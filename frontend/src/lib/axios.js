import axios from "axios";

// Automatically choose backend based on environment
const baseURL =
    import.meta.env.MODE === "development"
        ? "http://localhost:3000/api/v1/" // local backend
        : import.meta.env.VITE_API_URL;   // production backend (Netlify env var)

export const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});
