import { DatosProvider } from "./context/DatosContext";
import PanelKPIs from "./components/PanelKPIs";
import Mapa from "./components/Mapa";
import TablaContenedores from "./components/TablaContenedores";
import Asistente from "./components/Asistente";

export default function App() {
  return (
    <DatosProvider>
      <div className="min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold mb-4">Gestión de Residuos</h1>
        <PanelKPIs />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Mapa />
          <TablaContenedores />
        </div>
        <Asistente />
      </div>
    </DatosProvider>
  );
}
