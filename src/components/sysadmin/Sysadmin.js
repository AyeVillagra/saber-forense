import React, { useEffect, useState } from "react";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";

const SysAdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/usuarios");

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const usersData = await response.json();
        setUsers(usersData);
      } catch (error) {
      } finally {
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    { key: "id", name: "ID", width: 100 },
    { key: "name", name: "Nombre", width: 200 },
    { key: "email", name: "Email", width: 250 },
    { key: "address", name: "Domicilio", width: 300 },
    { key: "addressNumber", name: "Número", width: 300 },
    { key: "role", name: "Tipo de usuario", width: 200 },
  ];

  const handleLogout = async () => {
    console.log("Cerrando sesión...");
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  return (
    <div>
      <div className="header">
        <h1>Dashboard administrador</h1>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>
      <h2>Usuarios</h2>
      <DataGrid columns={columns} rows={users} />
      <h2>Cursos</h2>
    </div>
  );
};

export default SysAdminDashboard;