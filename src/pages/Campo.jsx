import { useState, useEffect } from "react";
import {
  fetchCampos,
  guardarCampo,
  editCampo,
  toggleEstadoCampo,
} from "../services/campo";
import Swal from "sweetalert2";
import "animate.css";
import "../css/Usuarios.css"; // puedes renombrar CSS a Campos.css si quieres

export default function Campo() {
  const [campos, setCampos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [editCampoData, setEditCampoData] = useState(null);
  const [newCampo, setNewCampo] = useState({
    nombre: "",
    precioHora: "",
    ubicacion: "",
  });

  useEffect(() => {
    loadCampos();
  }, []);

  const loadCampos = async () => {
    setLoading(true);
    try {
      const data = await fetchCampos();
      setCampos(data);
    } catch {
      setCampos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (campo) => {
    setEditCampoData(campo);
    setShowEditModal(true);
  };

  const handleToggleEstado = async (campo) => {
    const nuevoEstado = campo.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    const success = await toggleEstadoCampo(campo.idCampo, nuevoEstado);

    if (success) {
      setCampos((prev) =>
        prev.map((c) =>
          c.idCampo === campo.idCampo ? { ...c, estado: nuevoEstado } : c
        )
      );
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `Campo ${campo.nombre} ahora está ${nuevoEstado}`,
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const filteredCampos = campos
    .filter((c) => c.nombre.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.idCampo - b.idCampo);

  return (
    <div className="usuarios-container">
      <h2>Gestión de Campos</h2>

      <div className="usuarios-toolbar">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setShowRegisterModal(true)}>
          Registrar Campo
        </button>
      </div>

      {loading ? (
        <p>Cargando campos...</p>
      ) : (
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Ubicacion</th>
              <th>Precio Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCampos.length === 0 ? (
              <tr>
                <td colSpan={5}>No hay campos</td>
              </tr>
            ) : (
              filteredCampos.map((campo) => (
                <tr key={campo.idCampo}>
                  <td>{campo.idCampo}</td>
                  <td>{campo.nombre}</td>
                  <td>{campo.ubicacion}</td>
                  <td>{campo.precioHora}</td>
                  <td>{campo.estado}</td>
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => handleEditClick(campo)}
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleToggleEstado(campo)}
                    >
                      {campo.estado === "ACTIVO" ? "🚫" : "✅"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Modal de editar campo */}
      {showEditModal && editCampoData && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Campo</h3>
            <input
              type="text"
              placeholder="Nombre"
              value={editCampoData.nombre}
              onChange={(e) =>
                setEditCampoData({ ...editCampoData, nombre: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Ubicacion"
              value={editCampoData.ubicacion}
              onChange={(e) =>
                setEditCampoData({
                  ...editCampoData,
                  ubicacion: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Precio por hora"
              value={editCampoData.precioHora}
              onChange={(e) =>
                setEditCampoData({
                  ...editCampoData,
                  precioHora:
                    e.target.value === "" ? "" : Number(e.target.value),
                })
              }
              min="1"
            />

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowEditModal(false)}
              >
                ❌ Cancelar
              </button>
              <button
                className="save-btn"
                onClick={async () => {
                  if (
                    !editCampoData.nombre ||
                    editCampoData.precioHora <= 0 ||
                    !editCampoData.ubicacion
                  ) {
                    Swal.fire({
                      icon: "error",
                      title: "Error",
                      text: "Datos inválidos",
                    });
                    return;
                  }

                  const payload = {
                    nombre: editCampoData.nombre,
                    ubicacion: editCampoData.ubicacion,
                    precioHora: Number(editCampoData.precioHora),
                  };

                  const success = await editCampo(
                    editCampoData.idCampo,
                    payload
                  );

                  if (success) {
                    setCampos((prev) =>
                      prev.map((c) =>
                        c.idCampo === editCampoData.idCampo
                          ? { ...c, ...payload }
                          : c
                      )
                    );

                    Swal.fire({
                      icon: "success",
                      title: "Campo actualizado",
                      text: `Campo ${editCampoData.nombre} actualizado correctamente`,
                      timer: 1500,
                      showConfirmButton: false,
                    });

                    setShowEditModal(false);
                  }
                }}
              >
                💾 Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de registrar campo */}
      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Registrar Campo</h3>
            <input
              type="text"
              placeholder="Nombre"
              value={newCampo.nombre}
              onChange={(e) =>
                setNewCampo({ ...newCampo, nombre: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Precio por hora"
              value={newCampo.precioHora}
              onChange={(e) =>
                setNewCampo({ ...newCampo, precioHora: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Ubicación"
              value={newCampo.ubicacion}
              onChange={(e) =>
                setNewCampo({ ...newCampo, ubicacion: e.target.value })
              }
            />

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowRegisterModal(false)}
              >
                ❌ Cancelar
              </button>
              <button
                className="save-btn"
                onClick={async () => {
                  if (
                    !newCampo.nombre ||
                    !newCampo.ubicacion ||
                    newCampo.precioHora <= 0
                  ) {
                    Swal.fire({
                      icon: "error",
                      title: "Error",
                      text: "Nombre, ubicación y precio por hora son obligatorios",
                    });
                    return;
                  }
                  const payload = {
                    nombre: newCampo.nombre,
                    precioHora: Number(newCampo.precioHora),
                    ubicacion: newCampo.ubicacion,
                  };

                  const campoCreado = await guardarCampo(payload);

                  if (campoCreado) {
                    setCampos((prev) => [...prev, campoCreado]);

                    Swal.fire({
                      icon: "success",
                      title: "Campo registrado",
                      text: `Campo ${newCampo.nombre} registrado correctamente`,
                      timer: 1500,
                      showConfirmButton: false,
                    });

                    setShowRegisterModal(false);
                    setNewCampo({ nombre: "", precioHora: "", ubicacion: "" });
                  }
                }}
              >
                💾 Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
