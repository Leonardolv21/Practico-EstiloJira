module.exports = {
    generateToken: (payload) => {
        const jwt = require('jsonwebtoken');
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        return token;
    },
    verifyToken: (token) => {
        const jwt = require('jsonwebtoken');
        const secretKey = process.env.JWT_SECRET;
        try {
            const decoded = jwt.verify(token, secretKey);
            return decoded;
        } catch (err) {
            return null;
        }
    }
}