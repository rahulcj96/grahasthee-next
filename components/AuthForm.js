'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
    const [ isLogin, setIsLogin ] = useState(true);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ message, setMessage ] = useState(null);
    const router = useRouter();

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ fullName, setFullName ] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isLogin) {
                const { error: loginError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (loginError) throw loginError;
                router.push('/');
            } else {
                const { error: signupError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (signupError) throw signupError;
                setMessage('Check your email for the confirmation link!');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form p-4 border rounded bg-white shadow-sm" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2 className="text-center text-uppercase fw-bold mb-4">
                {isLogin ? 'Login' : 'Sign Up'}
            </h2>

            {error && <div className="alert alert-danger small">{error}</div>}
            {message && <div className="alert alert-success small">{message}</div>}

            <form onSubmit={handleAuth}>
                {!isLogin && (
                    <div className="mb-3">
                        <label className="form-label small text-uppercase fw-bold text-muted">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required={!isLogin}
                            placeholder="John Doe"
                        />
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label small text-uppercase fw-bold text-muted">Email Address</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="email@example.com"
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label small text-uppercase fw-bold text-muted">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-dark w-100 py-3 text-uppercase fw-bold mb-3 shadow-sm"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
                </button>

                <div className="text-center small">
                    <span className="text-muted">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </span>
                    <button
                        type="button"
                        className="btn btn-link text-dark fw-bold p-0 ms-1 text-decoration-none"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </div>
            </form>
        </div>
    );
}
