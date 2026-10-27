import Seo from "../../components/Seo/Seo";
import Footer from "../../components/Footer/Footer";

function CancellationPolicy() {
  return (
    <>
      <Seo
        title="Cancellation Policy — UDHAYA AQUATICS"
        description="Cancellation guidelines and order stages for aquarium products and live fish orders at UDHAYA AQUATICS."
        canonical={window.location.origin + "/cancellation-policy"}
      />
      <div className="policy-page">
        <header className="policy-header">
          <h1>Cancellation Policy</h1>
          <div className="policy-meta">
            <strong>UDHAYA AQUATICS</strong> <span>•</span> Last Updated: October 2026
          </div>
        </header>

        <div className="policy-content">
          <section>
            <h2>1. Overview & Order Lifecycle</h2>
            <p>
              To ensure full transparency regarding order fulfillment and handling of delicate live aquatic pets, <strong>UDHAYA AQUATICS</strong> follows four clear sequential order fulfillment stages:
            </p>
            <ol>
              <li><strong>BOOKED:</strong> Order received and payment verified (online via Razorpay or manually confirmed via UPI/Bank transfer).</li>
              <li><strong>PACKING:</strong> Live fish fasting complete; packaging with medical oxygen, temperature-controlled thermocol boxes, and security seals has begun.</li>
              <li><strong>SHIPPING:</strong> Parcel has been handed over to our courier partner (e.g., The Professional Courier) and a tracking number has been generated.</li>
              <li><strong>DELIVERY:</strong> Parcel is out for delivery with the local delivery executive or delivered to the customer.</li>
            </ol>
          </section>

          <section>
            <h2>2. Customer Cancellation Rights by Stage</h2>

            <div className="policy-card">
              <h3>Stage 1 — BOOKED (Direct Cancellation Allowed)</h3>
              <p>
                Before packaging begins, you can <strong>directly cancel your order</strong> with a single click from your <strong>My Profile &rarr; Track Order</strong> page.
              </p>
              <ul>
                <li>Reserved stock is immediately returned to inventory.</li>
                <li>Used promotional coupon codes are instantly released for reuse.</li>
                <li>If payment was already verified, a full refund is immediately queued for processing.</li>
              </ul>
            </div>

            <div className="policy-card policy-card-alert">
              <h3>Stage 2 — PACKING (Cancellation Request Only)</h3>
              <p>
                Once packaging begins, live aquatic pets are selected from quarantine tanks and sealed inside pressurized medical-oxygen bags. Because re-acclimating packed livestock requires careful biological care:
              </p>
              <ul>
                <li>Direct automated cancellation is <u>disabled</u> at this stage.</li>
                <li>Customers may submit a formal <strong>Cancellation Request</strong> through the order dashboard along with their reason.</li>
                <li>Store management will review the request:
                  <ul>
                    <li>If the live livestock has not yet been sealed in transit containers, management will <strong>Approve</strong> the cancellation and queue your refund.</li>
                    <li>If live packaging is already finalized and booked with courier pickup, management may <strong>Reject</strong> the cancellation with clear explanatory notes.</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="policy-card">
              <h3>Stages 3 & 4 — SHIPPING & DELIVERY (Non-Cancellable)</h3>
              <p>
                Once an order has been dispatched and handed over to the courier transit network, <strong>it cannot be cancelled or recalled</strong>. Live fish parcels in transit must proceed to delivery for livestock safety. In case of issues upon arrival, our <a href="/refund-policy">Dead on Arrival (DOA)</a> policy applies.
              </p>
            </div>
          </section>

          <section>
            <h2>3. Cancellation by UDHAYA AQUATICS</h2>
            <p>We reserve the right to cancel an order under exceptional circumstances:</p>
            <ul>
              <li>If pre-dispatch health check indicates that a live fish is not in optimal health for travel.</li>
              <li>Severe weather disruptions, floods, or courier strikes along the transit route.</li>
              <li>Incorrect or unserviceable delivery pincode provided by the customer.</li>
              <li>Submission of duplicate, unverified, or fraudulent payment transaction references.</li>
            </ul>
            <p>In all cases of store-initiated cancellations, a 100% full refund is issued immediately.</p>
          </section>

          <section>
            <h2>4. Refund Timelines for Cancelled Orders</h2>
            <ul>
              <li><strong>Razorpay Online Payments:</strong> Refund initiated immediately upon cancellation approval; funds reflect in your original payment method within 5 to 7 business days.</li>
              <li><strong>Manual UPI / Bank Transfer Orders:</strong> Transferred to the customer's account within 24 to 48 hours with bank reference number provided.</li>
            </ul>
          </section>

          <div className="policy-contact-box">
            <h3>Need Urgent Cancellation Assistance?</h3>
            <p>If you need to request cancellation shortly after placing an order, please contact our dispatch desk immediately:</p>
            <p><strong>Business:</strong> UDHAYA AQUATICS</p>
            <p><strong>Owner:</strong> UDHAYAKUMAR</p>
            <p><strong>Phone / WhatsApp:</strong> <a href="tel:+916381582969">+91 63815 82969</a></p>
            <p><strong>Email:</strong> <a href="mailto:udhaya.aqua.pets@gmail.com">udhaya.aqua.pets@gmail.com</a></p>
            <p><strong>Support Desk:</strong> 7:00 AM – 9:00 PM (Monday – Sunday)</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CancellationPolicy;
