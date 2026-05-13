
### 🤖 1. Global / Sidebar (Chatbot IA)

**Endpoint:** `POST /api/ai/chat`

**Dónde se usa:** Componente del Chatbot (Sidebar izquierdo).

**Qué hace:** Recibe el mensaje del usuario, consulta a Gemini (o devuelve una respuesta predefinida) y avisa si se requiere una "acción" visual en la pantalla.

Request de Katia:
Prompt: {"prompt": "Prioriza el Mercado Independencia por tráfico" }

Response:
{
      "reply": "Analizando datos históricos de tráfico... Re-enrutando flotilla activa para priorizar el Mercado.",
      "action_trigger": "refresh_routes" // Katia lee esto y recarga la tabla de rutas
    }
    ```

---

### 🗺️ 2. Vista: Smart Map (Zonas y Polígonos)
*La vista para impresionar con el mapa de calor por colonias.*

*   **Endpoint:** `GET /api/map/zones-geojson`
*   **Dónde se usa:** Capa principal del mapa en `Mapa.jsx`.
*   **Qué hace:** Devuelve los polígonos de las colonias y sus datos inyectados para colorearlos y mostrar los popups.
*   **Response de Brandon (Formato GeoJSON):**
    
```json
    {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": { "type": "Polygon", "coordinates": [[[...]]] },
          "properties": {
            "name": "Centro Histórico",
            "saturation_pct": 85,
            "generated_tons": 120,
            "critical_bins": 14,
            "fill_color": "#E57373" // Rojo por alto riesgo
          }
        }
      ]
    }
    ```

*   **Endpoint:** `GET /api/map/saturation-list`
*   **Dónde se usa:** Tarjeta flotante "Live Zone Saturation" encima del mapa.
*   **Qué hace:** Lista rápida para la barra lateral del mapa.
*   **Response de Brandon:** Array con `[{ "zone": "Centro", "sat_pct": 85, "alert": "HIGH RISK - TIANGUIS" }]`

---

### 🧠 3. Vista: AI Routing (La magia de las Rutas y el PDF)
*Aquí ocurre el truco que me mencionaste. La IA "generó" esto.*

*   **Endpoint:** `GET /api/routes/optimized`
*   **Dónde se usa:** Panel central de la vista "AI Routing" (Tarjetas Route Alpha, Route Beta).
*   **Qué hace:** Devuelve las rutas que supuestamente la IA acaba de optimizar basándose en la plática del chat.
*   **Response de Brandon:**
    ```json
    [
      {
        "route_id": "alpha-402",
        "name": "Route Alpha",
        "zone": "Zone Norte",
        "truck": "402",
        "status": "In Progress",
        "est_time": "4h 15m",
        "efficiency_saved": "12L Diesel",
        "containers_current": 45,
        "containers_max": 50
      }
    ]
    ```

*   **Endpoint:** `GET /api/routes/{route_id}/export-pdf`
*   **Dónde se usa:** Botón "Export PDF Route Sheet" en las tarjetas de rutas optimizadas.
*   **Qué hace:** Genera y descarga el PDF de la ruta (que el backend arma con librerías como `reportlab` o `pdfkit`, o incluso devuelve un PDF estático pre-armado para el hackaton).
*   **Response de Brandon:** Un archivo binario (Header `Content-Type: application/pdf`).

---

### 📊 4. Vista: Dashboard (Resumen General)
*La pantalla de inicio (Good morning, Logistics Team).*

*   **Endpoint:** `GET /api/dashboard/kpis`
*   **Dónde se usa:** Las 4 tarjetas de la parte superior.
*   **Response de Brandon:**
    
```json
    {
      "daily_tonnage": { "current": 450, "max": 800 },
      "diesel_saved_pct": 20,
      "active_fleet": { "active": 12, "total": 14 },
      "blind_spots": 180
    }
    ```

*   **Endpoint:** `GET /api/dashboard/chart`
*   **Dónde se usa:** Gráfica central "Collection Volume vs Predictive AI".
*   **Response de Brandon:** Arreglo con `[{ "time": "06:00", "real_vol": 100, "ai_prediction": 110 }]`.

*   **Endpoint:** `GET /api/dashboard/alerts`
*   **Dónde se usa:** Panel derecho "Eco-Brain Alerts".
*   **Response de Brandon:** Arreglo con `[{ "type": "traffic", "title": "Traffic buildup...", "desc": "Rerouting Truck 04" }]`.

---

### 🚛 5. Vista: Fleet Manager (Gestión de Vehículos)
*Supervisión de los camiones en tiempo real.*

*   **Endpoint:** `GET /api/fleet/status`
*   **Dónde se usa:** Lista central "Live Unit Status".
*   **Response de Brandon:**
    ```json
    [
      {
        "unit_id": "TRK-01",
        "driver_name": "Carlos R.",
        "status": "In Transit",
        "load_pct": 85,
        "route": "MX-Centro"
      }
    ]
    ```

*   **Endpoint:** `GET /api/fleet/{unit_id}/telemetry`
*   **Dónde se usa:** Panel derecho de información detallada del camión al hacerle clic.
*   **Response de Brandon:**
    
```json
    {
      "driver_rating": 4.9,
      "fuel_efficiency": "2.1 km/L",
      "current_speed": "78 km/h",
      "engine_temp": "92°C",
      "eta": "14:30 CST"
    }
    ```