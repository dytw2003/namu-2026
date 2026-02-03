import React from "react";
import { Outlet } from "react-router-dom";

import "./AppLayout.css";

import FooterComoponent from "../../Components/footerComponent/FooterComponent";
import HeaderComoponent from "../../Components/headercomponent/HeaderComoponent";

function AppLayout() {
  return (
    <div className="app-layout">
      <HeaderComoponent />

      <main className="app-main">
        <Outlet />
      </main>

      <FooterComoponent />
    </div>
  );
}

export default AppLayout;


