// src/components/graph/TempGraph.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import GraphApi from "../../../apis/GaphApi/GraphApi";

import "./TempGraph.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useTheme } from "../../../providers/ThemeProvider/ThemeProvider";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

function parseTimestamp(ts) {
  if (!ts || typeof ts !== "string") return null;
  const iso = ts.replace(" ", "T");
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function tsToLabel(ts) {
  const d = parseTimestamp(ts);
  if (!d) return ts;
  return d.toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function TempGraph() {
  const { theme } = useTheme();

  const showNotReady = () => {
    toast.info("서비스 준비 중입니다.", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    });
  };

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [seriesMaps, setSeriesMaps] = useState(null); // {1: Map, 2: Map, ...}

  const [zoomPercent, setZoomPercent] = useState(0);

  const chartRef = useRef(null);

  // ✅ persist lastId across renders
  const lastIdsRef = useRef({});

  // ✅ NEW: remember current zoom window so it won't reset on new data
  const zoomWindowRef = useRef({ min: undefined, max: undefined, percent: 0 });

  // ✅ helper: get real chart instance
  const getChart = () => chartRef.current?.chart || chartRef.current;

  const urls = useMemo(() => {
    const api = GraphApi();
    return [
      { sensorNo: 1, url: api.sensor1 },
      { sensorNo: 2, url: api.sensor2 },
      { sensorNo: 3, url: api.sensor3 },
      { sensorNo: 4, url: api.sensor4 },
      { sensorNo: 5, url: api.sensor5 },
      { sensorNo: 6, url: api.sensor6 },
      { sensorNo: 7, url: api.sensor7 },
      { sensorNo: 8, url: api.sensor8 },
      { sensorNo: 9, url: api.sensor9 },
      { sensorNo: 10, url: api.sensor10 },
    ];
  }, []);

  // ✅ Poll every 5 seconds using ?lastId=...
  useEffect(() => {
    let closed = false;

    setLoading(true);
    setErr("");

    // init maps + init lastId
    const initial = {};
    for (const { sensorNo } of urls) {
      initial[sensorNo] = new Map();
      if (lastIdsRef.current[sensorNo] === undefined) {
        lastIdsRef.current[sensorNo] = 0;
      }
    }
    setSeriesMaps(initial);

    const POLL_MS = 5000;
    let timerId = null;
    let inFlight = false;

    async function pollOnce() {
      if (closed) return;
      if (inFlight) return;
      inFlight = true;

      try {
        const results = await Promise.allSettled(
          urls.map(async ({ sensorNo, url }) => {
            const lastId = lastIdsRef.current[sensorNo] ?? 0;

            const res = await fetch(`${url}?lastId=${lastId}`, {
              method: "GET",
              cache: "no-store",
            });

            if (!res.ok)
              throw new Error(`HTTP ${res.status} for sensor ${sensorNo}`);

            const json = await res.json(); // { ok, lastId, count, rows }
            if (!json?.ok)
              throw new Error(json?.error || `API error for sensor ${sensorNo}`);

            const rows = Array.isArray(json.rows) ? json.rows : [];
            const newLastId =
              typeof json.lastId === "number" ? json.lastId : lastId;

            return { sensorNo, rows, newLastId };
          })
        );

        if (closed) return;

        setSeriesMaps((prev) => {
          const next = { ...(prev || {}) };

          for (const r of results) {
            if (r.status !== "fulfilled") continue;

            const { sensorNo, rows, newLastId } = r.value;

            // save lastId for next poll
            lastIdsRef.current[sensorNo] = newLastId;

            if (!rows.length) continue;

            const oldMap = next[sensorNo] || new Map();
            const newMap = new Map(oldMap);

            // ✅ temp field: temp_s1..temp_s10
            const field = `temp_s${sensorNo}`;

            for (const row of rows) {
              const ts = row?.timestamp;
              const d = parseTimestamp(ts);
              if (!ts || !d) continue;

              const vRaw = row?.[field];
              if (vRaw === null || vRaw === undefined) continue;

              const v = typeof vRaw === "number" ? vRaw : Number(vRaw);
              if (!Number.isFinite(v)) continue;

              newMap.set(ts, { t: d.getTime(), v });
            }

            next[sensorNo] = newMap;
          }

          return next;
        });

        setLoading(false);
        setErr("");
      } catch (e) {
        if (!closed) {
          setErr(e?.message || "Polling failed");
          setLoading(false);
        }
      } finally {
        inFlight = false;
      }
    }

    pollOnce();
    timerId = setInterval(pollOnce, POLL_MS);

    return () => {
      closed = true;
      if (timerId) clearInterval(timerId);
    };
  }, [urls]);

  // ✅ UNION timeline across ALL 10 sensors
  const { labels, datasets } = useMemo(() => {
    if (!seriesMaps) return { labels: [], datasets: [] };

    const sensorNos = urls.map((u) => u.sensorNo);

    const allTs = new Map(); // ts -> timeMs
    for (const sn of sensorNos) {
      const m = seriesMaps?.[sn];
      if (!m) continue;
      for (const [ts, obj] of m.entries()) {
        allTs.set(ts, obj.t);
      }
    }

    const timelineTs = Array.from(allTs.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([ts]) => ts);

    const labels = timelineTs.map(tsToLabel);

    const COLORS = {
      1: "rgb(255, 99, 132)",
      2: "rgb(54, 162, 235)",
      3: "rgb(153, 102, 255)",
      4: "rgb(75, 192, 192)",
      5: "rgb(255, 159, 64)",
      6: "rgb(201, 203, 207)",
      7: "rgb(255, 205, 86)",
      8: "rgb(0, 200, 83)",
      9: "rgb(3, 169, 244)",
      10: "rgb(156, 39, 176)",
    };

    const datasets = [];

    for (const sn of sensorNos) {
      const m = seriesMaps?.[sn];
      if (!m) continue;

      const data = timelineTs.map((ts) => (m.get(ts) ? m.get(ts).v : null));
      if (!data.some((v) => v !== null)) continue;

      datasets.push({
        label: `센서-${sn}`,
        data,
        borderColor: COLORS[sn] || "rgb(99,102,241)",
        backgroundColor: "transparent",
        borderWidth: 1,
        pointRadius: 0,
        pointHitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 2,
        tension: 0.25,
        spanGaps: true,
      });
    }

    return { labels, datasets };
  }, [seriesMaps, urls]);

  const chartData = useMemo(() => ({ labels, datasets }), [labels, datasets]);

  // ✅ Apply zoom when slider changes (AND save window)
  useEffect(() => {
    const chart = getChart();
    if (!chart) return;

    const total = labels.length;
    if (total <= 2) return;

    const maxIndex = total - 1;
    const minWindow = Math.max(12, Math.floor(total * 0.05));

    const t = zoomPercent / 100;
    const windowSize = Math.round(total - t * (total - minWindow));

    const minIndex = Math.max(0, maxIndex - windowSize);
    const maxVisible = maxIndex;

    chart.options.scales.x.min = minIndex;
    chart.options.scales.x.max = maxVisible;

    // ✅ remember current window so it won't reset after polling
    zoomWindowRef.current = { min: minIndex, max: maxVisible, percent: zoomPercent };

    chart.update(); // normal update
  }, [zoomPercent, labels]);

  // ✅ Re-apply saved zoom window whenever new labels arrive (polling update)
  useEffect(() => {
    const chart = getChart();
    if (!chart) return;
    if (!labels.length) return;

    const saved = zoomWindowRef.current;
    if (saved?.min === undefined || saved?.max === undefined) return;

    const total = labels.length;
    const maxIndex = total - 1;

    // keep same window size, anchor to latest point
    const windowSize = Math.max(2, saved.max - saved.min);
    const newMax = maxIndex;
    const newMin = Math.max(0, newMax - windowSize);

    chart.options.scales.x.min = newMin;
    chart.options.scales.x.max = newMax;

    zoomWindowRef.current = { ...saved, min: newMin, max: newMax };

    chart.update();
  }, [labels]);

  const options = useMemo(() => {
    const isDark = theme === "dark";

    const tickColor = isDark ? "#ffffff" : "#111827";
    const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(17,24,39,0.10)";

    const tooltipBg = isDark ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.95)";
    const tooltipTitle = isDark ? "#ffffff" : "#111827";
    const tooltipBody = isDark ? "#ffffff" : "#111827";
    const tooltipBorder = isDark ? "rgba(255,255,255,0.15)" : "rgba(17,24,39,0.12)";

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "nearest", axis: "xy", intersect: false },
      plugins: {
        legend: {
          position: "top",
          labels: { boxWidth: 24, boxHeight: 10, color: tickColor },
        },
        tooltip: {
          enabled: true,
          mode: "nearest",
          intersect: false,
          displayColors: true,
          padding: 10,
          backgroundColor: tooltipBg,
          titleColor: tooltipTitle,
          bodyColor: tooltipBody,
          borderColor: tooltipBorder,
          borderWidth: 1,
          callbacks: {
            title: (items) =>
              items?.length ? labels[items[0].dataIndex] || "" : "",
            label: (ctx) => {
              const v = ctx.raw;
              if (v === null || v === undefined) return `${ctx.dataset.label}: -`;
              return `${ctx.dataset.label}: ${Number(v).toFixed(2)}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: tickColor, maxRotation: 0, autoSkip: true, maxTicksLimit: 20 },
          grid: { color: gridColor },
        },
        y: {
          min: 0,
          max: 70,
          ticks: { color: tickColor, stepSize: 5 },
          grid: { color: gridColor },
          title: { display: true, text: "온도(°C)", color: tickColor },
        },
      },
    };
  }, [labels, theme]);

  return (
    <div className={`ec-page ${theme}`}>
      <div className={`ec-card ${theme}`}>
        <div className="ec-zoom-wrap">
          <input
            className="ec-zoom-range"
            type="range"
            min="0"
            max="100"
            value={zoomPercent}
            onChange={(e) => setZoomPercent(Number(e.target.value))}
          />
          <div className="ec-zoom-labels">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="ec-chart-wrap">
          {loading && <div className="ec-msg">Loading...</div>}
          {!loading && err && <div className="ec-msg ec-msg--err">{err}</div>}
          {!loading && !err && datasets.length === 0 && (
            <div className="ec-msg">No temp data found (all sensors are null).</div>
          )}
          {!loading && !err && datasets.length > 0 && (
            <Line ref={chartRef} data={chartData} options={options} />
          )}
        </div>
      </div>

      <div className={`graph-dwn-btn-main ${theme}`}>
        <div className="graph-den-btn" onClick={showNotReady}>
          다운로드 (CSV File)
        </div>

        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar
          className="toast-center-container"
          toastClassName="toast-center"
          bodyClassName="toast-center-body"
        />
      </div>
    </div>
  );
}
