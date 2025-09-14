import api from "../api/axios";

export const signup = (payload) => api.post("/auth/signup", payload);
export const login = (payload) => api.post("/auth/login", payload);
export const logout = () => api.post("/auth/logout");
export const getCurrentUser = () => api.get("/auth/me");
