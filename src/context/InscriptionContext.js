import React, { createContext, useState, useContext } from "react";

// Crear el contexto
const InscriptionContext = createContext();

// Proveedor de Inscripción
export const InscriptionProvider = ({ children }) => {
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadInscriptions = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData.id;
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/inscripciones/usuario/${userId}`
      );
      const data = await response.json();

      setInscriptions(data);
    } catch (error) {
      setError("Error al cargar inscripciones");
    } finally {
      setLoading(false);
    }
  };

  return (
    <InscriptionContext.Provider
      value={{ inscriptions, loading, error, loadInscriptions }}
    >
      {children}
    </InscriptionContext.Provider>
  );
};

// Hook para usar el contexto
export const useInscriptions = () => useContext(InscriptionContext);
