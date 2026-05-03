const db = require("../models")
const userService = {
    findUserByEmail: async (email) => {
        return await db.usuario.findOne({
            where: {
                email
            }
        });
    },
    findUserById: async (id) => {
        return await db.usuario.findByPk(id);
    },
    createUser: async (nombre, email, password) => {
        return await db.usuario.create({
            nombre,
            email,
            password: password
        });
    }
}
module.exports = userService;