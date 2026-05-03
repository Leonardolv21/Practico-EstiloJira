const db = require("../models");
const projectService = require("./project.service");

const VALID_STATES = [1, 2, 3];

const buildTicketIncludes = () => ([
    {
        model: db.usuario,
        as: "responsable",
        attributes: ["id", "nombre", "email"]
    },
    {
        model: db.usuario,
        as: "creador",
        attributes: ["id", "nombre", "email"]
    },
    {
        model: db.proyecto,
        as: "proyecto",
        attributes: ["id", "nombre", "descripcion"]
    }
]);

const canTransition = (currentState, nextState) => {
    if (currentState === nextState) {
        return true;
    }

    return Math.abs(currentState - nextState) === 1;
};

const validateAssignee = async (projectId, assigneeId) => {
    if (assigneeId == null) {
        return { valid: true, assignee: null };
    }

    const assignee = await db.usuario.findByPk(assigneeId);
    if (!assignee) {
        return { valid: false, error: "ASSIGNEE_NOT_FOUND" };
    }

    const isMember = await projectService.isProjectMember(projectId, assigneeId);
    if (!isMember) {
        return { valid: false, error: "ASSIGNEE_NOT_IN_PROJECT" };
    }

    return { valid: true, assignee };
};

const validateTicketStateChange = (currentState, nextState, assigneeId) => {
    if (!VALID_STATES.includes(nextState)) {
        return { valid: false, error: "INVALID_STATE" };
    }

    if (!canTransition(currentState, nextState)) {
        return { valid: false, error: "INVALID_TRANSITION" };
    }

    if ((nextState === 2 || nextState === 3) && !assigneeId) {
        return { valid: false, error: "ASSIGNEE_REQUIRED_FOR_STATE" };
    }

    return { valid: true };
};

const ticketService = {
    createTicket: async (projectId, userId, payload) => {
        const assigneeValidation = await validateAssignee(projectId, payload.usuario_asignado_id ?? null);
        if (!assigneeValidation.valid) {
            return { error: assigneeValidation.error };
        }

        const initialState = payload.estado ?? 1;
        if (!VALID_STATES.includes(initialState)) {
            return { error: "INVALID_STATE" };
        }

        if ((initialState === 2 || initialState === 3) && !payload.usuario_asignado_id) {
            return { error: "ASSIGNEE_REQUIRED_FOR_STATE" };
        }

        const ticket = await db.ticket.create({
            titulo: payload.titulo,
            descripcion: payload.descripcion,
            prioridad: payload.prioridad,
            estado: initialState,
            proyecto_id: projectId,
            usuario_asignado_id: payload.usuario_asignado_id ?? null,
            creador_id: userId
        });

        return await ticketService.getTicketByIdForUser(ticket.id, userId);
    },
    getProjectTickets: async (projectId) => {
        return await db.ticket.findAll({
            where: { proyecto_id: projectId },
            include: buildTicketIncludes(),
            order: [["fecha_creacion", "DESC"]]
        });
    },
    getTicketByIdForUser: async (ticketId, userId) => {
        const ticket = await db.ticket.findByPk(ticketId, {
            include: buildTicketIncludes()
        });

        if (!ticket) {
            return null;
        }

        const isMember = await projectService.isProjectMember(ticket.proyecto_id, userId);
        return isMember ? ticket : null;
    },
    updateTicket: async (ticketId, userId, payload) => {
        const ticket = await ticketService.getTicketByIdForUser(ticketId, userId);
        if (!ticket) {
            return { error: "TICKET_NOT_FOUND" };
        }

        const assigneeValidation = await validateAssignee(ticket.proyecto_id, payload.usuario_asignado_id ?? null);
        if (!assigneeValidation.valid) {
            return { error: assigneeValidation.error };
        }

        if ((ticket.estado === 2 || ticket.estado === 3) && !payload.usuario_asignado_id) {
            return { error: "ASSIGNEE_REQUIRED_FOR_STATE" };
        }

        ticket.titulo = payload.titulo;
        ticket.descripcion = payload.descripcion;
        ticket.prioridad = payload.prioridad;
        ticket.usuario_asignado_id = payload.usuario_asignado_id ?? null;
        await ticket.save();

        return await ticketService.getTicketByIdForUser(ticket.id, userId);
    },
    updateTicketStatus: async (ticketId, userId, nextState) => {
        const ticket = await ticketService.getTicketByIdForUser(ticketId, userId);
        if (!ticket) {
            return { error: "TICKET_NOT_FOUND" };
        }

        const validation = validateTicketStateChange(ticket.estado, nextState, ticket.usuario_asignado_id);
        if (!validation.valid) {
            return { error: validation.error };
        }

        ticket.estado = nextState;
        await ticket.save();
        return await ticketService.getTicketByIdForUser(ticket.id, userId);
    },
    assignResponsible: async (ticketId, userId, assigneeId) => {
        const ticket = await ticketService.getTicketByIdForUser(ticketId, userId);
        if (!ticket) {
            return { error: "TICKET_NOT_FOUND" };
        }

        const assigneeValidation = await validateAssignee(ticket.proyecto_id, assigneeId);
        if (!assigneeValidation.valid) {
            return { error: assigneeValidation.error };
        }

        if ((ticket.estado === 2 || ticket.estado === 3) && assigneeId == null) {
            return { error: "ASSIGNEE_REQUIRED_FOR_STATE" };
        }

        ticket.usuario_asignado_id = assigneeId;
        await ticket.save();
        return await ticketService.getTicketByIdForUser(ticket.id, userId);
    },
    getProjectBoard: async (projectId) => {
        const tickets = await ticketService.getProjectTickets(projectId);
        return {
            pendiente: tickets.filter((ticket) => ticket.estado === 1),
            en_progreso: tickets.filter((ticket) => ticket.estado === 2),
            completado: tickets.filter((ticket) => ticket.estado === 3)
        };
    }
};

module.exports = ticketService;