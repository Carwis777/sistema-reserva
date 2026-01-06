import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Usuario from "./pages/Usuario";
import Reserva from "./pages/Reserva";
import Campo from "./pages/Campo";
import Login from "./pages/Login";
import ReservaUsuario from "./pages/ReservaUsuario";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Dashboard con rutas hijas */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="usuario" element={<Usuario />} />
          <Route path="reserva" element={<Reserva />} />
          <Route path="reservaUsuario" element={<ReservaUsuario />} />
          <Route path="campo" element={<Campo />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
