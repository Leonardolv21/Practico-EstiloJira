const Joi = require("joi");

const estadoSchema = Joi.number().integer().valid(1, 2, 3);

const createTicketSchema = Joi.object({
    titulo: Joi.string().min(3).max(150).required(),
    descripcion: Joi.string().min(3).required(),
    prioridad: Joi.string().valid("baja", "media", "alta").required(),
    estado: estadoSchema.optional(),
    usuario_asignado_id: Joi.number().integer().positive().allow(null)
});

const updateTicketSchema = Joi.object({
    titulo: Joi.string().min(3).max(150).required(),
    descripcion: Joi.string().min(3).required(),
    prioridad: Joi.string().valid("baja", "media", "alta").required(),
    usuario_asignado_id: Joi.number().integer().positive().allow(null)
});

const updateTicketStatusSchema = Joi.object({
    estado: estadoSchema.required()
});

const assignTicketSchema = Joi.object({
    usuario_asignado_id: Joi.number().integer().positive().allow(null).required()
});

module.exports = {
    createTicketSchema,
    updateTicketSchema,
    updateTicketStatusSchema,
    assignTicketSchema
};