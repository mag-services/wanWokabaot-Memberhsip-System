import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Roles() {
    const { roles = [] } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Roles
                </h2>
            }
        >
            <Head title="Roles" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white px-6 py-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Roles
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                A simple list of roles from the database. Extend
                                this page with create\/edit forms and
                                permissions assignment.
                            </p>
                        </div>
                        <div className="p-6 text-gray-900">
                            {roles.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    No roles found.
                                </p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {roles.map((role) => (
                                        <li
                                            key={role.id}
                                            className="flex items-center justify-between py-3"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {role.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Guard: {role.guard_name}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

