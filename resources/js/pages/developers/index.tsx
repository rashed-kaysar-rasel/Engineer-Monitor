import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import DeveloperForm from '@/components/developers/developer-form';
import DevelopersTable from '@/components/developers/developers-table';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { index as developers } from '@/routes/developers';
import type { DeveloperPageProps, DeveloperRecord } from '@/types/developer';

export default function DevelopersIndex({
    can,
    developers: directory,
}: DeveloperPageProps) {
    const [editingDeveloper, setEditingDeveloper] =
        useState<DeveloperRecord | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = (developer: DeveloperRecord) => {
        setDeletingId(developer.id);

        router.delete(`/developers/${developer.id}`, {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
            onSuccess: () => {
                if (editingDeveloper?.id === developer.id) {
                    setEditingDeveloper(null);
                }
            },
        });
    };

    return (
        <>
            <Head title="Developers" />

            <div className="flex flex-col gap-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Developer management</CardTitle>
                        <Heading
                            variant="small"
                            title="Build and maintain the developer directory"
                            description="Add, review, update, and remove developer records from one workspace."
                        />
                    </CardHeader>
                    <CardContent>
                        {can.create ? (
                            <DeveloperForm
                                mode="create"
                                onSuccess={() => setEditingDeveloper(null)}
                            />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Your role cannot add developers from this page.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Team directory</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DevelopersTable
                            canDelete={can.delete}
                            canUpdate={can.update}
                            deletingId={deletingId}
                            developers={directory.data}
                            editingId={editingDeveloper?.id ?? null}
                            meta={directory.meta}
                            onDelete={handleDelete}
                            onEdit={(developer) =>
                                setEditingDeveloper(developer)
                            }
                            renderEditForm={(developer) => (
                                <DeveloperForm
                                    developer={developer}
                                    mode="edit"
                                    onCancel={() => setEditingDeveloper(null)}
                                    onSuccess={() => setEditingDeveloper(null)}
                                />
                            )}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

DevelopersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Developers',
            href: developers(),
        },
    ],
};
