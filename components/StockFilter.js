'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function StockFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const inStock = searchParams.get('inStock') === 'true';

    const handleChange = (e) => {
        const checked = e.target.checked;
        const params = new URLSearchParams(searchParams);
        if (checked) {
            params.set('inStock', 'true');
        } else {
            params.delete('inStock');
        }
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className="form-check">
            <input
                className="form-check-input"
                type="checkbox"
                id="inStock"
                checked={inStock}
                onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="inStock">
                In Stock Only
            </label>
        </div>
    );
}
