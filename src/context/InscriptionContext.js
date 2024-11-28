import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./UserContext";

const InscriptionContext = createContext();

export const InscriptionProvider = ({ children }) => {
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();

  const loadInscriptions = async () => {
    console.log("Usuario actualizado en el inscription context:", user);
    //const userData = JSON.parse(localStorage.getItem("userData"));
    if (!user) {
      setError("No hay usuario logueado");
      return;
    }
    //const userId = userData.id;
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/inscripciones/usuario/${user.id}`
      );
      const data = await response.json();

      setInscriptions(data);
    } catch (error) {
      setError("Error al cargar inscripciones");
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = (inscriptionId) => {
    setInscriptions((prevInscriptions) =>
      prevInscriptions.map((inscription) =>
        inscription.id === inscriptionId
          ? { ...inscription, active: false }
          : inscription
      )
    );
  };

  useEffect(() => {
    if (user) {
      loadInscriptions(); // Llama a loadInscriptions solo si hay un usuario
    }
  }, [user]);

  return (
    <InscriptionContext.Provider
      value={{ inscriptions, loading, error, loadInscriptions, unsubscribe }}
    >
      {children}
    </InscriptionContext.Provider>
  );
};

export const useInscriptions = () => useContext(InscriptionContext);
