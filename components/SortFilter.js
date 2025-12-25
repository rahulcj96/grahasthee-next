'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function SortFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'featured';

    const handleChange = (e) => {
        const value = e.target.value;
        const params = new URLSearchParams(searchParams);
        if (value && value !== 'featured') {
            params.set('sort', value);
        } else {
            params.delete('sort');
        }
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <select
            className="form-select form-select-sm d-inline-block w-auto"
            value={currentSort}
            onChange={handleChange}
        >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
        </select>
    );
}
