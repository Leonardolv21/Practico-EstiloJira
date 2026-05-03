const { sequelize } = require('../config/db.config');

const usuario = require('./usuario.model')(sequelize);
const proyecto = require('./proyecto.model')(sequelize);
const proyectoAsignacion = require('./proyectoAsignacion.model')(sequelize);
const ticket = require('./ticket.model')(sequelize);

usuario.hasMany(proyecto, { foreignKey: 'creador_id', as: 'proyectosCreados' });
proyecto.belongsTo(usuario, { foreignKey: 'creador_id', as: 'creador' });

usuario.belongsToMany(proyecto, {
    through: proyectoAsignacion,
    foreignKey: 'usuario_id',
    otherKey: 'proyecto_id',
    as: 'proyectos'
});

proyecto.belongsToMany(usuario, {
    through: proyectoAsignacion,
    foreignKey: 'proyecto_id',
    otherKey: 'usuario_id',
    as: 'miembros'
});

proyecto.hasMany(proyectoAsignacion, { foreignKey: 'proyecto_id', as: 'asignaciones' });
proyectoAsignacion.belongsTo(proyecto, { foreignKey: 'proyecto_id', as: 'proyecto' });
usuario.hasMany(proyectoAsignacion, { foreignKey: 'usuario_id', as: 'membresiasProyecto' });
proyectoAsignacion.belongsTo(usuario, { foreignKey: 'usuario_id', as: 'usuario' });

proyecto.hasMany(ticket, { foreignKey: 'proyecto_id', as: 'tickets' });
ticket.belongsTo(proyecto, { foreignKey: 'proyecto_id', as: 'proyecto' });
usuario.hasMany(ticket, { foreignKey: 'usuario_asignado_id', as: 'ticketsAsignados' });
ticket.belongsTo(usuario, { foreignKey: 'usuario_asignado_id', as: 'responsable' });
usuario.hasMany(ticket, { foreignKey: 'creador_id', as: 'ticketsCreados' });
ticket.belongsTo(usuario, { foreignKey: 'creador_id', as: 'creador' });

module.exports = {
    usuario,
    proyecto,
    proyectoAsignacion,
    ticket,
    sequelize,
    Sequelize: sequelize.Sequelize
}