import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function RolesPermissions() {
    const { roles = [], permissions = [] } = usePage().props;

    const [showingModal, setShowingModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        permission_ids: [],
    });

    const openCreateModal = () => {
        setEditingRole(null);
        reset();
        setShowingModal(true);
    };

    const openEditModal = (role) => {
        setEditingRole(role);
        setData({
            name: role.name,
            permission_ids: role.permissions.map((p) => p.id),
        });
        setShowingModal(true);
    };

    const closeModal = () => {
        setShowingModal(false);
        setEditingRole(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingRole) {
            put(route('settings.roles-permissions.update', editingRole.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('settings.roles-permissions.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (role) => {
        if (!confirm(`Delete role "${role.name}"?`)) {
            return;
        }

        destroy(route('settings.roles-permissions.destroy', role.id));
    };

    const togglePermission = (permissionId) => {
        const currentIds = data.permission_ids || [];
        if (currentIds.includes(permissionId)) {
            setData(
                'permission_ids',
                currentIds.filter((id) => id !== permissionId),
            );
        } else {
            setData('permission_ids', [...currentIds, permissionId]);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Roles & Permissions
                </h2>
            }
        >
            <Head title="Roles & Permissions" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    Roles & Permissions
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Manage roles and assign permissions to them.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            >
                                Add Role
                            </button>
                        </div>
                        <div className="p-6 text-gray-900">
                            {roles.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    No roles found.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {roles.map((role) => (
                                        <div
                                            key={role.id}
                                            className="rounded-lg border border-gray-200 p-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                        {role.name}
                                                    </h4>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Guard: {role.guard_name}
                                                    </p>
                                                    {role.permissions.length > 0 && (
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {role.permissions.map(
                                                                (permission) => (
                                                                    <span
                                                                        key={
                                                                            permission.id
                                                                        }
                                                                        className="inline-flex rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800"
                                                                    >
                                                                        {
                                                                            permission.name
                                                                        }
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4 flex space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditModal(role)
                                                        }
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(role)
                                                        }
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {editingRole
                                    ? 'Edit Role'
                                    : 'Add Role'}
                            </h3>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <span className="sr-only">Close</span>
                                ×
                            </button>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="px-6 py-4"
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Role Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Permissions
                                    </label>
                                    <div className="mt-2 max-h-64 overflow-y-auto rounded-md border border-gray-200 p-4">
                                        {permissions.length === 0 ? (
                                            <p className="text-sm text-gray-500">
                                                No permissions available.
                                            </p>
                                        ) : (
                                            <div className="space-y-2">
                                                {permissions.map(
                                                    (permission) => (
                                                        <label
                                                            key={permission.id}
                                                            className="flex items-center"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={(
                                                                    data.permission_ids ||
                                                                    []
                                                                ).includes(
                                                                    permission.id,
                                                                )}
                                                                onChange={() =>
                                                                    togglePermission(
                                                                        permission.id,
                                                                    )
                                                                }
                                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">
                                                                {permission.name}
                                                            </span>
                                                        </label>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {errors.permission_ids && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.permission_ids}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-75"
                                >
                                    {editingRole
                                        ? 'Save Changes'
                                        : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
