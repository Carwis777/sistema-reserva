import "animate.css";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const fetchReservas = async () => {
  const res = await fetch(`${BASE_URL}/reserva/listar`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Error al listar reservas");
  return res.json();
};

export const guardarReserva = async (payload) => {
  const res = await fetch(`${BASE_URL}/reserva/guardar`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  console.log(payload);
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }

  return res.json();
};

/* =========================
   OBTENER MIS RESERVAS (USER)
========================== */
export const fetchMisReservas = async () => {
  const res = await fetch(`${BASE_URL}/reserva/listarReservaUsuario`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }

  return res.json();
};

export const editarReserva = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/reserva/editar/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }

  return res.json();
};

export const cancelarReserva = async (id) => {
  const res = await fetch(`${BASE_URL}/reserva/cambiarEstado/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ estado: "CANCELADA" }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg);
  }

  return res.json();
};
