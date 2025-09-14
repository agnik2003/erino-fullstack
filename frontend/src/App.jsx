import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Landing from "./pages/Landing";
import LeadsList from "./pages/LeadsList";
import LeadForm from "./pages/LeadForm";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <LeadsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads/new"
            element={
              <ProtectedRoute>
                <LeadForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads/edit/:id"
            element={
              <ProtectedRoute>
                <LeadForm />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<div style={{ padding: 20 }}>404 - Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
