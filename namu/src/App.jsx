// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layouts/AppLayout/AppLayout";
import GraphLayout from "./layouts/GraphLayout/GraphLayout";

import SensorPage from "./pages/SensorPage/SensorPage";
import GraphPage from "./pages/GraphPage/GraphPage";

import Login from "./Components/Auth/Login";

import AuthLayout from "./layouts/AuthLayout/AuthLayout";

// ✅ simple auth check (you can replace this later with Context)
const isAuthed = () => !!localStorage.getItem("agr_access_token");



// ✅ protect routes
function PrivateRoute({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter basename="/tree">
      <Routes>
        {/* ✅ redirect root to login */}
        <Route path="/" element={<Navigate to="/agrlogin" replace />} />

        <Route element={<AuthLayout />}>
          <Route path="/agrlogin" element={<Login />} />
        </Route>

        {/* ✅ home (protected) */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/agrhome" element={<SensorPage />} />
        </Route>

        {/* ✅ graph (protected) */}
        <Route
          element={
            <PrivateRoute>
              <GraphLayout />
            </PrivateRoute>
          }
        >
          <Route path="/agrgraph" element={<GraphPage />} />
        </Route>

        {/* ✅ fallback */}
        <Route path="*" element={<Navigate to="/agrlogin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
