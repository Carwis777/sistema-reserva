import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "animate.css";
import "../css/Usuarios.css";

import { guardarReserva, fetchMisReservas } from "../services/reserva";
import { fetchCampos } from "../services/campo";

export default function ReservaUsuario() {
  const [reservas, setReservas] = useState([]);
  const [campos, setCampos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [newReserva, setNewReserva] = useState({
    fecha: "",
    horaInicio: "",
    horaFin: "",
    duracion: 0,
    precioHora: 0,
    total: 0,
    idCampo: "",
  });

  useEffect(() => {
    loadReservas();
    loadCampos();
  }, []);

  const loadReservas = async () => {
    setLoading(true);
    try {
      const data = await fetchMisReservas(); // 🔥 SOLO LAS DEL USUARIO
      setReservas(data);
    } catch {
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCampos = async () => {
    try {
      const data = await fetchCampos();
      setCampos(data);
    } catch {
      setCampos([]);
    }
  };

  /* =========================
     CAMBIO DE CAMPO
  ========================== */
  const handleCampoChange = (e) => {
    const idCampo = Number(e.target.value);
    const campo = campos.find((c) => c.idCampo === idCampo);
    if (!campo) return;

    setNewReserva((prev) => ({
      ...prev,
      idCampo,
      precioHora: campo.precioHora,
    }));
  };

  /* =========================
     CÁLCULO AUTOMÁTICO
  ========================== */
  useEffect(() => {
    const { horaInicio, horaFin, precioHora } = newReserva;
    if (!horaInicio || !horaFin) return;

    const inicio = parseInt(horaInicio.split(":")[0]);
    const fin = parseInt(horaFin.split(":")[0]);
    const duracion = fin - inicio;

    if (duracion <= 0 || duracion > 2) return;

    setNewReserva((prev) => ({
      ...prev,
      duracion,
      total: duracion * precioHora,
    }));
  }, [newReserva.horaInicio, newReserva.horaFin, newReserva.precioHora]);

  /* =========================
     GUARDAR RESERVA
  ========================== */
  const handleGuardar = async () => {
    const { fecha, horaInicio, horaFin, duracion, total, idCampo } = newReserva;

    if (
      !fecha ||
      !horaInicio ||
      !horaFin ||
      duracion <= 0 ||
      total <= 0 ||
      !idCampo
    ) {
      Swal.fire("Error", "Datos incompletos", "error");
      return;
    }

    try {
      const creada = await guardarReserva({
        fecha,
        horaInicio,
        horaFin,
        duracion,
        total,
        idCampo,
      });

      setReservas((prev) => [...prev, creada]);
      Swal.fire("Éxito", "Reserva registrada", "success");

      setNewReserva({
        fecha: "",
        horaInicio: "",
        horaFin: "",
        duracion: 0,
        precioHora: 0,
        total: 0,
        idCampo: "",
      });

      setShowRegisterModal(false);
    } catch (e) {
      Swal.fire("Error", e.message, "error");
    }
  };

  return (
    <div className="usuarios-container">
      <h2>Mis Reservas</h2>

      <button onClick={() => setShowRegisterModal(true)}>
        ➕ Nueva Reserva
      </button>

      {loading ? (
        <p>Cargando reservas...</p>
      ) : (
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Horario</th>
              <th>Duración</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Campo</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td colSpan={6}>No tienes reservas</td>
              </tr>
            ) : (
              reservas.map((r) => (
                <tr key={r.idReserva}>
                  <td>{r.fecha}</td>
                  <td>
                    {r.horaInicio} - {r.horaFin}
                  </td>
                  <td>{r.duracion} h</td>
                  <td>S/. {r.total}</td>
                  <td>{r.estado}</td>
                  <td>{r.campo?.nombre}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* MODAL */}
      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Nueva Reserva</h3>

            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={newReserva.fecha}
              onChange={(e) =>
                setNewReserva({ ...newReserva, fecha: e.target.value })
              }
            />

            <input
              type="time"
              min="08:00"
              max="22:00"
              step="3600"
              value={newReserva.horaInicio}
              onChange={(e) =>
                setNewReserva({ ...newReserva, horaInicio: e.target.value })
              }
            />

            <input
              type="time"
              min="08:00"
              max="22:00"
              step="3600"
              value={newReserva.horaFin}
              onChange={(e) =>
                setNewReserva({ ...newReserva, horaFin: e.target.value })
              }
            />

            <select value={newReserva.idCampo} onChange={handleCampoChange}>
              <option value="">Seleccione campo</option>
              {campos.map((c) => (
                <option key={c.idCampo} value={c.idCampo}>
                  {c.nombre}
                </option>
              ))}
            </select>

            <input type="number" value={newReserva.precioHora} disabled />
            <input type="number" value={newReserva.duracion} disabled />
            <input type="number" value={newReserva.total} disabled />

            <div className="modal-actions">
              <button onClick={() => setShowRegisterModal(false)}>❌</button>
              <button onClick={handleGuardar}>💾 Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
