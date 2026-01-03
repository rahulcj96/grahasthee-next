import Link from "next/link";
import Image from "next/image";

export default function Categories() {
    return (
        <section className="categories overflow-hidden">
            <div className="container">
                <div className="open-up" data-aos="zoom-out">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="cat-item image-zoom-effect">
                                <div className="image-holder" style={{ width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                                    <Link href="/shop?category=cotton-pillow-covers">
                                        <Image
                                            src="/images/categories/pillow-covers.webp"
                                            alt="categories"
                                            width={1000}
                                            height={1500}
                                            className="product-image img-fluid w-100 h-100"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </Link>
                                </div>
                                <div className="category-content"></div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="cat-item image-zoom-effect">
                                <div className="image-holder" style={{ width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                                    <Link href="/shop?category=luxe-linen-bath-towels">
                                        <Image
                                            src="/images/categories/bath-towels.webp"
                                            alt="categories"
                                            width={1000}
                                            height={1500}
                                            className="product-image img-fluid w-100 h-100"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </Link>
                                </div>
                                <div className="category-content"></div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="cat-item image-zoom-effect">
                                <div className="image-holder" style={{ width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                                    <Link href="/shop?category=cozy-corners">
                                        <Image
                                            src="/images/categories/cozy-corners.webp"
                                            alt="categories"
                                            width={1000}
                                            height={1500}
                                            className="product-image img-fluid w-100 h-100"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </Link>
                                </div>
                                <div className="category-content"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
