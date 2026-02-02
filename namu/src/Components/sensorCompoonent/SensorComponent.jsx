import React from 'react'
import "./SensorComponent.css"

import temp from "../../assets/namu-temp-dark.svg"
import humi from "../../assets/namu-humi-dark.svg"
import ec from "../../assets/namu-ec-dark.svg"
import ph from "../../assets/namu-ph-dark.svg"


function SensorComponent() {
  return (
    <div className="main-container-sensorc">
        <div className="div-main-sensor-title">
            sensor 1
        </div>

        <div className="sensorc-inner-div">
            <div className="sensorc-inner-type1">
                <div className="sensorc-inner-image">
                    <img src = {temp} alt = "temp image" />
                </div>
                <div className="sensorc-inner-details">
                    <div className="sensorc-inner-title">온도</div>
                    <div className="sensorc-value-units">
                        <div className="sensorc-inner-sensor-value">12</div>
                        <div className="sensorc-inner-sensor-unit">°C</div>
                    </div>
                </div>
            </div>


            <div className="sensorc-inner-type1">
                <div className="sensorc-inner-image">
                    <img src = {humi} alt = "temp image" />
                </div>
                <div className="sensorc-inner-details">
                    <div className="sensorc-inner-title">습도</div>
                    <div className="sensorc-value-units">
                        <div className="sensorc-inner-sensor-value">12</div>
                        <div className="sensorc-inner-sensor-unit">%</div>
                    </div>
                </div>
            </div>

            <div className="sensorc-inner-type1">
                <div className="sensorc-inner-image">
                    <img src = {ec} alt = "temp image" />
                </div>
                <div className="sensorc-inner-details">
                    <div className="sensorc-inner-title">EC</div>
                    <div className="sensorc-value-units">
                        <div className="sensorc-inner-sensor-value">12</div>
                        <div className="sensorc-inner-sensor-unit">ds/m</div>
                    </div>
                </div>
            </div>

            <div className="sensorc-inner-type1">
                <div className="sensorc-inner-image">
                    <img src = {ph} alt = "temp image" />
                </div>
                <div className="sensorc-inner-details">
                    <div className="sensorc-inner-title">PH</div>
                    <div className="sensorc-value-units">
                        <div className="sensorc-inner-sensor-value">12</div>
                        <div className="sensorc-inner-sensor-unit">μmol/m²/s </div>
                    </div>
                </div>
            </div>

            <div className="sensorc-inner-type1">
                <div className="sensorc-inner-image">
                    <img src = "src/assets/namu-temp-dark.svg" alt = "temp image" />
                </div>
                <div className="sensorc-inner-details">
                    <div className="sensorc-inner-title">온도</div>
                    <div className="sensorc-value-units">
                        <div className="sensorc-inner-sensor-value">12</div>
                        <div className="sensorc-inner-sensor-unit">%</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SensorComponent