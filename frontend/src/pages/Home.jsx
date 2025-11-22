import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import { VisitantesContext } from "../context/VisitantesContext";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [ticket, setTicket] = useState(null);
  const navigate = useNavigate();
  const { agregarVisitante, visitantes } = useContext(VisitantesContext);

  const handleRegister = (formData) => {
    const fechaHora = new Date().toLocaleString();
    const codigo = Math.floor(100000 + Math.random() * 900000);

    const newTicket = { ...formData, fechaHora, codigo };
    agregarVisitante(newTicket);
    setTicket(newTicket);
    setShowForm(false);
    setShowTicket(true);
    
    // ✅ GENERAR PDF DESPUÉS DE REGISTRAR
    generarPDF(newTicket);
  };

  // ✅ FUNCIÓN PARA GENERAR EL PDF
  const generarPDF = (ticketData) => {
    const doc = new jsPDF();
    
    // Configuración del documento
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("TICKET DE REGISTRO", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${ticketData.nombres} ${ticketData.apellidos}`, 20, 40);
    doc.text(`DNI: ${ticketData.dni}`, 20, 50);
    doc.text(`Departamento: ${ticketData.departamento}`, 20, 60);
    doc.text(`Motivo: ${ticketData.motivo}`, 20, 70);
    doc.text(`Fecha: ${ticketData.fechaHora}`, 20, 80);
    doc.text(`Código: ${ticketData.codigo}`, 20, 90);

    // Generar código de barras con el código
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, ticketData.codigo.toString(), { 
      format: "CODE128", 
      width: 2, 
      height: 40,
      displayValue: true 
    });
    const barcodeImg = canvas.toDataURL("image/png");
    doc.addImage(barcodeImg, "PNG", 55, 100, 100, 30);

    // Añadir línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 95, 190, 95);

    // ✅ ABRIR PDF EN NUEVA PESTAÑA
    setTimeout(() => {
      const pdfDataUrl = doc.output("datauristring");
      const newWindow = window.open();
      
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Ticket de Visitante - ${ticketData.nombres}</title>
              <style>
                body { margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
                h1 { color: #333; text-align: center; }
                iframe { border: none; border-radius: 5px; width: 100%; height: 500px; }
                .download-btn { display: block; margin: 20px auto; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Ticket de Visitante</h1>
                <iframe src="${pdfDataUrl}"></iframe>
                <a href="${pdfDataUrl}" download="ticket-${ticketData.nombres}-${ticketData.codigo}.pdf" class="download-btn">
                  Descargar Ticket
                </a>
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        // Fallback: descargar directamente
        doc.save(`ticket-${ticketData.nombres}-${ticketData.codigo}.pdf`);
      }
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      {/* Botón de inicio en la esquina superior derecha */}
      <button
        className="absolute top-4 right-4 px-4 py-2 bg-green-600 text-white rounded"
        onClick={() => navigate("/login")}
      >
        Iniciar Sesión
      </button>

      <div className="bg-white p-6 rounded shadow text-center space-y-4">
        <h2 className="text-2xl font-semibold">¡Bienvenido al Edificio!</h2>
        {/* Reseña debajo del título */}
        <p className="text-gray-600">
          Este sistema te permitirá registrar visitantes de manera sencilla y 
          generar un ticket con todos los datos necesarios para tu control.
        </p>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setShowForm(true)}
        >
          Registrar Datos
        </button>
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <FormularioRegistro
          onClose={() => setShowForm(false)}
          onRegister={handleRegister}
        />
      )}

      {/* Modal de ticket */}
      {showTicket && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-md text-center">
            <h3 className="text-lg font-semibold mb-2">Registro exitoso ✅</h3>
            <p className="mb-2">Se generó el ticket con tus datos:</p>
            <div className="text-left mb-3">
              <p><b>Nombre:</b> {ticket.nombres} {ticket.apellidos}</p>
              <p><b>DNI:</b> {ticket.dni}</p>
              <p><b>Departamento:</b> {ticket.departamento}</p>
              <p><b>Motivo:</b> {ticket.motivo}</p>
              <p><b>Fecha y Hora:</b> {ticket.fechaHora}</p>
              <p><b>Código de visitante:</b> {ticket.codigo}</p>
            </div>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={() => setShowTicket(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FormularioRegistro({ onClose, onRegister }) {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [dni, setDni] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [motivo, setMotivo] = useState("");

  const submit = (e) => {
    e.preventDefault();

    // Validación manual extra
    if (!nombres || !apellidos || !dni || !departamento || !motivo) {
      alert("Todos los campos son obligatorios");
      return;
    }

    onRegister({ nombres, apellidos, dni, departamento, motivo });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded w-full max-w-md space-y-3"
      >
        <h3 className="text-lg font-semibold">Registrar visita</h3>
        <input
          className="w-full border px-3 py-2"
          placeholder="Nombres"
          value={nombres}
          onChange={(e) => setNombres(e.target.value)}
          required
        />
        <input
          className="w-full border px-3 py-2"
          placeholder="Apellidos"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
          required
        />
        <input
          type="text"
          className="w-full border px-3 py-2"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          required
        />
        <input
          className="w-full border px-3 py-2"
          placeholder="Departamento que visita"
          value={departamento}
          onChange={(e) => setDepartamento(e.target.value)}
          required
        />
        <input
          className="w-full border px-3 py-2"
          placeholder="Motivo de visita"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          required
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            className="px-3 py-1 border"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Registrar
          </button>
        </div>
      </form>
    </div>
  );
}