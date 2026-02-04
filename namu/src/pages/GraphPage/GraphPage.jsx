import React from 'react'
import { useState } from "react"

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./GraphPage.css"

import SensorSelectionComponent from '../../Components/sensorSelectionComponent/SensorSelectionComponent'
import PhGraph from '../../Components/graphComponent/PhGraph/PhGraph'
import TempGraph from '../../Components/graphComponent/TempGraph/TempGraph'
import EcGraph from '../../Components/graphComponent/EcGraph/EcGraph'
import HumiGraph from '../../Components/graphComponent/HumiGraph/HumiGraph'

import { useTheme } from "../../providers/ThemeProvider/ThemeProvider"
function GraphPage() {

  const { theme } = useTheme();

  const [selected, setSelected] = useState({
    temp: false,  // default ON if you want
    hum: false,
    ec: false,
    ph: true,
  });

  const toggle = (key) => {
    setSelected((prev) => {
      const isTurningOn = !prev[key];

      // ✅ if user is trying to turn ON a second checkbox
      if (isTurningOn) {
        const alreadyOnKey = Object.keys(prev).find((k) => prev[k] === true);

        // if something else is already ON and it's not the same key -> block
        if (alreadyOnKey && alreadyOnKey !== key) {
          toast.info("체크박스는 하나만 선택할 수 있습니다.", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
          });

          return prev; // ✅ do not change selection
        }
      }

      // normal toggle behavior
      return { ...prev, [key]: !prev[key] };
    });
  };


  return (
    <div className={`graphpage-main-div ${theme}`}>
      <div className="graphpage-sensor-selection">
        <SensorSelectionComponent
          selected={selected}
          onToggle={toggle}
        />
      </div>

      <div className="graphpage-sensors">
        {selected.temp && <TempGraph />}
        {selected.ph && <PhGraph />}
        {selected.ec && <EcGraph />}
        {selected.hum && <HumiGraph />}

      </div>
    </div>
  )
}

export default GraphPage
