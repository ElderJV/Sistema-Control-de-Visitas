import React, { createContext, useState } from 'react';

export const VisitantesContext = createContext();

export const VisitantesProvider = ({ children }) => {
  const [visitantes, setVisitantes] = useState([]);

  const agregarVisitante = (nuevoVisitante) => {
    const visitanteConId = {
      ...nuevoVisitante,
      id: Date.now(),
      fechaEntrada: new Date().toISOString(),
      estado: 'activo'
    };
    
    setVisitantes(prev => [visitanteConId, ...prev]);
  };

  const actualizarVisitante = (id, datosActualizados) => {
    setVisitantes(prev => 
      prev.map(visit => 
        visit.id === id ? { ...visit, ...datosActualizados } : visit
      )
    );
  };

  return (
    <VisitantesContext.Provider value={{
      visitantes,
      agregarVisitante,
      actualizarVisitante
    }}>
      {children}
    </VisitantesContext.Provider>
  );
};