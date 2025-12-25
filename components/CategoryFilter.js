'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function CategoryFilter({ categories }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category') || '';

    const handleChange = (e) => {
        const value = e.target.value;
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('category', value);
        } else {
            params.delete('category');
        }
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <select
            className="form-select form-select-sm d-inline-block w-auto"
            value={currentCategory}
            onChange={handleChange}
        >
            <option value="">All Products</option>
            {categories.map(category => (
                <option key={category.id} value={category.slug}>
                    {category.title}
                </option>
            ))}
        </select>
    );
}
