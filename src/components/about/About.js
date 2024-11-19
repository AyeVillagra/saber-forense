import React from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./About.css";

const About = () => {
  return (
    <div className="page-container">
      <Navbar />
      <div className="content-wrap">
        <div className="about-container">
          <h1>Acerca de Saber Forense</h1>
          <p>
            Saber Forense es una institución educativa dedicada a la formación
            en el área de la investigación criminal. Nuestros cursos están
            diseñados para proporcionar a los estudiantes las habilidades
            necesarias para enfrentar los desafíos en el campo de la
            criminología y la justicia penal.
          </p>
          <p>
            Ofrecemos una variedad de programas de capacitación que cubren temas
            como la recolección de evidencia, la criminología, la psicología
            criminal y el análisis forense. Nuestro objetivo es preparar a los
            estudiantes para que sean profesionales competentes y éticos en el
            ámbito de la investigación criminal.
          </p>
          <p>
            Únete a nosotros en Saber Forense y da el primer paso hacia una
            carrera emocionante en la investigación criminal.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
