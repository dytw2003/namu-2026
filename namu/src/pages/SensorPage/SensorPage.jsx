import React from "react";
import SensorComponent from "../../Components/sensorCompoonent/sensorComponent";
import "./SensorPage.css"

import { useTheme } from "../../providers/ThemeProvider/ThemeProvider";

function SensorPage() {
  const sensors = Array.from({ length: 50 }, (_, i) => i + 1);

  const { theme } = useTheme();

  return (
    <div className = {`sensors-grid ${theme}`}>
      {sensors.map((n) => (
        <SensorComponent key={n} sensorNo={n} />
      ))}
    </div>
  );
}

export default SensorPage;
