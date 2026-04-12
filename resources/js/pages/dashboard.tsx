import { Head, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';
import type { Auth } from '@/types';

export default function Dashboard() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const roleName = auth.user?.role?.name ?? 'Pending access';
    const roleSummary =
        auth.user?.role?.slug === 'admin'
            ? 'You can oversee internal access and platform operations.'
            : auth.user?.role?.slug === 'tech-lead'
              ? 'You can access the technical leadership workspace for this application.'
              : 'Your account needs an approved role before protected application features are available.';

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card>
                    <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>
                                Welcome back
                                {auth.user ? `, ${auth.user.name}` : ''}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Signed in through the protected internal access
                                flow.
                            </p>
                        </div>
                        <Badge variant="secondary">{roleName}</Badge>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {roleSummary}
                        </p>
                    </CardContent>
                </Card>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
