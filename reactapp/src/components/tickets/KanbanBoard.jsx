import { Card, Col, Row } from "react-bootstrap";

const KanbanBoard = ({ board }) => {
    const columns = [
        { key: "pendiente", label: "Pendiente" },
        { key: "en_progreso", label: "En progreso" },
        { key: "completado", label: "Completado" },
    ];

    return (
        <Row className="g-2">
            {columns.map(({ key, label }) => (
                <Col md={4} key={key}>
                    <Card className="kanban-column">
                        <Card.Body>
                            <h6>{label}</h6>
                            {(board[key] || []).map((ticket) => (
                                <div key={ticket.id} className="kanban-ticket">
                                    #{ticket.id} - {ticket.titulo}
                                </div>
                            ))}
                            {(board[key] || []).length === 0 && (
                                <small className="text-muted">Sin tickets</small>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default KanbanBoard;
