// src/components/graph/EcGraph.jsx
import React, { useEffect, useMemo, useState } from "react";
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
  // "2026-02-03 11:03:44" -> "2026-02-03T11:03:44"
  const iso = ts.replace(" ", "T");
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Build an hourly series (similar feel to HD graph):
 * - groups by hour key "YYYY-MM-DD HH:00"
 * - keeps LAST non-null EC value inside each hour
 *
 * Returns:
 *  - map: Map(hourKey -> number)
 *  - meta: { firstTimeMs, lastTimeMs } for sorting
 */
function buildHourlyEcMap(rows, sensorNo) {
  const field = `soil_ec_${sensorNo}`;
  const m = new Map();

  let first = null;
  let last = null;

  for (const r of rows || []) {
    const d = parseTimestamp(r?.timestamp);
    if (!d) continue;

    const vRaw = r?.[field];
    const vNum = typeof vRaw === "number" ? vRaw : Number(vRaw);

    // skip null/undefined/NaN
    if (vRaw === null || vRaw === undefined) continue;
    if (!Number.isFinite(vNum)) continue;

    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    const ho = String(d.getHours()).padStart(2, "0");
    const hourKey = `${y}-${mo}-${da} ${ho}:00`;

    // overwrite => last value in that hour wins
    m.set(hourKey, vNum);

    const t = d.getTime();
    if (first === null || t < first) first = t;
    if (last === null || t > last) last = t;
  }

  return {
    map: m,
    meta: { firstTimeMs: first, lastTimeMs: last },
  };
}

function hourKeyToLabel(hourKey) {
  // hourKey: "YYYY-MM-DD HH:00"
  const iso = hourKey.replace(" ", "T") + ":00";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return hourKey;

  // show like "11AM", "12PM" (similar to your screenshot)
  return d.toLocaleString(undefined, {
    hour: "numeric",
    hour12: true,
  });
}

export default function EcGraph() {
  const username = "jbsy24";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [seriesMaps, setSeriesMaps] = useState(null); // {1:{map,meta}, ...}

  const urls = useMemo(() => {
    const api = GraphApi(); // IMPORTANT: GraphApi() is a function
    return [
      { sensorNo: 1, url: api.sensor1 },
      { sensorNo: 2, url: api.sensor2 },
      { sensorNo: 3, url: api.sensor3 },
      { sensorNo: 4, url: api.sensor4 },
      { sensorNo: 5, url: api.sensor5 },
    ];
  }, []);

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

            // Some PHP endpoints sometimes return JSON as string
            const data = await res.json();

            if (!Array.isArray(data)) {
              throw new Error(`Unexpected response (not array) from sensor${sensorNo}`);
            }

            const built = buildHourlyEcMap(data, sensorNo);
            return { sensorNo, built };
          })
        );

        if (!alive) return;

        const obj = {};
        for (const { sensorNo, built } of results) obj[sensorNo] = built;

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

  // Build UNION labels across all sensors (hour keys), sorted by time.
  const { labels, datasets, ySuggestedMax } = useMemo(() => {
    if (!seriesMaps) return { labels: [], datasets: [], ySuggestedMax: 1 };

    const allHourKeysSet = new Set();

    // collect keys
    for (const sn of [1, 2, 3, 4, 5]) {
      const m = seriesMaps?.[sn]?.map;
      if (!m) continue;
      for (const k of m.keys()) allHourKeysSet.add(k);
    }

    // sort by actual time
    const allHourKeys = Array.from(allHourKeysSet).sort((a, b) => {
      const da = new Date(a.replace(" ", "T") + ":00").getTime();
      const db = new Date(b.replace(" ", "T") + ":00").getTime();
      return da - db;
    });

    // x labels shown to user
    const labels = allHourKeys.map(hourKeyToLabel);

    // distinct colors per sensor
    const COLORS = {
      1: "rgb(255, 99, 132)",  // red
      2: "rgb(54, 162, 235)",  // blue
      3: "rgb(153, 102, 255)", // purple
      4: "rgb(75, 192, 192)",  // teal
      5: "rgb(255, 159, 64)",  // orange
    };

    // build datasets, but SKIP sensors that have no values at all
    const datasets = [];
    let globalMax = 0;

    for (const sn of [1, 2, 3, 4, 5]) {
      const map = seriesMaps?.[sn]?.map;
      if (!map) continue;

      // map hourKeys -> values (or null)
      const data = allHourKeys.map((k) => {
        const v = map.get(k);
        if (v === undefined) return null;
        if (Number.isFinite(v)) {
          if (v > globalMax) globalMax = v;
          return v;
        }
        return null;
      });

      // if entire line is null => do not render this dataset
      const hasAnyValue = data.some((v) => v !== null);
      if (!hasAnyValue) continue;

      datasets.push({
        label: `${sn}동 배지EC`,
        data,
        borderColor: COLORS[sn],
        backgroundColor: "transparent",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.25,
        spanGaps: true, // important: line will continue across missing points
      });
    }

    // dynamic y scale suggestion so the line doesn’t get “flattened”
    const ySuggestedMax = Math.max(0.5, globalMax * 1.2);

    return { labels, datasets, ySuggestedMax };
  }, [seriesMaps]);

  const chartData = useMemo(() => {
    return {
      labels,
      datasets,
    };
  }, [labels, datasets]);

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
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#ffffff",
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 14, // similar spacing to your screenshot
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
          height: "520px",
          background: "#3f4a69",
          borderRadius: "18px",
          padding: "18px",
        }}
      >
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
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}
