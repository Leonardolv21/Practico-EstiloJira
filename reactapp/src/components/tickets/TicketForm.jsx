import { Button, Col, Form, Row } from "react-bootstrap";

const TicketForm = ({ ticketForm, hasSelectedProject, savingTicket, onFormChange, onSubmit }) => {
    return (
        <Form onSubmit={onSubmit} className="mb-3">
            <Row className="g-2">
                <Col md={4}>
                    <Form.Control
                        name="titulo"
                        placeholder="Titulo"
                        value={ticketForm.titulo}
                        onChange={onFormChange}
                        required
                        disabled={!hasSelectedProject}
                    />
                </Col>
                <Col md={4}>
                    <Form.Control
                        name="descripcion"
                        placeholder="Descripcion"
                        value={ticketForm.descripcion}
                        onChange={onFormChange}
                        required
                        disabled={!hasSelectedProject}
                    />
                </Col>
                <Col md={2}>
                    <Form.Select
                        name="prioridad"
                        value={ticketForm.prioridad}
                        onChange={onFormChange}
                        disabled={!hasSelectedProject}
                    >
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Form.Select
                        name="estado"
                        value={ticketForm.estado}
                        onChange={onFormChange}
                        disabled={!hasSelectedProject}
                    >
                        <option value={1}>Pendiente</option>
                        <option value={2}>En progreso</option>
                        <option value={3}>Completado</option>
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Form.Control
                        name="usuario_asignado_id"
                        placeholder="ID responsable (opcional)"
                        value={ticketForm.usuario_asignado_id}
                        onChange={onFormChange}
                        disabled={!hasSelectedProject}
                    />
                </Col>
                <Col md={8}>
                    <Button type="submit" disabled={!hasSelectedProject || savingTicket}>
                        {savingTicket ? "Guardando..." : "Crear ticket"}
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default TicketForm;
