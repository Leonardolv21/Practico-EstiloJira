const { Router } = require("express");
const requireAuth = require("../middlewares/user.middleware");
const schemaValidation = require("../middlewares/schemaValidation.middleware");
const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware");
const controller = require("../controllers/project.controller");
const {
    createProjectSchema,
    updateProjectSchema,
    addProjectMemberSchema
} = require("../validators/project.schema");

module.exports = (app) => {
    const router = Router();

    router.get("/", requireAuth, controller.getProjects);
    router.get("/:id", requireAuth, controller.getProjectById);
    router.post("/", requireAuth, isJsonRequestValid, schemaValidation(createProjectSchema), controller.postProjectCreate);
    router.put("/:id", requireAuth, isJsonRequestValid, schemaValidation(updateProjectSchema), controller.putProjectUpdate);
    router.post("/:id/members", requireAuth, isJsonRequestValid, schemaValidation(addProjectMemberSchema), controller.postProjectMember);

    app.use("/projects", router);
};