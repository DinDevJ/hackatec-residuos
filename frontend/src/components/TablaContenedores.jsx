import { useContext } from "react";
import { DatosContext } from "../context/DatosContext";

export default function TablaContenedores() {
  const { contenedores } = useContext(DatosContext);

  return (
    <div className="bg-white rounded shadow overflow-auto h-96">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Zona</th>
            <th className="p-2 text-left">Tipo</th>
            <th className="p-2 text-left">Nivel Actual</th>
          </tr>
        </thead>
        <tbody>
          {contenedores.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="p-2">{c.id}</td>
              <td className="p-2">{c.zona}</td>
              <td className="p-2">{c.tipo_zona}</td>
              <td className="p-2 font-bold" style={{ color: c.nivel_actual > 80 ? 'red' : 'inherit' }}>
                {c.nivel_actual}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
