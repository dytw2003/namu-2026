import React, { useEffect, useMemo, useState } from "react";
import "./OuterSensorData.css";

import sun from "../../assets/sun.svg";
import raining from "../../assets/raining.svg";

import { useTheme } from "../../providers/ThemeProvider/ThemeProvider";
import { useMqtt } from "../../providers/MqttProvider/MqttProvider";

function OuterSensorData() {
  const { theme } = useTheme();
  const { lastMessage } = useMqtt();

  const [history, setHistory] = useState([]);
  const [values, setValues] = useState({});

  // ✅ 2 decimal formatter
  function to2Decimals(v) {
    const num = typeof v === "number" ? v : Number(v);
    if (!Number.isFinite(num)) return v;
    return Number(num.toFixed(2));
  }

  useEffect(() => {
    if (!lastMessage?.payload) return;

    const payload = lastMessage.payload;

    // must be JSON object
    if (
      typeof payload !== "object" ||
      payload === null ||
      Array.isArray(payload)
    )
      return;

    // 1) store history (optional)
    setHistory((prev) => {
      const next = [...prev, { ts: Date.now(), ...payload }];
      return next.length > 200 ? next.slice(-200) : next;
    });

    // 2) merge into values with 2-decimal formatting for numbers
    const formatted = {};
    for (const [key, val] of Object.entries(payload)) {
      formatted[key] = to2Decimals(val);
    }

    setValues((prev) => ({ ...prev, ...formatted }));
  }, [lastMessage]);

  // ✅ keys you expect from MQTT
  const tempOut = values.temp_out;
  const humiOut = values.humi_out;
  const slOut = values.sl_out;
  const rainAmt = values.rain_amt;
  const windDir = values.wind_dir;
  const windSp = values.wind_sp;
  const rainStatus = values.rain_status;

  const showVal = (v) => v ?? "__";

  // ✅ icon rendering rule
  const rainIcon = useMemo(() => {
    const v = Number(rainStatus); // handles "0"/"1" strings too

    if (v === 1) {
      return <img src={raining} alt="raining" className="outersensor-icon" />;
    }

    if (v === 0) {
      return <img src={sun} alt="sunny" className="outersensor-icon" />;
    }

    // if missing/unknown => dash
    return (
      <span className="outersensor-dash" aria-hidden="true">
        __
      </span>
    );
  }, [rainStatus]);

  return (
    <div className={`outersensor-main-container ${theme}`}>
        <div className="main-title">외부 기상 정보</div>
      <div className="outer-inner-main">
        <div className="outersensor-current-data">
          <div className="outersensor-data-title">외부 온도</div>
          <div className="outersenosr-value-unit">
            <div className="outersenor-value" id="temp_out">
              {showVal(tempOut)}
            </div>
            <div className="outersensor-unit">°C</div>
          </div>
        </div>

        <div className="outersensor-current-data">
          <div className="outersensor-data-title">외부 습도</div>
          <div className="outersenosr-value-unit">
            <div className="outersenor-value" id="humi_out">
              {showVal(humiOut)}
            </div>
            <div className="outersensor-unit">%</div>
          </div>
        </div>

        <div className="outersensor-current-data">
          <div className="outersensor-data-title">외부 일사</div>
          <div className="outersenosr-value-unit">
            <div className="outersenor-value" id="sl_out">
              {showVal(slOut)}
            </div>
            <div className="outersensor-unit">w/㎡</div>
          </div>
        </div>

        <div className="outersensor-current-data">
          <div className="outersensor-data-title">강수량</div>
          <div className="outersenosr-value-unit">
            <div className="outersenor-value" id="rain_amt">
              {showVal(rainAmt)}
            </div>
            <div className="outersensor-unit">mm</div>
          </div>
        </div>

        <div className="outersensor-current-data">
          <div className="outersensor-data-title">외부 풍속</div>
          <div className="outersenosr-value-unit">
            <div className="outersenor-value" id="wind_dir">
              {showVal(windDir)}
            </div>
            <div className="outersensor-unit">°</div>
          </div>
        </div>

        <div className="outersensor-current-data">
          <div className="outersensor-data-title">외부 풍향</div>
          <div className="outersenosr-value-unit">
            <div className="outersenor-value" id="wind_sp">
              {showVal(windSp)}
            </div>
            <div className="outersensor-unit">m/s</div>
          </div>
        </div>

        <div className="outersensor-current-data">
          <div className="outersensor-data-title">강우 감지</div>
          <div className="outersenosr-value-unit" id="rain_status">
            {rainIcon}
          </div>
        </div>

        <div className="outersensor-current-time">
          <div className="outersensor-time">최종 검침 시간</div>
          <div className="outersenosr-surrent-t">{values.last_time ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}

export default OuterSensorData;
