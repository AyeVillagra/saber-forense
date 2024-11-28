import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const verifySession = async () => {
    try {
      const response = await fetch("http://localhost:8080/verify-session", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Datos del usuario:", data);
        setUser(data);
      } else {
        console.log(
          "Error en la verificación. Respuesta no OK:",
          response.status
        );
        setUser(null);
      }
    } catch (error) {
      console.error("Error verificando la sesión:", error);
    }
  };

  const logout = () => {
    setUser(null);
  };

  // Verificar la sesión al cargar el componente
  useEffect(() => {
    verifySession();
    console.log("Usuario actualizado en el contexto:", user);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, login, logout, verifySession }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

// Función para autenticar al usuario
//const login = async (credentials) => {
/*  try {
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
    } */
/* };*/
