import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';

export default function Index() {
    const { auth, members = [], sortBy, sortDirection } = usePage().props;

    const [showingModal, setShowingModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [showingConfirmDeleteModal, setShowingConfirmDeleteModal] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);

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
        phone: '',
        member_code: '',
        join_date: '',
        status: 'active',
        notes: '',
    });

    const openCreateModal = () => {
        setEditingMember(null);
        reset();
        setShowingModal(true);
    };

    const openEditModal = (member) => {
        setEditingMember(member);
        setData({
            name: member.name || '',
            email: member.email || '',
            phone: member.phone || '',
            member_code: member.member_code || '',
            join_date: member.join_date || '',
            status: member.status || 'active',
            notes: member.notes || '',
        });
        setShowingModal(true);
    };

    const closeModal = () => {
        setShowingModal(false);
        setEditingMember(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingMember) {
            put(route('web.members.update', editingMember.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('web.members.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (member) => {
        setMemberToDelete(member);
        setShowingConfirmDeleteModal(true);
    };

    const confirmDelete = () => {
        if (memberToDelete) {
            destroy(route('web.members.destroy', memberToDelete.id), {
                onSuccess: () => {
                    setShowingConfirmDeleteModal(false);
                    setMemberToDelete(null);
                },
            });
        }
    };

    const handleSort = (column) => {
        const newDirection =
            sortBy === column && sortDirection === 'asc' ? 'desc' : 'asc';
        router.get(route('web.members.index'), {
            sort_by: column,
            sort_direction: newDirection,
        });
    };

    const SortIcon = ({ column }) => {
        if (sortBy !== column) {
            return (
                <svg
                    className="ml-1 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                </svg>
            );
        }
        return sortDirection === 'asc' ? (
            <svg
                className="ml-1 h-4 w-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                />
            </svg>
        ) : (
            <svg
                className="ml-1 h-4 w-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                />
            </svg>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Members
                </h2>
            }
        >
            <Head title="Members - WanWokabaot Connect" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    Members
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Manage members. Click column headers to sort.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            >
                                Add Member
                            </button>
                        </div>
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('name')}
                                            >
                                                <div className="flex items-center">
                                                    Name
                                                    <SortIcon column="name" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('email')}
                                            >
                                                <div className="flex items-center">
                                                    Email
                                                    <SortIcon column="email" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('join_date')}
                                            >
                                                <div className="flex items-center">
                                                    Join Date
                                                    <SortIcon column="join_date" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('status')}
                                            >
                                                <div className="flex items-center">
                                                    Status
                                                    <SortIcon column="status" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('total_spent')}
                                            >
                                                <div className="flex items-center justify-end">
                                                    Total Spent
                                                    <SortIcon column="total_spent" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Unpaid Amount
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {members.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                                >
                                                    No members found.
                                                </td>
                                            </tr>
                                        ) : (
                                            members.map((member) => (
                                                <tr key={member.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {member.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {member.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {member.join_date}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                                                member.status === 'active'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}
                                                        >
                                                            {member.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                        {member.total_spent ?? '0.00'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                                        {member.unpaid_total ?? '0.00'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        member,
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
                                                                        member,
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
                    <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {editingMember ? 'Edit Member' : 'Add Member'}
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
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Member Code
                                        </label>
                                        <input
                                            type="text"
                                            value={data.member_code}
                                            onChange={(e) =>
                                                setData(
                                                    'member_code',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.member_code && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.member_code}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Join Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={data.join_date}
                                            onChange={(e) =>
                                                setData(
                                                    'join_date',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.join_date && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.join_date}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) =>
                                            setData('status', e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Notes
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData('notes', e.target.value)
                                        }
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.notes && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.notes}
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
                                    {editingMember ? 'Save Changes' : 'Create'}
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
                message={memberToDelete ? `Are you sure you want to delete member "${memberToDelete.name}"? This action cannot be undone.` : ''}
            />
        </AuthenticatedLayout>
    );
}
