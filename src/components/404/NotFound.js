import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found">
      <h3>Lo sentimos, la página que estás buscando no existe.</h3>
      <Link to="/">¿Volvemos a la página principal?</Link>
    </div>
  );
};

export default NotFound;
