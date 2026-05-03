import { useState } from "react";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import api from "../../services/api";

const LoginForm = ({ onLoginSuccess, onSwitchToRegister }) => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data } = await api.post("/auth/login", form);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            onLoginSuccess(data.user);
        } catch (requestError) {
            const message = requestError?.response?.data?.message || "No se pudo iniciar sesion.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-lg border-0 auth-card">
            <Card.Body className="p-4 p-md-5">
                <h1 className="h3 mb-3 fw-bold">Iniciar sesion</h1>
                <p className="text-muted mb-4">Ingresa con tu cuenta para ver tus proyectos y tickets.</p>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="loginEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="correo@ejemplo.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="loginPassword">
                        <Form.Label>Contrasena</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="******"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Button type="submit" className="w-100" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Entrando...
                            </>
                        ) : (
                            "Entrar"
                        )}
                    </Button>
                </Form>

                <div className="mt-4 text-center">
                    <span className="text-muted">No tienes cuenta? </span>
                    <Button variant="link" onClick={onSwitchToRegister} className="p-0 align-baseline">
                        Registrate aqui
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default LoginForm;
