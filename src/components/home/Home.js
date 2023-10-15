import React from "react";
import Navbar from "../navbar/Navbar";
import "./Home.css";
import Footer from "../footer/Footer";

function Home() {
  return (
    <div>
      <div className="background-top">
        <div className="content">
          <Navbar />
          <h1 className="title">Saber Forense</h1>
        </div>

        <div className="background-end">
          <div className="columns">
            <p>
              Dominá las ciencias forenses y sorprendé al mundo con tus
              conocimientos. Aprendé de los principales expertos del sector y
              descubrí lo que se necesita para llegar a la verdad. A través de
              esta plataforma podrás adquirir conocimientos teóricos, realizar
              diversas actividades prácticas y compartir ideas con otros
              estudiantes.
            </p>
            <p>
              Nuestros cursos forenses están diseñados para enseñarte sobre esta
              ciencia de vanguardia, conocer qué hay detrás de la investigación
              y el análisis criminal. Y el completo plan de estudios te
              capacitará para convertir la prueba más pequeña en un caso sólido.
              Algunos de los temas que podrás aprender son Documentología,
              Balística, Papiloscopía y muchas especialidades más.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
