import { useContext } from "react";
import { DatosContext } from "../context/DatosContext";

export default function TablaContenedores() {
  const { contenedores } = useContext(DatosContext);

  return (
    <div className="bg-white rounded shadow overflow-auto h-96">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Zona</th>
            <th className="p-2 text-left">Nivel</th>
          </tr>
        </thead>
        <tbody>
          {contenedores.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.id}</td>
              <td className="p-2">{c.zona}</td>
              <td className="p-2">
                <span className={c.nivel_llenado >= 80 ? "text-red-500 font-bold" : ""}>
                  {c.nivel_llenado}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
