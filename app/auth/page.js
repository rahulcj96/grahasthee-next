import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthForm from '@/components/AuthForm';

export default function AuthPage() {
    return (
        <>
            <Header />
            <main className="min-vh-100 d-flex align-items-center bg-light py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <auth-container className="d-block" data-aos="fade-up">
                                <div className="text-center mb-5">
                                    <h1 className="display-5 text-uppercase fw-bold mb-2">Welcome</h1>
                                    <p className="text-muted">Join the Grahasthee community today</p>
                                </div>
                                <AuthForm />
                            </auth-container>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
