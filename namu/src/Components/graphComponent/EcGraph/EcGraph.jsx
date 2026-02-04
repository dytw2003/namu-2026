// src/components/graph/EcGraph.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import GraphApi from "../../../apis/GaphApi/GraphApi";

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
 * Build RAW (non-grouped) EC map:
 * Map(timestampString -> { t: timeMs, v: value })
 * Keeps last value for duplicate timestamps.
 */
function buildEcMap(rows, sensorNo) {
  const field = `soil_ec_${sensorNo}`;
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
 * (You can change formatting anytime)
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

export default function EcGraph() {
  const username = "jbsy24";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [seriesMaps, setSeriesMaps] = useState(null); // {1: Map, 2: Map, ...}

  // ✅ zoom "scrollbar" (0 = zoom out/full view, 100 = zoom in/max)
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
              throw new Error(`HTTP ${res.status} from ${url}\n${text?.slice(0, 200)}`);
            }

            const data = await res.json();
            if (!Array.isArray(data)) {
              throw new Error(`Unexpected response (not array) from sensor${sensorNo}`);
            }

            const map = buildEcMap(data, sensorNo);
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
  const { timelineTs, labels, datasets, ySuggestedMax } = useMemo(() => {
    if (!seriesMaps) {
      return { timelineTs: [], labels: [], datasets: [], ySuggestedMax: 1 };
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

    let globalMax = 0;
    const datasets = [];

    for (const sn of [1, 2, 3, 4, 5]) {
      const m = seriesMaps?.[sn];
      if (!m) continue;

      const data = timelineTs.map((ts) => {
        const obj = m.get(ts);
        if (!obj) return null;
        globalMax = Math.max(globalMax, obj.v);
        return obj.v;
      });

      if (!data.some((v) => v !== null)) continue;

      datasets.push({
        label: `${sn}동 배지EC`,
        data,
        borderColor: COLORS[sn],
        backgroundColor: "transparent",
        borderWidth: 1, // ✅ thinner line
        pointRadius: 0,
        pointHitRadius: 6,
        tension: 0.25,
        spanGaps: true,
      });
    }

    return {
      timelineTs,
      labels,
      datasets,
      ySuggestedMax: Math.max(0.5, globalMax * 1.2),
    };
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

    // window shrinks as zoom increases
    const t = zoomPercent / 100; // 0..1
    const windowSize = Math.round(total - t * (total - minWindow));

    // anchor to latest data (right side)
    const minIndex = Math.max(0, maxIndex - windowSize);
    const maxVisible = maxIndex;

    // CategoryScale accepts numeric min/max (index)
    chart.options.scales.x.min = minIndex;
    chart.options.scales.x.max = maxVisible;

    chart.update("none");
  }, [zoomPercent, labels]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          labels: {
            boxWidth: 24,
            boxHeight: 10,
            color: "#ffffff",
          },
        },
        tooltip: { enabled: true },
      },
      scales: {
        x: {
          // min/max are controlled by zoom effect above
          ticks: {
            color: "#ffffff",
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 14,
          },
          grid: { color: "rgba(255,255,255,0.08)" },
        },
        y: {
          beginAtZero: true,
          suggestedMax: ySuggestedMax,
          ticks: { color: "#ffffff" },
          grid: { color: "rgba(255,255,255,0.08)" },
          title: {
            display: true,
            text: "EC (dS/m)",
            color: "#ffffff",
          },
        },
      },
    };
  }, [ySuggestedMax]);

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ color: "#cbd5e1", marginBottom: "0.5rem" }}>
        payload username: {username}
      </div>

      <div
        style={{
          background: "#3f4a69",
          borderRadius: "18px",
          padding: "18px",
        }}
      >
        {/* ✅ Zoom scrollbar (replaces Reset Zoom button) */}
        <div style={{ marginBottom: "12px" }}>
          <input
            type="range"
            min="0"
            max="100"
            value={zoomPercent}
            onChange={(e) => setZoomPercent(Number(e.target.value))}
            style={{
              width: "100%",
              height: "10px",
              borderRadius: "999px",
              cursor: "pointer",
              background: "rgba(255,255,255,0.18)",
              appearance: "none",
              outline: "none",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "6px",
              fontSize: "12px",
              color: "rgba(255,255,255,0.8)",
              userSelect: "none",
            }}
          >
            <span>Zoom Out</span>
            <span>Zoom In</span>
          </div>
        </div>

        <div style={{ height: "520px" }}>
          {loading && <div style={{ color: "#fff" }}>Loading...</div>}

          {!loading && err && (
            <div style={{ color: "tomato", whiteSpace: "pre-wrap" }}>{err}</div>
          )}

          {!loading && !err && datasets.length === 0 && (
            <div style={{ color: "#fff" }}>
              No EC data found (all sensors are null).
            </div>
          )}

          {!loading && !err && datasets.length > 0 && (
            <Line ref={chartRef} data={chartData} options={options} />
          )}
        </div>
      </div>
    </div>
  );
}
