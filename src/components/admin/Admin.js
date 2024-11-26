import React, { useEffect, useState } from "react";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import Navbar from "../navbar/Navbar";
import "./Admin.css";
import Footer from "../footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Admin = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrls: [],
  });
  const [isEditing, setIsEditing] = useState(false);

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
    { key: "description", name: "Descripción", width: 600 },
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
    {
      key: "action",
      name: "Edición",
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
          onClick={() => handleEdition(params.row)}
        >
          Editar
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
      if (response.ok) {
        toast.success("Curso eliminado con éxito");
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== id)
        );
      } else {
        const errorMessage = await response.text();
        toast.error(`Error al eliminar el curso: ${errorMessage}`);
      }
    } catch (error) {
      toast.error(`Error al eliminar el curso: ${error.message}`);
    }
  };

  const handleAddCourse = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setFormData({ name: "", description: "", imageUrls: [] });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", description: "", imageUrls: [] });
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
      const response = isEditing
        ? await fetch(`http://localhost:8080/courses/${formData.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(courseData),
          })
        : await fetch("http://localhost:8080/courses", {
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

      const savedCourse = await response.json();
      toast.success(
        isEditing ? "¡Curso editado con éxito!" : "¡Curso agregado con éxito!"
      );

      setCourses((prevCourses) =>
        isEditing
          ? prevCourses.map((course) =>
              course.id === savedCourse.id ? savedCourse : course
            )
          : [...prevCourses, savedCourse]
      );

      handleCloseModal();
    } catch (error) {
      toast.error(
        `Error al ${isEditing ? "editar" : "agregar"} el curso: ${
          error.message
        }`
      );
    }
  };

  const handleEdition = (course) => {
    setFormData({
      id: course.id,
      name: course.name,
      description: course.description,
    });
    setIsModalOpen(true);
    setIsEditing(true);
  };

  return (
    <div className="page-container">
      <div className="background">
        <Navbar />
        <div className="header">
          <h1>ABM Cursos</h1>
          <div className="header-buttons">
            <button onClick={handleAddCourse} className="button">
              Agregar Curso
            </button>
            <button onClick={handleLogout} className="button logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
        <DataGrid columns={columns} rows={courses} />

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>{isEditing ? "Editar Curso" : "Agregar Nuevo Curso"}</h2>
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
      <ToastContainer />
    </div>
  );
};

export default Admin;
