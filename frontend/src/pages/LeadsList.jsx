import React, { useEffect, useMemo, useState, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { getLeads, deleteLead, deleteAllLeads } from "../services/leadService";
import { useNavigate } from "react-router-dom";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function LeadsList() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteDropdownOpen, setDeleteDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allLeads, setAllLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState(new Set());
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const columns = useMemo(() => [
    { headerName: "First", field: "first_name", flex: 1 },
    { headerName: "Last", field: "last_name", flex: 1 },
    { headerName: "Email", field: "email", flex: 2 },
    { headerName: "Company", field: "company", flex: 1 },
    { headerName: "City", field: "city", flex: 1 },
    { headerName: "State", field: "state", flex: 1 },
    { headerName: "Source", field: "source", flex: 1 },
    { headerName: "Status", field: "status", flex: 1 },
    { headerName: "Score", field: "score", flex: 0.7 },
    { headerName: "Value", field: "lead_value", flex: 0.9 },
    {
      headerName: "Actions",
      field: "_id",
      cellRenderer: (params) =>
        `<div style="display:flex;gap:12px">
          <button class="btn-edit" data-id="${params.value}" aria-label="Edit lead">Edit</button>
          <button class="btn-delete" data-id="${params.value}" aria-label="Delete lead">Delete</button>
        </div>`,
      flex: 1,
      minWidth: 160,
    },
  ], []);

  const fetchLeads = async (p = page) => {
    try {
      setLoading(true);
      const res = await getLeads({ page: p, limit });
      setRows(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || Math.max(1, Math.ceil((res.total || 0) / limit)));
      if (p > totalPages && totalPages > 0) setPage(totalPages);
    } catch {
      setRows([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLeads = async () => {
    try {
      const res = await getLeads({ page: 1, limit: 1000 });
      setAllLeads(res.data || []);
    } catch {
      alert("Failed to load leads for deletion");
    }
  };

  useEffect(() => {
    fetchLeads(page);
  }, [page]);

  useEffect(() => {
    if (deleteDropdownOpen) fetchAllLeads();
    else {
      setSelectedLeads(new Set());
      setSearchTerm("");
    }
  }, [deleteDropdownOpen]);

  useEffect(() => {
    if (!deleteDropdownOpen) return;
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDeleteDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [deleteDropdownOpen]);

  const filteredLeads = allLeads.filter((l) =>
    l.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleLeadSelection = (id) => {
    setSelectedLeads(prev => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const selectAllFiltered = (checked) => {
    setSelectedLeads(checked ? new Set(filteredLeads.map(l => l._id)) : new Set());
  };

  const handleDeleteSelected = async () => {
    if (selectedLeads.size === 0) {
      alert("Please select leads to delete.");
      return;
    }
    if (!window.confirm(`Delete ${selectedLeads.size} selected lead(s)? This action cannot be undone.`)) return;
    try {
      for (let id of selectedLeads) {
        await deleteLead(id);
      }
      alert("Selected leads deleted.");
      fetchLeads(page);
      setSelectedLeads(new Set());
      setDeleteDropdownOpen(false);
    } catch {
      alert("Failed to delete selected leads.");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL leads? This action cannot be undone.")) return;
    try {
      await deleteAllLeads();
      alert("All leads deleted.");
      fetchLeads(1);
      setSelectedLeads(new Set());
      setDeleteDropdownOpen(false);
      setPage(1);
    } catch {
      alert("Failed to delete all leads.");
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      await deleteLead(id);
      fetchLeads(page);
    } catch {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    const gridEl = document.querySelector(".ag-theme-alpine");
    if (!gridEl) return;
    const handler = (ev) => {
      if (ev.target.classList.contains("btn-edit")) {
        navigate(`/leads/edit/${ev.target.dataset.id}`);
      } else if (ev.target.classList.contains("btn-delete")) {
        handleDeleteLead(ev.target.dataset.id);
      }
    };
    gridEl.addEventListener("click", handler);
    return () => gridEl.removeEventListener("click", handler);
  }, [rows]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>Leads</h2>
        <div style={styles.actions}>
          <button onClick={() => { setPage(1); navigate("/leads/new"); }} style={styles.createBtn}>Create</button>
          <button
            onClick={() => setDeleteDropdownOpen(d => !d)}
            style={{ ...styles.deleteToggleBtn, ...(deleteDropdownOpen ? styles.deleteToggleActive : {}) }}
            aria-expanded={deleteDropdownOpen}
            aria-haspopup="true"
          >
            Delete Leads
            <span style={styles.arrow}>{deleteDropdownOpen ? "▲" : "▼"}</span>
          </button>
        </div>
      </header>

      {deleteDropdownOpen && (
        <div ref={dropdownRef} style={styles.dropdown}>
          <input
            type="search"
            aria-label="Search leads"
            placeholder="Search leads by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            autoFocus
          />
          <label style={styles.selectAllLabel}>
            <input
              type="checkbox"
              checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
              onChange={(e) => selectAllFiltered(e.target.checked)}
              style={{ marginRight: 10 }}
            />
            Select All ({filteredLeads.length})
          </label>
          <div style={styles.leadsList}>
            {filteredLeads.length === 0 ? (
              <div style={styles.noLeadsText}>No leads found</div>
            ) : filteredLeads.map(lead => (
              <label key={lead._id} style={styles.leadItem}>
                <input
                  type="checkbox"
                  checked={selectedLeads.has(lead._id)}
                  onChange={() => toggleLeadSelection(lead._id)}
                  style={{ marginRight: 10 }}
                />
                <div>
                  <div style={styles.leadName}><b>{lead.first_name} {lead.last_name}</b></div>
                  <div style={styles.leadEmail}>{lead.email}</div>
                </div>
              </label>
            ))}
          </div>
          <div style={styles.deleteButtons}>
            <button onClick={handleDeleteSelected} style={{ ...styles.deleteBtn, backgroundColor: "#ef4444" }}>Delete Selected</button>
            <button onClick={handleDeleteAll} style={{ ...styles.deleteBtn, backgroundColor: "#b91c1c" }}>Delete All Leads</button>
          </div>
        </div>
      )}

      <div className="ag-theme-alpine" style={styles.gridContainer}>
        <AgGridReact
          rowData={rows}
          columnDefs={columns}
          defaultColDef={{ sortable: true, filter: true, resizable: true }}
          overlayLoadingTemplate="<span class='ag-overlay-loading-center'>Loading...</span>"
          pagination={false}
        />
        {(!rows || rows.length === 0) && !loading && (
          <div style={styles.emptyState}>
            No leads found.<br />
            Click <b>Create</b> to add your first lead!
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 32,
    maxWidth: 1400,
    margin: "0 auto",
    minHeight: "calc(100vh - 70px)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#222",
    position: "relative",
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 },
  title: { fontSize: 36, fontWeight: 700 },
  actions: { display: "flex", gap: 14, alignItems: "center" },

  createBtn: {
    padding: "10px 24px",
    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    border: "none",
    color: "#fff",
    borderRadius: 14,
    fontWeight: 600,
    fontSize: 18,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(56, 139, 253, 0.6)",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  createBtnHover: {
    backgroundColor: "#1e40af",
    transform: "scale(1.05)",
  },

  deleteToggleBtn: {
    padding: "10px 24px",
    background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
    border: "none",
    color: "#fff",
    borderRadius: 14,
    fontWeight: 600,
    fontSize: 18,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(239, 68, 68, 0.6)",
    display: "flex",
    alignItems: "center",
    gap: 6,
    transition: "background-color 0.3s ease",
  },
  deleteToggleActive: {
    boxShadow: "0 0 15px 4px rgba(239, 68, 68, 0.8)",
    filter: "brightness(1.1)",
  },
  arrow: {
    fontSize: 12,
    userSelect: "none",
  },

  dropdown: {
    position: "absolute",
    top: 90,
    right: 32,
    width: 360,
    backgroundColor: "rgba(255 255 255 / 0.98)",
    backdropFilter: "blur(8px)",
    borderRadius: 16,
    boxShadow: "0 12px 36px rgba(0,0,0,0.18)",
    zIndex: 1100,
    padding: 24,
    userSelect: "none",
  },

  searchInput: {
    width: "100%",
    padding: 12,
    marginBottom: 16,
    borderRadius: 10,
    border: "1px solid #ccc",
    fontSize: 16,
    outline: "none",
    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.07)",
  },

  selectAllLabel: {
    display: "flex",
    alignItems: "center",
    fontWeight: 700,
    color: "#444",
    borderBottom: "1px solid #eee",
    paddingBottom: 10,
    marginBottom: 20,
  },
  leadsList: {
    maxHeight: 280,
    overflowY: "auto",
    borderRadius: 12,
    border: "1px solid #ddd",
  },
  leadItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #f2f2f7",
    cursor: "pointer",
    transition: "background-color 0.15s ease",
  },
  leadItemHover: {
    backgroundColor: "#f0f5ff",
  },
  leadName: {
    fontSize: 15,
    color: "#111827",
  },
  leadEmail: {
    fontSize: 12,
    color: "#6b7280",
  },

  deleteButtons: {
    marginTop: 20,
    display: "flex",
    gap: 14,
    justifyContent: "space-between",
  },
  deleteBtn: {
    flex: 1,
    padding: "14px 24px",
    borderRadius: 16,
    border: "none",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 8px 28px rgba(0,0,0,0.15)",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  },

  gridContainer: {
    height: 580,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    boxShadow: "0 12px 38px rgba(50,50,93,.1)",
  },

  emptyState: {
    padding: 70,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 22,
    fontWeight: 600,
  },
};
