import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// STYLES
const wrapper = {
  minHeight: "100vh",
  background: "linear-gradient(120deg, #f0f5ff 0%, #f3f4fa 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 16px",
};

const content = {
  display: "flex",
  flexDirection: "row",
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 6px 24px rgba(0,0,0,0.10)",
  overflow: "hidden",
  maxWidth: 900,
  width: "100%",
};

const left = {
  background: "linear-gradient(135deg,#0ea5e9 60%,#6366f1 100%)",
  color: "#fff",
  flex: 1.2,
  padding: "48px 36px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: 440,
};

const right = {
  flex: 1,
  padding: "40px 36px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minWidth: 320,
};

const branding = {
  fontSize: 38,
  fontWeight: "800",
  letterSpacing: -2,
  marginBottom: 18,
  fontFamily: "Inter, sans-serif"
};

const desc = {
  fontSize: 20,
  fontWeight: "400",
  color: "#e0e7ef",
  lineHeight: 1.4,
  marginBottom: 34,
};

const cardTabs = {
  display: "flex",
  justifyContent: "center",
  marginBottom: 20,
  gap: 12
};

const formInput = {
  padding: 12,
  borderRadius: 7,
  border: "1px solid #bcccdc",
  marginBottom: 16,
  fontSize: 16,
  background: "#f9fafb",
  width: "100%",
};

const activeTab = {
  background: "#0ea5e9",
  color: "#fff",
  padding: "10px 28px",
  borderRadius: 7,
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
  fontSize: 16,
};

const inactiveTab = {
  background: "#f3f4fa",
  color: "#222",
  padding: "10px 28px",
  borderRadius: 7,
  border: "none",
  cursor: "pointer",
  fontSize: 16,
};

const primaryBtn = {
  padding: "12px 0",
  background: "linear-gradient(90deg,#0ea5e9,#6366f1)",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 16,
  marginTop: "6px",
  width: "100%",
};

export default function Landing() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const change = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await signup(form.name, form.email, form.password);
      }
      navigate("/leads");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={wrapper}>
      <div style={content}>
        {/* Left Panel: Branding & value proposition */}
        <div style={left}>
          <div style={branding}>
            🚀 Lead Manager
          </div>
          <div style={desc}>
            All your leads. <b>Organized</b>.<br />
            Fast, reliable, and made for sales teams.<br />
            Secure, modern, and hassle-free.
          </div>
          <ul style={{ fontSize: 15, color: "#e0e7ef", paddingLeft: 18, marginBottom: 10 }}>
            <li>✔️ JWT Auth with httpOnly cookies</li>
            <li>✔️ Real-time filtering & paging</li>
            <li>✔️ Secure, zero-setup experience</li>
            <li>✔️ Works everywhere, always</li>
          </ul>
        </div>
        {/* Right Panel: Auth Tabs and Forms */}
        <div style={right}>
          <div style={cardTabs}>
            <button
              style={mode === "login" ? activeTab : inactiveTab}
              onClick={() => setMode("login")}
              type="button"
            >
              Login
            </button>
            <button
              style={mode === "signup" ? activeTab : inactiveTab}
              onClick={() => setMode("signup")}
              type="button"
            >
              Sign Up
            </button>
          </div>
          {error && <div style={{ color: "red", marginBottom: 14, textAlign: "center" }}>{error}</div>}
          <form onSubmit={submit} autoComplete="on">
            {mode === "signup" && (
              <input
                style={formInput}
                placeholder="Full Name"
                value={form.name}
                autoFocus
                onChange={(e) => change("name", e.target.value)}
              />
            )}
            <input
              type="email"
              style={formInput}
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => change("email", e.target.value)}
            />
            <input
              type="password"
              style={formInput}
              placeholder="Password"
              value={form.password}
              onChange={(e) => change("password", e.target.value)}
            />
            <button type="submit" style={primaryBtn}>
              {mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>
          <div style={{ marginTop: 24, fontSize: 12, color: "#888", textAlign: "center" }}>
            Built with React, Node, and AG Grid • <b>Secure & Fast</b>
          </div>
        </div>
      </div>
    </div>
  );
}
