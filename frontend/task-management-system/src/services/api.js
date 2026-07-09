import axios from "axios";

const API = axios.create({
    baseURL: "https://task-management-system-1-givy.onrender.com/api"
});

export default API;