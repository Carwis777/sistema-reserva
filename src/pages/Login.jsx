import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "animate.css";
import "../css/Login.css";

import { login, saveToken, getUserRole } from "../services/auth";
import { registrarUsuario } from "../services/usuario";

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // 🔹 Estados separados para login y registro
  const [loginForm, setLoginForm] = useState({ correo: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    password: "",
  });

  // 🔹 Cambios en login
  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  // 🔹 Cambios en registro
  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    const data = await login(loginForm.correo, loginForm.password);
    saveToken(data.token);

    await Swal.fire({
      title: "Iniciando sesión...",
      timer: 1500,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const role = getUserRole();

    navigate("/dashboard");
  };

  /* ================= REGISTRO ================= */
  const handleRegister = async (e) => {
    e.preventDefault();
    await registrarUsuario(registerForm);

    await Swal.fire({
      icon: "success",
      title: "Usuario registrado",
      text: "Ahora puedes iniciar sesión",
    });

    setIsLogin(true); // vuelve al login
  };

  return (
    <div className="container">
      <div className={`card ${isLogin ? "" : "flip"}`}>
        <div className="card-inner">
          {/* ===== LOGIN ===== */}
          <div className="card-face card-front">
            <div className="switch">
              <button className={isLogin ? "active" : ""}>Login</button>
              <button onClick={() => setIsLogin(false)}>Registro</button>
            </div>

            <form onSubmit={handleLogin}>
              <h2>Iniciar Sesión</h2>

              <input
                name="correo"
                placeholder="Correo"
                value={loginForm.correo}
                onChange={handleLoginChange}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={handleLoginChange}
              />

              <button type="submit">Entrar</button>
            </form>
          </div>

          {/* ===== REGISTRO ===== */}
          <div className="card-face card-back">
            <div className="switch">
              <button onClick={() => setIsLogin(true)}>Login</button>
              <button className={!isLogin ? "active" : ""}>Registro</button>
            </div>

            <form onSubmit={handleRegister}>
              <h2>Registro</h2>

              <input
                name="nombre"
                placeholder="Nombre"
                value={registerForm.nombre}
                onChange={handleRegisterChange}
              />
              <input
                name="correo"
                placeholder="Correo"
                value={registerForm.correo}
                onChange={handleRegisterChange}
              />
              <input
                name="telefono"
                placeholder="Teléfono"
                value={registerForm.telefono}
                onChange={handleRegisterChange}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={registerForm.password}
                onChange={handleRegisterChange}
              />

              <button type="submit">Registrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
