import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./Courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
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
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="page-container">
      <Navbar />
      <div className="content-wrap">
        <div className="courses-container">
          <h1>Cursos</h1>
          <ul>
            {courses.map((course) => (
              <li key={course.id}>
                <h2>{course.name}</h2>
                <p>{course.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Courses;
