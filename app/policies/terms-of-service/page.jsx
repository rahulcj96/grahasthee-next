import PolicyPage from "@/components/PolicyPage";
import { CONTACT_INFO } from "@/lib/constants";

export default function TermsOfService() {
    return (
        <PolicyPage title="Terms of Service">
            <div className="prose">
                <p>Welcome to Grahasthee. These terms and conditions outline the rules and regulations for the use of Grahasthee's Website.</p>

                <h5 className="mt-4 fw-bold text-uppercase">1. Terms</h5>
                <p>By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use Grahasthee's website if you do not accept all of the terms and conditions stated on this page.</p>

                <h5 className="mt-4 fw-bold text-uppercase">2. Products & Services</h5>
                <p>We make every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.</p>
                <p>We reserve the right to limit the sales of our products or services to any person, geographic region, or jurisdiction. We may exercise this right on a case-by-case basis.</p>

                <h5 className="mt-4 fw-bold text-uppercase">3. Pricing & Payments</h5>
                <p>Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service without notice at any time.</p>
                <p>Payments must be made through our authorized payment gateways or via Cash on Delivery where applicable.</p>

                <h5 className="mt-4 fw-bold text-uppercase">4. Shipping & Delivery</h5>
                <p>Shipping and delivery are governed by our Shipping Policy. Delivery times are estimates and not guarantees.</p>

                <h5 className="mt-4 fw-bold text-uppercase">5. Returns & Refunds</h5>
                <p>Returns and refunds are governed by our Refund Policy. Please review it carefully before making a purchase.</p>

                <h5 className="mt-4 fw-bold text-uppercase">6. User Comments & Feedback</h5>
                <p>If you send certain specific submissions or creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, or otherwise, you agree that we may, at any time, without restriction, edit, copy, publish, distribute and otherwise use in any medium any comments that you forward to us.</p>

                <h5 className="mt-4 fw-bold text-uppercase">7. Prohibited Uses</h5>
                <p>In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content for any unlawful purpose, to solicit others to perform or participate in any unlawful acts, or to violate any international or local regulations.</p>

                <h5 className="mt-4 fw-bold text-uppercase">8. Governing Law</h5>
                <p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India.</p>

                <h5 className="mt-4 fw-bold text-uppercase">9. Contact Information</h5>
                <p>Questions about the Terms of Service should be sent to us at <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a></p>
            </div>
        </PolicyPage>
    );
}
