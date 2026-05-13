import { useForm } from '@inertiajs/react';
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

interface CreateBugModalProps {
    projects: Project[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateBugModal({ projects, open, onOpenChange }: CreateBugModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        project_id: '',
        impact: 'medium',
        description: '',
        reported_at: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/bugs', {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Record Bug</DialogTitle>
                        <DialogDescription>
                            Log a new bug discovered in a project.
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
                            Save Bug Record
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
