import React from "react";
import "./SensorComponent.css";

import tempIconDark from "../../assets/namu-temp-dark.svg";
import humiIconDark from "../../assets/namu-humi-dark.svg";
import ecIconDark from "../../assets/namu-ec-dark.svg";
import phIconDark from "../../assets/namu-ph-dark.svg";

import { useTheme } from "../../providers/ThemeProvider/ThemeProvider";

function SensorComponent({ sensorNo = 1, title }) {
  const sid = `s${sensorNo}`; 
  const sensorTitle = title ?? `sensor ${sensorNo}`;


  // ===theme ===========
  const { theme } = useTheme();

  return (
    <div className={`main-container-sensorc ${theme}`}>
      <div className="div-main-sensor-title">{sensorTitle}</div>

      <div className="sensorc-inner-div">
        <div className="sensorc-inner-type1">
          <div className="sensorc-inner-image">
            <img src={tempIconDark} alt="temp" />
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
            <img src={humiIconDark} alt="humidity" />
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
            <img src={ecIconDark} alt="ec" />
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
            <img src={phIconDark} alt="ph" />
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
            <img src={tempIconDark} alt="water" />
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
