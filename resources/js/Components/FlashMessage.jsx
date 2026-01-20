import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash?.success]);

    if (!show || !flash?.success) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5">
            <div className="rounded-md bg-green-50 p-4 shadow-lg ring-1 ring-green-200">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg
                            className="h-5 w-5 text-green-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a1 1 0 00-1.714-1.15L9.75 9.75l-1.393-1.393a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3.5-3.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                            {flash.success}
                        </p>
                    </div>
                    <div className="ml-auto pl-3">
                        <button
                            type="button"
                            onClick={() => setShow(false)}
                            className="inline-flex rounded-md bg-green-50 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                        >
                            <span className="sr-only">Dismiss</span>
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
