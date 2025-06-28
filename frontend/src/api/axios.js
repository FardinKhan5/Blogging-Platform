import axios from "axios"

const baseUrl = import.meta.env.VITE_API_URL
const api = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    withCredentials:true,
    headers: {
        "Content-Type": "application/json"
    }
})

export default api