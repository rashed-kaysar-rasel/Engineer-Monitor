import { Link } from '@inertiajs/react';
import { Fragment } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { DeveloperListMeta, DeveloperRecord } from '@/types/developer';

type DevelopersTableProps = {
    canDelete: boolean;
    canUpdate: boolean;
    deletingId: number | null;
    developers: DeveloperRecord[];
    editingId: number | null;
    meta: DeveloperListMeta;
    onDelete: (developer: DeveloperRecord) => void;
    onEdit: (developer: DeveloperRecord) => void;
    renderEditForm: (developer: DeveloperRecord) => ReactNode;
};

export default function DevelopersTable({
    canDelete,
    canUpdate,
    deletingId,
    developers,
    editingId,
    meta,
    onDelete,
    onEdit,
    renderEditForm,
}: DevelopersTableProps) {
    if (developers.length === 0) {
        return (
            <div className="rounded-xl border border-dashed p-8 text-center">
                <h3 className="text-lg font-semibold">
                    No developers added yet
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Add your first developer record to start building the team
                    directory.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-muted/40">
                        <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Email</th>
                            <th className="px-4 py-3 font-medium">
                                Specialization
                            </th>
                            <th className="px-4 py-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {developers.map((developer) => (
                            <Fragment key={developer.id}>
                                <tr className="border-t align-top">
                                    <td className="px-4 py-3 font-medium">
                                        {developer.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {developer.email}
                                    </td>
                                    <td className="px-4 py-3 capitalize">
                                        {developer.specialization}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-2">
                                            {canUpdate && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        onEdit(developer)
                                                    }
                                                >
                                                    {editingId === developer.id
                                                        ? 'Editing'
                                                        : 'Edit'}
                                                </Button>
                                            )}

                                            {canDelete && (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Delete developer
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                This permanently
                                                                removes{' '}
                                                                {developer.name}{' '}
                                                                from the team
                                                                directory.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <DialogClose
                                                                asChild
                                                            >
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                >
                                                                    Keep
                                                                    developer
                                                                </Button>
                                                            </DialogClose>
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                disabled={
                                                                    deletingId ===
                                                                    developer.id
                                                                }
                                                                onClick={() =>
                                                                    onDelete(
                                                                        developer,
                                                                    )
                                                                }
                                                            >
                                                                Confirm delete
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                {editingId === developer.id && (
                                    <tr className="border-t bg-muted/20">
                                        <td className="px-4 py-4" colSpan={4}>
                                            {renderEditForm(developer)}
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p>
                    Showing {meta.from ?? 0} to {meta.to ?? 0} of {meta.total}{' '}
                    developers
                </p>

                <div className="flex items-center gap-2">
                    {meta.prev_page_url ? (
                        <Button asChild size="sm" variant="outline">
                            <Link href={meta.prev_page_url} preserveScroll>
                                Previous
                            </Link>
                        </Button>
                    ) : (
                        <Button disabled size="sm" variant="outline">
                            Previous
                        </Button>
                    )}

                    {meta.next_page_url ? (
                        <Button asChild size="sm" variant="outline">
                            <Link href={meta.next_page_url} preserveScroll>
                                Next
                            </Link>
                        </Button>
                    ) : (
                        <Button disabled size="sm" variant="outline">
                            Next
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
