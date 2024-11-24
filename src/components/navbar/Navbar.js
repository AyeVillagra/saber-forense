import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("userData")); // Verifica si el usuario está autenticado

  return (
    <nav>
      <ul>
        {userData ? (
          location.pathname === "/profile" ? (
            // Si el usuario está en el perfil, muestra "Inicio"
            <li>
              <Link to="/">Inicio</Link>
            </li>
          ) : (
            // Si el usuario no está en el perfil, muestra "Mi Perfil"
            <li>
              <Link to="/profile" state={userData}>
                Mi Perfil
              </Link>
            </li>
          )
        ) : (
          // Si el usuario no está autenticado, muestra siempre "Inicio"
          <li>
            <Link to="/">Inicio</Link>
          </li>
        )}
        <li>
          <Link to="/courses">Cursos</Link>
        </li>
        <li>
          <Link to="/about">Acerca de</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
