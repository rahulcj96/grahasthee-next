"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/ProductCard";

export default function BestSellers() {
    const [ products, setProducts ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        async function fetchBestSellers() {
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    product_images!inner (
                        image_url,
                        alt_text,
                        is_primary
                    )
                `)
                .eq('is_best_seller', true)
                .eq('product_images.is_primary', true)
                .limit(10);

            if (error) {
                console.error('Error fetching best sellers:', error);
            } else {
                const transformedData = data.map(product => {
                    let imageUrl = product.product_images?.[ 0 ]?.image_url;
                    if (imageUrl && imageUrl.startsWith('https://grahasthee.com/assets/')) {
                        imageUrl = imageUrl.replace('https://grahasthee.com/assets/', '/');
                    }
                    return {
                        ...product,
                        image_url: imageUrl,
                        alt_text: product.product_images?.[ 0 ]?.alt_text
                    };
                });
                setProducts(transformedData);
            }
            setLoading(false);
        }

        fetchBestSellers();
    }, []);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-dark" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <section
            id="best-sellers"
            className="best-sellers product-carousel py-5 position-relative overflow-hidden"
        >
            <div className="container">
                <div className="d-flex flex-wrap justify-content-between align-items-center mt-5 mb-3">
                    <h4 className="text-uppercase">Best Selling Items</h4>
                    <Link href="/shop" className="btn-link">
                        View All Products
                    </Link>
                </div>
                <div className="position-relative">
                    <Swiper
                        modules={[ Navigation ]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation={{
                            nextEl: ".icon-arrow-right",
                            prevEl: ".icon-arrow-left",
                        }}
                        breakpoints={{
                            1200: { slidesPerView: 4 },
                            992: { slidesPerView: 3 },
                            768: { slidesPerView: 2 },
                        }}
                        className="product-swiper open-up"
                        data-aos="zoom-out"
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id}>
                                <ProductCard product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="icon-arrow icon-arrow-left">
                        <svg width="50" height="50" viewBox="0 0 24 24">
                            <use xlinkHref="#arrow-left"></use>
                        </svg>
                    </div>
                    <div className="icon-arrow icon-arrow-right">
                        <svg width="50" height="50" viewBox="0 0 24 24">
                            <use xlinkHref="#arrow-right"></use>
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}
