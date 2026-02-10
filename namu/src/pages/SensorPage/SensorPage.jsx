import React, { useEffect, useState } from "react";
import SensorComponent from "../../Components/sensorCompoonent/sensorComponent";
import "./SensorPage.css";
import { useTheme } from "../../providers/ThemeProvider/ThemeProvider";

function SensorPage() {
  const sensors = Array.from({ length: 10 }, (_, i) => i + 1);
  const { theme } = useTheme();

  // === format to 2 decimals ===
  function to2Decimals(v) {
    const num = typeof v === "number" ? v : Number(v);
    if (!Number.isFinite(num)) return v;
    return Number(num.toFixed(2));
  }

  const [values, setValues] = useState({});

  useEffect(() => {
    const base = "http://www.adas.today";
    const POLL_MS = 5000;

    let alive = true;
    let timerId = null;

    async function fetchOneSensor(sensorNo, signal) {
      const url = `${base}/sf/backend/namu_php/sensor_latest.php?sensorNo=${sensorNo}`;

      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status} for sensorNo=${sensorNo}`);

      const json = await res.json(); // { ok: true, data: {...} }
      if (!json?.ok || !json.data) return null;

      // format all numeric values
      const formatted = {};
      for (const [key, val] of Object.entries(json.data)) {
        formatted[key] = to2Decimals(val);
      }
      return formatted;
    }

    async function pollAll() {
      const controller = new AbortController();
      const { signal } = controller;

      // store controller so we can abort on cleanup
      pollAll._controller = controller;

      try {
        // fetch 10 sensors in parallel
        const results = await Promise.allSettled(
          sensors.map((sn) => fetchOneSensor(sn, signal))
        );

        if (!alive) return;

        // merge all successful results into one object
        const merged = {};
        for (const r of results) {
          if (r.status === "fulfilled" && r.value) {
            Object.assign(merged, r.value);
          }
        }

        if (Object.keys(merged).length > 0) {
          setValues((prev) => ({ ...prev, ...merged }));
        }
      } catch (err) {
        // ignore abort errors
        if (err?.name !== "AbortError") {
          // console.error(err);
        }
      }
    }

    // initial fetch immediately
    pollAll();

    // repeat every 5 seconds
    timerId = setInterval(pollAll, POLL_MS);

    return () => {
      alive = false;
      if (timerId) clearInterval(timerId);
      // abort any in-flight fetch
      if (pollAll._controller) pollAll._controller.abort();
    };
  }, []);

  return (
    <div className={`sensors-grid ${theme}`}>
      {sensors.map((n) => (
        <SensorComponent key={n} sensorNo={n} values={values} />
      ))}
    </div>
  );
}

export default SensorPage;
