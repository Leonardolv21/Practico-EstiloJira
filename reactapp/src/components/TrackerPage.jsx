/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Row } from "react-bootstrap";
import api from "../services/api";
import ProjectList from "./projects/ProjectList";
import ProjectDetail from "./projects/ProjectDetail";
import TicketForm from "./tickets/TicketForm";
import TicketTable from "./tickets/TicketTable";
import KanbanBoard from "./tickets/KanbanBoard";

const initialProjectForm = { nombre: "", descripcion: "" };
const initialTicketForm = {
    titulo: "",
    descripcion: "",
    prioridad: "media",
    estado: 1,
    usuario_asignado_id: "",
};


const TrackerPage = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [board, setBoard] = useState({ pendiente: [], en_progreso: [], completado: [] });
    const [projectForm, setProjectForm] = useState(initialProjectForm);
    const [ticketForm, setTicketForm] = useState(initialTicketForm);
    const [projectLoading, setProjectLoading] = useState(false);
    const [ticketLoading, setTicketLoading] = useState(false);
    const [savingProject, setSavingProject] = useState(false);
    const [savingTicket, setSavingTicket] = useState(false);
    const [memberEmail, setMemberEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [ticketDetail, setTicketDetail] = useState(null);
    const [assignByTicket, setAssignByTicket] = useState({});

    const hasSelectedProject = useMemo(() => Boolean(selectedProjectId), [selectedProjectId]);

    const getErrorMessage = (requestError) =>
        requestError?.response?.data?.message || "Ocurrio un error al conectar con el servidor.";

    const loadProjects = async () => {
        setProjectLoading(true);
        try {
            const { data } = await api.get("/projects");
            setProjects(data);
            if (!selectedProjectId && data.length > 0) {
                setSelectedProjectId(data[0].id);
            }
        } catch (requestError) {
            setError(getErrorMessage(requestError));
        } finally {
            setProjectLoading(false);
        }
    };

    const loadProjectDetail = async (projectId) => {
        try {
            const { data } = await api.get(`/projects/${projectId}`);
            setSelectedProject(data);
        } catch (requestError) {
            setError(getErrorMessage(requestError));
        }
    };

    const loadTicketsAndBoard = async (projectId) => {
        setTicketLoading(true);
        try {
            const [ticketsResponse, boardResponse] = await Promise.all([
                api.get(`/projects/${projectId}/tickets`),
                api.get(`/projects/${projectId}/board`),
            ]);
            setTickets(ticketsResponse.data);
            setBoard(boardResponse.data);
        } catch (requestError) {
            setError(getErrorMessage(requestError));
        } finally {
            setTicketLoading(false);
        }
    };

    const refreshCurrentProjectData = async (projectId) => {
        if (!projectId) {
            return;
        }

        await Promise.all([loadProjectDetail(projectId), loadTicketsAndBoard(projectId)]);
    };

    useEffect(() => {
        loadProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!selectedProjectId) {
            setSelectedProject(null);
            setTickets([]);
            setBoard({ pendiente: [], en_progreso: [], completado: [] });
            return;
        }

        refreshCurrentProjectData(selectedProjectId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProjectId]);

    const resetAlerts = () => {
        setError("");
        setMessage("");
    };

    const handleProjectFormChange = (event) => {
        const { name, value } = event.target;
        setProjectForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleTicketFormChange = (event) => {
        const { name, value } = event.target;
        setTicketForm((prev) => ({ ...prev, [name]: value }));
    };

    const submitProject = async (event) => {
        event.preventDefault();
        resetAlerts();
        setSavingProject(true);

        try {
            if (editingProjectId) {
                await api.put(`/projects/${editingProjectId}`, projectForm);
                setMessage("Proyecto actualizado.");
            } else {
                await api.post("/projects", projectForm);
                setMessage("Proyecto creado.");
            }

            setProjectForm(initialProjectForm);
            setEditingProjectId(null);
            await loadProjects();
        } catch (requestError) {
            setError(getErrorMessage(requestError));
        } finally {
            setSavingProject(false);
        }
    };

    const startProjectEdit = (project) => {
        setEditingProjectId(project.id);
        setProjectForm({
            nombre: project.nombre || "",
            descripcion: project.descripcion || "",
        });
        resetAlerts();
    };

    const cancelProjectEdit = () => {
        setEditingProjectId(null);
        setProjectForm(initialProjectForm);
    };

    const submitProjectMember = async (event) => {
        event.preventDefault();
        if (!selectedProjectId) {
            return;
        }

        resetAlerts();

        try {
            const { data } = await api.post(`/projects/${selectedProjectId}/members`, { email: memberEmail });
            setMessage(data.message || "Miembro actualizado.");
            setMemberEmail("");
            await loadProjectDetail(selectedProjectId);
        } catch (requestError) {
            setError(getErrorMessage(requestError));
        }
    };

    const submitTicket = async (event) => {
        event.preventDefault();
        if (!selectedProjectId) {
            return;
        }

        resetAlerts();
        setSavingTicket(true);

        try {
            await api.post(`/projects/${selectedProjectId}/tickets`, {
                ...ticketForm,
                estado: Number(ticketForm.estado),
                usuario_asignado_id: ticketForm.usuario_asignado_id
                    ? Number(ticketForm.usuario_asignado_id)
                    : null,
            });
            setMessage("Ticket creado.");
            setTicketForm(initialTicketForm);
            await loadTicketsAndBoard(selectedProjectId);
        } catch (requestError) {
            setError(getErrorMessage(requestError));
        } finally {
            setSavingTicket(false);
        }
    };

    const updateTicketStatus = async (ticketId, estado) => {
        resetAlerts();
        try {
            await api.patch(`/tickets/${ticketId}/status`, { estado: Number(estado) });
            setMessage("Estado actualizado.");
            await loadTicketsAndBoard(selectedProjectId);
        } catch (requestError) {
            setError(getErrorMessage(requestError));
        }
    };

    const updateTicketAssignee = async (ticketId) => {
        resetAlerts();
        const assigneeRaw = assignByTicket[ticketId];

        try {
            await api.patch(`/tickets/${ticketId}/assign`, {
                usuario_asignado_id: assigneeRaw ? Number(assigneeRaw) : null,
            });
            setMessage("Responsable actualizado.");
            await loadTicketsAndBoard(selectedProjectId);
        } catch (requestError) {
            setError(getErrorMessage(requestError));
        }
    };

    const openTicketDetail = async (ticketId) => {
        resetAlerts();
        try {
            const { data } = await api.get(`/tickets/${ticketId}`);
            setTicketDetail(data);
        } catch (requestError) {
            setError(getErrorMessage(requestError));
        }
    };

    const quickEditTicket = async (ticket) => {
        resetAlerts();

        const titulo = window.prompt("Nuevo titulo:", ticket.titulo);
        if (!titulo) {
            return;
        }

        const descripcion = window.prompt("Nueva descripcion:", ticket.descripcion || "");
        if (descripcion == null) {
            return;
        }

        const prioridad = window.prompt("Prioridad (baja/media/alta):", ticket.prioridad);
        if (!prioridad) {
            return;
        }

        const assigneeInput = window.prompt(
            "ID responsable (vacio para null):",
            ticket.usuario_asignado_id || ""
        );

        try {
            await api.put(`/tickets/${ticket.id}`, {
                titulo,
                descripcion,
                prioridad,
                usuario_asignado_id: assigneeInput ? Number(assigneeInput) : null,
            });
            setMessage("Ticket actualizado.");
            await loadTicketsAndBoard(selectedProjectId);
        } catch (requestError) {
            setError(getErrorMessage(requestError));
        }
    };

    return (
        <section className="tracker-wrapper">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h3 className="m-0">Panel de trabajo</h3>
                <Button size="sm" variant="outline-secondary" onClick={loadProjects}>
                    Recargar proyectos
                </Button>
            </div>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="g-3">
                <Col lg={4}>
                    <Card className="h-100 border-0 shadow-sm">
                        <Card.Body>
                            <ProjectList
                                projects={projects}
                                projectForm={projectForm}
                                editingProjectId={editingProjectId}
                                savingProject={savingProject}
                                loading={projectLoading}
                                selectedProjectId={selectedProjectId}
                                onFormChange={handleProjectFormChange}
                                onSubmit={submitProject}
                                onSelect={setSelectedProjectId}
                                onEdit={startProjectEdit}
                                onCancelEdit={cancelProjectEdit}
                            />
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={8}>
                    <Card className="mb-3 border-0 shadow-sm">
                        <Card.Body>
                            <h5 className="mb-3">Detalle del proyecto</h5>
                            <ProjectDetail
                                selectedProject={selectedProject}
                                memberEmail={memberEmail}
                                onMemberEmailChange={(event) => setMemberEmail(event.target.value)}
                                onSubmitMember={submitProjectMember}
                            />
                        </Card.Body>
                    </Card>

                    <Card className="mb-3 border-0 shadow-sm">
                        <Card.Body>
                            <h5 className="mb-3">Tickets</h5>
                            <TicketForm
                                ticketForm={ticketForm}
                                hasSelectedProject={hasSelectedProject}
                                savingTicket={savingTicket}
                                onFormChange={handleTicketFormChange}
                                onSubmit={submitTicket}
                            />
                            <TicketTable
                                tickets={tickets}
                                loading={ticketLoading}
                                ticketDetail={ticketDetail}
                                assignByTicket={assignByTicket}
                                onStatusChange={updateTicketStatus}
                                onAssignChange={(ticketId, value) =>
                                    setAssignByTicket((prev) => ({ ...prev, [ticketId]: value }))
                                }
                                onAssignSubmit={updateTicketAssignee}
                                onViewDetail={openTicketDetail}
                                onCloseDetail={() => setTicketDetail(null)}
                                onEditTicket={quickEditTicket}
                            />
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <h5 className="mb-3">Tablero Kanban</h5>
                            <KanbanBoard board={board} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </section>
    );
};

export default TrackerPage;
