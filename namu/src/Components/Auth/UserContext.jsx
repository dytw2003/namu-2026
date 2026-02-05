// src/Components/Login/UserContext.jsx
import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

const TOKEN_KEY = "agr_access_token"; // ✅ CHANGED (was "access_token")

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // ✅ On refresh, restore user from AGR token only
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY); // ✅ CHANGED
    if (token && !user) {
      // optional: decode token and set real username
      setUser({ username: "logged_in" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ checkSession must also use AGR token
  const checkSession = () => !!localStorage.getItem(TOKEN_KEY); // ✅ CHANGED

  return (
    <UserContext.Provider value={{ user, setUser, checkSession }}>
      {children}
    </UserContext.Provider>
  );
}
