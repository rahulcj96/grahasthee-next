import PolicyPage from "@/components/PolicyPage";
import { CONTACT_INFO } from "@/lib/constants";

export default function PrivacyPolicy() {
    return (
        <PolicyPage title="Privacy Policy">
            <div className="prose">
                <p>Grahasthee ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.</p>

                <h5 className="mt-4 fw-bold text-uppercase">Information We Collect</h5>
                <p>We collect information that you provided directly to us when you:</p>
                <ul>
                    <li>Create an account or place an order.</li>
                    <li>Sign up for our newsletter.</li>
                    <li>Contact our customer support.</li>
                </ul>
                <p>This may include your name, email address, phone number, shipping address, and payment details.</p>

                <h5 className="mt-4 fw-bold text-uppercase">How We Use Your Information</h5>
                <p>We use the collected information to:</p>
                <ul>
                    <li>Process and fulfill your orders.</li>
                    <li>Communicate with you about your orders and promotional offers.</li>
                    <li>Improve our website and customer service.</li>
                    <li>Prevent fraudulent transactions and enhance security.</li>
                </ul>

                <h5 className="mt-4 fw-bold text-uppercase">Cookies</h5>
                <p>We use cookies to enhance your browsing experience. Cookies are small files stored on your device that help us understand your preferences and provide a personalized experience. You can choose to disable cookies through your browser settings, but it may affect some features of our website.</p>

                <h5 className="mt-4 fw-bold text-uppercase">Third-Party Disclosure</h5>
                <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except for trusted third parties who assist us in operating our website, conducting our business, or servicing you (e.g., shipping partners, payment gateways), so long as those parties agree to keep this information confidential.</p>

                <h5 className="mt-4 fw-bold text-uppercase">Data Security</h5>
                <p>We implement a variety of security measures to maintain the safety of your personal information. Your sensitive information (like credit card data) is encrypted and transmitted via Secure Socket Layer (SSL) technology.</p>

                <h5 className="mt-4 fw-bold text-uppercase">Your Consent</h5>
                <p>By using our site, you consent to our website's privacy policy.</p>

                <h5 className="mt-4 fw-bold text-uppercase">Contact Us</h5>
                <p>If there are any questions regarding this privacy policy, you may contact us at <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a></p>
            </div>
        </PolicyPage>
    );
}
