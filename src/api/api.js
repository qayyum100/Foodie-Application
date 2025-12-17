// src/api/api.js
import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json"
  }
});
// attach token automatically for requests when available in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;

// // src/api/api.js
// import axios from "axios";


// // const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

// const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";


// const api = axios.create({
//   baseURL: API_BASE,
//   headers: {
//     "Content-Type": "application/json"
//   }
// });

// // attach token automatically for requests when available in localStorage
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("auth_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
