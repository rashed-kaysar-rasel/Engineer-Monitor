import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateFeatureShipmentModal from './Partials/CreateFeatureShipmentModal';
import EditFeatureShipmentModal from './Partials/EditFeatureShipmentModal';

interface User {
    id: number;
    name: string;
}

interface Project {
    id: number;
    title: string;
}

interface FeatureShipment {
    id: number;
    feature_id: number;
    name: string;
    description: string;
    shipped_date: string;
    t_shirt_size: string;
    points: number;
    developer_id: number;
    approver_id: number;
    project_id: number;
    developer?: User;
    approver?: User;
    project?: Project;
}

interface PaginatedData<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
    };
}

interface FeatureShipmentsIndexProps {
    shipments: PaginatedData<FeatureShipment>;
    developers: User[];
    approvers: User[];
    projects: Project[];
}

export default function FeatureShipmentsIndex({ shipments, developers, approvers, projects }: FeatureShipmentsIndexProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingShipment, setEditingShipment] = useState<FeatureShipment | null>(null);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this shipment?')) {
            router.delete(`/feature-shipments/${id}`);
        }
    };

    return (
        <>
            <Head title="Feature Shipments" />

            <div className="flex flex-col gap-6 p-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Feature Shipments</CardTitle>
                        <Button onClick={() => setIsCreateModalOpen(true)}>Log Shipment</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {shipments.data.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No feature shipments logged yet.</p>
                            ) : (
                                <div className="rounded-md border">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Feature</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Project</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Size (Pts)</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Developer</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {shipments.data.map((shipment) => (
                                                <tr key={shipment.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                    <td className="p-4 align-middle">
                                                        <div className="font-medium">#{shipment.feature_id} {shipment.name}</div>
                                                        <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                            {shipment.description}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        {new Date(shipment.shipped_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        {shipment.project?.title || 'Unknown'}
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <Badge variant="outline" className="font-mono">
                                                            {shipment.t_shirt_size} ({shipment.points})
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        {shipment.developer?.name || 'Unknown'}
                                                    </td>
                                                    <td className="p-4 align-middle text-right space-x-2">
                                                        <Button variant="outline" size="sm" onClick={() => setEditingShipment(shipment)}>
                                                            Edit
                                                        </Button>
                                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(shipment.id)}>
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

            <CreateFeatureShipmentModal
                developers={developers}
                approvers={approvers}
                projects={projects}
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />

            <EditFeatureShipmentModal
                shipment={editingShipment}
                developers={developers}
                approvers={approvers}
                projects={projects}
                open={!!editingShipment}
                onOpenChange={(open) => !open && setEditingShipment(null)}
            />
        </>
    );
}

FeatureShipmentsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Feature Shipments',
            href: '/feature-shipments',
        },
    ],
};
