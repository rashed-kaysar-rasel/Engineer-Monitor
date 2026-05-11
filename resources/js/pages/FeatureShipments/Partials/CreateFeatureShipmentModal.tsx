import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface User {
    id: number;
    name: string;
}

interface Project {
    id: number;
    title: string;
}

interface CreateModalProps {
    developers: User[];
    approvers: User[];
    projects: Project[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateFeatureShipmentModal({ developers, approvers, projects, open, onOpenChange }: CreateModalProps) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        feature_id: '',
        name: '',
        description: '',
        shipped_date: '',
        t_shirt_size: 'M',
        approver_id: '',
        developer_id: '',
        project_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/feature-shipments', {
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
                        <DialogTitle>Log Feature Shipment</DialogTitle>
                        <DialogDescription>
                            Record a shipped feature to track team delivery.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="feature_id">Feature ID</Label>
                                <Input
                                    id="feature_id"
                                    type="number"
                                    value={data.feature_id}
                                    onChange={(e) => setData('feature_id', e.target.value)}
                                    placeholder="e.g. 1234"
                                />
                                {errors.feature_id && <p className="text-sm text-destructive">{errors.feature_id}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Feature Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="shipped_date">Shipped Date</Label>
                                <Input
                                    id="shipped_date"
                                    type="date"
                                    value={data.shipped_date}
                                    onChange={(e) => setData('shipped_date', e.target.value)}
                                />
                                {errors.shipped_date && <p className="text-sm text-destructive">{errors.shipped_date}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="t_shirt_size">T-Shirt Size</Label>
                                <select
                                    id="t_shirt_size"
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
                                <Label htmlFor="developer_id">Developer</Label>
                                <select
                                    id="developer_id"
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
                                <Label htmlFor="approver_id">Approver</Label>
                                <select
                                    id="approver_id"
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
                            <Label htmlFor="project_id">Project</Label>
                            <select
                                id="project_id"
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
                            {processing ? 'Saving...' : 'Save Shipment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
