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
}

interface EditBugModalProps {
    bug: Bug | null;
    projects: Project[];
    developers: User[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditBugModal({ bug, projects, developers, open, onOpenChange }: EditBugModalProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        project_id: '',
        impact: 'medium',
        status: 'pending',
        description: '',
        developer_id: '',
        reported_at: '',
        resolved_at: '',
    });

    useEffect(() => {
        if (bug) {
            setData({
                project_id: bug.project_id.toString(),
                impact: bug.impact,
                status: bug.status,
                description: bug.description,
                developer_id: bug.developer_id?.toString() || '',
                reported_at: bug.reported_at.split('T')[0],
                resolved_at: bug.resolved_at?.split('T')[0] || '',
            });
        }
    }, [bug]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bug) return;

        put(`/bugs/${bug.id}`, {
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
                        <DialogTitle>Edit Bug Record</DialogTitle>
                        <DialogDescription>
                            Update the details or status of this bug.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
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
                                <Label htmlFor="impact">Impact</Label>
                                <Select
                                    value={data.impact}
                                    onValueChange={(value: any) => setData('impact', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select impact" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.impact && <p className="text-xs text-destructive">{errors.impact}</p>}
                            </div>
                        </div>

                        {data.status === 'resolved' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="developer_id">Resolved By</Label>
                                    <Select
                                        value={data.developer_id}
                                        onValueChange={(value) => setData('developer_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select developer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {developers.map((dev) => (
                                                <SelectItem key={dev.id} value={dev.id.toString()}>
                                                    {dev.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.developer_id && <p className="text-xs text-destructive">{errors.developer_id}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="resolved_at">Resolved At</Label>
                                    <Input
                                        id="resolved_at"
                                        type="date"
                                        value={data.resolved_at}
                                        onChange={(e) => setData('resolved_at', e.target.value)}
                                    />
                                    {errors.resolved_at && <p className="text-xs text-destructive">{errors.resolved_at}</p>}
                                </div>
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="reported_at">Reported At</Label>
                            <Input
                                id="reported_at"
                                type="date"
                                value={data.reported_at}
                                onChange={(e) => setData('reported_at', e.target.value)}
                            />
                            {errors.reported_at && <p className="text-xs text-destructive">{errors.reported_at}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe the bug in detail..."
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
                            Update Bug Record
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
