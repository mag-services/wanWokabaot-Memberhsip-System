import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    return (
        <nav className="mt-4 flex items-center justify-between">
            <div className="flex flex-1 justify-between sm:justify-end">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url || '#'} // Use # for null URLs
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md ${link.active
                                ? 'bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                        ${link.label.includes('Previous') || link.label.includes('Next') ? 'mx-1' : ''}
                        `}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        preserveScroll
                    />
                ))}
            </div>
        </nav>
    );
}
