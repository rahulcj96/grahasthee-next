'use client';

import { useStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
    const { cart, removeFromCart, updateCartQuantity, clearCart } = useStore();

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="cartDrawer" aria-labelledby="cartDrawerLabel">
            <div className="offcanvas-header border-bottom">
                <h5 className="offcanvas-title text-uppercase fw-bold" id="cartDrawerLabel">Your Cart ({cart.length})</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body d-flex flex-column">
                {cart.length === 0 ? (
                    <div className="text-center my-auto">
                        <p className="text-muted">Your cart is empty</p>
                        <Link href="/shop" data-bs-dismiss="offcanvas" className="btn btn-dark text-uppercase px-4 py-2">Start Shopping</Link>
                    </div>
                ) : (
                    <>
                        <div className="cart-items flex-grow-1 overflow-auto pe-2">
                            {cart.map((item) => (
                                <div key={item.id} className="cart-item d-flex gap-3 mb-4 last-child-mb-0 pb-3 border-bottom">
                                    <div className="cart-item-image position-relative border rounded" style={{ width: '80px', height: '100px', flexShrink: 0 }}>
                                        <Image
                                            src={item.image_url || '/placeholder.webp'}
                                            alt={item.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="rounded"
                                        />
                                    </div>
                                    <div className="cart-item-content flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                            <h6 className="text-uppercase small fw-bold mb-0 pe-3">{item.title}</h6>
                                            <button
                                                className="btn-close small"
                                                style={{ fontSize: '0.7rem' }}
                                                onClick={() => removeFromCart(item.id)}
                                            ></button>
                                        </div>
                                        <div className="text-muted small mb-2">₹{parseFloat(item.price).toLocaleString()}</div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="quantity-toggle d-flex align-items-center border rounded">
                                                <button
                                                    className="btn btn-sm btn-link text-dark p-0 px-2"
                                                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                                >-</button>
                                                <span className="small px-2">{item.quantity}</span>
                                                <button
                                                    className="btn btn-sm btn-link text-dark p-0 px-2"
                                                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                                >+</button>
                                            </div>
                                            <div className="fw-bold small">₹{(item.price * item.quantity).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="cart-footer mt-auto pt-4 border-top">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-uppercase fw-bold">Subtotal</span>
                                <span className="h5 fw-bold mb-0">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <Link
                                href="/checkout"
                                className="btn btn-dark w-100 py-3 text-uppercase fw-bold mb-2 shadow-sm"
                                data-bs-dismiss="offcanvas"
                            >
                                Checkout
                            </Link>
                            <button
                                className="btn btn-link w-100 text-muted small text-decoration-none"
                                onClick={clearCart}
                            >Clear Cart</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
