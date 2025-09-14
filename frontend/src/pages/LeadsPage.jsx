// src/pages/LeadsPage.jsx
import { useEffect, useState } from "react";
import { getLeads } from "../services/leadService";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data } = await getLeads(page, 10);
        setLeads(data);
      } catch (err) {
        console.error("Error fetching leads:", err.response?.data || err.message);
      }
    };
    fetchLeads();
  }, [page]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Leads (Page {page})</h1>
      <ul>
        {leads.map((lead) => (
          <li key={lead._id}>
            {lead.first_name} {lead.last_name} — {lead.email}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-4">
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} className="px-4 py-2 bg-gray-200 rounded">Prev</button>
        <button onClick={() => setPage((p) => p + 1)} className="px-4 py-2 bg-gray-200 rounded">Next</button>
      </div>
    </div>
  );
}
