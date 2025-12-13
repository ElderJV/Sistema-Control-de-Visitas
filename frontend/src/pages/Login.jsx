import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
//Importamos el contexto de autenticación
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(usuario, password);
      console.log(usuario,password)
      navigate("/dashboard");
    } catch (err) {
      setError("Usuario o contraseña incorrectos ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Iniciar Sesión
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Usuario</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mt-1"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Contraseña</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
