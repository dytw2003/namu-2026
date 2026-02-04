
  const API_BASE_URL = "www.adas.today";

import AuthApi from "../../apis/AuthApi/AuthApi";


export const loginApi = async (username, password) => {
    const login = AuthApi().login
  try {
   
    const response = await fetch(login, {
      method: "POST",
      credentials: "include", // ✅ Ensure cookies are sent
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const jsonResponse = await response.json();
   

    return jsonResponse;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};