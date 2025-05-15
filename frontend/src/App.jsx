import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./loginFrom";
import Dashboard from "./dashboard";
import AddAgent from "./addagent";
import UploadCSV from "./uploadcsv";
import RegisterForm from "./registerForm";
import Logout from "./logout";
import AgentView from "./agentView";
import { useState, useEffect } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    // Listen to changes in token (e.g., from other tabs or logout)
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginForm setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/agents"
          element={isAuthenticated ? <AddAgent /> : <Navigate to="/" />}
        />
        <Route
          path="/agent/:agentId"
          element={isAuthenticated ? <AgentView /> : <Navigate to="/" />}
        />
        <Route
          path="/upload"
          element={isAuthenticated ? <UploadCSV /> : <Navigate to="/" />}
        />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/logout"
          element={<Logout setIsAuthenticated={setIsAuthenticated} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
