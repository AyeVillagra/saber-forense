import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./Courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleShowAllCourses = () => {
    fetchCourses();
    setSearchTerm("");
  };

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
