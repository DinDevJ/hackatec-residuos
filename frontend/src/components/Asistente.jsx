import { useState } from "react";
import { preguntar } from "../api/client";

export default function Asistente() {
  const [texto, setTexto] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [loading, setLoading] = useState(false);

  const enviar = async () => {
    if (!texto.trim()) return;
    setLoading(true);
    try {
      const { data } = await preguntar(texto);
      setRespuesta(data.respuesta);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 mt-4">
      <h2 className="font-bold mb-2">Asistente IA</h2>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe tu consulta..."
          onKeyDown={(e) => e.key === "Enter" && enviar()}
        />
        <button
          className="bg-blue-600 text-white px-4 rounded"
          onClick={enviar}
          disabled={loading}
        >
          {loading ? "..." : "Enviar"}
        </button>
      </div>
      {respuesta && <p className="mt-2 text-gray-700">{respuesta}</p>}
    </div>
  );
}
