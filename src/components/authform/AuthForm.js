import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const navigate = useNavigate();

  const validateForm = () => {
    const formErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      formErrors.email = "El email es obligatorio.";
    } else if (!emailRegex.test(email)) {
      formErrors.email = "El email no tiene un formato válido.";
    }

    if (!password) {
      formErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 8) {
      formErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    }

    if (isRegistering) {
      if (!name) formErrors.name = "El nombre es obligatorio.";
      if (!lastName) formErrors.lastName = "El apellido es obligatorio.";
      if (!address) {
        formErrors.address = "La dirección es obligatoria.";
      }
      if (!addressNumber) {
        formErrors.addressNumber = "El número de dirección es obligatorio.";
      } else if (!/^\d+$/.test(addressNumber)) {
        formErrors.addressNumber =
          "El número de dirección debe ser un número válido.";
      }
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Retorna true si no hay errores
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setLoginError("");
    if (isRegistering) {
      setName("");
      setLastName("");
      setAddress("");
      setAddressNumber("");
    }
  };

  const toggleForm = () => {
    setIsRegistering((prev) => !prev);
    resetForm();
  };
  const handleAuth = async () => {
    if (!validateForm()) return;

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
        if (response.status === 409) {
          alert(responseData.message);
        } else if (response.status === 401) {
          setLoginError(
            "Los datos ingresados son incorrectos, por favor verifíquelos."
          );
        } else {
          throw new Error(
            `Error al ${
              isRegistering ? "registrar" : "iniciar sesión"
            }. Código de estado: ${response.status}`
          );
        }
        return;
      }

      setLoginError("");

      if (isRegistering) {
        alert(responseData.message);
      }

      localStorage.setItem("userData", JSON.stringify(responseData.data));
      localStorage.setItem("userRole", responseData.role);

      const userRole = responseData.role;
      console.log("Rol del usuario:", userRole);
      if (userRole === "SYSADMIN") {
        navigate("/sysadmin");
      } else if (userRole === "ADMIN") {
        navigate("/admin");
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
      {errors.email && <p className="error">{errors.email}</p>}

      <div className="password-input-container">
        <input
          className="input"
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span
          className="password-toggle-btn"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <span role="img" aria-label="ocultar contraseña">
              👁️
            </span>
          ) : (
            <span role="img" aria-label="ver contraseña">
              👁️‍🗨️
            </span>
          )}
        </span>
      </div>
      {errors.password && <p className="error">{errors.password}</p>}
      {loginError && <p className="error">{loginError}</p>}
      {isRegistering && (
        <>
          <input
            className="input"
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="error">{errors.name}</p>}
          <input
            className="input"
            type="text"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {errors.lastName && <p className="error">{errors.lastName}</p>}
          <input
            className="input"
            type="text"
            placeholder="Dirección - Calle"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {errors.address && <p className="error">{errors.address}</p>}
          <input
            className="input"
            type="text"
            placeholder="Dirección - Número"
            value={addressNumber}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setAddressNumber(value);
              }
            }}
            onKeyDown={(e) => {
              const isNumberKey = e.key >= "0" && e.key <= "9";
              const isSpecialKey = [
                "Backspace",
                "Tab",
                "Enter",
                "ArrowLeft",
                "ArrowRight",
              ].includes(e.key);
              if (!isNumberKey && !isSpecialKey) {
                e.preventDefault();
              }
            }}
            maxLength={5}
          />
          {errors.addressNumber && (
            <p className="error">{errors.addressNumber}</p>
          )}
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
      <button className="toggle-button" onClick={toggleForm}>
        {isRegistering ? "Iniciar Sesión" : "Registrarse"}
      </button>
    </div>
  );
};

export default AuthForm;
