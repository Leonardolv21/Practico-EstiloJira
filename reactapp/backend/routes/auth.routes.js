const { isJsonRequestValid } = require('../middlewares/isJsonRequestValid.middleware');
const schemaValidation = require('../middlewares/schemaValidation.middleware');
const requireAuth = require('../middlewares/user.middleware');
const { registerUserSchema, loginUserSchema } = require('../validators/user.schema');

module.exports = app => {
    let router = require('express').Router();
    const controller = require('../controllers/auth.controller');
    router.post('/register', isJsonRequestValid, schemaValidation(registerUserSchema), controller.postRegister)
    router.post('/login', isJsonRequestValid, schemaValidation(loginUserSchema), controller.postLogin);
    router.post('/logout', requireAuth, controller.postLogout);

    app.use('/auth', router);
}
