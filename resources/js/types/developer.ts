import type { Auth } from '@/types/auth';

export type DeveloperSpecialization = 'frontend' | 'backend' | 'fullstack';

export type DeveloperRecord = {
    id: number;
    name: string;
    email: string;
    specialization: DeveloperSpecialization;
    created_at: string | null;
    updated_at: string | null;
};

export type DeveloperListMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
};

export type DeveloperDirectory = {
    data: DeveloperRecord[];
    meta: DeveloperListMeta;
};

export type DeveloperCapabilities = {
    create: boolean;
    update: boolean;
    delete: boolean;
};

export type DeveloperPageProps = {
    auth: Auth;
    developers: DeveloperDirectory;
    can: DeveloperCapabilities;
};

export type DeveloperFormData = {
    name: string;
    email: string;
    specialization: DeveloperSpecialization;
};
