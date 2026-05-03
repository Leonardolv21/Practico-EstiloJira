const ticketService = require("../services/ticket.service");

const mapTicketError = (error, res) => {
    if (error === "TICKET_NOT_FOUND") {
        return res.status(404).json({ message: "Ticket no encontrado" });
    }
    if (error === "ASSIGNEE_NOT_FOUND") {
        return res.status(404).json({ message: "El responsable indicado no existe" });
    }
    if (error === "ASSIGNEE_NOT_IN_PROJECT") {
        return res.status(400).json({ message: "El responsable debe pertenecer al proyecto" });
    }
    if (error === "INVALID_STATE") {
        return res.status(400).json({ message: "El estado indicado no es valido" });
    }
    if (error === "INVALID_TRANSITION") {
        return res.status(400).json({ message: "Solo puedes mover el ticket a un estado contiguo" });
    }
    if (error === "ASSIGNEE_REQUIRED_FOR_STATE") {
        return res.status(400).json({ message: "El ticket necesita responsable para ese estado" });
    }

    return res.status(400).json({ message: "Operacion no permitida" });
};

exports.postTicketCreate = async (req, res) => {
    const ticket = await ticketService.createTicket(req.params.projectId, req.user.id, req.body);
    if (ticket.error) {
        return mapTicketError(ticket.error, res);
    }

    res.status(201).json(ticket);
};

exports.getProjectTickets = async (req, res) => {
    const tickets = await ticketService.getProjectTickets(req.params.projectId);
    res.status(200).json(tickets);
};

exports.getTicketById = async (req, res) => {
    const ticket = await ticketService.getTicketByIdForUser(req.params.id, req.user.id);
    if (!ticket) {
        return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.status(200).json(ticket);
};

exports.putTicketUpdate = async (req, res) => {
    const ticket = await ticketService.updateTicket(req.params.id, req.user.id, req.body);
    if (ticket.error) {
        return mapTicketError(ticket.error, res);
    }

    res.status(200).json(ticket);
};

exports.patchTicketStatus = async (req, res) => {
    const ticket = await ticketService.updateTicketStatus(req.params.id, req.user.id, req.body.estado);
    if (ticket.error) {
        return mapTicketError(ticket.error, res);
    }

    res.status(200).json(ticket);
};

exports.patchTicketAssignee = async (req, res) => {
    const ticket = await ticketService.assignResponsible(req.params.id, req.user.id, req.body.usuario_asignado_id);
    if (ticket.error) {
        return mapTicketError(ticket.error, res);
    }

    res.status(200).json(ticket);
};

exports.getProjectBoard = async (req, res) => {
    const board = await ticketService.getProjectBoard(req.params.projectId);
    res.status(200).json(board);
};