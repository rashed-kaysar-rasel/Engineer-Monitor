import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateProjectForm from './partials/create-project-form';
import EditProjectModal from './partials/edit-project-modal';

interface User {
    id: number;
    name: string;
}

interface Project {
    id: number;
    title: string;
    description: string;
    status: string;
    project_lead_id?: number;
    lead?: { id: number; name: string };
    creator?: { id: number; name: string };
}

interface PaginatedData<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
    };
}

interface ProjectsIndexProps {
    projects: PaginatedData<Project>;
    users: User[];
}

export default function ProjectsIndex({ projects, users }: ProjectsIndexProps) {
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this project?')) {
return;
}
        
        setDeletingId(id);
        router.delete(`/projects/${id}`, {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        });
    };

    return (
        <>
            <Head title="Projects" />

            <div className="flex flex-col gap-6 p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Projects List</CardTitle>
                        <Button onClick={() => setIsCreateModalOpen(true)}>Create Project</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {projects.data.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No projects found.</p>
                            ) : (
                                <div className="rounded-md border">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Lead</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {projects.data.map((project) => (
                                                <tr key={project.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                    <td className="p-4 align-middle">
                                                        <div className="font-medium">{project.title}</div>
                                                        {project.description && (
                                                            <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                                {project.description}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                                                            {project.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        {project.lead?.name || 'Unassigned'}
                                                    </td>
                                                    <td className="p-4 align-middle text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEdit(project)}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                disabled={deletingId === project.id}
                                                                onClick={() => handleDelete(project.id)}
                                                            >
                                                                {deletingId === project.id ? 'Deleting...' : 'Delete'}
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <CreateProjectForm
                users={users}
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />

            <EditProjectModal
                project={editingProject}
                users={users}
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
            />
        </>
    );
}

ProjectsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Projects',
            href: '/projects',
        },
    ],
};
