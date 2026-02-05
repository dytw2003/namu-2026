import React from "react";
import { Outlet } from "react-router-dom";

import "./AppLayout.css";

import FooterComoponent from "../../Components/footerComponent/FooterComponent";
import HeaderComoponent from "../../Components/headercomponent/HeaderComoponent";
import OuterSensorData from "../../Components/outeerSensorData/OuterSensorData";

import { useTheme } from "../../providers/ThemeProvider/ThemeProvider"

function AppLayout() {

  const { theme } = useTheme();
  return (
    <div className= {`app-layout ${theme}`}>
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


