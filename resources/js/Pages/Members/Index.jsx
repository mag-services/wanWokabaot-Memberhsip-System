import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';

const FilterField = styled.input.attrs(props => ({
    type: 'text',
    placeholder: 'Filter members...',
    'aria-label': 'Search Input',
}))`
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #d1d5db;
    font-size: 14px;
    &:focus {
        outline: none;
        border-color: #6366f1;
        box-shadow: 0 0 0 1px #6366f1;
    }
`;

const customStyles = {
    headCells: {
        style: {
            fontWeight: 'bold',
            fontSize: '14px',
            backgroundColor: '#f9fafb',
            color: '#4b5563',
            paddingLeft: '16px',
            paddingRight: '16px',
        },
    },
    cells: {
        style: {
            fontSize: '14px',
            color: '#374151',
            paddingLeft: '16px',
            paddingRight: '16px',
        },
    },
    rows: {
        highlightOnHoverStyle: {
            backgroundColor: '#f3f4f6',
        },
    },
};

export default function Index() {
    const { auth, members: initialMembers } = usePage().props;

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

    const [showingModal, setShowingModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [showingConfirmDeleteModal, setShowingConfirmDeleteModal] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const filteredMembers = useMemo(() => {
        return initialMembers.filter(
            (member) =>
                (member.name && member.name.toLowerCase().includes(filterText.toLowerCase())) ||
                (member.email && member.email.toLowerCase().includes(filterText.toLowerCase()))
        );
    }, [initialMembers, filterText]);

    const handleClearFilter = () => {
        if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
        }
    };

    const openCreateModal = () => {
        setEditingMember(null);
        reset();
        setShowingModal(true);
    };

    const openEditModal = (row) => {
        setEditingMember(row);
        setData({
            name: row.name || '',
            email: row.email || '',
            phone: row.phone || '',
            member_code: row.member_code || '',
            join_date: row.join_date || '',
            status: row.status || 'active',
            notes: row.notes || '',
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

    const handleDelete = (row) => {
        setMemberToDelete(row);
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

    const columns = useMemo(
        () => [
            {
                name: 'Name',
                selector: (row) => row.name,
                sortable: true,
            },
            {
                name: 'Email',
                selector: (row) => row.email,
                sortable: true,
            },
            {
                name: 'Join Date',
                selector: (row) => row.join_date,
                sortable: true,
            },
            {
                name: 'Status',
                selector: (row) => row.status,
                sortable: true,
                cell: (row) => (
                    <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            row.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                        {row.status}
                    </span>
                ),
            },
            {
                name: 'Total Spent',
                selector: (row) => row.total_spent,
                sortable: true,
                right: true,
                cell: (row) => `VT${row.total_spent ?? '0.00'}`,
            },
            {
                name: 'Unpaid Amount',
                selector: (row) => row.unpaid_total,
                sortable: true,
                right: true,
                cell: (row) => `VT${row.unpaid_total ?? '0.00'}`,
                conditionalCellStyles: [
                    {
                        when: row => parseFloat(row.unpaid_total) >= 2000,
                        style: { backgroundColor: '#fecaca', color: '#b91c1c' }, // Red-200, Red-800
                    },
                    {
                        when: row => parseFloat(row.unpaid_total) > 0 && parseFloat(row.unpaid_total) < 2000,
                        style: { backgroundColor: '#fee2e2', color: '#ef4444' }, // Red-100, Red-500
                    },
                ],
            },
            {
                name: 'Actions',
                cell: (row) => (
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => openEditModal(row)}
                            className="font-medium text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline"
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDelete(row)}
                            className="font-medium text-red-600 hover:text-red-800 focus:outline-none focus:underline"
                        >
                            Delete
                        </button>
                    </div>
                ),
                right: true,
                ignoreRowClick: true,
                allowOverflow: true,
                button: true,
            },
        ],
        [openEditModal, handleDelete],
    );

    const SubHeaderComponent = useMemo(() => {
        return (
            <div className="flex items-center justify-between w-full mb-4">
                <FilterField
                    id="search"
                    type="text"
                    placeholder="Filter members..."
                    aria-label="Search Input"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={handleClearFilter}
                        className="rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
                    >
                        Clear
                    </button>
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    >
                        Add Member
                    </button>
                </div>
            </div>
        );
    }, [filterText, handleClearFilter, openCreateModal]);

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
                                    Manage members.
                                </p>
                            </div>
                        </div>
                        <div className="p-6 bg-white border-b border-gray-200">
                            <DataTable
                                columns={columns}
                                data={filteredMembers}
                                pagination
                                paginationPerPage={10}
                                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                                highlightOnHover
                                pointerOnHover
                                customStyles={customStyles}
                                subHeader
                                subHeaderComponent={SubHeaderComponent}
                                persistTableHead
                                noDataComponent="No members found"
                            />
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