import { useContext } from "react";
import { DatosContext } from "../context/DatosContext";

export default function PanelKPIs() {
  const { kpis } = useContext(DatosContext);
  if (!kpis) return <p>Cargando KPIs...</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm text-gray-500">Total</p>
        <p className="text-2xl font-bold">{kpis.total_contenedores}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm text-gray-500">Promedio llenado</p>
        <p className="text-2xl font-bold">{kpis.promedio_llenado}%</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <p className="text-sm text-gray-500">Críticos (&ge;80%)</p>
        <p className="text-2xl font-bold text-red-500">{kpis.criticos}</p>
      </div>
    </div>
  );
}
