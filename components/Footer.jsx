import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer id="footer" className="mt-5">
            <div className="container">
                <div className="row d-flex flex-wrap justify-content-between py-5">
                    <div className="col-md-3 col-sm-6">
                        <div className="footer-menu footer-menu-001">
                            <div className="footer-intro mb-4">
                                <Link href="/">
                                    <Image
                                        src="/images/logo.webp"
                                        alt="logo"
                                        width={120}
                                        height={40}
                                        style={{ objectFit: "contain" }}
                                    />
                                </Link>
                            </div>

                            <div className="social-links">
                                <ul className="list-unstyled d-flex flex-wrap gap-3">
                                    <li>
                                        <a
                                            href="https://www.instagram.com/grahasthee"
                                            className="text-secondary"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24">
                                                <use xlinkHref="#instagram"></use>
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-sm-6">
                        <div className="footer-menu footer-menu-004 border-animation-left">
                            <h5 className="widget-title text-uppercase mb-4">Contact Us</h5>
                            <p>
                                Do you have any questions or suggestions?{" "}
                                <a href="mailto:grahasthee@gmail.com" className="item-anchor">
                                    grahasthee@gmail.com
                                </a>
                            </p>
                            <p>
                                Do you need support? Give us a call.{" "}
                                <a href="tel:+917470652857" className="item-anchor">
                                    +917470652857
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-top py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 mx-auto">
                            <p>
                                © Copyright 2025 Grahasthee. All rights reserved. Design by{" "}
                                <a
                                    href="https://templatesjungle.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    TemplatesJungle
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
