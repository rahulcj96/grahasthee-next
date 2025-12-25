import Image from "next/image";

export default function Collection() {
    return (
        <section className="collection bg-light position-relative py-5">
            <div className="container">
                <div className="row">
                    <div className="collection-item d-flex flex-wrap my-5">
                        <div className="col-md-6 column-container">
                            <div className="image-holder">
                                <Image
                                    src="/images/collections/handbags-2.webp"
                                    alt="collection"
                                    width={600}
                                    height={600}
                                    className="product-image img-fluid"
                                    style={{ width: "100%", height: "auto" }}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 column-container bg-white">
                            <div className="collection-content p-5 m-0 m-md-5">
                                <h3 className="element-title text-uppercase">
                                    Artisan Handbags: Carry a Piece of Tradition
                                </h3>
                                <p>
                                    Discover our collection of handcrafted handbags, where
                                    traditional artistry meets contemporary design. Each piece is
                                    meticulously woven from natural fibers, offering a durable and
                                    unique accessory that complements your personal style. They're
                                    thoughtfully sized and structured to be the perfect companion
                                    for your errands, outings, and special occasions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
