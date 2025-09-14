import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      navigate("/leads");
    } catch (error) {
      setErr(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={center}>
      <div style={card}>
        <h2 style={{marginBottom:8}}>Login</h2>
        {err && <div style={{color:"red", marginBottom:8}}>{err}</div>}
        <form onSubmit={submit} style={{display:"flex",flexDirection:"column", gap:10}}>
          <input name="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={input}/>
          <input name="password" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={input}/>
          <button type="submit" style={primaryBtn}>Login</button>
        </form>
      </div>
    </div>
  );
}

const center = { display: "flex", height: "80vh", alignItems: "center", justifyContent: "center" };
const card = { width: 380, padding: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", borderRadius: 8, background: "#fff" };
const input = { padding: 10, borderRadius: 6, border: "1px solid #ddd" };
const primaryBtn = { padding: "10px 12px", background: "#0ea5e9", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
