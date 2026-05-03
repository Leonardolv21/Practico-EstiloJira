const { Op } = require("sequelize");
const db = require("../models");

const projectService = {
    createProject: async ({ nombre, descripcion }, creadorId) => {
        const proyecto = await db.proyecto.create({
            nombre,
            descripcion,
            creador_id: creadorId
        });

        await db.proyectoAsignacion.findOrCreate({
            where: {
                proyecto_id: proyecto.id,
                usuario_id: creadorId
            }
        });

        return await projectService.getProjectByIdForUser(proyecto.id, creadorId);
    },
    getUserProjects: async (userId) => {
        return await db.proyecto.findAll({
            include: [
                {
                    model: db.usuario,
                    as: "miembros",
                    attributes: [],
                    through: { attributes: [] },
                    where: { id: userId },
                    required: false
                },
                {
                    model: db.usuario,
                    as: "creador",
                    attributes: ["id", "nombre", "email"]
                }
            ],
            where: {
                [Op.or]: [
                    { creador_id: userId },
                    { "$miembros.id$": userId }
                ]
            },
            order: [["fecha_creacion", "DESC"]],
            distinct: true,
            subQuery: false
        });
    },
    getProjectByIdForUser: async (projectId, userId) => {
        return await db.proyecto.findOne({
            include: [
                {
                    model: db.usuario,
                    as: "miembros",
                    attributes: ["id", "nombre", "email"],
                    through: { attributes: [] }
                },
                {
                    model: db.usuario,
                    as: "creador",
                    attributes: ["id", "nombre", "email"]
                }
            ],
            where: {
                id: projectId,
                [Op.or]: [
                    { creador_id: userId },
                    { "$miembros.id$": userId }
                ]
            },
            subQuery: false
        });
    },
    updateProject: async (projectId, userId, { nombre, descripcion }) => {
        const proyecto = await projectService.getProjectByIdForUser(projectId, userId);
        if (!proyecto) {
            return null;
        }

        proyecto.nombre = nombre;
        proyecto.descripcion = descripcion;
        await proyecto.save();

        return await projectService.getProjectByIdForUser(projectId, userId);
    },
    addMember: async (projectId, requesterId, { usuario_id, email }) => {
        const proyecto = await projectService.getProjectByIdForUser(projectId, requesterId);
        if (!proyecto) {
            return { error: "PROJECT_NOT_FOUND" };
        }

        let usuario = null;
        if (usuario_id) {
            usuario = await db.usuario.findByPk(usuario_id);
        }
        if (!usuario && email) {
            usuario = await db.usuario.findOne({ where: { email } });
        }

        if (!usuario) {
            return { error: "USER_NOT_FOUND" };
        }

        const [membership, created] = await db.proyectoAsignacion.findOrCreate({
            where: {
                proyecto_id: projectId,
                usuario_id: usuario.id
            }
        });

        return {
            created,
            membership,
            project: await projectService.getProjectByIdForUser(projectId, requesterId)
        };
    },
    isProjectMember: async (projectId, userId) => {
        const membership = await db.proyectoAsignacion.findOne({
            where: {
                proyecto_id: projectId,
                usuario_id: userId
            }
        });

        if (membership) {
            return true;
        }

        const proyecto = await db.proyecto.findOne({
            where: {
                id: projectId,
                creador_id: userId
            }
        });

        return Boolean(proyecto);
    }
};

module.exports = projectService;