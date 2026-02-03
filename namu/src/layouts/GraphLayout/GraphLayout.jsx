import React from "react";
import HeaderComoponent from "../../Components/headercomponent/HeaderComoponent";
import FooterComoponent from "../../Components/footerComponent/FooterComponent";

import "./GraphLayout.css"
import SensorSelectionComponent from "../../Components/sensorSelectionComponent/SensorSelectionComponent";

function GraphLayout() {
  return (
    <div className="graph-layout-main">
      <HeaderComoponent />
      <div className="graph-layout-inner">
       <SensorSelectionComponent />
      </div>

      <FooterComoponent />
    </div>
  );
}

export default GraphLayout;
