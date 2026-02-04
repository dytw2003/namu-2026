import React from "react";
import HeaderComoponent from "../../Components/headercomponent/HeaderComoponent";
import FooterComoponent from "../../Components/footerComponent/FooterComponent";

import "./GraphLayout.css"
import SensorSelectionComponent from "../../Components/sensorSelectionComponent/SensorSelectionComponent";
import { Outlet } from "react-router-dom";
import GraphPage from "../../pages/GraphPage/GraphPage";

function GraphLayout() {
  return (
    <div className="graph-layout-main">
      <HeaderComoponent />
      <div className="graph-layout-inner">
        <GraphPage />
       <Outlet />
      </div>

      <FooterComoponent />
    </div>
  );
}

export default GraphLayout;
