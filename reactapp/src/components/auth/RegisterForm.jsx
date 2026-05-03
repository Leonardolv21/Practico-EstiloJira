import { useState } from "react";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import api from "../../services/api";

const RegisterForm = ({ onSwitchToLogin }) => {
    const [form, setForm] = useState({ nombre: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await api.post("/auth/register", form);
            setSuccess("Registro exitoso. Ahora puedes iniciar sesion.");
            setForm({ nombre: "", email: "", password: "" });
        } catch (requestError) {
            const message = requestError?.response?.data?.message || "No se pudo registrar el usuario.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-lg border-0 auth-card">
            <Card.Body className="p-4 p-md-5">
                <h1 className="h3 mb-3 fw-bold">Crear cuenta</h1>
                <p className="text-muted mb-4">Registra un usuario para empezar a usar el tracker.</p>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="registerNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            placeholder="Tu nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                            minLength={3}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="registerEmail">
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

                    <Form.Group className="mb-4" controlId="registerPassword">
                        <Form.Label>Contrasena</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Minimo 6 caracteres"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </Form.Group>

                    <Button type="submit" className="w-100" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Registrando...
                            </>
                        ) : (
                            "Registrarme"
                        )}
                    </Button>
                </Form>

                <div className="mt-4 text-center">
                    <span className="text-muted">Ya tienes cuenta? </span>
                    <Button variant="link" onClick={onSwitchToLogin} className="p-0 align-baseline">
                        Ir a login
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default RegisterForm;
