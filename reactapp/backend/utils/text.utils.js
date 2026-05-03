const bcrypt = require('bcryptjs');

module.exports = {
    hashPassword: async (str) => {
        return await bcrypt.hash(str, 10);
    },
    comparePassword: async (plainTextPassword, hashedPassword) => {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    }
}