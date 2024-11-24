import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Profile.css";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";

const Profile = () => {
  const userData = useLocation().state;
  const [userDetails, setUserDetails] = useState(userData); // Datos del usuario
  const [formData, setFormData] = useState({}); // Datos del formulario
  const [isEditing, setIsEditing] = useState(false); // Estado de edición
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatDate = (inscriptionDateArray) => {
    const [year, month, day] = inscriptionDateArray;
    return new Date(year, month - 1, day);
  };

  const fetchInscriptions = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/inscripciones/usuario/${userId}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener inscripciones");
      }
      const data = await response.json();
      setInscriptions(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      fetchInscriptions(storedUserData.id);
    }
    setFormData({
      name: userDetails.name || "",
      lastName: userDetails.lastName || "",
      address: userDetails.address || "",
      addressNumber: userDetails.addressNumber || "",
      email: userDetails.email || "",
    });
  }, [userDetails]);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/usuarios/perfil/${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Hubo un error al actualizar el perfil.");
        return;
      }

      const updatedUser = await response.json();
      alert("Perfil actualizado correctamente.");
      setUserDetails(updatedUser); // Actualiza los datos mostrados
      setIsEditing(false); // Cambia a modo de visualización
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      alert("Hubo un problema al intentar actualizar el perfil.");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar tu cuenta?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/usuarios/${userDetails.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(
            data.message || "Hubo un error al intentar eliminar la cuenta."
          );
          return;
        }
        alert(data.message);
        navigate("/");
      } catch (error) {
        console.error("Error en la eliminación:", error);
        alert("Hubo un problema al intentar eliminar tu cuenta.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    navigate("/"); // Redirigir al inicio
  };

  return (
    <div className="page-container">
      <div className="background">
        <Navbar />
        <div className="header-container">
          <h3 className="title">Perfil de Usuario</h3>
          <div className="button-container">
            <button onClick={handleEditToggle} className="edit-button">
              {isEditing ? "Cancelar Edición" : "Editar Perfil"}
            </button>
            <button onClick={handleDeleteAccount} className="delete-button">
              Eliminar Cuenta
            </button>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
        {isEditing ? (
          <form onSubmit={handleSave} className="edit-form">
            <label>
              Nombre:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </label>
            <label>
              Apellido:
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </label>
            <label>
              Dirección:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </label>
            <label>
              Número:
              <input
                type="text"
                name="addressNumber"
                value={formData.addressNumber}
                onChange={handleChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <button type="submit" className="save-button">
              Guardar Cambios
            </button>
          </form>
        ) : (
          <div>
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
            <p>
              <strong>Nombre:</strong> {userDetails.name}
            </p>
            <p>
              <strong>Apellido:</strong> {userDetails.lastName}
            </p>
            <p>
              <strong>Dirección:</strong> {userDetails.address}{" "}
              {userDetails.addressNumber}
            </p>
          </div>
        )}
        <div>
          <h4>Mis Cursos:</h4>
          {loading ? (
            <p>Cargando inscripciones...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <ul>
              {inscriptions.length > 0 ? (
                inscriptions.map((inscription) => (
                  <li key={inscription.id}>
                    <strong>Curso:</strong> {inscription.courseName} <br />
                    <strong>Fecha de inscripción:</strong>{" "}
                    {formatDate(
                      inscription.inscriptionDate
                    ).toLocaleDateString()}{" "}
                    <br />
                    <strong>Estado:</strong>{" "}
                    {inscription.is_active ? (
                      <span style={{ color: "green" }}>Inscripto</span>
                    ) : (
                      <span style={{ color: "red" }}>Dado de baja</span>
                    )}
                    <br />
                  </li>
                ))
              ) : (
                <p>No tienes inscripciones.</p>
              )}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
