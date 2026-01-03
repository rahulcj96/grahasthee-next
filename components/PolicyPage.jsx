import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PolicyPage({ title, children }) {
    return (
        <>
            <Header />
            <main className="policy-page py-5 mt-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <h1 className="text-uppercase fw-bold mb-5 text-center">{title}</h1>
                            <div className="policy-content bg-white p-4 p-md-5 border rounded shadow-sm">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
