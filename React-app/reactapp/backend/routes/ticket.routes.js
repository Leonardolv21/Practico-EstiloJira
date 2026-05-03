const { Router } = require("express");
const requireAuth = require("../middlewares/user.middleware");
const requireProjectMember = require("../middlewares/projectMember.middleware");
const schemaValidation = require("../middlewares/schemaValidation.middleware");
const { isJsonRequestValid } = require("../middlewares/isJsonRequestValid.middleware");
const controller = require("../controllers/ticket.controller");
const {
    createTicketSchema,
    updateTicketSchema,
    updateTicketStatusSchema,
    assignTicketSchema
} = require("../validators/ticket.schema");

module.exports = (app) => {
    const router = Router();

    router.get("/projects/:projectId/tickets", requireAuth, requireProjectMember, controller.getProjectTickets);
    router.post("/projects/:projectId/tickets", requireAuth, requireProjectMember, isJsonRequestValid, schemaValidation(createTicketSchema), controller.postTicketCreate);
    router.get("/projects/:projectId/board", requireAuth, requireProjectMember, controller.getProjectBoard);

    router.get("/tickets/:id", requireAuth, controller.getTicketById);
    router.put("/tickets/:id", requireAuth, isJsonRequestValid, schemaValidation(updateTicketSchema), controller.putTicketUpdate);
    router.patch("/tickets/:id/status", requireAuth, isJsonRequestValid, schemaValidation(updateTicketStatusSchema), controller.patchTicketStatus);
    router.patch("/tickets/:id/assign", requireAuth, isJsonRequestValid, schemaValidation(assignTicketSchema), controller.patchTicketAssignee);

    app.use("/", router);
};