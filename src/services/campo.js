import Swal from "sweetalert2";
import "animate.css";
import { getToken } from "./auth";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

console.log("Token:", getToken());

// Listar todos los campos
export async function fetchCampos() {
  try {
    const response = await fetch(`${BASE_URL}/campo/listar`, {
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

// Editar un campo por ID
export async function editCampo(id, payload) {
  try {
    const response = await fetch(`${BASE_URL}/campo/editar/${id}`, {
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
        ? `Campo ${data.nombre} actualizado correctamente`
        : "Campo actualizado",
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

// Cambiar estado de un campo
export async function toggleEstadoCampo(id, nuevoEstado) {
  try {
    const response = await fetch(`${BASE_URL}/campo/cambiarEstado/${id}`, {
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
      text: `Campo ${data.nombre} ahora está ${data.estado}`,
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

// Guardar un nuevo campo
export async function guardarCampo(payload) {
  try {
    const response = await fetch(`${BASE_URL}/campo/guardar`, {
      method: "POST",
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
      let msg = "Error";

      if (typeof data === "object") {
        // Tomamos el primer error de validación
        msg = Object.values(data)[0];
      }

      throw new Error(msg);
    }

    Swal.fire({
      icon: "success",
      title: "Registrado",
      text: data.nombre
        ? `Campo ${data.nombre} registrado correctamente`
        : "Campo registrado",
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" },
    });

    return data; // Retornamos el campo creado para agregarlo a la tabla
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
