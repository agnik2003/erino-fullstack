// axios instance — uses credentials so httpOnly cookie is sent
import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api",
  bbaseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // IMPORTANT: send/receive httpOnly cookie
});

export default api;
