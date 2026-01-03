import PolicyPage from "@/components/PolicyPage";
import { CONTACT_INFO } from "@/lib/constants";

export default function ShippingPolicy() {
    return (
        <PolicyPage title="Shipping Policy">
            <div className="prose">
                <p>We ship across India. We also provide the COD option for Pin codes supported by our delivery partners.</p>
                <p>Please refer to our shipping table below:</p>

                <div className="table-responsive my-4">
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th>Orders</th>
                                <th>Delivery / COD charges</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>All orders above Rs.799/-</td>
                                <td className="text-success fw-bold">Free</td>
                            </tr>
                            <tr>
                                <td>All orders below Rs.799/-</td>
                                <td>Rs.70/-</td>
                            </tr>
                            <tr>
                                <td>All COD orders</td>
                                <td>Rs.49/-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p className="text-muted small">Please Note - this is subject to change as per Company policy.</p>

                <h5 className="mt-4 fw-bold text-uppercase">Shipping Timeline</h5>
                <p>Packages will be shipped in 48 working hours. We are closed on Sundays and will reach you in the next 5-7 days post shipping.</p>
                <p>We give the estimated time of delivery on the shipping page. However, these are indicative and depend on our shipping partner.</p>

                <h5 className="mt-4 fw-bold text-uppercase">Tracking & Delivery</h5>
                <p>The delivery times are subject to location, distance, and our logistics partners. We are not liable for any delays in delivery by the courier company/postal authorities but will help you track down a package through our partner courier services.</p>
                <p>Your purchases may reach you from various locations in more than one package. But rest assured, you will be charged one delivery fee for the entire order.</p>
                <p>As soon as your package ships, we will email you your package tracking information.</p>

                <h5 className="mt-4 fw-bold text-uppercase">Cash on Delivery (COD)</h5>
                <p>Cash on Delivery is only available on orders above Rs.799 and lower than Rs.5000. The cash On Delivery option is not a trial option and payment is necessary before accepting the order. Any refusal of COD orders will result in the deactivation of the COD option for future orders.</p>
                <p>In some pin codes, our shipping partners do not support COD and hence the option might be unavailable. For any queries, please contact our customer WhatsApp helpline.</p>

                <h5 className="mt-4 fw-bold text-uppercase">Cancellations</h5>
                <p>For any cancellations, we require an email within 4 hours of the order being placed. If the order is shipped out, cancellations will not be accepted. We will be unable to process any refund if an order is canceled at the doorstep or if there have been 3 failed attempts to deliver the parcel by our delivery partner.</p>

                <h5 className="mt-4 fw-bold text-uppercase">International Shipping</h5>
                <p>We currently do not ship outside India.</p>

                <p className="mt-5">In case of any queries and doubts, please write to us at <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a></p>
            </div>
        </PolicyPage>
    );
}
