import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateBugModal from './partials/create-bug-modal';
import EditBugModal from './partials/edit-bug-modal';

interface User {
    id: number;
    name: string;
}

interface Project {
    id: number;
    title: string;
}

interface Bug {
    id: number;
    project_id: number;
    impact: 'high' | 'medium' | 'low';
    status: 'pending' | 'resolved';
    description: string;
    developer_id: number | null;
    reported_at: string;
    resolved_at: string | null;
    project?: Project;
    developer?: User;
}

interface PaginatedData<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
    };
    links: any;
}

interface BugsIndexProps {
    bugs: PaginatedData<Bug>;
    projects: Project[];
    developers: User[];
    filters: any;
}

export default function BugsIndex({ bugs, projects, developers, filters }: BugsIndexProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingBug, setEditingBug] = useState<Bug | null>(null);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this bug record?')) {
            router.delete(`/bugs/${id}`);
        }
    };

    const getImpactBadge = (impact: string) => {
        switch (impact) {
            case 'high': return <Badge variant="destructive">High</Badge>;
            case 'medium': return <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">Medium</Badge>;
            case 'low': return <Badge variant="secondary">Low</Badge>;
            default: return <Badge variant="outline">{impact}</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        return status === 'resolved' 
            ? <Badge className="bg-green-500 hover:bg-green-600 text-white">Resolved</Badge>
            : <Badge variant="outline">Pending</Badge>;
    };

    return (
        <>
            <Head title="Bug Tracking" />

            <div className="flex flex-col gap-6 p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Bug Tracking</CardTitle>
                        <Button onClick={() => setIsCreateModalOpen(true)}>Record Bug</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {bugs.data.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No bugs recorded yet.</p>
                            ) : (
                                <div className="rounded-md border overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Project</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Impact</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Reported At</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bugs.data.map((bug) => (
                                                <tr key={bug.id} className="border-b transition-colors hover:bg-muted/50">
                                                    <td className="p-4 align-middle">
                                                        <div className="max-w-[300px] truncate font-medium" title={bug.description}>
                                                            {bug.description}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-middle">{bug.project?.title || 'N/A'}</td>
                                                    <td className="p-4 align-middle">{getImpactBadge(bug.impact)}</td>
                                                    <td className="p-4 align-middle">{getStatusBadge(bug.status)}</td>
                                                    <td className="p-4 align-middle text-muted-foreground">
                                                        {new Date(bug.reported_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4 align-middle text-right space-x-2">
                                                        <Button variant="outline" size="sm" onClick={() => setEditingBug(bug)}>
                                                            Edit
                                                        </Button>
                                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(bug.id)}>
                                                            Delete
                                                        </Button>
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

            <CreateBugModal
                projects={projects}
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />

            <EditBugModal
                bug={editingBug}
                developers={developers}
                projects={projects}
                open={!!editingBug}
                onOpenChange={(open) => !open && setEditingBug(null)}
            />
        </>
    );
}

BugsIndex.layout = (page: any) => {
    return page; // Discovery will handle layout if standard
};
