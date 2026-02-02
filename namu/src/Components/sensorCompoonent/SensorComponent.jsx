import React from "react";
import "./SensorComponent.css";

import temp from "../../assets/namu-temp-dark.svg";
import humi from "../../assets/namu-humi-dark.svg";
import ecIcon from "../../assets/namu-ec-dark.svg";
import phIcon from "../../assets/namu-ph-dark.svg";

function SensorComponent({ sensorNo = 1, title }) {
  // sensorNo: 1,2,3...
  // index: if you ever need _1 part (temp_s1_1). Keep it 1 for now.

  const sid = `s${sensorNo}`; // e.g. s1_1, s2_1
  const sensorTitle = title ?? `sensor ${sensorNo}`;

  return (
    <div className="main-container-sensorc">
      <div className="div-main-sensor-title">{sensorTitle}</div>

      <div className="sensorc-inner-div">
        <div className="sensorc-inner-type1">
          <div className="sensorc-inner-image">
            <img src={temp} alt="temp" />
          </div>
          <div className="sensorc-inner-details">
            <div className="sensorc-inner-title">온도</div>
            <div className="sensorc-value-units">
              <div className="sensorc-inner-sensor-value" id={`temp_${sid}`}>
                12
              </div>
              <div className="sensorc-inner-sensor-unit">°C</div>
            </div>
          </div>
        </div>

        <div className="sensorc-inner-type1">
          <div className="sensorc-inner-image">
            <img src={humi} alt="humidity" />
          </div>
          <div className="sensorc-inner-details">
            <div className="sensorc-inner-title">습도</div>
            <div className="sensorc-value-units">
              <div className="sensorc-inner-sensor-value" id={`humi_${sid}`}>
                12
              </div>
              <div className="sensorc-inner-sensor-unit">%</div>
            </div>
          </div>
        </div>

        <div className="sensorc-inner-type1">
          <div className="sensorc-inner-image">
            <img src={ecIcon} alt="ec" />
          </div>
          <div className="sensorc-inner-details">
            <div className="sensorc-inner-title">EC</div>
            <div className="sensorc-value-units">
              <div className="sensorc-inner-sensor-value" id={`ec_${sid}`}>
                12
              </div>
              <div className="sensorc-inner-sensor-unit">ds/m</div>
            </div>
          </div>
        </div>

        <div className="sensorc-inner-type1">
          <div className="sensorc-inner-image">
            <img src={phIcon} alt="ph" />
          </div>
          <div className="sensorc-inner-details">
            <div className="sensorc-inner-title">PH</div>
            <div className="sensorc-value-units">
              <div className="sensorc-inner-sensor-value" id={`ph_${sid}`}>
                12
              </div>
              <div className="sensorc-inner-sensor-unit">μmol/m²/s</div>
            </div>
          </div>
        </div>

        <div className="sensorc-inner-type1">
          <div className="sensorc-inner-image">
            <img src={temp} alt="water" />
          </div>
          <div className="sensorc-inner-details">
            <div className="sensorc-inner-title">abc</div>
            <div className="sensorc-value-units">
              <div className="sensorc-inner-sensor-value" id={`water_${sid}`}>
                12
              </div>
              <div className="sensorc-inner-sensor-unit">%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SensorComponent;
