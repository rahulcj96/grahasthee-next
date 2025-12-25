import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <nav className="navbar navbar-expand-lg bg-light text-uppercase fs-6 p-3 border-bottom align-items-center">
            <div className="container-fluid">
                <div className="row justify-content-between align-items-center w-100">
                    <div className="col-auto">
                        <Link className="navbar-brand text-white" href="/">
                            <Image
                                src="/images/logo.webp"
                                alt="Logo"
                                width={120}
                                height={40}
                                style={{ objectFit: "contain" }}
                                priority
                            />
                        </Link>
                    </div>

                    <div className="col-auto">
                        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                            <div className="offcanvas-header">
                                <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
                                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>

                            <div className="offcanvas-body">
                                <ul className="navbar-nav justify-content-end flex-grow-1 gap-1 gap-md-5 pe-3">
                                    <li className="nav-item">
                                        <Link className="nav-link" href="/">Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" href="/shop">Shop</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" href="#footer">Contact</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>

                    <div className="col-3 col-lg-auto">
                        {/* Search, Login, Cart icons could go here if needed */}
                    </div>
                </div>
            </div>
        </nav>
    );
}
