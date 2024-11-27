import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Función para verificar si el usuario está autenticado
    const checkUserAuthentication = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/usuarios/verify-session",
          {
            method: "GET",
            credentials: "include", // Asegura que las cookies de sesión sean enviadas
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserData(data); // Guarda los datos del usuario si está autenticado
        } else {
          setUserData(null); // Si no está autenticado, establece userData en null
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
        setUserData(null); // En caso de error, se considera que no está autenticado
      }
    };

    checkUserAuthentication();
  }, []); // Solo se ejecuta una vez al montar el componente

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
