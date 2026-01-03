'use client';

import Link from 'next/link';

export default function Pagination({ currentPage, totalPages, searchParams }) {
    if (totalPages <= 1) return null;

    const createPageUrl = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page);
        return `/shop?${params.toString()}`;
    };

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <nav aria-label="Product pagination" className="mt-5">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
                    <Link
                        className="page-link shadow-none"
                        href={createPageUrl(currentPage - 1)}
                        aria-disabled={currentPage <= 1}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </Link>
                </li>

                {pages.map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <Link
                            className="page-link shadow-none"
                            href={createPageUrl(page)}
                            style={currentPage === page ? { backgroundColor: '#000', borderColor: '#000' } : { color: '#000' }}
                        >
                            {page}
                        </Link>
                    </li>
                ))}

                <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                    <Link
                        className="page-link shadow-none"
                        href={createPageUrl(currentPage + 1)}
                        aria-disabled={currentPage >= totalPages}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
