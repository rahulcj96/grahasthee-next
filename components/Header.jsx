"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
    const { cart, wishlist, setIsCartOpen } = useStore();
    const pathname = usePathname();
    const [ mounted, setMounted ] = useState(false);
    const [ isMenuOpen, setIsMenuOpen ] = useState(false);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
        setIsCartOpen(false);
    }, [ pathname, setIsCartOpen ]);

    // Prevent hydration mismatch by waiting for mount
    useEffect(() => {
        setMounted(true);
    }, []);



    const cartCount = mounted ? cart.length : 0;
    const wishlistCount = mounted ? wishlist.length : 0;

    return (
        <>
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
                                    onClick={() => setIsCartOpen(true)}
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

                            <button
                                className="navbar-toggler border-0 shadow-none"
                                type="button"
                                onClick={() => setIsMenuOpen(true)}
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                        </div>

                        <div className="col-lg-auto order-lg-2">
                            <div className="collapse navbar-collapse justify-content-center">
                                <ul className="navbar-nav gap-1 gap-lg-5">
                                    <li className="nav-item">
                                        <Link className="nav-link" href="/">Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" href="/shop">Shop</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" href="#footer">Contact</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Offcanvas - Managed via React State */}
            <div
                className={`offcanvas offcanvas-end ${isMenuOpen ? 'show' : ''}`}
                style={{
                    visibility: isMenuOpen ? 'visible' : 'hidden',
                    display: 'block'
                }}
                tabIndex="-1"
                id="offcanvasNavbar"
            >
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title fw-bold text-uppercase">Menu</h5>
                    <button
                        type="button"
                        className="btn-close text-reset shadow-none"
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Close"
                    ></button>
                </div>

                <div className="offcanvas-body">
                    <ul className="navbar-nav gap-2">
                        <li className="nav-item">
                            <Link
                                className="nav-link d-flex align-items-center gap-3 py-3 border-bottom"
                                href="/"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <svg width="24" height="24"><use xlinkHref="#home"></use></svg>
                                <span>Home</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link d-flex align-items-center gap-3 py-3 border-bottom"
                                href="/shop"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <svg width="24" height="24"><use xlinkHref="#shopping-bag"></use></svg>
                                <span>Shop</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link d-flex align-items-center gap-3 py-3 border-bottom"
                                href="#footer"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <svg width="24" height="24"><use xlinkHref="#mail"></use></svg>
                                <span>Contact</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Managed Backdrop */}
            {isMenuOpen && (
                <div
                    className="offcanvas-backdrop fade show"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ zIndex: 1040 }}
                ></div>
            )}
        </>
    );
}
