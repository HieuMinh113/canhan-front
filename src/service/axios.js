import axios from "axios";

// Tạo instance axios
const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
    const csrfToken = getCookie("XSRF-TOKEN");
  if (csrfToken) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
  }
  return config;
});
function getCookie(name) {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return cookieValue ? cookieValue.split("=")[1] : null;
}
export default apiClient;
