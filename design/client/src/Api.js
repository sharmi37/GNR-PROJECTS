import axios from "axios";

const API = axios.create({
  baseURL: "https://gnr-projects-production.up.railway.app",
});

export default API;
