import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ThemeProvider from "./providers/ThemeProvider/ThemeProvider.jsx";
import MqttProvider from "./providers/MqttProvider/MqttProvider.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <MqttProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </MqttProvider>
  </ThemeProvider>,
);
