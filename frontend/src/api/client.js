import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// Existing endpoints
export const getContenedores = () => api.get("/contenedores/");
export const getKPIs = () => api.get("/kpis/");
export const preguntar = (texto) => api.post("/asistente/", { texto });

// New Contract Endpoints
export const chatAI = (prompt) => api.post("/ai/chat", { prompt });
export const getZonesGeojson = () => api.get("/map/zones-geojson");
export const getSaturationList = () => api.get("/map/saturation-list");
export const getOptimizedRoutes = () => api.get("/routes/optimized");
export const exportRoutePdf = (routeId) => api.get(`/routes/${routeId}/export-pdf`, { responseType: 'blob' });
export const getDashboardKpis = () => api.get("/dashboard/kpis");
export const getDashboardChart = () => api.get("/dashboard/chart");
export const getDashboardAlerts = () => api.get("/dashboard/alerts");
export const getFleetStatus = () => api.get("/fleet/status");
export const getFleetTelemetry = (unitId) => api.get(`/fleet/${unitId}/telemetry`);
