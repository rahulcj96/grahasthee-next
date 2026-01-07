"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";
import Reveal from "../Reveal";
import { resolveImageUrl } from "@/utils/imageUtils";

export default function Hero({ categories = [] }) {
    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <section id="billboard" className="bg-light py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <Reveal animation="fade-up">
                        <h1 className="section-title text-center mt-4">
                            Fresh Finds for Your Home
                        </h1>
                    </Reveal>
                    <Reveal animation="fade-up" delay={300} className="col-md-6 text-center">
                        <p>
                            Explore our thoughtfully curated selections of home essentials
                            designed to bring comfort, style, and a touch of luxury into your
                            everyday living. From cozy cotton pillow covers to elegant bath
                            towels and stylish handbags, find something beautiful for every
                            corner of your life.
                        </p>
                    </Reveal>
                </div>
                <Reveal animation="fade-up" delay={600} className="swiper main-swiper py-4">
                    <Swiper
                        modules={[ Navigation, Pagination, Autoplay ]}
                        spaceBetween={30}
                        slidesPerView={1}
                        observer={true}
                        observeParents={true}
                        pagination={{ clickable: true, el: ".swiper-pagination" }}
                        navigation={{
                            nextEl: ".icon-arrow-right",
                            prevEl: ".icon-arrow-left",
                        }}
                        autoplay={{ delay: 5000 }}
                        breakpoints={{
                            1400: { slidesPerView: 3 },
                            768: { slidesPerView: 2 },
                        }}
                    >
                        {categories.map((category) => (
                            <SwiperSlide key={category.id}>
                                <div className="banner-item image-zoom-effect">
                                    <Link href={`/shop?category=${category.slug}`} className="item-anchor">
                                        <div className="image-holder">
                                            <Image
                                                src={resolveImageUrl(category.image_url)}
                                                alt={category.title || 'Category'}
                                                width={387}
                                                height={580}
                                                className="img-fluid"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                    </Link>
                                    <div className="banner-content py-4">
                                        <h5 className="element-title text-uppercase">
                                            <Link href={`/shop?category=${category.slug}`} className="item-anchor">
                                                {category.title}
                                            </Link>
                                        </h5>
                                        <p>
                                            <b>{category.tagline}</b> <br />
                                            {category.description}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                        <div className="swiper-pagination"></div>
                    </Swiper>
                </Reveal>
            </div>
        </section>
    );
}
