import Swal from "sweetalert2";
import "animate.css";

import { jwtDecode } from "jwt-decode";

export function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const decoded = jwtDecode(token);

  // Ej: ["ROLE_ADMIN"]
  return decoded.roles?.[0] || null;
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";


export async function login(correo, password) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password }),
    });

    let data = {};
    try {
      data = await response.json(); // intentamos parsear JSON
    } catch {
      // si no es JSON, dejamos data vacío
    }

    if (!response.ok) {
      // si hay error, usamos el mensaje del backend o fallback
      const msg = data.mensaje || `Error ${response.status}: ${response.statusText}`;
      throw new Error(msg);
    }

    return data; // retorna { token }

  } catch (error) {
    // Mostramos alerta de error correctamente
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message, // aquí sí usamos error.message
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" },
    });

    throw error; // para que Login.jsx sepa que hubo error
  }
}

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}