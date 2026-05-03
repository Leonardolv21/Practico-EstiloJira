import { useMemo, useState } from "react";
import { Button, Card } from "react-bootstrap";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import TrackerPage from "./components/TrackerPage";
import api from "./services/api";
import "./App.css";

const readSavedUser = () => {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

function App() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(readSavedUser);

  const isAuthenticated = useMemo(() => Boolean(user && localStorage.getItem("token")), [user]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Manejar el error de cierre de sesión si es necesario

    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setScreen("login");
  };

  return (
    <main className={`app-shell ${isAuthenticated ? "app-shell-dashboard" : ""}`}>
      {!isAuthenticated ? (
        <section className="auth-wrapper">
          <h2 className="brand-title text-center fw-bold">Mini Issue Tracker</h2>
          {screen === "login" ? (
            <LoginForm onLoginSuccess={setUser} onSwitchToRegister={() => setScreen("register")} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setScreen("login")} />
          )}
        </section>
      ) : (
        <section className="dashboard-wrapper">
          <Card className="session-box shadow-sm mb-3">
            <Card.Body className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h2 className="h5 mb-1">Sesion iniciada</h2>
                <small className="text-muted">
                  {user.nombre} - {user.email}
                </small>
              </div>
              <Button variant="danger" size="sm" onClick={handleLogout}>
                Cerrar sesion
              </Button>
            </Card.Body>
          </Card>
          <TrackerPage />
        </section>
      )}
    </main>
  );
}

export default App;