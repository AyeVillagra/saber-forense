import React, { createContext, useState, useContext } from "react";

// Crear el contexto
const UserContext = createContext();

// Proveedor de Usuario
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Función para autenticar al usuario
  const login = async (credentials) => {
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    setUser(data);
  };

  return (
    <UserContext.Provider value={{ user, login }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto
export const useUser = () => useContext(UserContext);
