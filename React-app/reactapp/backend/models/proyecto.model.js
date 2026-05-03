const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Proyecto = sequelize.define(
        "Proyecto",
        {
            nombre: {
                type: DataTypes.STRING,
                allowNull: false
            },
            descripcion: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            fecha_creacion: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            creador_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: "proyectos"
        }
    );

    return Proyecto;
};