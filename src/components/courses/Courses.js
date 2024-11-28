import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./Courses.css";
import { useInscriptions } from "../../context/InscriptionContext";
import { useUser } from "../../context//UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const { user } = useUser();

  const navigate = useNavigate();
  const { inscriptions, loadInscriptions } = useInscriptions();

  const searchCourseByName = async (name) => {
    if (name.trim() === "") {
      alert("Por favor, ingrese el nombre de un curso"); // No funciona el set error, el mensaje dura poco tiempo, no se alcanza a ver
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
    const inscriptionData = {
      user: { id: user.id },
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
        toast.error(
          data.message ||
            "No pudimos procesar tu inscripción. Por favor, intenta nuevamente."
        );
        return;
      }

      toast.success("¡Te has inscripto con éxito!");
      navigate("/profile", { state: user });
    } catch (error) {
      console.error("Error al inscribirse:", error);
      toast.error(
        "Ocurrió un problema al inscribirte. Por favor, intenta más tarde."
      );
    }
  };

  useEffect(() => {
    fetchCourses();
    console.log(user);
    if (user) {
      loadInscriptions();
    }
  }, [user]);

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
              onChange={(e) => setSearchTerm(e.target.value)}
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
                    {user && user.role === "student" && (
                      <button
                        onClick={() => handleSubscribe(course.id)}
                        disabled={isUserSubscribed(course.id)}
                      >
                        {isUserSubscribed(course.id)
                          ? "Inscripto"
                          : "Inscribirme"}
                      </button>
                    )}
                  </li>
                ))
              : !error && <p>No se encontraron cursos.</p>}
          </ul>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
}

export default Courses;
