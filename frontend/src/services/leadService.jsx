import api from "../api/axios";

// list with pagination and filters
export const getLeads = async ({ page = 1, limit = 20, filters = {} } = {}) => {
  const params = { page, limit, ...filters };
  const { data } = await api.get("/leads", { params });
  return data; // returns { data: [], page, limit, total, totalPages }
};

// fetch single lead by id
export const getLead = (id) => api.get(`/leads/${id}`);

export const createLead = (payload) => api.post("/leads", payload);

export const updateLead = (id, payload) => api.put(`/leads/${id}`, payload);

export const deleteLead = (id) => api.delete(`/leads/${id}`);

// bulk delete all leads
export const deleteAllLeads = () => api.delete("/leads");
