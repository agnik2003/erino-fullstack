import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>
        <Link to="/leads" style={styles.brandLink}>
          Lead Manager
        </Link>
      </div>

      <div style={styles.authSection}>
        {user ? (
          <>
            <span style={styles.userName}>Hello, {user.name}</span>
            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
              aria-label="Logout"
              type="button"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link} tabIndex={0}>
              Login
            </Link>
            <Link to="/register" style={styles.link} tabIndex={0}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    padding: "16px 32px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontWeight: 700,
    fontSize: 24,
  },
  brandLink: {
    textDecoration: "none",
    color: "#2563eb",
    transition: "color 0.3s ease",
  },
  authSection: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    fontSize: 16,
  },
  userName: {
    color: "#374151",
    fontWeight: 600,
  },
  logoutBtn: {
    padding: "8px 18px",
    backgroundColor: "#ef4444",
    border: "none",
    color: "#fff",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 16,
    boxShadow: "0 4px 14px rgba(239,68,68,0.4)",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  },
  link: {
    textDecoration: "none",
    color: "#2563eb",
    fontWeight: 600,
    padding: "8px 14px",
    borderRadius: 6,
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
};
