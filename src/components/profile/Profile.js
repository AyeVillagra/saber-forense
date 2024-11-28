import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import { useUser } from "../../context//UserContext";
import { useInscriptions } from "../../context//InscriptionContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  //const [inscriptions, setInscriptions] = useState([]);
  // const [loading, setLoading] = useState(true);
  //const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const {
    inscriptions = [],
    loading,
    error,
    loadInscriptions,
    unsubscribe,
  } = useInscriptions();

  const formatDate = (inscriptionDateArray) => {
    const [year, month, day] = inscriptionDateArray;
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    if (user && inscriptions.length === 0) {
      loadInscriptions();
    }
  }, [user]);

  const handleDeleteAccount = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar tu cuenta?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/usuarios/${user.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          toast.error(
            data.message || "Hubo un error al intentar eliminar la cuenta."
          );
          return;
        }

        toast.success("Cuenta eliminada con éxito.");
        logout();
        navigate("/");
      } catch (error) {
        toast.error("Hubo un problema al intentar eliminar tu cuenta.");
      }
    }
  };

  const handleLogout = () => {
    logout(); // logout del contexto
    navigate("/");
  };

  const handleUnsubscribe = async (inscriptionId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/inscripciones/${inscriptionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.ok) {
        if (response.status === 204) {
          toast.success("Inscripción dada de baja con éxito.");
        }
      } else {
        toast.error("No pudimos procesar la baja del curso.");
      }

      unsubscribe(inscriptionId);
    } catch (error) {
      console.error("Error al dar de baja:", error);
      toast.error("Hubo un problema al intentar dar de baja la inscripción.");
    }
  };

  return (
    <div className="page-container">
      <div className="background">
        <Navbar />
        <div className="header-container">
          <h3 className="title">Perfil de Usuario</h3>
          <div className="button-container">
            <button onClick={handleDeleteAccount} className="delete-button">
              Eliminar Cuenta
            </button>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
        <div>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Nombre:</strong> {user.name}
          </p>
          <p>
            <strong>Apellido:</strong> {user.lastName}
          </p>
          <p>
            <strong>Dirección:</strong> {user.address} {user.addressNumber}
          </p>
        </div>

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
                    {inscription.active ? (
                      <span style={{ color: "green" }}>Inscripto</span>
                    ) : (
                      <span style={{ color: "red" }}>Dado de baja</span>
                    )}
                    {inscription.active && (
                      <button
                        onClick={() => handleUnsubscribe(inscription.id)}
                        className="unsubscribe-button"
                      >
                        Dar de baja
                      </button>
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
      <ToastContainer />
    </div>
  );
};

export default Profile;
