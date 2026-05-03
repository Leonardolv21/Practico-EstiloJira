const Joi = require("joi");

const createProjectSchema = Joi.object({
    nombre: Joi.string().min(3).max(100).required(),
    descripcion: Joi.string().min(3).required()
});

const updateProjectSchema = Joi.object({
    nombre: Joi.string().min(3).max(100).required(),
    descripcion: Joi.string().min(3).required()
});

const addProjectMemberSchema = Joi.object({
    usuario_id: Joi.number().integer().positive(),
    email: Joi.string().email()
}).or("usuario_id", "email");

module.exports = {
    createProjectSchema,
    updateProjectSchema,
    addProjectMemberSchema
};