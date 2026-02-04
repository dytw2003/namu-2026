import { useState } from "react";
import SensorComponent from "./Components/sensorCompoonent/sensorComponent";
import SensorPage from "./pages/SensorPage/SensorPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout/AppLayout";

import GraphComponent from "./Components/graphComponent/GraphComponent";
import GraphLayout from "./layouts/GraphLayout/GraphLayout";
import GraphPage from "./pages/GraphPage/GraphPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<SensorPage />} />
        </Route>
    
        <Route element={<GraphLayout />}>
          <Route path="/graph" element={<GraphPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
