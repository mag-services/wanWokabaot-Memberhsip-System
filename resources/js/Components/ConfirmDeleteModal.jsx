import React from 'react';
import { Transition } from '@headlessui/react';

export default function ConfirmDeleteModal({
    show = false,
    onClose,
    onConfirm,
    title = 'Confirm Deletion',
    message = 'Are you sure you want to delete this item? This action cannot be undone.',
}) {
    return (
        <Transition show={show} as={React.Fragment}>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                aria-labelledby="modal-title"
                role="dialog"
                aria-modal="true"
            >
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <h3
                            className="text-lg font-medium leading-6 text-gray-900"
                            id="modal-title"
                        >
                            {title}
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">{message}</p>
                        </div>

                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </Transition.Child>
            </div>
        </Transition>
    );
}
