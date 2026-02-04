// src/components/graph/PhGraph.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import GraphApi from "../../../apis/GaphApi/GraphApi";

import "./PhGraph.css";


import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import { useTheme } from "../../../providers/ThemeProvider/ThemeProvider"




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

/**
 * ✅ pH background bands: 0–5, 5–8, 8–14
 * Drawn behind the line (single canvas).
 */
const phBandsPlugin = {
  id: "phBandsPlugin",
  beforeDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    if (!chartArea) return;

    const y = scales?.y;
    if (!y) return;

    const { left, right } = chartArea;

    const bands = [
      { from: 0, to: 5.5, color: "rgba(239,  68,  68, 0.12)" },  // 0–5
      { from: 5.5, to: 7.5, color: "rgba( 34, 197,  94, 0.12)" },  // 5–8
      { from: 7.5, to: 14.0, color: "rgba( 59, 130, 246, 0.12)" }, // 8–14
    ];

    ctx.save();
    for (const b of bands) {
      const yTop = y.getPixelForValue(b.to);
      const yBottom = y.getPixelForValue(b.from);
      const rectTop = Math.min(yTop, yBottom);
      const rectH = Math.abs(yBottom - yTop);

      ctx.fillStyle = b.color;
      ctx.fillRect(left, rectTop, right - left, rectH);
    }
    ctx.restore();
  },
};

/**
 * Convert "YYYY-MM-DD HH:mm:ss" -> Date (local)
 * If parsing fails, return null.
 */
function parseTimestamp(ts) {
  if (!ts || typeof ts !== "string") return null;
  const iso = ts.replace(" ", "T");
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Build RAW (non-grouped) pH map:
 * Map(timestampString -> { t: timeMs, v: value })
 * Keeps last value for duplicate timestamps.
 */
function buildPhMap(rows, sensorNo) {
  const field = `soil_ph_${sensorNo}`;
  const m = new Map();

  for (const r of rows || []) {
    const ts = r?.timestamp;
    const d = parseTimestamp(ts);
    if (!ts || !d) continue;

    const vRaw = r?.[field];
    if (vRaw === null || vRaw === undefined) continue;

    const v = typeof vRaw === "number" ? vRaw : Number(vRaw);
    if (!Number.isFinite(v)) continue;

    m.set(ts, { t: d.getTime(), v });
  }

  return m;
}

/**
 * Label for x-axis ticks.
 */
function tsToLabel(ts) {
  const d = parseTimestamp(ts);
  if (!d) return ts;
  return d.toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function PhGraph() {
  const username = "jbsy24";

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

  // ✅ zoom scrollbar (0 = zoom out/full view, 100 = zoom in/max)
  const [zoomPercent, setZoomPercent] = useState(0);

  const chartRef = useRef(null);

  const urls = useMemo(() => {
    const api = GraphApi();
    return [
      { sensorNo: 1, url: api.sensor1 },
      { sensorNo: 2, url: api.sensor2 },
      { sensorNo: 3, url: api.sensor3 },
      { sensorNo: 4, url: api.sensor4 },
      { sensorNo: 5, url: api.sensor5 },
    ];
  }, []);

  // -------------------------
  // Fetch ALL data (raw points)
  // -------------------------
  useEffect(() => {
    let alive = true;

    async function fetchAll() {
      setLoading(true);
      setErr("");

      try {
        const results = await Promise.all(
          urls.map(async ({ sensorNo, url }) => {
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username }),
            });

            if (!res.ok) {
              const text = await res.text().catch(() => "");
              throw new Error(
                `HTTP ${res.status} from ${url}\n${text?.slice(0, 200)}`
              );
            }

            const data = await res.json();
            if (!Array.isArray(data)) {
              throw new Error(
                `Unexpected response (not array) from sensor${sensorNo}`
              );
            }

            const map = buildPhMap(data, sensorNo);
            return { sensorNo, map };
          })
        );

        if (!alive) return;

        const obj = {};
        for (const { sensorNo, map } of results) obj[sensorNo] = map;

        setSeriesMaps(obj);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to fetch");
        setSeriesMaps(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    fetchAll();
    return () => {
      alive = false;
    };
  }, [urls, username]);

  // --------------------------------------------
  // Build UNION timeline across sensors (ALL ts)
  // --------------------------------------------
  const { timelineTs, labels, datasets } = useMemo(() => {
    if (!seriesMaps) {
      return { timelineTs: [], labels: [], datasets: [] };
    }

    // union timestamps across all sensors
    const allTs = new Map(); // ts -> timeMs
    for (const sn of [1, 2, 3, 4, 5]) {
      const m = seriesMaps?.[sn];
      if (!m) continue;
      for (const [ts, obj] of m.entries()) {
        allTs.set(ts, obj.t);
      }
    }

    // sort by timeMs
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
    };

    const datasets = [];

    for (const sn of [1, 2, 3, 4, 5]) {
      const m = seriesMaps?.[sn];
      if (!m) continue;

      const data = timelineTs.map((ts) => {
        const obj = m.get(ts);
        if (!obj) return null;
        return obj.v;
      });

      if (!data.some((v) => v !== null)) continue;

      datasets.push({
        label: `센서-${sn}`,
        data,
        borderColor: COLORS[sn],
        backgroundColor: "transparent",
        borderWidth: 1,
        pointRadius: 0,
        pointHitRadius: 10, // ✅ easier hover
        hoverRadius: 4,     // ✅ show hover dot
        hoverBorderWidth: 2,
        tension: 0.25,
        spanGaps: true,
      });
    }

    return { timelineTs, labels, datasets };
  }, [seriesMaps]);

  const chartData = useMemo(() => {
    return { labels, datasets };
  }, [labels, datasets]);

  // --------------------------------------------
  // Zoom logic (single canvas) using slider
  //   - 0% => full view
  //   - 100% => most zoomed-in
  //   - anchored to the RIGHT (latest time)
  // --------------------------------------------
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const total = labels.length;
    if (total <= 2) return;

    const maxIndex = total - 1;

    // smallest window at max zoom (show at least 12 points or 5%)
    const minWindow = Math.max(12, Math.floor(total * 0.05));

    const t = zoomPercent / 100; // 0..1
    const windowSize = Math.round(total - t * (total - minWindow));

    const minIndex = Math.max(0, maxIndex - windowSize);
    const maxVisible = maxIndex;

    chart.options.scales.x.min = minIndex;
    chart.options.scales.x.max = maxVisible;

    chart.update("none");
  }, [zoomPercent, labels]);

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

    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },

    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 24,
          boxHeight: 10,
          color: tickColor,
        },
      },
      tooltip: {
        enabled: true,
        displayColors: true,
        padding: 10,
        backgroundColor: tooltipBg,
        titleColor: tooltipTitle,
        bodyColor: tooltipBody,
        borderColor: tooltipBorder,
        borderWidth: 1,
        callbacks: {
          title: (items) => {
            if (!items?.length) return "";
            return labels[items[0].dataIndex] || "";
          },
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
        ticks: {
          color: tickColor,
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 14,
        },
        grid: { color: gridColor },
      },
      y: {
        min: 0,
        max: 14,
        ticks: {
          color: tickColor,
          stepSize: 1,
        },
        grid: { color: gridColor },
        title: {
          display: true,
          text: "pH",
          color: tickColor,
        },
      },
    },
  };
}, [labels, theme]);


  return (
    <div className= {`ec-page ${theme}`}>
      <div className= {`ec-card ${theme}`}>
        {/* Zoom */}
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

        {/* Chart */}
        <div className="ec-chart-wrap">
          {loading && <div className="ec-msg">Loading...</div>}

          {!loading && err && <div className="ec-msg ec-msg--err">{err}</div>}

          {!loading && !err && datasets.length === 0 && (
            <div className="ec-msg">No pH data found (all sensors are null).</div>
          )}

          {!loading && !err && datasets.length > 0 && (
            <Line
              ref={chartRef}
              data={chartData}
              options={options}
              plugins={[phBandsPlugin]}
            />
          )}
        </div>
      </div>

      <div className={`graph-dwn-btn-main ${theme}`}>
        <div
          className="graph-den-btn"
          onClick={showNotReady}
        >
          다운로드 (CSV File)
        </div>

        {/* toast */}
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
