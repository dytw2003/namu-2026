import React from "react";
import { Outlet } from "react-router-dom";

import "./AppLayout.css";

import FooterComoponent from "../../Components/footerComponent/FooterComponent";
import HeaderComoponent from "../../Components/headercomponent/HeaderComoponent";
import OuterSensorData from "../../Components/outeerSensorData/OuterSensorData";

function AppLayout() {
  return (
    <div className="app-layout">
      <HeaderComoponent />

     

      <main className="app-main">
         <OuterSensorData />
         
        <Outlet />
      </main>

      <FooterComoponent />
    </div>
  );
}

export default AppLayout;


