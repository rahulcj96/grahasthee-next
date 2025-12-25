"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
    return (
        <section id="billboard" className="bg-light py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <h1 className="section-title text-center mt-4" data-aos="fade-up">
                        Fresh Finds for Your Home
                    </h1>
                    <div
                        className="col-md-6 text-center"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    >
                        <p>
                            Explore our thoughtfully curated selections of home essentials
                            designed to bring comfort, style, and a touch of luxury into your
                            everyday living. From cozy cotton pillow covers to elegant bath
                            towels and stylish handbags, find something beautiful for every
                            corner of your life.
                        </p>
                    </div>
                </div>
                <div className="swiper main-swiper py-4" data-aos="fade-up" data-aos-delay="600">
                    <Swiper
                        modules={[ Navigation, Pagination, Autoplay ]}
                        spaceBetween={30}
                        slidesPerView={1}
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
                        <SwiperSlide>
                            <div className="banner-item image-zoom-effect">
                                <div className="image-holder">
                                    <Image
                                        src="/images/collections/pillow-cover.webp"
                                        alt="product"
                                        width={387}
                                        height={580}
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="banner-content py-4">
                                    <h5 className="element-title text-uppercase">
                                        <Link href="#" className="item-anchor">
                                            Cotton Pillow Covers
                                        </Link>
                                    </h5>
                                    <p>
                                        <b>Pure cotton comfort.</b> <br />
                                        Refresh your bedroom with our range of soft, durable, and
                                        stylish pillow covers. Sleep beautifully!
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="banner-item image-zoom-effect">
                                <div className="image-holder">
                                    <Image
                                        src="/images/collections/handbags.webp"
                                        alt="product"
                                        width={387}
                                        height={580}
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="banner-content py-4">
                                    <h5 className="element-title text-uppercase">
                                        <Link href="#" className="item-anchor">
                                            Handbags
                                        </Link>
                                    </h5>
                                    <p>
                                        <b>The perfect accessory.</b> <br />
                                        Discover a collection of chic and functional handbags
                                        crafted for your daily needs and every occasion.
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="banner-item image-zoom-effect">
                                <div className="image-holder">
                                    <Image
                                        src="/images/collections/bath-towels.webp"
                                        alt="product"
                                        width={387}
                                        height={580}
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="banner-content py-4">
                                    <h5 className="element-title text-uppercase">
                                        <Link href="#" className="item-anchor">
                                            Luxe Linen Bath Towels
                                        </Link>
                                    </h5>
                                    <p>
                                        <b>Indulge in luxury.</b> <br />
                                        Wrap yourself in the finest linen and cotton blends. Highly
                                        absorbent, ultra-soft, and quick-drying.
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="banner-item image-zoom-effect">
                                <div className="image-holder">
                                    <Image
                                        src="/images/collections/cozy-corner.webp"
                                        alt="product"
                                        width={387}
                                        height={580}
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="banner-content py-4">
                                    <h5 className="element-title text-uppercase">
                                        <Link href="#" className="item-anchor">
                                            Cozy Corner
                                        </Link>
                                    </h5>
                                    <p>
                                        <b>Design your haven.</b> <br />
                                        Everything you need to create a comfortable, warm, and
                                        inviting space right in your own home.
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="banner-item image-zoom-effect">
                                <div className="image-holder">
                                    <Image
                                        src="/images/collections/pillow-cover.webp"
                                        alt="product"
                                        width={387}
                                        height={580}
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="banner-content py-4">
                                    <h5 className="element-title text-uppercase">
                                        <Link href="#" className="item-anchor">
                                            Cotton Pillow Covers
                                        </Link>
                                    </h5>
                                    <p>
                                        <b>Pure cotton comfort.</b> <br />
                                        Refresh your bedroom with our range of soft, durable, and
                                        stylish pillow covers. Sleep beautifully!
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="banner-item image-zoom-effect">
                                <div className="image-holder">
                                    <Image
                                        src="/images/collections/handbags.webp"
                                        alt="product"
                                        width={387}
                                        height={580}
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="banner-content py-4">
                                    <h5 className="element-title text-uppercase">
                                        <Link href="#" className="item-anchor">
                                            Handbags
                                        </Link>
                                    </h5>
                                    <p>
                                        <b>The perfect accessory.</b> <br />
                                        Discover a collection of chic and functional handbags
                                        crafted for your daily needs and every occasion.
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                        <div className="swiper-pagination"></div>
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
