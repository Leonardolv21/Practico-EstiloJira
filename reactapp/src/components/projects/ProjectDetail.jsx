import { Badge, Button, Form } from "react-bootstrap";

const ProjectDetail = ({
    selectedProject,
    memberEmail,
    onMemberEmailChange,
    onSubmitMember,
}) => {
    if (!selectedProject) {
        return <p className="text-muted mb-0">Selecciona un proyecto.</p>;
    }

    return (
        <div>
            <p className="mb-1">
                <strong>Nombre:</strong> {selectedProject.nombre}
            </p>
            <p className="mb-3">
                <strong>Descripcion:</strong> {selectedProject.descripcion}
            </p>

            <h6 className="mb-2">Miembros</h6>
            <div className="mb-3 d-flex gap-2 flex-wrap">
                {(selectedProject.miembros || []).map((member) => (
                    <Badge bg="dark" key={member.id}>
                        {member.nombre} (id: {member.id})
                    </Badge>
                ))}
                {(!selectedProject.miembros || selectedProject.miembros.length === 0) && (
                    <span className="text-muted">Sin miembros.</span>
                )}
            </div>

            <Form className="d-flex gap-2" onSubmit={onSubmitMember}>
                <Form.Control
                    placeholder="Email para agregar miembro"
                    value={memberEmail}
                    onChange={onMemberEmailChange}
                    required
                />
                <Button type="submit">Agregar</Button>
            </Form>
        </div>
    );
};

export default ProjectDetail;
