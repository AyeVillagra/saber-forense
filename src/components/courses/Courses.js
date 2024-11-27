import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./Courses.css";
import { useInscriptions } from "../../context/InscriptionContext";
import { useUser } from "../../context//UserContext";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const { userData, login } = useUser();

  const navigate = useNavigate();
  const { inscriptions, loadInscriptions } = useInscriptions();

  const searchCourseByName = async (name) => {
    if (name.trim() === "") {
      setError("Por favor, ingrese un nombre de curso");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/courses/name/${name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Curso no encontrado");
      }

      const data = await response.json();
      setCourses([data]);
      setError("");
    } catch (error) {
      console.error("Error fetching course:", error);
      setError("Curso no encontrado");
      setCourses([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const endpoint = "/courses";

      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching courses");
      }

      const data = await response.json();
      setCourses(data);
      setError("");
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("No se pudieron cargar los cursos");
    }
  };

  const handleSubscribe = async (courseId) => {
    if (!userData) {
      alert("Debes iniciar sesión para inscribirte en un curso.");
      return;
    }

    const inscriptionData = {
      user: { id: userData.id },
      course: { id: courseId },
      active: true,
    };

    try {
      const response = await fetch(`http://localhost:8080/inscripciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inscriptionData),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Hubo un error al inscribirse.");
        return;
      }

      alert(data.message || "Te has inscrito correctamente.");
      navigate("/profile", { state: userData });
    } catch (error) {
      console.error("Error al inscribirse:", error);
      alert("Hubo un problema al intentar inscribirte.");
    }
  };

  useEffect(() => {
    fetchCourses(); // Esto se ejecuta al cargar el componente
    if (userData) {
      loadInscriptions(); // Cargar inscripciones solo si hay usuario
    }
  }, [userData]); // Solo depende de userData, no de loadInscriptions

  const handleShowAllCourses = () => {
    fetchCourses();
    setSearchTerm("");
  };

  const isUserSubscribed = (courseId) =>
    inscriptions.some(
      (inscription) =>
        inscription.courseId === courseId && inscription.active === true
    );

  return (
    <div className="page-container">
      <Navbar />
      <div className="content-wrap">
        <div className="courses-container">
          <h1>Cursos</h1>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por nombre de curso"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado del término de búsqueda
            />
            <button onClick={() => searchCourseByName(searchTerm)}>
              Buscar
            </button>
          </div>

          <button onClick={handleShowAllCourses} className="show-all-button">
            Ver todos los cursos
          </button>

          {error && <p className="error-message">{error}</p>}

          <ul>
            {courses.length > 0
              ? courses.map((course) => (
                  <li key={course.id}>
                    <h2>{course.name}</h2>
                    <p>{course.description}</p>
                    {course.imageUrls && course.imageUrls.length > 0 ? (
                      <img
                        src={course.imageUrls[0]}
                        alt={course.name}
                        className="course-image"
                      />
                    ) : (
                      <p>No hay imagen disponible</p>
                    )}
                    {userData && (
                      <button
                        onClick={() => handleSubscribe(course.id)}
                        disabled={isUserSubscribed(course.id)}
                      >
                        {isUserSubscribed(course.id)
                          ? "Ya estás inscrito"
                          : "Inscribirme"}
                      </button>
                    )}
                  </li>
                ))
              : !error && <p>No se encontraron cursos.</p>}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Courses;
