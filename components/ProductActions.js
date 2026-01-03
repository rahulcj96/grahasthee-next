'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function ProductActions({ product }) {
    const { stock_quantity: stockQuantity } = product;
    const [ quantity, setQuantity ] = useState(1);
    const { addToCart, removeFromCart, toggleWishlist, wishlist, cart, setIsCartOpen } = useStore();
    const [ mounted, setMounted ] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isInWishlist = mounted && wishlist.some(item => item.id === product.id);
    const isInCart = mounted && cart.some(item => item.id === product.id);

    const handleIncrement = () => {
        if (quantity < stockQuantity && quantity < 10) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    return (
        <div className="product-actions d-flex gap-3 mb-4">
            <div className="quantity-selector d-flex align-items-center border rounded p-1" style={{ width: '120px' }}>
                <button
                    className="btn btn-link text-dark p-2"
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                >
                    <svg width="16" height="16"><use xlinkHref="#minus"></use></svg>
                </button>
                <input
                    type="number"
                    className="form-control border-0 text-center p-0"
                    value={quantity}
                    readOnly
                />
                <button
                    className="btn btn-link text-dark p-2"
                    onClick={handleIncrement}
                    disabled={quantity >= stockQuantity || quantity >= 10}
                >
                    <svg width="16" height="16"><use xlinkHref="#plus"></use></svg>
                </button>
            </div>
            <button
                className={`btn flex-fill py-3 text-uppercase fw-bold shadow-sm ${isInCart ? 'btn-outline-dark' : 'btn-dark'}`}
                id="add-to-cart"
                disabled={stockQuantity === 0}
                onClick={() => {
                    if (isInCart) {
                        removeFromCart(product.id);
                    } else {
                        addToCart(product, quantity);
                        setIsCartOpen(true);
                    }
                }}
            >
                {stockQuantity === 0 ? 'Out of Stock' : isInCart ? 'In Cart' : 'Add to Cart'}
            </button>
            <button
                className={`btn py-3 px-2 ${isInWishlist ? 'border-0' : 'btn-outline-dark shadow-sm'}`}
                style={isInWishlist ? { color: '#9e6218', background: 'transparent', boxShadow: 'none' } : {}}
                id="wishlist-btn"
                onClick={() => toggleWishlist(product)}
                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
                <svg width="28" height="28" viewBox="0 0 24 24">
                    <use xlinkHref={isInWishlist ? "#heart-solid" : "#heart"}></use>
                </svg>
            </button>
        </div>
    );
}
