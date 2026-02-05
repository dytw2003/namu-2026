import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import mqtt from "mqtt";

const MqttContext = createContext(null);

function MqttProvider({ children }) {
  const username = "tree";
  const clientRef = useRef(null);

  const [status, setStatus] = useState("disconnected"); 
  const [lastMessage, setLastMessage] = useState(null); 

  
  const MQTT_BASE_URL = "www.adas.today";
  const MQTT_WS_URL = `ws://${MQTT_BASE_URL}:9090`; 

  useEffect(() => {
    setStatus("connecting");

    const client = mqtt.connect(MQTT_WS_URL, {
      clean: true,
      reconnectPeriod: 2000, 
      connectTimeout: 10_000,
    });

    clientRef.current = client;

    client.on("connect", () => {
      setStatus("connected");

      // ✅ subscribe to topic "adas"
      client.subscribe(`${username}`, { qos: 0 }, (err) => {
        if (err) console.error("MQTT subscribe error:", err);
      });
    });

    client.on("reconnect", () => setStatus("connecting"));
    client.on("close", () => setStatus("disconnected"));
    client.on("error", (err) => {
      console.error("MQTT error:", err);
      setStatus("error");
    });

    client.on("message", (topic, payload) => {
      const text = payload?.toString?.("utf-8") ?? "";

      // Try JSON parse (optional)
      let parsed = text;
      try {
        parsed = JSON.parse(text);
      } catch (_) {}

      setLastMessage({ topic, payload: parsed, ts: Date.now() });
    });

    return () => {
      try {
        client.end(true);
      } catch (_) {}
      clientRef.current = null;
    };
  }, []);

  const value = useMemo(() => {
    return { status, lastMessage };
  }, [status, lastMessage]);

  return <MqttContext.Provider value={value}>{children}</MqttContext.Provider>;
}

export function useMqtt() {
  const ctx = useContext(MqttContext);
  if (!ctx) throw new Error("useMqtt must be used inside MqttProvider");
  return ctx;
}

export default MqttProvider;
