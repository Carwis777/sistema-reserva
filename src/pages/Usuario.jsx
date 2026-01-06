import { useState, useEffect } from "react";
import { fetchUsuarios, editUsuario, toggleEstadoUsuario } from "../services/usuario";
import Swal from "sweetalert2";
import "animate.css";
import "../css/Usuarios.css";

export default function Usuario() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsuarios();
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const handleToggleEstado = async (user) => {
  const nuevoEstado = user.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
  const success = await toggleEstadoUsuario(user.idUsuario, nuevoEstado);

  if (success) {
    // Actualizamos solo el estado del usuario en el estado local
    setUsers(prev =>
      prev.map(u =>
        u.idUsuario === user.idUsuario ? { ...u, estado: nuevoEstado } : u
      )
    );

    Swal.fire({
      icon: "success",
      title: "Estado actualizado",
      text: `Usuario ${user.nombre} ahora está ${nuevoEstado}`,
      timer: 1500,
      showConfirmButton: false,
    });
  }
};


  const filteredUsers = users
    .filter(u =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.correo.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.idUsuario - b.idUsuario);

  return (
    <div className="usuarios-container">
      <h2>Gestión de Usuarios</h2>

      <div className="usuarios-toolbar">
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5}>No hay usuarios</td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.idUsuario}>
                  <td>{user.idUsuario}</td>
                  <td>{user.nombre}</td>
                  <td>{user.correo}</td>
                  <td>{user.estado}</td>
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => handleEditClick(user)}
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleToggleEstado(user)}
                    >
                      {user.estado === "ACTIVO" ? "🚫" : "✅"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Modal de editar usuario */}
      {showEditModal && editUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Usuario</h3>
            <input
              type="text"
              placeholder="Nombre"
              value={editUser.nombre}
              onChange={(e) =>
                setEditUser({ ...editUser, nombre: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Correo"
              value={editUser.correo}
              onChange={(e) =>
                setEditUser({ ...editUser, correo: e.target.value })
              }
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
                  const payload = {
                    nombre: editUser.nombre,
                    correo: editUser.correo,
                  };
                  const success = await editUsuario(editUser.idUsuario, payload);
                  if (success) {
                    // Actualizamos solo ese usuario en el estado
                    setUsers(prev =>
                      prev.map(u =>
                        u.idUsuario === editUser.idUsuario ? { ...u, ...payload } : u
                      )
                    );
                    Swal.fire({
                      icon: "success",
                      title: "Usuario actualizado",
                      text: `Usuario ${editUser.nombre} actualizado correctamente`,
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
    </div>
  );
}
