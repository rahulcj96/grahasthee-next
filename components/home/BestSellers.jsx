"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";

export default function BestSellers() {
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
                        <SwiperSlide>
                            <div className="product-item image-zoom-effect link-effect">
                                <div className="image-holder">
                                    <Link href="/product-detail">
                                        <Image
                                            src="/images/best-sellers/bath-towel-1.webp"
                                            alt="categories"
                                            width={300}
                                            height={300}
                                            className="product-image img-fluid"
                                            style={{ width: "100%", height: "auto" }}
                                        />
                                    </Link>
                                    <div className="product-content">
                                        <h5 className="text-uppercase fs-5 mt-3">
                                            <Link href="/product-detail">Solid Mint Green Towel</Link>
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="product-item image-zoom-effect link-effect">
                                <div className="image-holder">
                                    <Link href="/product-detail">
                                        <Image
                                            src="/images/best-sellers/mat.webp"
                                            alt="product"
                                            width={300}
                                            height={300}
                                            className="product-image img-fluid"
                                            style={{ width: "100%", height: "auto" }}
                                        />
                                    </Link>
                                    <div className="product-content">
                                        <h5 className="text-uppercase fs-5 mt-3">
                                            <Link href="/product-detail">Grey Scalloped Bath Mat</Link>
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="product-item image-zoom-effect link-effect">
                                <div className="image-holder">
                                    <Link href="/product-detail">
                                        <Image
                                            src="/images/best-sellers/bath-towel-2.webp"
                                            alt="categories"
                                            width={300}
                                            height={300}
                                            className="product-image img-fluid"
                                            style={{ width: "100%", height: "auto" }}
                                        />
                                    </Link>
                                    <div className="product-content">
                                        <h5 className="text-uppercase fs-5 mt-3">
                                            <Link href="/product-detail">
                                                Lightweight Turkish Bath Towel
                                            </Link>
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="product-item image-zoom-effect link-effect">
                                <div className="image-holder">
                                    <Link href="/product-detail">
                                        <Image
                                            src="/images/best-sellers/basket.webp"
                                            alt="categories"
                                            width={300}
                                            height={300}
                                            className="product-image img-fluid"
                                            style={{ width: "100%", height: "auto" }}
                                        />
                                    </Link>
                                    <div className="product-content">
                                        <h5 className="text-uppercase fs-5 mt-3">
                                            <Link href="/product-detail">
                                                Woven Storage Basket Set
                                            </Link>
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="product-item image-zoom-effect link-effect">
                                <div className="image-holder">
                                    <Link href="/product-detail">
                                        <Image
                                            src="/images/best-sellers/bath-towel-3.webp"
                                            alt="categories"
                                            width={300}
                                            height={300}
                                            className="product-image img-fluid"
                                            style={{ width: "100%", height: "auto" }}
                                        />
                                    </Link>
                                    <div className="product-content">
                                        <h5 className="text-uppercase fs-5 mt-3">
                                            <Link href="/product-detail">
                                                Artisan Woven Throw Blanket
                                            </Link>
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="product-item image-zoom-effect link-effect">
                                <div className="image-holder">
                                    <Link href="/product-detail">
                                        <Image
                                            src="/images/best-sellers/rug.webp"
                                            alt="categories"
                                            width={300}
                                            height={300}
                                            className="product-image img-fluid"
                                            style={{ width: "100%", height: "auto" }}
                                        />
                                    </Link>
                                    <div className="product-content">
                                        <h5 className="text-uppercase fs-5 mt-3">
                                            <Link href="/product-detail">Hand-Knotted Accent Rug</Link>
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
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
