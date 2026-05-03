const { generateToken } = require("../utils/jwt.utils");
const { hashPassword, comparePassword } = require("../utils/text.utils");
const userService = require("../services/user.service");

exports.postRegister = async (req, res) => {
    const { nombre, email, password } = req.body;
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: "El correo electronico ya está registrado" });
    }
    const encondedPassword = await hashPassword(password);
    const usuario = await userService.createUser(nombre, email, encondedPassword);
    res.status(201).json({
        message: "Usuario registrado exitosamente",
        user: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email
        }
    });
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    const usuario = await userService.findUserByEmail(email);
    if (!usuario) {
        return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }
    const isPasswordValid = await comparePassword(password, usuario.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Usuario o contraseña incorrecta" });
    }
    const token = generateToken({
        id: usuario.id,
    });
    res.status(200).json({
        token,
        user: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email
        }
    });
};

exports.postLogout = async (_req, res) => {
    res.status(200).json({ message: "Logout exitoso" });
};