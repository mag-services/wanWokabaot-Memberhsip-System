import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';

export default function Index() {
    const { auth, products = [], sortBy, sortDirection } = usePage().props;

    const [showingModal, setShowingModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showingConfirmDeleteModal, setShowingConfirmDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

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

    const handleDelete = (product) => {
        setProductToDelete(product);
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

    const handleSort = (column) => {
        const newDirection =
            sortBy === column && sortDirection === 'asc' ? 'desc' : 'asc';
        router.get(route('web.inventory.index'), {
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
                                    Manage your product inventory. Click column
                                    headers to sort.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                            >
                                Add Item
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
                                                onClick={() =>
                                                    handleSort('category')
                                                }
                                            >
                                                <div className="flex items-center">
                                                    Category
                                                    <SortIcon column="category" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() =>
                                                    handleSort('selling_price')
                                                }
                                            >
                                                <div className="flex items-center justify-end">
                                                    Selling Price
                                                    <SortIcon column="selling_price" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() =>
                                                    handleSort('cost_price')
                                                }
                                            >
                                                <div className="flex items-center justify-end">
                                                    Cost Price
                                                    <SortIcon column="cost_price" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() =>
                                                    handleSort('current_stock')
                                                }
                                            >
                                                <div className="flex items-center justify-end">
                                                    Current Stock
                                                    <SortIcon column="current_stock" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() =>
                                                    handleSort('min_stock')
                                                }
                                            >
                                                <div className="flex items-center justify-end">
                                                    Min. Stock
                                                    <SortIcon column="min_stock" />
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleSort('unit')}
                                            >
                                                <div className="flex items-center">
                                                    Unit
                                                    <SortIcon column="unit" />
                                                </div>
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
                                        {products.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="8"
                                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                                >
                                                    No inventory items found.
                                                </td>
                                            </tr>
                                        ) : (
                                            products.map((product) => (
                                                <tr key={product.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {product.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {product.category}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                        {product.selling_price}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                        {product.cost_price}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                        {product.current_stock}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                                        {product.min_stock}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {product.unit}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        product,
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
                                                                        product,
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