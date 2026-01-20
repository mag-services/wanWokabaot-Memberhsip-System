import React from 'react';
import { Transition } from '@headlessui/react';

export default function NotificationModal({
    show = false,
    onClose,
    title = 'Notification',
    message = '',
    type = 'info', // Can be 'info', 'success', 'warning', 'error'
}) {
    let bgColorClass = 'bg-blue-50';
    let textColorClass = 'text-blue-800';
    let ringColorClass = 'ring-blue-200';
    let svgColorClass = 'text-blue-400';

    if (type === 'success') {
        bgColorClass = 'bg-green-50';
        textColorClass = 'text-green-800';
        ringColorClass = 'ring-green-200';
        svgColorClass = 'text-green-400';
    } else if (type === 'warning') {
        bgColorClass = 'bg-yellow-50';
        textColorClass = 'text-yellow-800';
        ringColorClass = 'ring-yellow-200';
        svgColorClass = 'text-yellow-400';
    } else if (type === 'error') {
        bgColorClass = 'bg-red-50';
        textColorClass = 'text-red-800';
        ringColorClass = 'ring-red-200';
        svgColorClass = 'text-red-400';
    }

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
                    <div
                        className={`w-full max-w-md transform overflow-hidden rounded-lg ${bgColorClass} p-6 text-left align-middle shadow-xl ring-1 ${ringColorClass} transition-all`}
                    >
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {/* Icon based on type */}
                                {type === 'success' && (
                                    <svg
                                        className={`h-6 w-6 ${svgColorClass}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                )}
                                {type === 'error' && (
                                    <svg
                                        className={`h-6 w-6 ${svgColorClass}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                )}
                                {type === 'warning' && (
                                    <svg
                                        className={`h-6 w-6 ${svgColorClass}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                )}
                                {type === 'info' && (
                                    <svg
                                        className={`h-6 w-6 ${svgColorClass}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <h3 className={`text-lg font-medium ${textColorClass}`}>
                                    {title}
                                </h3>
                                <div className="mt-2 text-sm text-gray-500">
                                    <p>{message}</p>
                                </div>
                            </div>
                            <div className="ml-4 flex flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className={`inline-flex rounded-md p-1.5 ${bgColorClass} ${textColorClass} hover:${bgColorClass} focus:outline-none focus:ring-2 focus:ring-${svgColorClass.split('-')[1]}-600 focus:ring-offset-2`}
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
                </Transition.Child>
            </div>
        </Transition>
    );
}
