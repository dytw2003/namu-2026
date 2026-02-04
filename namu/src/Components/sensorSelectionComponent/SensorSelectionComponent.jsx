import React from "react";
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import { useTheme } from "../../providers/ThemeProvider/ThemeProvider";
import "./SensorSelectionComponent.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SensorSelectionComponent() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const showNotReady = () => {
    toast.info("서비스 준비 중입니다.", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    });
  };

  return (
    <div className={`graph-house-checkbox-maindiv ${theme}`}>
      <div className="graph-title-close">
        <div className="graph-title">통계 분석</div>
        <div
          className="graph-open-close"
          role="button"
          tabIndex={0}
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setIsOpen((prev) => !prev);
          }}
        >
          <span className="graph-open-close-text">
            {isOpen ? "접기" : "펼치기"}
          </span>
          <span className="graph-open-close-icon" aria-hidden="true">
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="house-wrapper">
            <div className="sensor-selection">센서 선택</div>

            <div className="graph-house-checkbox-innerdiv">
              <input type="checkbox" id="sensor_temp" />
              <label htmlFor="sensor_temp" className="custom-checkbox">
                <FontAwesomeIcon icon={faCheck} className="check-icon" />
              </label>
              <span className="checkbox-label-text">온도</span>
            </div>

            <div className="graph-house-checkbox-innerdiv">
              <input type="checkbox" id="sensor_hum" />
              <label htmlFor="sensor_hum" className="custom-checkbox">
                <FontAwesomeIcon icon={faCheck} className="check-icon" />
              </label>
              <span className="checkbox-label-text">습도</span>
            </div>

            <div className="graph-house-checkbox-innerdiv">
              <input type="checkbox" id="sensor_ec" />
              <label htmlFor="sensor_ec" className="custom-checkbox">
                <FontAwesomeIcon icon={faCheck} className="check-icon" />
              </label>
              <span className="checkbox-label-text">EC</span>
            </div>

            <div className="graph-house-checkbox-innerdiv">
              <input type="checkbox" id="sensor_ph" />
              <label htmlFor="sensor_ph" className="custom-checkbox">
                <FontAwesomeIcon icon={faCheck} className="check-icon" />
              </label>
              <span className="checkbox-label-text">PH</span>
            </div>
          </div>

          <div className="graph-time-container">
            <div className="time-text-wrapper">
              <div className="graph-time-text">기간</div>
            </div>

            <div className="graph-dandt">
              <div className="graph-date-selection">
                <div className="graph-starting-date">
                  <DatePicker
                    selected={null}
                    placeholderText="YYYY-MM-DD"
                    dateFormat="yyyy-MM-dd"
                    onChange={() => {}}
                    readOnly
                    onInputClick={showNotReady}
                  />
                </div>

                <div className="graph-seperation-sign">~</div>

                <div className="graph-starting-date">
                  <DatePicker
                    selected={null}
                    placeholderText="YYYY-MM-DD"
                    dateFormat="yyyy-MM-dd"
                    onChange={() => {}}
                    readOnly
                    onInputClick={showNotReady}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        className="toast-center-container"
        toastClassName="toast-center"
        bodyClassName="toast-center-body"
      />
    </div>
  );
}

export default SensorSelectionComponent;
