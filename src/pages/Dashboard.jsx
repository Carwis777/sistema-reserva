import { Link, Outlet, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "animate.css";
import "../css/Dashboard.css";
import { getUserRole } from "../services/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const role = getUserRole();

  const isAdmin = role === "ROLE_ADMIN";
  const isUser = role === "ROLE_USER";

  const handleLogout = () => {
    Swal.fire({
      title: "Cerrando sesión",
      text: "Hasta luego 👋",
      timer: 2000,
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
      willClose: () => {
        localStorage.removeItem("token");
        navigate("/");
      },
    });
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">Mi Sistema</h2>

        <nav>
          <ul>
            {isAdmin && (
              <>
                <li>
                  <Link to="usuario">Usuario</Link>
                </li>
                <li>
                  <Link to="campo">Campo</Link>
                </li>
                <li>
                  <Link to="reserva">Reserva</Link>
                </li>
              </>
            )}

            {isUser && (
              <li>
                <Link to="reservaUsuario">Reserva Usuario</Link>
              </li>
            )}
          </ul>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>

      <main className="main-content">
        <h1>Bienvenido</h1>
        <p>
          {isAdmin && "Panel de administración"}
          {isUser && "Panel de usuario"}
        </p>
        <Outlet />
      </main>
    </div>
  );
}
