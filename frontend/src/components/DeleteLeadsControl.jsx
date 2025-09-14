import React, { useEffect, useState, useMemo, useRef } from "react";
import { getLeads, deleteLead, deleteAllLeads } from "../services/leadService";

export default function DeleteLeadsControl({ onLeadsDeleted }) {
  const [open, setOpen] = useState(false);
  const [allLeads, setAllLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeadIds, setSelectedLeadIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch all leads once when dropdown opens
  useEffect(() => {
    if (!open) return;

    let canceled = false;
    const fetchAllLeads = async () => {
      setLoading(true);
      try {
        // Fetch all leads with big limit (e.g. 1000)
        const data = await getLeads({ page: 1, limit: 1000 });
        if (!canceled) setAllLeads(data.data || []);
      } catch (err) {
        alert("Failed to load leads for deletion");
      } finally {
        if (!canceled) setLoading(false);
      }
    };
    fetchAllLeads();
    return () => (canceled = true);
  }, [open]);

  // Filter leads by search term
  const filteredLeads = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return allLeads.filter(
      (lead) =>
        lead.first_name.toLowerCase().includes(term) ||
        lead.last_name.toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term)
    );
  }, [allLeads, searchTerm]);

  // Toggle a lead selection
  const toggleSelectLead = (id) => {
    setSelectedLeadIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Select or deselect all filtered leads
  const selectAll = (checked) => {
    if (checked) {
      const allIds = filteredLeads.map((lead) => lead._id);
      setSelectedLeadIds(new Set(allIds));
    } else {
      setSelectedLeadIds(new Set());
    }
  };

  // Delete selected leads API call
  const handleDeleteSelected = async () => {
    if (selectedLeadIds.size === 0) {
      alert("Please select at least one lead to delete.");
      return;
    }
    if (!window.confirm(`Delete ${selectedLeadIds.size} selected lead(s)? This cannot be undone.`)) return;
    setLoading(true);
    try {
      for (const id of selectedLeadIds) {
        await deleteLead(id);
      }
      alert("Selected leads deleted.");
      setSelectedLeadIds(new Set());
      onLeadsDeleted?.();
      setOpen(false);
    } catch {
      alert("Failed to delete some leads.");
    } finally {
      setLoading(false);
    }
  };

  // Delete all leads API call
  const handleDeleteAll = async () => {
    if (!window.confirm("Delete ALL leads? This cannot be undone.")) return;
    setLoading(true);
    try {
      await deleteAllLeads();
      alert("All leads deleted.");
      setSelectedLeadIds(new Set());
      onLeadsDeleted?.();
      setOpen(false);
    } catch {
      alert("Failed to delete all leads.");
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen((o) => !o)} style={buttonStyle}>
        Delete Leads
      </button>

      {open && (
        <div ref={dropdownRef} style={dropdownStyle}>
          <input
            type="text"
            placeholder="Search leads by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
            disabled={loading}
            autoFocus
          />

          <div style={{ maxHeight: 250, overflowY: "auto", border: "1px solid #ddd" }}>
            <label style={{ display: "flex", alignItems: "center", padding: "8px", borderBottom: "1px solid #eee" }}>
              <input
                type="checkbox"
                checked={selectedLeadIds.size === filteredLeads.length && filteredLeads.length > 0}
                onChange={(e) => selectAll(e.target.checked)}
                disabled={loading || filteredLeads.length === 0}
                style={{ marginRight: 8 }}
              />
              Select All ({filteredLeads.length})
            </label>

            {loading ? (
              <div style={{ padding: 10, textAlign: "center" }}>Loading leads...</div>
            ) : filteredLeads.length === 0 ? (
              <div style={{ padding: 10, textAlign: "center", color: "#888" }}>No leads found</div>
            ) : (
              filteredLeads.map((lead) => (
                <label key={lead._id} style={{ display: "flex", alignItems: "center", padding: "6px 8px", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={selectedLeadIds.has(lead._id)}
                    onChange={() => toggleSelectLead(lead._id)}
                    disabled={loading}
                    style={{ marginRight: 8 }}
                  />
                  <div>
                    <div><b>{lead.first_name} {lead.last_name}</b></div>
                    <div style={{ fontSize: 12, color: "#555" }}>{lead.email}</div>
                  </div>
                </label>
              ))
            )}
          </div>

          <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
            <button onClick={handleDeleteSelected} disabled={loading} style={{ ...buttonStyle, backgroundColor: "#ef4444" }}>
              Delete Selected
            </button>
            <button onClick={handleDeleteAll} disabled={loading} style={{ ...buttonStyle, backgroundColor: "#b91c1c" }}>
              Delete All Leads
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const buttonStyle = {
  padding: "8px 14px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  userSelect: "none",
  fontWeight: "600",
  fontSize: 14,
};

const dropdownStyle = {
  position: "absolute",
  top: "110%",
  right: 0,
  width: 320,
  backgroundColor: "white",
  border: "1px solid #ddd",
  borderRadius: 8,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  zIndex: 1000,
  padding: 8,
};

const searchInputStyle = {
  width: "100%",
  padding: "6px 10px",
  marginBottom: 8,
  border: "1px solid #ccc",
  borderRadius: 4,
  fontSize: 14,
};
