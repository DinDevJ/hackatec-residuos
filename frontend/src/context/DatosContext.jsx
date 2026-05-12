import { createContext, useEffect, useState } from "react";
import { getContenedores, getKPIs } from "../api/client";

export const DatosContext = createContext();

export function DatosProvider({ children }) {
  const [contenedores, setContenedores] = useState([]);
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    getContenedores().then(({ data }) => setContenedores(data));
    getKPIs().then(({ data }) => setKpis(data));
  }, []);

  return (
    <DatosContext.Provider value={{ contenedores, kpis }}>
      {children}
    </DatosContext.Provider>
  );
}
