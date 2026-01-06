import Swal from "sweetalert2";
import "animate.css";
import { getToken } from "./auth";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

console.log("Token:", getToken());

export async function fetchUsuarios() {
  try {
    const response = await fetch(`${BASE_URL}/usuario/listar`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    let data = {};
    try {
      data = await response.json();
    } catch {}

    if (!response.ok) {
      const msg =
        data.mensaje || `Error ${response.status}: ${response.statusText}`;
      throw new Error(msg);
    }

    // ✅ Si la lista está vacía, backend devuelve ErrorDTO
    // Entonces podemos normalizarlo
    if (Array.isArray(data)) return data;
    if (data.mensaje) return []; // lista vacía

    return data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" },
    });
    throw error;
  }
}

export async function editUsuario(id, payload) {
  try {
    const response = await fetch(`${BASE_URL}/usuario/editar/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let data = {};
    try {
      data = await response.json();
    } catch {}

    if (!response.ok) {
      const msg =
        data.mensaje || `Error ${response.status}: ${response.statusText}`;
      throw new Error(msg);
    }

    Swal.fire({
      icon: "success",
      title: "Actualizado",
      text: data.nombre
        ? `Usuario ${data.nombre} actualizado correctamente`
        : "Usuario actualizado",
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" },
    });

    return true;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" },
    });
    return false;
  }
}

export async function toggleEstadoUsuario(id, nuevoEstado) {
  try {
    const response = await fetch(`${BASE_URL}/usuario/cambiarEstado/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    });

    let data = {};
    try {
      data = await response.json();
    } catch {}

    if (!response.ok) {
      const msg =
        data.mensaje || `Error ${response.status}: ${response.statusText}`;
      throw new Error(msg);
    }

    Swal.fire({
      icon: "success",
      title: "Estado cambiado",
      text: `Usuario ${data.nombre} ahora está ${data.estado}`,
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" },
    });

    return true;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" },
    });
    return false;
  }
}

export async function registrarUsuario(usuario) {
  try {
    const response = await fetch(`${BASE_URL}/usuario/guardar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });

    let data = {};
    try {
      data = await response.json(); // intenta parsear JSON
    } catch {
      // si falla, dejamos data vacío, no rompe el código
    }

    if (!response.ok) {
      throw new Error(data.mensaje || "Error al registrar usuario");
    }

    return data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Registro fallido",
      text: error.message,
    });
    throw error;
  }
}
