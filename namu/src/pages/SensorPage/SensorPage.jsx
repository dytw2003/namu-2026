import React from "react";
import SensorComponent from "../../Components/sensorCompoonent/sensorComponent";
import "./SensorPage.css"

function SensorPage() {
  const sensors = Array.from({ length: 50 }, (_, i) => i + 1);

  return (
    <div className="sensors-grid">
      {sensors.map((n) => (
        <SensorComponent key={n} sensorNo={n} />
      ))}
    </div>
  );
}

export default SensorPage;
