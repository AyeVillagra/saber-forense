import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const { user } = useUser();

  const getProfileLink = () => {
    if (user) {
      if (user.role === "ADMIN") {
        return "/admin";
      } else if (user.role === "SYSADMIN") {
        return "/sysadmin";
      } else {
        return "/profile";
      }
    }
    return "/";
  };

  return (
    <nav>
      <ul>
        {user ? (
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
              <Link to={getProfileLink()}>Mi Perfil</Link>
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
