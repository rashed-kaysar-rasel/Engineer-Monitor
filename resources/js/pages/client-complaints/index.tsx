import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Auth } from '@/types';
import CreateComplaintModal from './partials/create-complaint-modal';
import EditComplaintModal from './partials/edit-complaint-modal';

interface Project {
    id: number;
    title: string;
}

interface ClientComplaint {
    id: number;
    project_id: number;
    client_name: string;
    impact_level: 'high' | 'medium' | 'low';
    status: 'pending' | 'resolved';
    reported_date: string;
    description: string;
    project?: Project;
}

interface PaginatedData<T> {
    data: T[];
    meta?: {
        current_page: number;
        last_page: number;
    };
    links: any[];
}

interface ClientComplaintsIndexProps {
    complaints: PaginatedData<ClientComplaint>;
    projects: Project[];
    filters: {
        project_id?: string;
        impact_level?: string;
        status?: string;
    };
}

export default function ClientComplaintsIndex({ complaints, projects, filters }: ClientComplaintsIndexProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const roleSlug = auth.user?.role?.slug;
    const canManage = roleSlug === 'admin' || roleSlug === 'tech-lead';

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingComplaint, setEditingComplaint] = useState<ClientComplaint | null>(null);

    const [projectId, setProjectId] = useState(filters.project_id || 'all');
    const [impactLevel, setImpactLevel] = useState(filters.impact_level || 'all');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilterChange = (key: string, value: string) => {
        if (key === 'project_id') {
setProjectId(value);
}

        if (key === 'impact_level') {
setImpactLevel(value);
}

        if (key === 'status') {
setStatus(value);
}

        const newFilters = {
            project_id: key === 'project_id' ? value : projectId,
            impact_level: key === 'impact_level' ? value : impactLevel,
            status: key === 'status' ? value : status,
        };

        const queryParams: any = {};

        if (newFilters.project_id !== 'all') {
queryParams.project_id = newFilters.project_id;
}

        if (newFilters.impact_level !== 'all') {
queryParams.impact_level = newFilters.impact_level;
}

        if (newFilters.status !== 'all') {
queryParams.status = newFilters.status;
}

        router.get('/client-complaints', queryParams, { preserveState: true });
    };

    const handleResetFilters = () => {
        setProjectId('all');
        setImpactLevel('all');
        setStatus('all');
        router.get('/client-complaints', {}, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this complaint record?')) {
            router.delete(`/client-complaints/${id}`);
        }
    };

    const getImpactBadge = (impact: string) => {
        switch (impact) {
            case 'high': return <Badge variant="destructive">High</Badge>;
            case 'medium': return <Badge variant="default" className="bg-orange-500 hover:bg-orange-600 text-white border-none">Medium</Badge>;
            case 'low': return <Badge variant="secondary">Low</Badge>;
            default: return <Badge variant="outline">{impact}</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        return status === 'resolved'
            ? <Badge className="bg-green-500 hover:bg-green-600 text-white border-none">Resolved</Badge>
            : <Badge variant="outline" className="text-amber-500 border-amber-500 bg-amber-500/10">Pending</Badge>;
    };

    return (
        <>
            <Head title="Client Complaints" />

            <div className="flex flex-col gap-6 p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Client Complaints</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                View and manage reported client complaints for development projects.
                            </p>
                        </div>
                        {canManage && (
                            <Button onClick={() => setIsCreateModalOpen(true)}>Record Complaint</Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Filter Bar */}
                            <div className="flex flex-wrap gap-4 items-end p-4 rounded-lg bg-muted/30 border">
                                <div className="flex flex-col gap-1.5 w-full sm:w-[200px]">
                                    <span className="text-xs font-semibold text-muted-foreground">Project</span>
                                    <Select value={projectId} onValueChange={(val) => handleFilterChange('project_id', val)}>
                                        <SelectTrigger className="w-full bg-background">
                                            <SelectValue placeholder="All Projects" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Projects</SelectItem>
                                            {projects.map((project) => (
                                                <SelectItem key={project.id} value={project.id.toString()}>
                                                    {project.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-1.5 w-full sm:w-[150px]">
                                    <span className="text-xs font-semibold text-muted-foreground">Impact</span>
                                    <Select value={impactLevel} onValueChange={(val) => handleFilterChange('impact_level', val)}>
                                        <SelectTrigger className="w-full bg-background">
                                            <SelectValue placeholder="All Impacts" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Impacts</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col gap-1.5 w-full sm:w-[150px]">
                                    <span className="text-xs font-semibold text-muted-foreground">Status</span>
                                    <Select value={status} onValueChange={(val) => handleFilterChange('status', val)}>
                                        <SelectTrigger className="w-full bg-background">
                                            <SelectValue placeholder="All Statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="resolved">Resolved</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {(projectId !== 'all' || impactLevel !== 'all' || status !== 'all') && (
                                    <Button
                                        variant="ghost"
                                        onClick={handleResetFilters}
                                        className="h-9 px-3 text-muted-foreground hover:text-foreground w-full sm:w-auto text-left sm:text-center justify-start sm:justify-center"
                                    >
                                        Reset Filters
                                    </Button>
                                )}
                            </div>

                            {complaints.data.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">No client complaints found matching the filters.</p>
                            ) : (
                                <>
                                    <div className="rounded-md border overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b bg-muted/50">
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Client Name</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Project</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Impact</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Reported Date</th>
                                                    {canManage && (
                                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {complaints.data.map((complaint) => (
                                                    <tr key={complaint.id} className="border-b transition-colors hover:bg-muted/50">
                                                        <td className="p-4 align-middle font-medium">{complaint.client_name}</td>
                                                        <td className="p-4 align-middle">{complaint.project?.title || 'N/A'}</td>
                                                        <td className="p-4 align-middle">
                                                            <div className="max-w-[280px] truncate" title={complaint.description}>
                                                                {complaint.description}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle">{getImpactBadge(complaint.impact_level)}</td>
                                                        <td className="p-4 align-middle">{getStatusBadge(complaint.status)}</td>
                                                        <td className="p-4 align-middle text-muted-foreground">
                                                            {new Date(complaint.reported_date).toLocaleDateString()}
                                                        </td>
                                                        {canManage && (
                                                            <td className="p-4 align-middle text-right space-x-2 whitespace-nowrap">
                                                                <Button variant="outline" size="sm" onClick={() => setEditingComplaint(complaint)}>
                                                                    Edit
                                                                </Button>
                                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(complaint.id)}>
                                                                    Delete
                                                                </Button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination Links */}
                                    {complaints.links && complaints.links.length > 3 && (
                                        <div className="flex justify-center gap-1 mt-4">
                                            {complaints.links.map((link, idx) => (
                                                <Button
                                                    key={idx}
                                                    variant={link.active ? 'default' : 'outline'}
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <CreateComplaintModal
                projects={projects}
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />

            <EditComplaintModal
                complaint={editingComplaint}
                projects={projects}
                open={!!editingComplaint}
                onOpenChange={(open) => !open && setEditingComplaint(null)}
            />
        </>
    );
}

ClientComplaintsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Client Complaints',
            href: '/client-complaints',
        },
    ],
};
