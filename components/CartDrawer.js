'use client';

import { useStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
    const { cart, removeFromCart, updateCartQuantity, clearCart } = useStore();

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = () => {
        const phoneNumber = "918891888448"; // Updated to correct customer care number

        let message = `*New Order from Grahasthee*%0A%0A`;

        cart.forEach((item, index) => {
            message += `${index + 1}. *${item.title}*%0A`;
            message += `   Quantity: ${item.quantity}%0A`;
            message += `   Price: ₹${item.price.toLocaleString()}%0A%0A`;
        });

        message += `*Total Amount: ₹${subtotal.toLocaleString()}*%0A%0A`;
        message += `Please confirm my order.`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

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
                            <button
                                className="btn btn-dark w-100 py-3 text-uppercase fw-bold mb-2 d-flex align-items-center justify-content-center gap-2"
                                onClick={handleCheckout}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.445 0 .01 5.437 0 12.045c0 2.112.552 4.173 1.598 6.01L0 24l6.117-1.605a11.803 11.803 0 005.925 1.604h.005c6.605 0 12.04-5.437 12.045-12.045a11.83 11.83 0 00-3.41-8.452" />
                                </svg>
                                Checkout via WhatsApp
                            </button>
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
