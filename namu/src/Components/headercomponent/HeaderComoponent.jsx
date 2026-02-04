import React from "react";
import { useState } from "react";

import { FiSun, FiMoon, FiLogOut } from "react-icons/fi";

import logoIconDark from "../../assets/adas-logo-dark.svg";
import logoIconLight from "../../assets/logo-light.svg";

import { NavLink } from "react-router-dom";
import "./HeaderComponent.css";


import { useTheme } from "../../providers/ThemeProvider/ThemeProvider";

function HeaderComoponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`header ${theme}`}>
      {/* Left */}

      <div className="header-brand">
        <div className="header-logo-outer">
          <div className="header-logo">
            <img src={theme === "dark" ? logoIconDark : logoIconLight } alt="logo" />
          </div>
        </div>
        <div className="header-farmName">아다스주식회사</div>
      </div>

      {/* Center */}
      <nav className="header-nav">
        <NavLink to="/home" end className="nav-item-home">
          홈
        </NavLink>

        <NavLink to="/graph" end className="nav-item-graph">
          통계 분석
        </NavLink>
      </nav>

      {/* Right */}
      <div className="header-right">
        <button
          className={`header-modeBtn ${theme === "dark" ? "is-dark" : "is-light"}`}
          type="button"
          onClick={toggleTheme}
          aria-pressed={theme === "dark"}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          <span className="mode-label">
            {theme === "dark" ? "다크모드" : "라이트모드"}
          </span>

          <span className="mode-knob" aria-hidden="true">
            {theme === "dark" ? <FiMoon /> : <FiSun />}
          </span>
        </button>

        <button className="header-logoutBtn" type="button">
          <span className="logout-text">로그아웃</span>
       <FiLogOut className={`logout-ico ${theme}`} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default HeaderComoponent;
