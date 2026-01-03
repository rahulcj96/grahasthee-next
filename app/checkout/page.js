'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useStore } from '@/lib/store';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CONTACT_INFO } from '@/lib/constants';

export default function CheckoutPage() {
    const { cart, clearCart } = useStore();
    const [ loading, setLoading ] = useState(true);
    const [ orderPlacing, setOrderPlacing ] = useState(false);
    const [ user, setUser ] = useState(null);
    const [ profile, setProfile ] = useState({
        full_name: '',
        phone: '',
        address: '',
        city: '',
        pincode: ''
    });
    const router = useRouter();

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth?redirect=/checkout');
                return;
            }
            setUser(session.user);

            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (data) setProfile(data);
            setLoading(false);
        };

        if (cart.length === 0) {
            router.push('/shop');
        } else {
            checkAuth();
        }
    }, [ cart, router ]);

    const handlePlaceOrder = async (method) => {
        if (!profile.address || !profile.phone) {
            alert('Please complete your profile details first.');
            router.push('/profile?redirect=/checkout');
            return;
        }

        setOrderPlacing(true);

        // 1. Create Order in Supabase
        const { data, error } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                total_amount: subtotal,
                payment_method: method,
                shipping_address: profile,
                items: cart,
                status: 'pending'
            })
            .select()
            .single();

        if (error) {
            alert('Error placing order: ' + error.message);
            setOrderPlacing(false);
            return;
        }

        // 2. Clear Cart
        const orderId = data.id;

        // 3. Trigger Payment/WhatsApp
        if (method === 'upi') {
            const upiId = "rahulcj96@okicici"; // Placeholder VPA
            const upiUrl = `upi://pay?pa=${upiId}&pn=Grahasthee&am=${subtotal}&cu=INR&tn=Order%20${orderId.substring(0, 8)}`;
            window.location.href = upiUrl;

            // For desktop browsers, might need a helper message
            setTimeout(() => {
                alert('UPI payment initiated. If your UPI app didn\'t open, please try on a mobile device.');
                router.push('/orders');
            }, 2000);
        } else {
            const phoneNumber = CONTACT_INFO.whatsappNumber;
            let message = `*New Order: ${orderId.substring(0, 8)}*%0A%0A`;
            message += `*Items:*%0A`;
            cart.forEach(item => {
                message += `- ${item.title} (x${item.quantity}) - ₹${item.price}%0A`;
            });
            message += `%0A*Total: ₹${subtotal}*%0A`;
            message += `*Shipping to:*%0A${profile.full_name}%0A${profile.address}, ${profile.city} - ${profile.pincode}%0AContact: ${profile.phone}`;

            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            window.open(whatsappUrl, '_blank');
            router.push('/orders');
        }

        clearCart();
    };

    if (loading) return null;

    return (
        <>
            <Header />
            <main className="min-vh-100 bg-light py-5">
                <div className="container">
                    <h1 className="text-uppercase fw-bold mb-5 text-center">Checkout</h1>
                    <div className="row g-4">
                        <div className="col-12 col-lg-8">
                            {/* Shipping Details */}
                            <div className="bg-white p-4 border rounded shadow-sm mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="text-uppercase fw-bold mb-0">Shipping Details</h5>
                                    <button onClick={() => router.push('/profile?redirect=/checkout')} className="btn btn-sm btn-outline-dark text-uppercase small py-1 px-3">Edit</button>
                                </div>
                                {profile.address ? (
                                    <div className="small text-muted">
                                        <p className="mb-1 fw-bold text-dark">{profile.full_name}</p>
                                        <p className="mb-1">{profile.address}</p>
                                        <p className="mb-1">{profile.city} - {profile.pincode}</p>
                                        <p className="mb-0">Phone: {profile.phone}</p>
                                    </div>
                                ) : (
                                    <div className="alert alert-warning py-2 small mb-0">Please add your shipping address in your profile.</div>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="bg-white p-4 border rounded shadow-sm">
                                <h5 className="text-uppercase fw-bold mb-4">Order Items</h5>
                                {cart.map((item) => (
                                    <div key={item.id} className="d-flex gap-3 mb-3 pb-3 border-bottom last-child-mb-0 last-child-border-0">
                                        <div className="position-relative border rounded" style={{ width: '60px', height: '70px', flexShrink: 0 }}>
                                            <Image src={item.image_url || '/placeholder.webp'} alt={item.title} fill style={{ objectFit: 'cover' }} className="rounded" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="small fw-bold text-uppercase mb-1">{item.title}</h6>
                                            <div className="small text-muted">₹{item.price.toLocaleString()} x {item.quantity}</div>
                                        </div>
                                        <div className="fw-bold small">₹{(item.price * item.quantity).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-12 col-lg-4">
                            <div className="bg-white p-4 border rounded shadow-sm sticky-lg-top" style={{ top: '100px', zIndex: 1 }}>
                                <h5 className="text-uppercase fw-bold mb-4">Order Total</h5>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-muted small text-uppercase">Subtotal</span>
                                    <span className="fw-bold small">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <span className="text-muted small text-uppercase">Shipping</span>
                                    <span className="text-success small fw-bold text-uppercase">Free</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-4 border-top pt-3">
                                    <span className="fw-bold text-uppercase">Total</span>
                                    <span className="h4 fw-bold mb-0">₹{subtotal.toLocaleString()}</span>
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        className="btn btn-dark py-3 text-uppercase fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                                        onClick={() => handlePlaceOrder('upi')}
                                        disabled={orderPlacing || !profile.address}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                        </svg>
                                        Pay via UPI (Instant)
                                    </button>
                                    <button
                                        className="btn btn-outline-dark py-3 text-uppercase fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                                        onClick={() => handlePlaceOrder('whatsapp')}
                                        disabled={orderPlacing || !profile.address}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.445 0 .01 5.437 0 12.045c0 2.112.552 4.173 1.598 6.01L0 24l6.117-1.605a11.803 11.803 0 005.925 1.604h.005c6.605 0 12.04-5.437 12.045-12.045a11.83 11.83 0 00-3.41-8.452" />
                                        </svg>
                                        Order on WhatsApp
                                    </button>
                                </div>
                                <p className="text-center text-muted small mt-4 mb-0">Secure Transaction with Grahasthee</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
