import React, { useEffect, useState } from "react";
import SensorComponent from "../../Components/sensorCompoonent/sensorComponent";
import "./SensorPage.css";

import { useTheme } from "../../providers/ThemeProvider/ThemeProvider";

function SensorPage() {
  const sensors = Array.from({ length: 3 }, (_, i) => i + 1);
  const { theme } = useTheme();

  // === format to 2 decimals ===
  function to2Decimals(v) {
    const num = typeof v === "number" ? v : Number(v);
    if (!Number.isFinite(num)) return v;
    return Number(num.toFixed(2));
  }

  const [history, setHistory] = useState([]); // optional
  const [values, setValues] = useState({});

useEffect(() => {
  const base = "http://www.adas.today";

  const endpoints = {
    1: `${base}/sf/backend/namu_php/sensor1_stream.php?sensorNo=1&intervalMs=1000`,
    2: `${base}/sf/backend/namu_php/sensor1_stream.php?sensorNo=2&intervalMs=1000`,
    3: `${base}/sf/backend/namu_php/sensor1_stream.php?sensorNo=3&intervalMs=1000`,
  };

  const sources = sensors.map((sn) => {
    const es = new EventSource(endpoints[sn]);

    es.addEventListener("update", (ev) => {
      const payload = JSON.parse(ev.data);

      const formatted = {};
      for (const [key, val] of Object.entries(payload)) {
        formatted[key] = to2Decimals(val);
      }

      setValues((prev) => ({ ...prev, ...formatted }));
    });

    es.onerror = () => {
      // EventSource auto-retries automatically
    };

    return es;
  });

  return () => sources.forEach((es) => es.close());
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
