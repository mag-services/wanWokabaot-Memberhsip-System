import React, { useState, useEffect, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';

const FilterField = styled.input.attrs(props => ({
    type: 'text',
    placeholder: 'Filter inventory...',
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
    const { auth, products: initialProducts } = usePage().props;

    const [showingModal, setShowingModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showingConfirmDeleteModal, setShowingConfirmDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const filteredProducts = useMemo(() => {
        return initialProducts.filter(
            (product) =>
                (product.name && product.name.toLowerCase().includes(filterText.toLowerCase())) ||
                (product.category && product.category.toLowerCase().includes(filterText.toLowerCase()))
        );
    }, [initialProducts, filterText]);

    const handleClearFilter = () => {
        if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
        }
    };


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
        category: '',
        selling_price: '',
        cost_price: '',
        current_stock: '',
        min_stock: '',
        unit: '',
    });

    const openCreateModal = () => {
        setEditingProduct(null);
        reset();
        setShowingModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setData({
            name: product.name || '',
            category: product.category || '',
            selling_price: product.selling_price || '',
            cost_price: product.cost_price || '',
            current_stock: product.current_stock || '',
            min_stock: product.min_stock || '',
            unit: product.unit || '',
        });
        setShowingModal(true);
    };

    const closeModal = () => {
        setShowingModal(false);
        setEditingProduct(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingProduct) {
            put(route('web.inventory.update', editingProduct.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('web.inventory.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (row) => {
        setProductToDelete(row);
        setShowingConfirmDeleteModal(true);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            destroy(route('web.inventory.destroy', productToDelete.id), {
                onSuccess: () => {
                    setShowingConfirmDeleteModal(false);
                    setProductToDelete(null);
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
                name: 'Category',
                selector: (row) => row.category,
                sortable: true,
            },
            {
                name: 'Selling Price',
                selector: (row) => `VT${row.selling_price ?? '0.00'}`,
                sortable: true,
                right: true,
            },
            {
                name: 'Cost Price',
                selector: (row) => `VT${row.cost_price ?? '0.00'}`,
                sortable: true,
                right: true,
            },
            {
                name: 'Current Stock',
                selector: (row) => row.current_stock,
                sortable: true,
                right: true,
            },
            {
                name: 'Min. Stock',
                selector: (row) => row.min_stock,
                sortable: true,
                right: true,
            },
            {
                name: 'Unit',
                selector: (row) => row.unit,
                sortable: true,
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
                    placeholder="Filter inventory..."
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
                        Add Item
                    </button>
                </div>
            </div>
        );
    }, [filterText, handleClearFilter, openCreateModal]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Inventory</h2>}
        >
            <Head title="Inventory - WanWokabaot Connect" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    Inventory Items
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Manage your product inventory.
                                </p>
                            </div>
                            {/* Add Item button is now in SubHeaderComponent */}
                        </div>
                        <div className="p-6 bg-white border-b border-gray-200">
                            <DataTable
                                columns={columns}
                                data={filteredProducts}
                                pagination
                                paginationPerPage={10}
                                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                                highlightOnHover
                                pointerOnHover
                                customStyles={customStyles}
                                subHeader
                                subHeaderComponent={SubHeaderComponent}
                                persistTableHead
                                noDataComponent="No inventory items found"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit Product Modal */}
            {showingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {editingProduct ? 'Edit Item' : 'Add Item'}
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.category}
                                        onChange={(e) =>
                                            setData('category', e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.category && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.category}
                                        </p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Selling Price
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.selling_price}
                                            onChange={(e) =>
                                                setData(
                                                    'selling_price',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.selling_price && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.selling_price}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Cost Price
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.cost_price}
                                            onChange={(e) =>
                                                setData(
                                                    'cost_price',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.cost_price && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.cost_price}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Current Stock
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={data.current_stock}
                                            onChange={(e) =>
                                                setData(
                                                    'current_stock',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.current_stock && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.current_stock}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Minimum Stock
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={data.min_stock}
                                            onChange={(e) =>
                                                setData(
                                                    'min_stock',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                        {errors.min_stock && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.min_stock}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Unit <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.unit}
                                        onChange={(e) =>
                                            setData('unit', e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.unit && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.unit}
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
                                    {editingProduct ? 'Save Changes' : 'Add Item'}
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
                message={productToDelete ? `Are you sure you want to delete item "${productToDelete.name}"? This action cannot be undone.` : ''}
            />
        </AuthenticatedLayout>
    );
}