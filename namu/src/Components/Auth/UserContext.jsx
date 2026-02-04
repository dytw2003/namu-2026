// src/Components/Login/UserContext.jsx
import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Optional: on refresh, restore user from token if exists
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !user) {
      // If you want, decode and set username here.
      // For now just mark authed.
      setUser({ username: "logged_in" });
    }
  }, []);

  // Optional: you referenced checkSession in Login, so provide it
  const checkSession = () => !!localStorage.getItem("access_token");

  return (
    <UserContext.Provider value={{ user, setUser, checkSession }}>
      {children}
    </UserContext.Provider>
  );
}
