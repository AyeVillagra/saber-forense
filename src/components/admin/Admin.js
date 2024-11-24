import React, { useEffect, useState } from "react";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import Navbar from "../navbar/Navbar";
import "./Admin.css";
import Footer from "../footer/Footer";

const Admin = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrls: [],
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8080/courses");

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const coursesData = await response.json();
        setCourses(coursesData);
      } catch (error) {
        console.error("Error al obtener los cursos:", error);
      }
    };

    fetchCourses();
  }, []);
  const columns = [
    { key: "id", name: "ID", width: 100 },
    { key: "name", name: "Nombre del Curso", width: 250 },
    { key: "description", name: "Descripción", width: 300 },
    {
      key: "action",
      name: "Acción",
      width: 150,
      renderCell: (params) => (
        <button
          style={{
            backgroundColor: "#f7e987",
            color: "black",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
          onClick={() => handleAction(params.row.id)}
        >
          Baja
        </button>
      ),
    },
  ];

  const handleLogout = async () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };
  const handleAction = async (id) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar el curso con ID ${id}?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/courses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el curso");
      }

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== id)
      );
      alert("Curso eliminado con éxito");
    } catch (error) {
      alert("No se pudo eliminar el curso. Intenta de nuevo.");
    }
  };

  const handleAddCourse = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", description: "" });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    const courseData = {
      ...formData,
      imageUrls: [],
    };

    try {
      const response = await fetch("http://localhost:8080/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const newCourse = await response.json();
      setCourses((prevCourses) => [...prevCourses, newCourse]);

      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar el curso:", error.message);
      alert("No se pudo guardar el curso: " + error.message);
    }
  };

  return (
    <div className="page-container">
      <div className="background">
        <Navbar />
        <div className="header">
          <h1>ABM Cursos</h1>
          <div className="header-buttons">
            {/* Botón Agregar Curso */}
            <button onClick={handleAddCourse} className="button">
              Agregar Curso
            </button>
            {/* Botón Cerrar Sesión */}
            <button onClick={handleLogout} className="button logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
        <DataGrid columns={columns} rows={courses} />
        {/* Modal para agregar un curso */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Agregar Nuevo Curso</h2>
              <form onSubmit={handleSaveCourse}>
                <label>
                  Nombre:
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nombre del curso"
                    required
                  />
                </label>
                <label>
                  Descripción:
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descripción del curso"
                    rows="4"
                    required
                  ></textarea>
                </label>
                <div className="modal-actions">
                  <button type="submit" className="button">
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="button logout-button"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
