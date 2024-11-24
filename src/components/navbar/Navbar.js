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
