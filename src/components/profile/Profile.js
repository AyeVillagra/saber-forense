import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./Profile.css";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";

const Profile = () => {
  const userData = useLocation().state;
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
      console.log(data);
      setInscriptions(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData && userData.id) {
      fetchInscriptions(userData.id);
    }
  }, [userData]);

  const handleDeleteAccount = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar tu cuenta?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/usuarios/${userData.id}`,
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

  const handleLogout = async () => {
    console.log("Cerrando sesión...");
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  return (
    <div className="page-container">
      <div className="background">
        <Navbar />
        <div className="header-container">
          <h3 className="title">Perfil de Usuario</h3>
          <div className="button-container">
            <Link to="/editar-datos">
              <button className="edit-button">Editar Perfil</button>
            </Link>
            <button onClick={handleDeleteAccount} className="delete-button">
              Eliminar Cuenta
            </button>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
        <div>
          <strong>Email:</strong> {userData.email}
        </div>
        <div>
          <strong>Nombre:</strong> {userData.name}
        </div>
        <div>
          <strong>Apellido:</strong> {userData.lastName}
        </div>
        <div>
          <strong>Dirección:</strong> {userData.address}{" "}
          {userData.addressNumber}
        </div>
        <div>
          <strong>Mis Cursos:</strong>
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
