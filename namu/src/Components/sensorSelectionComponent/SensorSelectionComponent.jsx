import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";


import { useTheme } from "../../providers/ThemeProvider/ThemeProvider"

import "./SensorSelectionComponent.css";
function SensorSelectionComponent() {

  const { theme } = useTheme();
  return (
    <div className= {`graph-house-checkbox-maindiv ${theme}`}>
      <div className="graph-title-close">
        <div className="graph-title">Graph</div>
        <div className="graph-open-close">펼치기</div>
      </div>
      <div className="house-wrapper">
        <div className="sensor-selection">Select sensor</div>
        <div className="graph-house-checkbox-innerdiv">
          <input type="checkbox" id="house_0" />
          <label htmlFor="house_0" className="custom-checkbox">
            <FontAwesomeIcon icon={faCheck} className="check-icon" />
          </label>
          <span className="checkbox-label-text">온도</span>
        </div>

        {/* 1동 ~ 11동 */}
        <div className="graph-house-checkbox-innerdiv">
          <input type="checkbox" id="house_1" />
          <label htmlFor="house_1" className="custom-checkbox">
            <FontAwesomeIcon icon={faCheck} className="check-icon" />
          </label>
          <span className="checkbox-label-text">습도</span>
        </div>

        <div className="graph-house-checkbox-innerdiv">
          <input type="checkbox" id="house_2" />
          <label htmlFor="house_2" className="custom-checkbox">
            <FontAwesomeIcon icon={faCheck} className="check-icon" />
          </label>
          <span className="checkbox-label-text">EC</span>
        </div>

        <div className="graph-house-checkbox-innerdiv">
          <input type="checkbox" id="house_3" />
          <label htmlFor="house_3" className="custom-checkbox">
            <FontAwesomeIcon icon={faCheck} className="check-icon" />
          </label>
          <span className="checkbox-label-text">PH</span>
        </div>
      </div>
    </div>
  );
}

export default SensorSelectionComponent;
