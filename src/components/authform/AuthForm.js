import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(true);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [addressNumber, setAddressNumber] = useState("");

  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      const userData = {
        email,
        password,
        name,
        lastName,
        address,
        addressNumber,
      };

      const endpoint = isRegistering ? "/usuarios/registro" : "/usuarios/login";

      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          `Error al ${
            isRegistering ? "registrar" : "iniciar sesión"
          }. Código de estado: ${response.status}`
        );
      }

      if (isRegistering) {
        navigate("/profile", { state: responseData.data });
      } else {
        navigate("/profile", { state: responseData.data });
      }
    } catch (error) {
      console.error(
        `Error al ${isRegistering ? "registrar" : "iniciar sesión"}:`,
        error.message
      );
    }
  };

  return (
    <div className="auth-form-container">
      <h2>{isRegistering ? "Registrarse" : "Iniciar Sesión"}</h2>
      <input
        className="input"
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {isRegistering && (
        <>
          <input
            className="input"
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            type="text"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            className="input"
            type="text"
            placeholder="Dirección - Calle"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            className="input"
            type="text"
            placeholder="Dirección - Número"
            value={addressNumber}
            onChange={(e) => setAddressNumber(e.target.value)}
          />
        </>
      )}

      <button className="button" onClick={handleAuth}>
        {isRegistering ? "Registrarse" : "Iniciar Sesión"}
      </button>

      <p>
        {isRegistering
          ? "¿Ya tienes una cuenta? Inicia sesión."
          : "¿No tienes una cuenta? Regístrate aquí."}
      </p>

      <button
        className="toggle-button"
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering ? "Iniciar Sesión" : "Registrarse"}
      </button>
    </div>
  );
};

export default AuthForm;
