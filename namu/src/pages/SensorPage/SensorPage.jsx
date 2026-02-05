import React from "react";
import { useState, useEffect } from "react"
import SensorComponent from "../../Components/sensorCompoonent/sensorComponent";
import "./SensorPage.css"

import { useTheme } from "../../providers/ThemeProvider/ThemeProvider";
import { useMqtt } from "../../providers/MqttProvider/MqttProvider";

function SensorPage() {
  const sensors = Array.from({ length: 1 }, (_, i) => i + 1);

  const { theme } = useTheme();


  // ===to take 2 digit===
function to2Decimals(v) {
  const num = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(num)) return v;          
  return Number(num.toFixed(2));                 
}


// ====mqtt====
 const { lastMessage } = useMqtt();
  const [history, setHistory] = useState([]);     
  const [values, setValues] = useState({});      

 useEffect(() => {
    if (!lastMessage?.payload) return;

    const payload = lastMessage.payload;

    // payload must be JSON object like { temp_s1: 20, humi_s10: 10 }
    if (typeof payload !== "object" || payload === null || Array.isArray(payload)) return;

    // 1) store history (limit to last 200 messages to avoid memory issues)
    setHistory((prev) => {
      const next = [...prev, { ts: Date.now(), ...payload }];
      return next.length > 200 ? next.slice(next.length - 200) : next;
    });

    // 2) merge into latest values (formatted)
    const formatted = {};
    for (const [key, val] of Object.entries(payload)) {
      formatted[key] = to2Decimals(val);
    }

    setValues((prev) => ({ ...prev, ...formatted }));
  }, [lastMessage]);

  return (
    <div className = {`sensors-grid ${theme}`}>
      {sensors.map((n) => (
        <SensorComponent key={n} sensorNo={n} values={values}/>
      ))}
    </div>
  );
}

export default SensorPage;
