import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Función para verificar la sesión activa
  const verifySession = async () => {
    try {
      const response = await fetch("http://localhost:8080/verify-session", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error verificando la sesión:", error);
      setUser(null);
    }
  };

  // Función para autenticar al usuario
  const login = async (credentials) => {
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data); // Si el login es exitoso, se guarda el usuario en el estado
      } else {
        throw new Error(data.message || "Error en el login");
      }
    } catch (error) {
      console.error("Error en el login:", error);
    }
  };

  // Verificar la sesión al cargar el componente
  useEffect(() => {
    verifySession();
  }, []);

  return (
    <UserContext.Provider value={{ user, login, verifySession }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
