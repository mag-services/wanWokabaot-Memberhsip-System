import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';

export default function Users() {
    const { users = [], roles = [] } = usePage().props;

    const [showingModal, setShowingModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showingConfirmDeleteModal, setShowingConfirmDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

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
        email: '',
        password: '',
        role_id: '',
    });

    const openCreateModal = () => {
        setEditingUser(null);
        reset();
        setShowingModal(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            role_id: user.roles && user.roles.length > 0 ? user.roles[0].id : '',
        });
        setShowingModal(true);
    };

    const closeModal = () => {
        setShowingModal(false);
        setEditingUser(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingUser) {
            put(route('settings.users.update', editingUser.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('settings.users.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (user) => {
        setUserToDelete(user);
        setShowingConfirmDeleteModal(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            destroy(route('settings.users.destroy', userToDelete.id), {
                onSuccess: () => {
                    setShowingConfirmDeleteModal(false);
                    setUserToDelete(null);
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    User Management
                </h2>
            }
        >
            <Head title="User Management - WanWokabaot Connect" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    Users
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Manage application users. Use the table
                                    below to add, edit, or delete users.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            >
                                Add User
                            </button>
                        </div>
                        <div className="p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {users.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                                >
                                                    No users found.
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {user.email}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                        {user.roles &&
                                                        user.roles.length > 0
                                                            ? user.roles[0].name
                                                            : '—'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        user,
                                                                    )
                                                                }
                                                                className="font-medium text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        user,
                                                                    )
                                                                }
                                                                className="font-medium text-red-600 hover:text-red-800 focus:outline-none focus:underline"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {editingUser ? 'Edit User' : 'Add User'}
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
                        <form onSubmit={handleSubmit} className="px-6 py-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Name
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
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Role
                                    </label>
                                    <select
                                        value={data.role_id}
                                        onChange={(e) =>
                                            setData('role_id', e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">Select a role</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.role_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.role_id}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {editingUser
                                            ? 'Password (leave blank to keep current)'
                                            : 'Password'}
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.password}
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
                                    {editingUser ? 'Save Changes' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmDeleteModal
                show={showingConfirmDeleteModal}
                onClose={() => setShowingConfirmDeleteModal(false)}
                onConfirm={confirmDelete}
                message={userToDelete ? `Are you sure you want to delete user "${userToDelete.name}"? This action cannot be undone.` : ''}
            />
        </AuthenticatedLayout>
    );
}


