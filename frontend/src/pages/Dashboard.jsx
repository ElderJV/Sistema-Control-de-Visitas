import { useContext } from "react"; 
import { useNavigate } from "react-router-dom";
import { VisitantesContext } from "../context/VisitantesContext";

export default function Dashboard() {
  const { visitantes } = useContext(VisitantesContext);
  const navigate = useNavigate();

  const usuario = localStorage.getItem("usuario") || "Invitado";

  const total = visitantes.length;
  const departamentosUnicos = [...new Set(visitantes.map(v => v.departamento))].length;
  const hoy = new Date().toLocaleDateString();
  const visitasHoy = visitantes.filter(v => v.fecha === hoy).length;

  // ✅ Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("usuario"); // Opcional: limpiar localStorage
    navigate("/"); // Redireccionar a Home
  };

  return (
    <div className="max-w-5xl mx-auto p-6 relative"> {}
      
      {/* ✅ Botón de cerrar sesión */}
      <button
        className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        onClick={handleLogout}
      >
        Cerrar Sesión
      </button>

      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      <p className="text-lg mb-6">👋 Bienvenido, <span className="font-bold">{usuario}</span></p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Visitas de Hoy</h3>
          <p className="text-3xl font-bold text-blue-600">{visitasHoy}</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Total Visitantes</h3>
          <p className="text-3xl font-bold text-green-600">{total}</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Departamentos Visitados</h3>
          <p className="text-3xl font-bold text-purple-600">{departamentosUnicos}</p>
        </div>
      </div>
    </div>
  );
}