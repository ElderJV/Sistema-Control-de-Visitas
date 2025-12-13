import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import { VisitantesContext } from "../context/VisitantesContext";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({
    usuario: '',
    contraseña: ''
  });
  const [loginError, setLoginError] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    piso: '',
    departamento: '',
    anfitrion: '',
    motivo: ''
  });

  // Opciones para los selects
  const pisos = [
    { value: '', label: 'Seleccione un piso' },
    { value: '1', label: 'Piso 1' },
    { value: '2', label: 'Piso 2' },
    { value: '3', label: 'Piso 3' },
    { value: '4', label: 'Piso 4' },
    { value: '5', label: 'Piso 5' }
  ];

  const motivos = [
    { value: '', label: 'Seleccione un motivo' },
    { value: 'cumpleanos', label: 'Celebraciones de cumpleaños o aniversarios' },
    { value: 'cuidado', label: 'Cuidado de niños o mascotas' },
    { value: 'reuniones', label: 'Reuniones familiares' },
    { value: 'cortesia', label: 'Visitas de cortesía o saludo' },
    { value: 'paquetes', label: 'Traer regalos, paquetes o correspondencia' }
  ];

  // Generar departamentos basados en el piso seleccionado
  const getDepartamentos = () => {
    if (!formData.piso) return [];
    
    const departamentos = [];
    const baseNumber = parseInt(formData.piso) * 100;
    
    for (let i = 1; i <= 5; i++) {
      const numeroDepartamento = baseNumber + i;
      departamentos.push({
        value: numeroDepartamento.toString(),
        label: `Departamento ${numeroDepartamento}`
      });
    }
    
    return departamentos;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Si cambia el piso, resetear el departamento
      if (name === 'piso') {
        newData.departamento = '';
      }
      
      return newData;
    });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    setLoginError(false);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // Credenciales hardcodeadas (admin/admin)
    if (loginData.usuario === 'admin' && loginData.contraseña === 'admin') {
      navigate('/dashboard');
    } else {
      setLoginError(true);
    }
  };

  const generatePDF = (visitante) => {
    // Crear contenido del PDF
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .ticket { border: 2px solid #333; padding: 20px; max-width: 400px; }
          .header { text-align: center; background: #2c3e50; color: white; padding: 10px; margin-bottom: 20px; }
          .info { margin: 10px 0; }
          .label { font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .qr-code { text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <h2>TICKET DE VISITA</h2>
            <p>Control de Acceso - Edificio Residencial</p>
          </div>
          
          <div class="info">
            <span class="label">Visitante:</span> ${visitante.nombre}
          </div>
          
          <div class="info">
            <span class="label">Destino:</span> ${visitante.departamento}
          </div>
          
          <div class="info">
            <span class="label">Anfitrión:</span> ${visitante.anfitrion}
          </div>
          
          <div class="info">
            <span class="label">Motivo:</span> ${visitante.motivo}
          </div>
          
          <div class="info">
            <span class="label">Fecha y Hora:</span> ${new Date().toLocaleString()}
          </div>
          
          <div class="qr-code">
            <div style="border: 1px dashed #ccc; padding: 10px; display: inline-block;">
              [CÓDIGO QR]
            </div>
          </div>
          
          <div class="footer">
            <p>Este ticket debe ser presentado al salir del edificio</p>
            <p>Válido por 24 horas</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Crear ventana para imprimir
    const printWindow = window.open('', '_blank');
    printWindow.document.write(pdfContent);
    printWindow.document.close();
    
    // Esperar a que cargue el contenido y luego imprimir
    setTimeout(() => {
      printWindow.print();
      // No cerramos la ventana automáticamente para que el usuario pueda ver el ticket
    }, 250);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.piso || !formData.departamento || !formData.anfitrion || !formData.motivo) {
      alert('Por favor, complete todos los campos');
      return;
    }

    // Encontrar el label del motivo seleccionado
    const motivoLabel = motivos.find(m => m.value === formData.motivo)?.label || formData.motivo;
    const departamentoLabel = getDepartamentos().find(d => d.value === formData.departamento)?.label || formData.departamento;

    const nuevoVisitante = {
      nombre: formData.nombre,
      departamento: departamentoLabel,
      anfitrion: formData.anfitrion,
      motivo: motivoLabel,
      piso: formData.piso
    };

    // Agregar a la base de datos
    agregarVisitante(nuevoVisitante);
    
    // Generar PDF
    generatePDF(nuevoVisitante);
    
    // Resetear formulario pero NO redirigir al dashboard
    setFormData({
      nombre: '',
      piso: '',
      departamento: '',
      anfitrion: '',
      motivo: ''
    });
    
    setShowForm(false);
    alert('Visitante registrado exitosamente! Se ha generado el ticket.');
  };

  const departamentos = getDepartamentos();

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>¡Bienvenido al Edificio!</h1>
        <p>Este sistema te permitirá registrar visitantes de manera sencilla y generar un ticket con todos los datos necesarios para tu control.</p>
      </div>

      {!showForm && !showLogin ? (
        <div className="home-actions">
          <button 
            className="btn-register" 
            onClick={() => setShowForm(true)}
          >
            Registrar Datos
          </button>
          <button 
            className="btn-login" 
            onClick={() => setShowLogin(true)}
          >
            Iniciar Sesión
          </button>
        </div>
      ) : showLogin ? (
        <div className="login-form">
          <h2>Iniciar Sesión</h2>
          {loginError && (
            <div className="error-message">
              Usuario o contraseña incorrectos
            </div>
          )}
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="usuario">Usuario</label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                value={loginData.usuario}
                onChange={handleLoginChange}
                placeholder="Ingrese su usuario"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contraseña">Contraseña</label>
              <input
                type="password"
                id="contraseña"
                name="contraseña"
                value={loginData.contraseña}
                onChange={handleLoginChange}
                placeholder="Ingrese su contraseña"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                Ingresar
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setShowLogin(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
          <div className="login-help">
            <p><strong>Credenciales de prueba:</strong></p>
            <p>Usuario: admin</p>
            <p>Contraseña: admin</p>
          </div>
        </div>
      ) : (
        <div className="registration-form">
          <h2>Registrar Nueva Visita</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Visitante *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre completo"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="piso">Piso *</label>
              <select
                id="piso"
                name="piso"
                value={formData.piso}
                onChange={handleInputChange}
                required
              >
                {pisos.map(piso => (
                  <option key={piso.value} value={piso.value}>
                    {piso.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="departamento">Departamento *</label>
              <select
                id="departamento"
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
                disabled={!formData.piso}
                required
              >
                <option value="">Seleccione un departamento</option>
                {departamentos.map(depto => (
                  <option key={depto.value} value={depto.value}>
                    {depto.label}
                  </option>
                ))}
              </select>
              {!formData.piso && (
                <small className="form-help">Primero seleccione un piso</small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="anfitrion">Nombre del Anfitrión *</label>
              <input
                type="text"
                id="anfitrion"
                name="anfitrion"
                value={formData.anfitrion}
                onChange={handleInputChange}
                placeholder="Persona que recibe al visitante"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="motivo">Motivo de la Visita *</label>
              <select
                id="motivo"
                name="motivo"
                value={formData.motivo}
                onChange={handleInputChange}
                required
              >
                {motivos.map(motivo => (
                  <option key={motivo.value} value={motivo.value}>
                    {motivo.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                Registrar Visita y Generar Ticket
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;