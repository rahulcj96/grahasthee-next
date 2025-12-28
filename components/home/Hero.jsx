"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function Hero() {
    const [ categories, setCategories ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            const { data, error } = await supabase
                .from('categories')
                .select('*');

            if (error) {
                console.error('Error fetching categories:', error);
            } else {
                const transformedData = data.map(cat => ({
                    ...cat,
                    image_url: cat.image_url.startsWith('https://grahasthee.com/assets/')
                        ? cat.image_url.replace('https://grahasthee.com/assets/', '/')
                        : cat.image_url
                }));
                setCategories(transformedData);
            }
            setLoading(false);
        }

        fetchCategories();
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
                        {categories.map((category) => (
                            <SwiperSlide key={category.id}>
                                <div className="banner-item image-zoom-effect">
                                    <Link href={`/shop?category=${category.slug}`} className="item-anchor">
                                        <div className="image-holder">
                                            <Image
                                                src={category.image_url}
                                                alt={category.title}
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
                </div>
            </div>
        </section>
    );
}
