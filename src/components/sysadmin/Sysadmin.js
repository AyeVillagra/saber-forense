import React, { useEffect, useState } from "react";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SysAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    address: "",
    addressNumber: "",
    role: "",
    password: "12345678",
  });

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
    { key: "id", name: "ID", width: 50 },
    { key: "name", name: "Nombre", width: 200 },
    { key: "email", name: "Email", width: 250 },
    { key: "address", name: "Domicilio", width: 200 },
    { key: "addressNumber", name: "Número", width: 80 },
    { key: "role", name: "Tipo de usuario", width: 200 },
    {
      key: "action",
      name: "Acción",
      width: 150,
      renderCell: (params) => (
        <button
          style={{
            backgroundColor: "#f7e987",
            color: "black",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
          onClick={() => handleUserAction(params.row.id)}
        >
          Baja
        </button>
      ),
    },
  ];

  const handleUserAction = async (id) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar el usuario con ID ${id}?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/usuarios/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Usuario eliminado con éxito");
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      } else {
        const errorMessage = await response.text();
        toast.error(`Error al eliminar el usuario: ${errorMessage}`);
      }
    } catch (error) {
      toast.error(`Error al eliminar el usuario: ${error.message}`);
    }
  };

  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8080/courses");

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const coursesData = await response.json();
        setCourses(coursesData);
      } catch (error) {
        console.error("Error al obtener los cursos:", error);
      }
    };

    fetchCourses();
  }, []);

  const columnsCourses = [
    { key: "id", name: "ID", width: 100 },
    { key: "name", name: "Nombre del Curso", width: 250 },
    { key: "description", name: "Descripción", width: 300 },
    {
      key: "action",
      name: "Acción",
      width: 150,
      renderCell: (params) => (
        <button
          style={{
            backgroundColor: "#f7e987",
            color: "black",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
          onClick={() => handleAction(params.row.id)}
        >
          Baja
        </button>
      ),
    },
  ];

  const handleAction = async (id) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar el curso con ID ${id}?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/courses/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Curso eliminado con éxito");
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== id)
        );
      } else {
        const errorMessage = await response.text();
        toast.error(`Error al eliminar el curso: ${errorMessage}`);
      }
    } catch (error) {
      toast.error(`Error al eliminar el curso: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      lastName: "",
      email: "",
      address: "",
      addressNumber: "",
      role: "",
    });
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/usuarios/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const newUser = await response.json();
      if (response.ok) {
        toast.success("Usuario agregado con éxito");
        setUsers((prevUsers) => [...prevUsers, newUser]);
      } else {
        const errorMessage = await response.text();
        toast.error(`Error al crear el usuario: ${errorMessage}`);
      }
    } catch (error) {
      toast.error(`Error al crear el usuario: ${error.message}`);
    }
    handleCloseModal();
  };

  return (
    <div className="page-container">
      <div className="background">
        <Navbar />
        <div className="header">
          <h1>Dashboard Sysadmin</h1>
          <div className="header-buttons">
            <button onClick={handleAddUser} className="button">
              Agregar Usuario
            </button>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
        <h2>Usuarios</h2>
        <DataGrid columns={columns} rows={users} />
        <h2>Cursos</h2>
        <DataGrid columns={columnsCourses} rows={courses} />
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Agregar Nuevo Usuario</h2>
              <form onSubmit={handleSaveUser}>
                <label>
                  Nombre:
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Apellido:
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Domicilio:
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Número:
                  <input
                    type="text"
                    name="addressNumber"
                    value={formData.addressNumber}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Tipo de usuario:
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SYSADMIN">Sysadmin</option>
                    <option value="STUDENT">Estudiante</option>
                  </select>
                </label>
                <div className="modal-actions">
                  <button type="submit" className="button">
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="button logout-button"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default SysAdminDashboard;
