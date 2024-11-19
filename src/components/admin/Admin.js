import React, { useEffect, useState } from "react";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import Navbar from "../navbar/Navbar";
import "./Admin.css";
import Footer from "../footer/Footer";

const Admin = () => {
  const [courses, setCourses] = useState([]);
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
  ];

  const handleLogout = async () => {
    console.log("Cerrando sesión...");
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  return (
    <div>
      <Navbar />
      <div className="header">
        <h1>ABM Cursos</h1>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>
      <DataGrid columns={columns} rows={courses} />
      <Footer />
    </div>
  );
};

export default Admin;
