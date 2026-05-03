const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const ProyectoAsignacion = sequelize.define(
        "ProyectoAsignacion",
        {
            proyecto_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                unique: false
            },
            usuario_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                unique: false
            }
        },
        {
            tableName: "proyecto_asignaciones",
            indexes: [
                {
                    unique: true,
                    fields: ["proyecto_id", "usuario_id"]
                }
            ]
        }
    );

    return ProyectoAsignacion;
};