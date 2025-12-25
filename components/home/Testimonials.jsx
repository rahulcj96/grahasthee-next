"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectCoverflow } from "swiper/modules";

export default function Testimonials() {
    return (
        <section className="testimonials py-5 bg-light">
            <div className="section-header text-center mt-5">
                <h3 className="section-title">WHAT OUR CUSTOMERS ARE SAYING</h3>
            </div>
            <Swiper
                modules={[ Pagination, EffectCoverflow ]}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                }}
                pagination={{
                    clickable: true,
                    el: ".testimonial-swiper-pagination"
                }}
                loop={true}
                className="testimonial-swiper overflow-hidden my-5"
            >
                <SwiperSlide>
                    <div className="testimonial-item text-center">
                        <blockquote>
                            <p>
                                "These pillow covers completely transformed my living room!
                                The **cotton feels luxurious**, and the artisan patterns are
                                even more beautiful in person. Excellent quality."
                            </p>
                            <div className="review-title text-uppercase">AARTI S.</div>
                        </blockquote>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="testimonial-item text-center">
                        <blockquote>
                            <p>
                                "I finally found the perfect bath towels. They are incredibly
                                **soft and absorbent**, yet they dry so quickly. A true touch
                                of luxe for my everyday routine."
                            </p>
                            <div className="review-title text-uppercase">
                                HOME COMFORT FAN
                            </div>
                        </blockquote>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="testimonial-item text-center">
                        <blockquote>
                            <p>
                                "My new GRAHASTHEE handbag is stunning! It's **sturdy, the
                                weaving is gorgeous**, and I get compliments every time I use
                                it. I love carrying a piece of art."
                            </p>
                            <div className="review-title text-uppercase">MAYA D.</div>
                        </blockquote>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="testimonial-item text-center">
                        <blockquote>
                            <p>
                                "I appreciate a brand that prioritizes both **sustainability
                                and style**. Everything I've ordered has been high quality and
                                truly elevates my home."
                            </p>
                            <div className="review-title text-uppercase">
                                CONSCIOUS BUYER
                            </div>
                        </blockquote>
                    </div>
                </SwiperSlide>
            </Swiper>
            <div className="testimonial-swiper-pagination d-flex justify-content-center mb-5"></div>
        </section>
    );
}
