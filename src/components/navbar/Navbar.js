import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setUserData(JSON.parse(localStorage.getItem("userData")));
    };

    // Escucha cambios en localStorage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Determina la URL del perfil según el rol
  const getProfileLink = () => {
    if (userData) {
      if (userData.role === "ADMIN") {
        return "/admin"; // Si es admin, redirige a /admin
      } else if (userData.role === "SYSADMIN") {
        return "/sysadmin"; // Si es sysadmin, redirige a /sysadmin
      } else {
        return "/profile"; // Si es estudiante, redirige a /profile
      }
    }
    return "/"; // Si no hay usuario, redirige al inicio
  };

  return (
    <nav>
      <ul>
        {userData ? (
          location.pathname === "/profile" ||
          location.pathname === "/admin" ||
          location.pathname === "/sysadmin" ? (
            // Si el usuario está en su perfil, muestra "Inicio"
            <li>
              <Link to="/">Inicio</Link>
            </li>
          ) : (
            // Si el usuario no está en el perfil, muestra el enlace a "Mi Perfil"
            <li>
              <Link to={getProfileLink()} state={userData}>
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
