'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OrdersPage() {
    const [ orders, setOrders ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/auth');
                return;
            }

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (data) setOrders(data);
            setLoading(false);
        };

        fetchOrders();
    }, [ router ]);

    if (loading) return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <main className="min-vh-100 bg-light py-5">
                <div className="container">
                    <h2 className="text-uppercase fw-bold mb-5 text-center">My Order History</h2>
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-10">
                            {orders.length === 0 ? (
                                <div className="text-center bg-white p-5 border rounded shadow-sm">
                                    <p className="text-muted mb-4">You haven't placed any orders yet.</p>
                                    <button onClick={() => router.push('/shop')} className="btn btn-dark text-uppercase px-4">Browse Shop</button>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-4">
                                    {orders.map((order) => (
                                        <div key={order.id} className="bg-white p-4 border rounded shadow-sm" data-aos="fade-up">
                                            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 border-bottom pb-3 g-3">
                                                <div>
                                                    <div className="small text-muted text-uppercase mb-1">Order ID</div>
                                                    <div className="fw-bold fs-5 text-uppercase">{order.id.substring(0, 8)}</div>
                                                </div>
                                                <div>
                                                    <div className="small text-muted text-uppercase mb-1">Date</div>
                                                    <div className="fw-bold">{new Date(order.created_at).toLocaleDateString()}</div>
                                                </div>
                                                <div>
                                                    <div className="small text-muted text-uppercase mb-1">Total</div>
                                                    <div className="fw-bold">₹{order.total_amount.toLocaleString()}</div>
                                                </div>
                                                <div>
                                                    <span className={`badge text-uppercase p-2 ${order.status === 'pending' ? 'bg-warning text-dark' : 'bg-success'}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="order-items">
                                                <h6 className="small text-uppercase fw-bold text-muted mb-3">Items Purchased</h6>
                                                <div className="row g-3">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="col-12 col-md-6">
                                                            <div className="d-flex align-items-center gap-3 p-2 border rounded bg-light-subtle">
                                                                <div className="position-relative border rounded overflow-hidden" style={{ width: '50px', height: '50px', flexShrink: 0 }}>
                                                                    <Image src={item.image_url || '/placeholder.webp'} alt={item.title} fill style={{ objectFit: 'cover' }} />
                                                                </div>
                                                                <div className="flex-grow-1 min-width-0">
                                                                    <div className="small fw-bold text-truncate text-uppercase">{item.title}</div>
                                                                    <div className="small text-muted">Qty: {item.quantity} × ₹{item.price}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                                                <div className="small text-muted">
                                                    Payment via: <span className="text-dark fw-bold text-uppercase">{order.payment_method}</span>
                                                </div>
                                                <button className="btn btn-sm btn-outline-dark text-uppercase small">Need Help?</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
