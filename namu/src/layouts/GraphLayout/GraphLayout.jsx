import React from "react";
import HeaderComoponent from "../../Components/headercomponent/HeaderComoponent";
import FooterComoponent from "../../Components/footerComponent/FooterComponent";

import "./GraphLayout.css"
import { Outlet } from "react-router-dom";


function GraphLayout() {
  return (
    <div className="graph-layout-main">
      <HeaderComoponent />
      <div className="graph-layout-inner">
        <Outlet />
      </div>

      <FooterComoponent />
    </div>
  );
}

export default GraphLayout;


