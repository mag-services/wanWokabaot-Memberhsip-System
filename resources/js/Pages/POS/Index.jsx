import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import NotificationModal from '@/Components/NotificationModal';

export default function POS() {
    const { products: initialProducts } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [showingNotificationModal, setShowingNotificationModal] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('info');

    const filteredProducts = useMemo(() => {
        if (!searchTerm) {
            return initialProducts;
        }
        return initialProducts.filter(
            (product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [searchTerm, initialProducts]);

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const updateCartQuantity = (productId, quantity) => {
        setCart((prevCart) => {
            if (quantity <= 0) {
                return prevCart.filter((item) => item.id !== productId);
            }
            return prevCart.map((item) =>
                item.id === productId ? { ...item, quantity: quantity } : item,
            );
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const calculateTotal = useMemo(() => {
        return cart.reduce(
            (total, item) => total + item.selling_price * item.quantity,
            0,
        );
    }, [cart]);

    const handleCheckout = () => {
        // Placeholder for actual checkout logic
        if (cart.length === 0) {
            setNotificationMessage('Your cart is empty.');
            setNotificationType('warning');
            setShowingNotificationModal(true);
            return;
        }

        setNotificationMessage(
            `Checking out with total: $${calculateTotal.toFixed(2)} using ${paymentMethod}. (This is a placeholder.)`,
        );
        setNotificationType('info');
        setShowingNotificationModal(true);
        setCart([]); // Clear cart after checkout (placeholder)
    };

    const closeNotificationModal = () => {
        setShowingNotificationModal(false);
        setNotificationMessage('');
        setNotificationType('info');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Point of Sale
                </h2>
            }
        >
            <Head title="Point of Sale - WanWokabaot Connect" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex h-[80vh] overflow-hidden rounded-lg bg-white shadow-sm">
                        {/* Product List Section */}
                        <div className="w-2/3 border-r border-gray-200 p-6">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                Products
                            </h3>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mb-4 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <div className="h-[calc(100%-100px)] overflow-y-auto pr-2">
                                {filteredProducts.length === 0 ? (
                                    <p className="text-sm text-gray-500">
                                        No products found.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        {filteredProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className="cursor-pointer rounded-lg border border-gray-200 p-4 shadow-sm transition hover:bg-gray-50"
                                                onClick={() =>
                                                    addToCart(product)
                                                }
                                            >
                                                <p className="text-sm font-medium text-gray-900">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Stock: {product.current_stock}
                                                </p>
                                                <p className="mt-1 text-sm font-semibold text-indigo-600">
                                                    ${product.selling_price}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cart and Checkout Section */}
                        <div className="w-1/3 p-6">
                            <h3 className="mb-4 text-lg font-medium text-gray-900">
                                Cart
                            </h3>
                            <div className="h-[calc(100%-220px)] overflow-y-auto pr-2">
                                {cart.length === 0 ? (
                                    <p className="text-sm text-gray-500">
                                        Cart is empty.
                                    </p>
                                ) : (
                                    <ul className="space-y-3">
                                        {cart.map((item) => (
                                            <li
                                                key={item.id}
                                                className="flex items-center justify-between rounded-md bg-gray-50 p-3"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        ${item.selling_price}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateCartQuantity(
                                                                item.id,
                                                                parseInt(
                                                                    e.target.value,
                                                                ),
                                                            )
                                                        }
                                                        className="w-16 rounded-md border-gray-300 text-center text-sm shadow-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeFromCart(
                                                                item.id,
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <svg
                                                            className="h-5 w-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="mt-4 border-t border-gray-200 pt-4">
                                <div className="mb-3 flex items-center justify-between text-lg font-semibold text-gray-900">
                                    <span>Total:</span>
                                    <span>${calculateTotal.toFixed(2)}</span>
                                </div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Payment Method
                                </label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                    className="mb-4 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="mpesa">M-Pesa</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={handleCheckout}
                                    className="w-full rounded-md bg-indigo-600 px-4 py-2 text-lg font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                >
                                    Process Sale
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <NotificationModal
                show={showingNotificationModal}
                onClose={closeNotificationModal}
                message={notificationMessage}
                type={notificationType}
            />
        </AuthenticatedLayout>
    );
}
