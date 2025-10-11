import axios from "axios";

export const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});




