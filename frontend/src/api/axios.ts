import axios from "axios";

// ✅ Create Axios instance
export const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});


// ✅ Load token from localStorage if present
const storedAuth = localStorage.getItem("payvue_auth");
if (storedAuth) {
    try {
        const { token } = JSON.parse(storedAuth);
        if (token) {
            API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
    } catch (error) {
        console.warn("⚠️ Failed to parse stored token", error);
    }
}

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("Session expired — please log in again");
            // Optionally dispatch logout or clear localStorage here
            localStorage.removeItem("payvue_auth");
            delete API.defaults.headers.common["Authorization"];
        }
        return Promise.reject(error);
    }
);
