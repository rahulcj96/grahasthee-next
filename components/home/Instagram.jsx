import Image from "next/image";

export default function Instagram() {
    return (
        <section className="instagram position-relative">
            <div className="d-flex justify-content-center w-100 position-absolute bottom-0 z-1">
                <a
                    href="https://www.instagram.com/grahasthee/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-dark px-5"
                >
                    Follow us on Instagram
                </a>
            </div>
            <div className="row g-0">
                <div className="col-6 col-sm-4 col-md-2">
                    <div className="insta-item">
                        <a
                            href="https://www.instagram.com/grahasthee/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/images/instagram/pillow-square.webp"
                                alt="instagram"
                                width={300}
                                height={300}
                                className="insta-image img-fluid"
                                style={{ width: "100%", height: "auto" }}
                            />
                        </a>
                    </div>
                </div>
                <div className="col-6 col-sm-4 col-md-2">
                    <div className="insta-item">
                        <a
                            href="https://www.instagram.com/grahasthee/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/images/instagram/mat-square.webp"
                                alt="instagram"
                                width={300}
                                height={300}
                                className="insta-image img-fluid"
                                style={{ width: "100%", height: "auto" }}
                            />
                        </a>
                    </div>
                </div>
                <div className="col-6 col-sm-4 col-md-2">
                    <div className="insta-item">
                        <a
                            href="https://www.instagram.com/grahasthee/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/images/instagram/pillow-1.webp"
                                alt="instagram"
                                width={300}
                                height={300}
                                className="insta-image img-fluid"
                                style={{ width: "100%", height: "auto" }}
                            />
                        </a>
                    </div>
                </div>
                <div className="col-6 col-sm-4 col-md-2">
                    <div className="insta-item">
                        <a
                            href="https://www.instagram.com/grahasthee/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/images/instagram/mat-1.webp"
                                alt="instagram"
                                width={300}
                                height={300}
                                className="insta-image img-fluid"
                                style={{ width: "100%", height: "auto" }}
                            />
                        </a>
                    </div>
                </div>
                <div className="col-6 col-sm-4 col-md-2">
                    <div className="insta-item">
                        <a
                            href="https://www.instagram.com/grahasthee/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/images/instagram/pillow-2.webp"
                                alt="instagram"
                                width={300}
                                height={300}
                                className="insta-image img-fluid"
                                style={{ width: "100%", height: "auto" }}
                            />
                        </a>
                    </div>
                </div>
                <div className="col-6 col-sm-4 col-md-2">
                    <div className="insta-item">
                        <a
                            href="https://www.instagram.com/grahasthee/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src="/images/instagram/towel.webp"
                                alt="instagram"
                                width={300}
                                height={300}
                                className="insta-image img-fluid"
                                style={{ width: "100%", height: "auto" }}
                            />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
