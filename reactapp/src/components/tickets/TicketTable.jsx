import { Badge, Button, Card, Form, Spinner, Table } from "react-bootstrap";

const statusLabel = {
    1: "Pendiente",
    2: "En progreso",
    3: "Completado",
};

const priorityVariant = {
    baja: "secondary",
    media: "warning",
    alta: "danger",
};

const TicketTable = ({
    tickets,
    loading,
    ticketDetail,
    assignByTicket,
    onStatusChange,
    onAssignChange,
    onAssignSubmit,
    onViewDetail,
    onCloseDetail,
    onEditTicket,
}) => {
    return (
        <div>
            {loading ? (
                <Spinner animation="border" size="sm" />
            ) : (
                <div className="table-responsive">
                    <Table striped hover size="sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Titulo</th>
                                <th>Prioridad</th>
                                <th>Estado</th>
                                <th>Responsable</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.titulo}</td>
                                    <td>
                                        <Badge bg={priorityVariant[ticket.prioridad] || "secondary"}>
                                            {ticket.prioridad}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Form.Select
                                            size="sm"
                                            value={ticket.estado}
                                            onChange={(event) => onStatusChange(ticket.id, event.target.value)}
                                        >
                                            <option value={1}>Pendiente</option>
                                            <option value={2}>En progreso</option>
                                            <option value={3}>Completado</option>
                                        </Form.Select>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <Form.Control
                                                size="sm"
                                                placeholder={ticket.usuario_asignado_id || "null"}
                                                value={assignByTicket[ticket.id] || ""}
                                                onChange={(event) => onAssignChange(ticket.id, event.target.value)}
                                            />
                                            <Button size="sm" onClick={() => onAssignSubmit(ticket.id)}>
                                                OK
                                            </Button>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-1 flex-wrap">
                                            <Button
                                                size="sm"
                                                variant="outline-info"
                                                onClick={() => onViewDetail(ticket.id)}
                                            >
                                                Ver
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline-warning"
                                                onClick={() => onEditTicket(ticket)}
                                            >
                                                Editar
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {tickets.length === 0 && (
                                <tr>
                                    <td colSpan={6}>No hay tickets para este proyecto.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            )}

            {ticketDetail && (
                <Card className="mt-3">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="m-0">Detalle ticket #{ticketDetail.id}</h6>
                            <Button size="sm" variant="outline-secondary" onClick={onCloseDetail}>
                                Cerrar
                            </Button>
                        </div>
                        <p className="mb-1">
                            <strong>Titulo:</strong> {ticketDetail.titulo}
                        </p>
                        <p className="mb-1">
                            <strong>Descripcion:</strong> {ticketDetail.descripcion}
                        </p>
                        <p className="mb-1">
                            <strong>Estado:</strong> {statusLabel[ticketDetail.estado]}
                        </p>
                        <p className="mb-0">
                            <strong>Responsable:</strong>{" "}
                            {ticketDetail.responsable?.nombre || "Sin asignar"}
                        </p>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default TicketTable;
