import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export const getContenedores = () => api.get("/contenedores/");
export const getKPIs = () => api.get("/kpis/");
export const preguntar = (texto) => api.post("/asistente/", { texto });
