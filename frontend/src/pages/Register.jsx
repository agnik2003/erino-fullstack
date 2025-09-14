import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await signup(name, email, password);
      navigate("/leads");
    } catch (error) {
      setErr(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={center}>
      <div style={card}>
        <h2 style={{marginBottom:8}}>Register</h2>
        {err && <div style={{color:"red", marginBottom:8}}>{err}</div>}
        <form onSubmit={submit} style={{display:"flex",flexDirection:"column", gap:10}}>
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} style={input}/>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={input}/>
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={input}/>
          <button type="submit" style={primaryBtn}>Sign up</button>
        </form>
      </div>
    </div>
  );
}

const center = { display: "flex", height: "80vh", alignItems: "center", justifyContent: "center" };
const card = { width: 380, padding: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", borderRadius: 8, background: "#fff" };
const input = { padding: 10, borderRadius: 6, border: "1px solid #ddd" };
const primaryBtn = { padding: "10px 12px", background: "#10b981", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" };
