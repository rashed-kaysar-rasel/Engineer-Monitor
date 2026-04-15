import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DeveloperFormData, DeveloperRecord } from '@/types/developer';

const defaultData: DeveloperFormData = {
    name: '',
    email: '',
    specialization: 'frontend',
};

type DeveloperFormProps = {
    developer?: DeveloperRecord | null;
    mode: 'create' | 'edit';
    onCancel?: () => void;
    onSuccess?: () => void;
};

export default function DeveloperForm({
    developer = null,
    mode,
    onCancel,
    onSuccess,
}: DeveloperFormProps) {
    const form = useForm<DeveloperFormData>(
        developer
            ? {
                  name: developer.name,
                  email: developer.email,
                  specialization: developer.specialization,
              }
            : defaultData,
    );

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                if (mode === 'create') {
                    form.reset();
                }

                onSuccess?.();
            },
        };

        if (mode === 'edit' && developer) {
            form.patch(`/developers/${developer.id}`, options);

            return;
        }

        form.post('/developers', options);
    };

    return (
        <form className="space-y-4" onSubmit={submit}>
            <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                    <Label htmlFor={`${mode}-developer-name`}>Name</Label>
                    <Input
                        id={`${mode}-developer-name`}
                        value={form.data.name}
                        onChange={(event) =>
                            form.setData('name', event.target.value)
                        }
                        placeholder="Developer name"
                    />
                    <InputError message={form.errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor={`${mode}-developer-email`}>
                        Email address
                    </Label>
                    <Input
                        id={`${mode}-developer-email`}
                        type="email"
                        value={form.data.email}
                        onChange={(event) =>
                            form.setData('email', event.target.value)
                        }
                        placeholder="developer@example.com"
                    />
                    <InputError message={form.errors.email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor={`${mode}-developer-specialization`}>
                        Specialization
                    </Label>
                    <select
                        id={`${mode}-developer-specialization`}
                        value={form.data.specialization}
                        onChange={(event) =>
                            form.setData(
                                'specialization',
                                event.target
                                    .value as DeveloperFormData['specialization'],
                            )
                        }
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs ring-offset-background outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="fullstack">Fullstack</option>
                    </select>
                    <InputError message={form.errors.specialization} />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Button disabled={form.processing} type="submit">
                    {mode === 'create' ? 'Add developer' : 'Save changes'}
                </Button>

                {mode === 'edit' && onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={form.processing}
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
}
