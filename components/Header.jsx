"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Header() {
    const { cart, wishlist } = useStore();
    const [ mounted, setMounted ] = useState(false);
    const [ user, setUser ] = useState(null);
    const router = useRouter();

    // Prevent hydration mismatch by waiting for mount
    useEffect(() => {
        setMounted(true);

        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const cartCount = mounted ? cart.length : 0;
    const wishlistCount = mounted ? wishlist.length : 0;

    return (
        <nav className="navbar navbar-expand-lg bg-light text-uppercase fs-6 p-3 border-bottom align-items-center sticky-top">
            <div className="container-fluid">
                <div className="row justify-content-between align-items-center w-100 g-0">
                    <div className="col-auto">
                        <Link className="navbar-brand text-white" href="/">
                            <Image
                                src="/images/logo.webp"
                                alt="Logo"
                                width={120}
                                height={40}
                                style={{ objectFit: "contain" }}
                                priority
                            />
                        </Link>
                    </div>

                    <div className="col-auto d-flex align-items-center gap-3 order-lg-3">
                        <div className="header-actions d-flex align-items-center gap-3">
                            {mounted && (
                                <>
                                    {user ? (
                                        <div className="dropdown">
                                            <button
                                                className="btn p-0 border-0 dropdown-toggle hide-caret"
                                                id="userDropdown"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24">
                                                    <use xlinkHref="#user"></use>
                                                </svg>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2" aria-labelledby="userDropdown">
                                                <li><div className="dropdown-item-text small text-muted border-bottom mb-2 pb-2">{user.email}</div></li>
                                                <li><Link className="dropdown-item rounded" href="/profile">My Profile</Link></li>
                                                <li><Link className="dropdown-item rounded" href="/orders">My Orders</Link></li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><button className="dropdown-item rounded text-danger" onClick={handleLogout}>Logout</button></li>
                                            </ul>
                                        </div>
                                    ) : (
                                        <Link href="/auth" className="nav-link p-0" title="Login / Signup">
                                            <svg width="24" height="24" viewBox="0 0 24 24">
                                                <use xlinkHref="#user"></use>
                                            </svg>
                                        </Link>
                                    )}
                                </>
                            )}

                            <Link href="/wishlist" className="nav-link position-relative p-0">
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                    <use xlinkHref="#heart"></use>
                                </svg>
                                {wishlistCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark" style={{ fontSize: '0.6rem' }}>
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            <button
                                className="btn p-0 position-relative border-0"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#cartDrawer"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                    <use xlinkHref="#cart"></use>
                                </svg>
                                {cartCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark" style={{ fontSize: '0.6rem' }}>
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>

                    <div className="col-lg-auto order-lg-2">
                        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                            <div className="offcanvas-header border-bottom">
                                <h5 className="offcanvas-title fw-bold text-uppercase" id="offcanvasNavbarLabel">Menu</h5>
                                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>

                            <div className="offcanvas-body">
                                <ul className="navbar-nav justify-content-center flex-grow-1 gap-1 gap-lg-5">
                                    <li className="nav-item">
                                        <Link className="nav-link" href="/">Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" href="/shop">Shop</Link>
                                    </li>
                                    {user && (
                                        <>
                                            <li className="nav-item d-lg-none">
                                                <Link className="nav-link" href="/profile">My Profile</Link>
                                            </li>
                                            <li className="nav-item d-lg-none">
                                                <Link className="nav-link" href="/orders">My Orders</Link>
                                            </li>
                                        </>
                                    )}
                                    <li className="nav-item">
                                        <Link className="nav-link" href="#footer">Contact</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
