import Link from "next/link";
import Image from "next/image";
import { CONTACT_INFO, getWhatsappLink } from "@/lib/constants";

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
                                            href={CONTACT_INFO.instagram}
                                            className="text-secondary"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24">
                                                <use xlinkHref="#instagram"></use>
                                            </svg>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href={getWhatsappLink()}
                                            className="text-secondary"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24">
                                                <use xlinkHref="#whatsapp"></use>
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 col-sm-6">
                        <div className="footer-menu footer-menu-002">
                            <h5 className="widget-title text-uppercase mb-4">Policies</h5>
                            <ul className="menu-list list-unstyled text-uppercase border-animation-left">
                                <li className="menu-item mb-2">
                                    <Link href="/policies/shipping-policy" className="item-anchor">Shipping Policy</Link>
                                </li>
                                <li className="menu-item mb-2">
                                    <Link href="/policies/refund-policy" className="item-anchor">Refund Policy</Link>
                                </li>
                                <li className="menu-item mb-2">
                                    <Link href="/policies/privacy-policy" className="item-anchor">Privacy Policy</Link>
                                </li>
                                <li className="menu-item mb-2">
                                    <Link href="/policies/terms-of-service" className="item-anchor">Terms of Service</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-md-4 col-sm-6">
                        <div className="footer-menu footer-menu-004 border-animation-left">
                            <h5 className="widget-title text-uppercase mb-4">Contact Us</h5>
                            <p>
                                Do you have any questions or suggestions?{" "}
                                <a href={`mailto:${CONTACT_INFO.email}`} className="item-anchor">
                                    {CONTACT_INFO.email}
                                </a>
                            </p>
                            <p>
                                Do you need support? Give us a call or WhatsApp.{" "}
                                <a href={`tel:${CONTACT_INFO.phone}`} className="item-anchor">
                                    {CONTACT_INFO.phone}
                                </a>
                                {" / "}
                                <a href={getWhatsappLink()} className="item-anchor" target="_blank" rel="noopener noreferrer">
                                    WhatsApp
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
