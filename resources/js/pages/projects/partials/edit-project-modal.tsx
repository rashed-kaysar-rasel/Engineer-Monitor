import { useForm } from '@inertiajs/react';
import type { FormEventHandler} from 'react';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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

interface EditProjectModalProps {
    project: Project | null;
    users: User[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditProjectModal({
    project,
    users,
    open,
    onOpenChange,
}: EditProjectModalProps) {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        title: '',
        description: '',
        status: 'active',
        project_lead_id: '',
    });

    useEffect(() => {
        if (project && open) {
            setData({
                title: project.title,
                description: project.description || '',
                status: project.status,
                project_lead_id: project.project_lead_id
                    ? project.project_lead_id.toString()
                    : project.lead?.id.toString() || '',
            });
            clearErrors();
        }
    }, [project, open, setData, clearErrors]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!project) {
return;
}

        put(`/projects/${project.id}`, {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                    <DialogDescription>
                        Make changes to the project here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-title">Project Title</Label>
                        <Input
                            id="edit-title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <textarea
                            id="edit-description"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-status">Status</Label>
                        <Select
                            value={data.status}
                            onValueChange={(value) => setData('status', value)}
                        >
                            <SelectTrigger id="edit-status">
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-project_lead_id">Project Lead</Label>
                        <Select
                            value={data.project_lead_id}
                            onValueChange={(value) => setData('project_lead_id', value)}
                        >
                            <SelectTrigger id="edit-project_lead_id">
                                <SelectValue placeholder="Select a project lead" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.project_lead_id} className="mt-2" />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
