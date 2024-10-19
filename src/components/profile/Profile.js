import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./Profile.css";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";

const Profile = () => {
  const userData = useLocation().state;

  const handleDeleteAccount = () => {
    // Lógica para eliminar la cuenta
    console.log("Eliminando cuenta...");
  };

  const handleLogout = async () => {
    console.log("Cerrando sesión...");
  };

  return (
    <div className="page-container">
      <div className="background">
        <Navbar />
        <h2 className="title">Perfil de Usuario</h2>
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
        </div>
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
      <Footer />
    </div>
  );
};

export default Profile;
