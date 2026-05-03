import { Button, Form, ListGroup, Spinner } from "react-bootstrap";

const ProjectList = ({
    projects,
    projectForm,
    editingProjectId,
    savingProject,
    loading,
    selectedProjectId,
    onFormChange,
    onSubmit,
    onSelect,
    onEdit,
    onCancelEdit,
}) => {
    return (
        <div>
            <h5 className="mb-3">Proyectos</h5>

            <Form onSubmit={onSubmit} className="mb-3">
                <Form.Group className="mb-2">
                    <Form.Control
                        name="nombre"
                        placeholder="Nombre del proyecto"
                        value={projectForm.nombre}
                        onChange={onFormChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Control
                        as="textarea"
                        rows={2}
                        name="descripcion"
                        placeholder="Descripcion"
                        value={projectForm.descripcion}
                        onChange={onFormChange}
                        required
                    />
                </Form.Group>
                <div className="d-flex gap-2">
                    <Button type="submit" disabled={savingProject}>
                        {savingProject ? "Guardando..." : editingProjectId ? "Actualizar" : "Crear"}
                    </Button>
                    {editingProjectId && (
                        <Button type="button" variant="secondary" onClick={onCancelEdit}>
                            Cancelar
                        </Button>
                    )}
                </div>
            </Form>

            {loading ? (
                <Spinner animation="border" size="sm" />
            ) : (
                <ListGroup>
                    {projects.map((project) => (
                        <ListGroup.Item key={project.id} active={project.id === selectedProjectId}>
                            <div className="d-flex justify-content-between align-items-start gap-2">
                                <div>
                                    <div className="fw-semibold">{project.nombre}</div>
                                    <small>{project.descripcion}</small>
                                </div>
                                <div className="d-flex flex-column gap-1">
                                    <Button
                                        size="sm"
                                        variant={project.id === selectedProjectId ? "light" : "primary"}
                                        onClick={() => onSelect(project.id)}
                                    >
                                        Ver
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline-warning"
                                        onClick={() => onEdit(project)}
                                    >
                                        Editar
                                    </Button>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                    {projects.length === 0 && (
                        <ListGroup.Item>No tienes proyectos aun.</ListGroup.Item>
                    )}
                </ListGroup>
            )}
        </div>
    );
};

export default ProjectList;
