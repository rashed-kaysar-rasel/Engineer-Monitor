import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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
}

interface EditComplaintModalProps {
    complaint: ClientComplaint | null;
    projects: Project[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditComplaintModal({ complaint, projects, open, onOpenChange }: EditComplaintModalProps) {
    const { data, setData, put, processing, errors } = useForm({
        project_id: '',
        client_name: '',
        impact_level: 'medium',
        status: 'pending',
        reported_date: '',
        description: '',
    });

    useEffect(() => {
        if (complaint) {
            setData({
                project_id: complaint.project_id.toString(),
                client_name: complaint.client_name,
                impact_level: complaint.impact_level,
                status: complaint.status,
                reported_date: complaint.reported_date.split('T')[0],
                description: complaint.description,
            });
        }
    }, [complaint, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!complaint) {
return;
}

        put(`/client-complaints/${complaint.id}`, {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Client Complaint</DialogTitle>
                        <DialogDescription>
                            Update the details or status of this client complaint.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="project_id">Project</Label>
                            <Select
                                value={data.project_id.toString()}
                                onValueChange={(value) => setData('project_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map((project) => (
                                        <SelectItem key={project.id} value={project.id.toString()}>
                                            {project.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.project_id && <p className="text-xs text-destructive">{errors.project_id}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="client_name">Client Name</Label>
                            <Input
                                id="client_name"
                                value={data.client_name}
                                onChange={(e) => setData('client_name', e.target.value)}
                                placeholder="Enter client name"
                            />
                            {errors.client_name && <p className="text-xs text-destructive">{errors.client_name}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="impact_level">Impact Level</Label>
                            <Select
                                value={data.impact_level}
                                onValueChange={(value: any) => setData('impact_level', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select impact level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.impact_level && <p className="text-xs text-destructive">{errors.impact_level}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value: any) => setData('status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="reported_date">Date Reported</Label>
                            <Input
                                id="reported_date"
                                type="date"
                                value={data.reported_date}
                                onChange={(e) => setData('reported_date', e.target.value)}
                            />
                            {errors.reported_date && <p className="text-xs text-destructive">{errors.reported_date}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Complaint Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe the client complaint in detail..."
                                rows={4}
                            />
                            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Update Complaint Record
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
