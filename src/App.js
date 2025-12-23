import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ProjectPage from "./pages/ProjectPage";
import Layout from "./components/Layout";

function App() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <ThemeProvider>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={!userInfo ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/"
            element={userInfo ? <Layout /> : <Navigate to="/login" />}
          >
            <Route
              path="dashboard"
              element={
                userInfo?.role === "employee" ? (
                  <EmployeeDashboard />
                ) : (
                  <Dashboard />
                )
              }
            />
            <Route path="project/:id" element={<ProjectPage />} />
            <Route path="" element={<Navigate to="/dashboard" />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
