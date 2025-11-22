import { Link } from "react-router-dom";
import { useContext } from "react";
import { VisitantesContext } from "../../context/VisitantesContext";

export default function Navbar() {
  const { usuario, logout } = useContext(VisitantesContext);

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">Control de Visitas</h1>
      <div className="flex gap-6">
        {!usuario ? (
          <Link to="/" className="bg-white text-blue-700 px-3 py-1 rounded shadow hover:bg-gray-100">
            Iniciar Sesión
          </Link>
        ) : (
          <>
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/visitantes" className="hover:underline">Visitantes</Link>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
