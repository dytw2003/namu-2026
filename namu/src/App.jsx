// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layouts/AppLayout/AppLayout";
import GraphLayout from "./layouts/GraphLayout/GraphLayout";

import SensorPage from "./pages/SensorPage/SensorPage";
import GraphPage from "./pages/GraphPage/GraphPage";

import Login from "./Components/Auth/Login";

// ✅ simple auth check (you can replace this later with Context)
const isAuthed = () => !!localStorage.getItem("access_token");

// ✅ protect routes
function PrivateRoute({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ✅ login route */}
        <Route path="/login" element={<Login />} />

        {/* ✅ home (protected) */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/home" element={<SensorPage />} />
        </Route>

        {/* ✅ graph (protected) */}
        <Route
          element={
            <PrivateRoute>
              <GraphLayout />
            </PrivateRoute>
          }
        >
          <Route path="/graph" element={<GraphPage />} />
        </Route>

        {/* ✅ fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
