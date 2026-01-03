import PolicyPage from "@/components/PolicyPage";
import { CONTACT_INFO, getWhatsappLink } from "@/lib/constants";

export default function RefundPolicy() {
    return (
        <PolicyPage title="Refund & Return Policy">
            <div className="prose">
                <p>At Grahasthee, we value our customers and aim to provide a hassle-free experience for returns and refunds. Our policy is designed to be fair and transparent.</p>

                <h5 className="mt-4 fw-bold text-uppercase">Return Eligibility</h5>
                <p>You can initiate a return request within 7 days of delivery for most products. To be eligible for a return:</p>
                <ul>
                    <li>The product must be unused, unwashed, and in the same condition as received.</li>
                    <li>Items must have original tags, packaging, and accessories included.</li>
                    <li>Stains, damage, or signs of usage will lead to rejection of the return.</li>
                </ul>

                <h5 className="mt-4 fw-bold text-uppercase">How to Initiate a Return</h5>
                <p>To start a return, please contact us via:</p>
                <ul>
                    <li>Email: <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a></li>
                    <li>WhatsApp: <a href={getWhatsappLink()}>{CONTACT_INFO.whatsapp}</a></li>
                </ul>
                <p>Please provide your Order ID and photos of the product you wish to return.</p>

                <h5 className="mt-4 fw-bold text-uppercase">Return Pick-up</h5>
                <p>Once your return request is approved, our logistics partner will attempt a pick-up within 4 business days. The delivery personnel will perform a basic quality check at the doorstep.</p>

                <h5 className="mt-4 fw-bold text-uppercase">Refund Process</h5>
                <p>After the product reaches our warehouse and passes the quality inspection:</p>
                <ul>
                    <li>For Prepaid orders: The refund will be credited back to the original payment method within 7-10 business days.</li>
                    <li>For COD orders: We will request your bank details or UPI ID to process the refund via bank transfer.</li>
                </ul>

                <h5 className="mt-4 fw-bold text-uppercase">Exchanges</h5>
                <p>We offer one free replacement if the product delivered is damaged or incorrect. If you wish to exchange a product for other reasons (e.g., preference), additional shipping charges may apply.</p>

                <h5 className="mt-4 fw-bold text-uppercase">Cancellations</h5>
                <p>Cancellations are accepted within 4 hours of placing the order. Once the order is shipped, it cannot be canceled.</p>

                <p className="mt-5 text-center text-muted">For any further questions, reach out to us at <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a></p>
            </div>
        </PolicyPage>
    );
}
