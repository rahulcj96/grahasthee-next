"use client";
import Image from "next/image";

export default function VideoSection() {
    return (
        <section className="video py-5 overflow-hidden">
            <div className="container-fluid">
                <div className="row">
                    <div className="video-content">
                        <div className="video-bg">
                            <Image
                                src="/images/banner/banner.webp"
                                alt="video"
                                width={1920}
                                height={800}
                                className="video-image img-fluid"
                                style={{ width: "100%", height: "auto" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
