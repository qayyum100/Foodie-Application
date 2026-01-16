import React, { useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  // ===== VALIDATION FUNCTIONS =====
  const isValidName = (name) => /^[A-Za-z ]{3,}$/.test(name);
  const isValidEmail = (email) =>
    /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/.test(email);
  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
  // ===== SUBMIT HANDLER =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    // ---- FRONTEND VALIDATION ----
    if (!isValidName(name)) {
      alert("Name must be at least 3 letters and contain only alphabets.");
      return;
    }
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!isStrongPassword(password)) {
      alert(
        "Password must be at least 8 characters and include:\n- Uppercase\n- Lowercase\n- Number\n- Special character"
      );
      return;
    }
    // ---- API CALL ----
    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password
      });
      const body = res.data;
      login(body.token, {
        id: body.id,
        name: body.name,
        email: body.email
      });
      navigate("/");
    } catch (err) {
      alert(err?.response?.data || "Registration failed");
    }
  };
  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <small style={{ color: "#555", display: "block", marginBottom: 10 }}>
          Password must contain uppercase, lowercase, number & special character.
        </small>
        <button className="btn" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}