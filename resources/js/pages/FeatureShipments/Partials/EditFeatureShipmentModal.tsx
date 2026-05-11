import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';

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
    developer_id: number;
    approver_id: number;
    project_id: number;
}

interface EditModalProps {
    shipment: FeatureShipment | null;
    developers: User[];
    approvers: User[];
    projects: Project[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditFeatureShipmentModal({ shipment, developers, approvers, projects, open, onOpenChange }: EditModalProps) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        feature_id: '',
        name: '',
        description: '',
        shipped_date: '',
        t_shirt_size: 'M',
        approver_id: '',
        developer_id: '',
        project_id: '',
    });

    useEffect(() => {
        if (shipment && open) {
            setData({
                feature_id: shipment.feature_id.toString(),
                name: shipment.name,
                description: shipment.description,
                shipped_date: shipment.shipped_date,
                t_shirt_size: shipment.t_shirt_size,
                approver_id: shipment.approver_id.toString(),
                developer_id: shipment.developer_id.toString(),
                project_id: shipment.project_id.toString(),
            });
        }
    }, [shipment, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!shipment) return;
        
        put(`/feature-shipments/${shipment.id}`, {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            reset();
            clearErrors();
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Feature Shipment</DialogTitle>
                        <DialogDescription>
                            Update the details of this shipped feature.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_feature_id">Feature ID</Label>
                                <Input
                                    id="edit_feature_id"
                                    type="number"
                                    value={data.feature_id}
                                    onChange={(e) => setData('feature_id', e.target.value)}
                                    placeholder="e.g. 1234"
                                />
                                {errors.feature_id && <p className="text-sm text-destructive">{errors.feature_id}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit_name">Feature Name</Label>
                                <Input
                                    id="edit_name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_description">Description</Label>
                            <Textarea
                                id="edit_description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_shipped_date">Shipped Date</Label>
                                <Input
                                    id="edit_shipped_date"
                                    type="date"
                                    value={data.shipped_date}
                                    onChange={(e) => setData('shipped_date', e.target.value)}
                                />
                                {errors.shipped_date && <p className="text-sm text-destructive">{errors.shipped_date}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit_t_shirt_size">T-Shirt Size</Label>
                                <select
                                    id="edit_t_shirt_size"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={data.t_shirt_size}
                                    onChange={(e) => setData('t_shirt_size', e.target.value)}
                                >
                                    <option value="S">S (1 pt)</option>
                                    <option value="M">M (2 pts)</option>
                                    <option value="L">L (3 pts)</option>
                                    <option value="XL">XL (5 pts)</option>
                                    <option value="XXL">XXL (7 pts)</option>
                                    <option value="XXXL">XXXL (8 pts)</option>
                                </select>
                                {errors.t_shirt_size && <p className="text-sm text-destructive">{errors.t_shirt_size}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit_developer_id">Developer</Label>
                                <select
                                    id="edit_developer_id"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={data.developer_id}
                                    onChange={(e) => setData('developer_id', e.target.value)}
                                >
                                    <option value="">Select a developer</option>
                                    {developers.map((u) => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                                {errors.developer_id && <p className="text-sm text-destructive">{errors.developer_id}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit_approver_id">Approver</Label>
                                <select
                                    id="edit_approver_id"
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={data.approver_id}
                                    onChange={(e) => setData('approver_id', e.target.value)}
                                >
                                    <option value="">Select an approver</option>
                                    {approvers.map((u) => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                                {errors.approver_id && <p className="text-sm text-destructive">{errors.approver_id}</p>}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit_project_id">Project</Label>
                            <select
                                id="edit_project_id"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={data.project_id}
                                onChange={(e) => setData('project_id', e.target.value)}
                            >
                                <option value="">Select a project</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                            {errors.project_id && <p className="text-sm text-destructive">{errors.project_id}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Update Shipment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
