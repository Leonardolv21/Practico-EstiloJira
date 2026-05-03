const projectService = require("../services/project.service");

exports.postProjectCreate = async (req, res) => {
    const proyecto = await projectService.createProject(req.body, req.user.id);
    res.status(201).json(proyecto);
};

exports.getProjects = async (req, res) => {
    const proyectos = await projectService.getUserProjects(req.user.id);
    res.status(200).json(proyectos);
};

exports.getProjectById = async (req, res) => {
    const proyecto = await projectService.getProjectByIdForUser(req.params.id, req.user.id);
    if (!proyecto) {
        return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.status(200).json(proyecto);
};

exports.putProjectUpdate = async (req, res) => {
    const proyecto = await projectService.updateProject(req.params.id, req.user.id, req.body);
    if (!proyecto) {
        return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.status(200).json(proyecto);
};

exports.postProjectMember = async (req, res) => {
    const result = await projectService.addMember(req.params.id, req.user.id, req.body);
    if (result.error === "PROJECT_NOT_FOUND") {
        return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    if (result.error === "USER_NOT_FOUND") {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(result.created ? 201 : 200).json({
        message: result.created ? "Usuario agregado al proyecto" : "El usuario ya pertenece al proyecto",
        project: result.project
    });
};