import React, { useEffect, useState } from "react";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";

const SysAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para errores

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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    { key: "id", name: "ID" },
    { key: "name", name: "Nombre" },
    { key: "email", name: "Email" },
  ];

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  if (error) {
    return <div>Error al cargar usuarios: {error}</div>;
  }

  return (
    <div>
      <h1>Dashboard del Sysadmin</h1>
      <h2>Usuarios</h2>
      <DataGrid columns={columns} rows={users} />
      <h2>Cursos</h2>
    </div>
  );
};

export default SysAdminDashboard;
