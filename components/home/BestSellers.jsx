"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "../Reveal";

export default function BestSellers({ products = [] }) {
    if (!products || products.length === 0) return null;

    return (
        <section
            id="best-sellers"
            className="best-sellers product-carousel py-5 position-relative overflow-hidden"
        >
            <div className="container">
                <Reveal className="d-flex flex-wrap justify-content-between align-items-center mt-5 mb-3">
                    <h4 className="text-uppercase">Best Selling Items</h4>
                    <Link href="/shop" className="btn-link">
                        View All Products
                    </Link>
                </Reveal>
                <Reveal animation="zoom-out" className="position-relative">
                    <Swiper
                        modules={[ Navigation ]}
                        spaceBetween={30}
                        slidesPerView={1}
                        observer={true}
                        observeParents={true}
                        navigation={{
                            nextEl: ".icon-arrow-right",
                            prevEl: ".icon-arrow-left",
                        }}
                        breakpoints={{
                            1200: { slidesPerView: 4 },
                            992: { slidesPerView: 3 },
                            768: { slidesPerView: 2 },
                        }}
                        className="product-swiper"
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
                </Reveal>
            </div>
        </section>
    );
}
