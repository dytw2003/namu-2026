import React from 'react'
  import { Outlet } from "react-router-dom";

  import FooterComoponent from '../../Components/footerComponent/FooterComponent';


function AuthLayout() {
  return (
    
    <div className="auth-layout">
        <Outlet />

        <FooterComoponent />
    </div>
  )
}

export default AuthLayout
