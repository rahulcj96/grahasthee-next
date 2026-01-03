'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import Reveal from '@/components/Reveal';

export default function ProfilePage() {
    const [ loading, setLoading ] = useState(true);
    const [ updating, setUpdating ] = useState(false);
    const [ user, setUser ] = useState(null);
    const [ profile, setProfile ] = useState({
        full_name: '',
        phone: '',
        address: '',
        city: '',
        pincode: ''
    });
    const [ message, setMessage ] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const getProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push('/auth');
                return;
            }

            setUser(session.user);

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (data) {
                setProfile({
                    full_name: data.full_name || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    city: data.city || '',
                    pincode: data.pincode || ''
                });
            }
            setLoading(false);
        };

        getProfile();
    }, [ router ]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage(null);

        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                ...profile,
                updated_at: new Date().toISOString(),
            });

        if (error) {
            setMessage({ type: 'danger', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        }
        setUpdating(false);
    };

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
                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-8">
                            <Reveal animation="fade-up">
                                <div className="bg-white p-4 p-md-5 border rounded shadow-sm">
                                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                        <h2 className="text-uppercase fw-bold mb-0">My Profile</h2>
                                        <span className="badge bg-dark text-uppercase">{user?.email}</span>
                                    </div>

                                    {message && (
                                        <div className={`alert alert-${message.type} small fade show`} role="alert">
                                            {message.text}
                                        </div>
                                    )}

                                    <form onSubmit={handleUpdate}>
                                        <div className="row g-3 mb-4">
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small text-uppercase fw-bold text-muted">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={profile.full_name}
                                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small text-uppercase fw-bold text-muted">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    value={profile.phone}
                                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                    placeholder="+91 99999 99999"
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small text-uppercase fw-bold text-muted">Street Address</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    value={profile.address}
                                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                                    placeholder="Flat/House No., Colony, Area"
                                                ></textarea>
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small text-uppercase fw-bold text-muted">City</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={profile.city}
                                                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                                    placeholder="Enter your city"
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <label className="form-label small text-uppercase fw-bold text-muted">Pincode</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={profile.pincode}
                                                    onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                                                    placeholder="6-digit pincode"
                                                />
                                            </div>
                                        </div>

                                        <div className="d-grid">
                                            <button
                                                type="submit"
                                                className="btn btn-dark py-3 text-uppercase fw-bold shadow-sm"
                                                disabled={updating}
                                            >
                                                {updating ? 'Saving Changes...' : 'Save Profile'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
