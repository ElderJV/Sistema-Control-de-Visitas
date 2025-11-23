import React, { useState, useEffect, useContext } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { VisitantesContext } from '../Context/VisitantesContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Dashboard.css';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { visitantes, agregarVisitante } = useContext(VisitantesContext);
  
  const [stats, setStats] = useState({
    todayVisits: 0,
    totalVisitors: 0,
    departmentsVisited: 0,
    activeVisits: 0
  });

  const getDepartmentsChartData = () => {
    const departmentCounts = {};
    
    visitantes.forEach(visit => {
      const depto = visit.departamento;
      departmentCounts[depto] = (departmentCounts[depto] || 0) + 1;
    });

    // Ordenar por cantidad de visitas y tomar los top 5
    const sortedDepartments = Object.entries(departmentCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return {
      labels: sortedDepartments.map(([depto]) => depto),
      datasets: [
        {
          data: sortedDepartments.map(([, count]) => count),
          backgroundColor: [
            '#3498db',
            '#1abc9c',
            '#9b59b6',
            '#e74c3c',
            '#f39c12',
            '#d35400',
            '#c0392b'
          ],
        },
      ],
    };
  };

  const departmentsData = getDepartmentsChartData();

  const visitsData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Número de Visitas',
        data: [12, 19, 15, 17, 24, 10, 5],
        backgroundColor: '#3498db',
        borderColor: '#2980b9',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Calcular estadísticas en tiempo real
  useEffect(() => {
    calculateStats();
  }, [visitantes]);

  const calculateStats = () => {
    const today = new Date().toDateString();
    const todayVisits = visitantes.filter(visit => 
      new Date(visit.fechaEntrada).toDateString() === today
    ).length;

    const uniqueDepartments = [...new Set(visitantes.map(visit => visit.departamento))].length;
    
    const activeVisits = visitantes.filter(visit => visit.estado === 'activo').length;

    setStats({
      todayVisits,
      totalVisitors: visitantes.length,
      departmentsVisited: uniqueDepartments,
      activeVisits
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      activo: { class: 'badge-active', text: 'En curso' },
      completado: { class: 'badge-completed', text: 'Finalizada' },
      programado: { class: 'badge-scheduled', text: 'Programada' }
    };
    
    const config = statusConfig[status] || statusConfig.completado;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const handleLogout = () => {
    // Aquí puedes agregar lógica de logout (limpiar localStorage, etc.)
    navigate('/');
  };

  const handleNewVisit = () => {
    navigate('/visitantes');
  };

  // Obtener visitas recientes (últimas 5)
  const recentVisits = visitantes
    .sort((a, b) => new Date(b.fechaEntrada) - new Date(a.fechaEntrada))
    .slice(0, 5);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="user-info">
          <span className="welcome-text">Bienvenido, admin</span>
          <button className="btn-logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-number">{stats.todayVisits}</div>
          <div className="stat-label">Visitas de Hoy</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-user-friends"></i>
          </div>
          <div className="stat-number">{stats.totalVisitors}</div>
          <div className="stat-label">Total Visitantes</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-building"></i>
          </div>
          <div className="stat-number">{stats.departmentsVisited}</div>
          <div className="stat-label">Departamentos Visitados</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-number">{stats.activeVisits}</div>
          <div className="stat-label">Visitas en Curso</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-row">
        <div className="chart-container">
          <div className="chart-card">
            <div className="chart-header">
              <h5>Visitas por Día (Última Semana)</h5>
            </div>
            <div className="chart-body">
              <Bar data={visitsData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-card">
            <div className="chart-header">
              <h5>Departamentos Más Visitados</h5>
            </div>
            <div className="chart-body">
              <Doughnut data={departmentsData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Visitas Recientes */}
      <div className="recent-visits">
        <div className="visits-card">
          <div className="card-header">
            <h5>Visitas Recientes</h5>
            <button className="btn-primary" onClick={handleNewVisit}>
              <i className="fas fa-plus"></i> Registrar Nueva Visita
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="visits-table">
                <thead>
                  <tr>
                    <th>Visitante</th>
                    <th>Departamento</th>
                    <th>Anfitrión</th>
                    <th>Hora de Entrada</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVisits.length > 0 ? (
                    recentVisits.map(visit => (
                      <tr key={visit.id}>
                        <td>{visit.nombre}</td>
                        <td>{visit.departamento}</td>
                        <td>{visit.anfitrion}</td>
                        <td>{new Date(visit.fechaEntrada).toLocaleTimeString()}</td>
                        <td>{getStatusBadge(visit.estado)}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-action btn-view">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button className="btn-action btn-edit">
                              <i className="fas fa-edit"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-data">
                        No hay visitas registradas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;