// src/pages/Signup.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { handleSignup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    await handleSignup(name, email, password);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Signup</h2>
      <form onSubmit={submitHandler} className="flex flex-col gap-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="border p-2"/>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2"/>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border p-2"/>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Signup</button>
      </form>
    </div>
  );
}
