const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Ticket = sequelize.define(
        "Ticket",
        {
            titulo: {
                type: DataTypes.STRING,
                allowNull: false
            },
            descripcion: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            estado: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                validate: {
                    isIn: [[1, 2, 3]]
                }
            },
            prioridad: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [["baja", "media", "alta"]]
                }
            },
            fecha_creacion: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            proyecto_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            usuario_asignado_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            creador_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: "tickets"
        }
    );

    return Ticket;
};