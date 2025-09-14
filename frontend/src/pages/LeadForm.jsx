import React, { useEffect, useState } from "react";
import { createLead, getLead, updateLead } from "../services/leadService";
import { useNavigate, useParams } from "react-router-dom";

const empty = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  company: "",
  city: "",
  state: "",
  source: "website",
  status: "new",
  score: 0,
  lead_value: 0,
  last_activity_at: "",
  is_qualified: false,
};

export default function LeadForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const { data } = await getLead(id);
          setForm({
            ...data,
            last_activity_at: data.last_activity_at
              ? new Date(data.last_activity_at).toISOString().slice(0, 16)
              : "",
          });
        } catch (e) {
          setErr("Failed to load lead");
        }
      })();
    }
  }, [id, isEdit]);

  const change = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) await updateLead(id, form);
      else await createLead(form);
      navigate("/leads");
    } catch (error) {
      setErr(error.response?.data?.message || "Save failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{isEdit ? "Edit Lead" : "Create Lead"}</h2>
      {err && <div style={styles.error}>{err}</div>}
      <form onSubmit={submit} style={styles.form}>
        <input
          placeholder="First name"
          value={form.first_name}
          onChange={(e) => change("first_name", e.target.value)}
          style={styles.input}
          required
        />
        <input
          placeholder="Last name"
          value={form.last_name}
          onChange={(e) => change("last_name", e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => change("email", e.target.value)}
          style={styles.input}
          required
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => change("phone", e.target.value)}
          style={styles.input}
        />
        <input
          placeholder="Company"
          value={form.company}
          onChange={(e) => change("company", e.target.value)}
          style={styles.input}
        />
        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => change("city", e.target.value)}
          style={styles.input}
        />
        <input
          placeholder="State"
          value={form.state}
          onChange={(e) => change("state", e.target.value)}
          style={styles.input}
        />
        <select
          value={form.source}
          onChange={(e) => change("source", e.target.value)}
          style={styles.input}
        >
          <option value="website">Website</option>
          <option value="facebook_ads">Facebook Ads</option>
          <option value="google_ads">Google Ads</option>
          <option value="referral">Referral</option>
          <option value="events">Events</option>
          <option value="other">Other</option>
        </select>

        <select
          value={form.status}
          onChange={(e) => change("status", e.target.value)}
          style={styles.input}
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="lost">Lost</option>
          <option value="won">Won</option>
        </select>

        <input
          type="number"
          placeholder="Score"
          value={form.score}
          onChange={(e) => change("score", Number(e.target.value))}
          style={styles.input}
          min={0}
          max={100}
        />
        <input
          type="number"
          placeholder="Lead value"
          value={form.lead_value}
          onChange={(e) => change("lead_value", Number(e.target.value))}
          style={styles.input}
          min={0}
          step="0.01"
        />

        <input
          type="datetime-local"
          placeholder="Last activity"
          value={form.last_activity_at || ""}
          onChange={(e) => change("last_activity_at", e.target.value)}
          style={styles.input}
        />

        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={form.is_qualified}
            onChange={(e) => change("is_qualified", e.target.checked)}
            style={styles.checkbox}
          />
          Qualified
        </label>

        <div style={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => navigate("/leads")}
            style={styles.cancelBtn}
          >
            Cancel
          </button>
          <button type="submit" style={styles.submitBtn}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: 24,
    maxWidth: 700,
    margin: "auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#222",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111",
  },
  error: {
    color: "#dc2626",
    marginBottom: 20,
    fontWeight: 600,
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 18,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    fontSize: 16,
    color: "#1e293b",
    outlineOffset: 2,
    outlineColor: "transparent",
    transition: "outline-color 0.2s ease",
  },
  checkboxLabel: {
    gridColumn: "1 / -1",
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 16,
    color: "#334155",
  },
  checkbox: {
    width: 20,
    height: 20,
  },
  buttonGroup: {
    gridColumn: "1 / -1",
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
    marginTop: 12,
  },
  cancelBtn: {
    padding: "10px 22px",
    backgroundColor: "transparent",
    border: "2px solid #94a3b8",
    color: "#475569",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 16,
    transition: "background-color 0.3s ease, color 0.3s ease",
  },
  submitBtn: {
    padding: "10px 26px",
    backgroundColor: "#3b82f6",
    border: "none",
    borderRadius: 8,
    fontWeight: 700,
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
    transition: "background-color 0.3s ease",
  },
};
