import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Briefcase, FolderGit2, LayoutGrid, Users, Rocket, Bug } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as developers } from '@/routes/developers';
import { index as projects } from '@/routes/projects';
import type { Auth, NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const roleSlug = auth.user?.role?.slug;
    const canManageDevelopers =
        roleSlug === 'admin' || roleSlug === 'tech-lead';
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...(canManageDevelopers
            ? [
                  {
                      title: 'Developers',
                      href: developers(),
                      icon: Users,
                  },
                  {
                      title: 'Projects',
                      href: projects(),
                      icon: Briefcase,
                  },
                  {
                      title: 'Shipments',
                      href: '/feature-shipments',
                      icon: Rocket,
                  },
                  {
                      title: 'Bugs',
                      href: '/bugs',
                      icon: Bug,
                  },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
