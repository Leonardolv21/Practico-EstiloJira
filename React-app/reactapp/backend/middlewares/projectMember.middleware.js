const projectService = require("../services/project.service");

const requireProjectMember = async (req, res, next) => {
    const projectId = req.params.projectId || req.params.id;
    const isMember = await projectService.isProjectMember(projectId, req.user.id);

    if (!isMember) {
        return res.status(403).json({ message: "No perteneces a este proyecto" });
    }

    next();
};

module.exports = requireProjectMember;