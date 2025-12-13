// src/Paginas/Visitantes.js
import Home from "./Home";

export default function Visitantes() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>👥 Gestión de Visitantes</h2>
      <p>
        Aquí puedes registrar nuevas visitas y generar un ticket con código de barras 
        que se puede imprimir o descargar en PDF.
      </p>

      <Home /> {}
    </div>
  );
}