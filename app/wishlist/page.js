'use client';

import { useStore } from '@/lib/store';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function WishlistPage() {
    const { wishlist } = useStore();
    const [ mounted, setMounted ] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const wishlistItems = mounted ? wishlist : [];

    return (
        <>
            <Header />
            <main>
                <section className="wishlist-page py-5 min-vh-100">
                    <div className="container">
                        <div className="text-center mb-5">
                            <h1 className="text-uppercase fw-bold display-4">My Wishlist</h1>
                            <p className="text-muted">Keep track of items you love</p>
                        </div>

                        {wishlistItems.length === 0 ? (
                            <div className="text-center py-5">
                                <div className="mb-4">
                                    <svg width="64" height="64" viewBox="0 0 24 24" className="text-muted opacity-25">
                                        <use xlinkHref="#heart"></use>
                                    </svg>
                                </div>
                                <h3 className="h4 text-uppercase fw-bold mb-3">Your wishlist is empty</h3>
                                <p className="text-muted mb-4">You haven't saved any items yet. Start exploring our collection!</p>
                                <Link href="/shop" className="btn btn-dark text-uppercase px-5 py-3 fw-bold shadow-sm">
                                    Browse Shop
                                </Link>
                            </div>
                        ) : (
                            <div className="row g-4">
                                {wishlistItems.map((product) => (
                                    <div key={product.id} className="col-6 col-md-4 col-lg-3">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
