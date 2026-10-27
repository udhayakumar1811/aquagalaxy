import Seo from "../../components/Seo/Seo";
import Footer from "../../components/Footer/Footer";

function RefundPolicy() {
  return (
    <>
      <Seo
        title="Return & Refund Policy — UDHAYA AQUATICS"
        description="Return and refund guidelines for live ornamental fish, plants, and aquarium accessories from UDHAYA AQUATICS."
        canonical={window.location.origin + "/refund-policy"}
      />
      <div className="policy-page">
        <header className="policy-header">
          <h1>Return & Refund Policy</h1>
          <div className="policy-meta">
            <strong>UDHAYA AQUATICS</strong> <span>•</span> Last Updated: October 2026
          </div>
        </header>

        <div className="policy-content">
          <section>
            <h2>1. Policy Overview</h2>
            <p>
              At <strong>UDHAYA AQUATICS</strong>, we strive to ensure that all live fish, plants, and aquarium supplies arrive healthy, vibrant, and in perfect condition. Because our catalog includes live biological organisms as well as delicate dry goods, our return and refund guidelines are structured to protect livestock welfare while guaranteeing customer satisfaction.
            </p>
          </section>

          <section>
            <h2>2. Live Livestock & Plants Return Policy</h2>
            <p>
              Due to biosecurity protocols and the delicate nature of live aquatic species:
            </p>
            <ul>
              <li><strong>No Physical Returns of Live Fish:</strong> Once live ornamental fish or aquatic plants have been received and introduced to customer water, they <u>cannot be physically returned</u> to our facility to prevent disease transmission and fatal acclimation shock.</li>
              <li><strong>Dead on Arrival (DOA) Guarantee:</strong> If any fish or plant unfortunately arrives dead or fatally damaged due to transit stress, we provide a <strong>100% replacement or refund</strong> for the affected item under our DOA policy.</li>
            </ul>

            <div className="policy-card policy-card-alert">
              <strong>Mandatory Requirements for DOA Claims:</strong>
              <ol style={{ marginTop: "8px" }}>
                <li>Record a <strong>continuous, unedited unboxing video</strong> showing the intact outer carton seal, opening of the box, and inspecting the livestock inside the transparent sealed bag.</li>
                <li>Send the unboxing video and clear photographs to our support team via WhatsApp (<strong>+91 63815 82969</strong>) or email (<strong>udhaya.aqua.pets@gmail.com</strong>) within <strong>2 hours</strong> of delivery marked by the courier.</li>
                <li>Once verified by our aquatic specialists, we will initiate a prompt refund or provide free livestock replacement.</li>
              </ol>
            </div>
          </section>

          <section>
            <h2>3. Aquarium Accessories & Equipment Returns</h2>
            <p>
              For dry goods, filters, lights, air pumps, heaters, and accessories:
            </p>
            <ul>
              <li><strong>7-Day Return/Replacement Window:</strong> If an accessory arrives damaged, defective, or physically incorrect, you can request a replacement or return within 7 days of delivery.</li>
              <li><strong>Condition:</strong> Items must be returned in their original packaging, unused, with all user manuals and accompanying accessories intact.</li>
              <li>Return shipping for defective items is coordinated and covered by UDHAYA AQUATICS.</li>
            </ul>
          </section>

          <section>
            <h2>4. Refund Processing Workflows</h2>
            <p>
              Once a refund has been approved by store management, it is processed based on your original payment method:
            </p>

            <div className="policy-card">
              <h3>A. Online Payments via Razorpay</h3>
              <p>
                Refunds for orders paid online through Razorpay (Credit/Debit Card, NetBanking, UPI Gateway) are initiated directly through the official Razorpay Refund API to the original payment source.
              </p>
              <ul>
                <li><strong>Turnaround Time:</strong> 5 to 7 business days depending on your issuing bank.</li>
                <li><strong>Reference:</strong> A unique Razorpay Refund ID (e.g., <code>rfnd_xxx</code>) is recorded and shared with you for bank reconciliation.</li>
              </ul>
            </div>

            <div className="policy-card">
              <h3>B. Direct UPI / Bank Transfer Orders</h3>
              <p>
                For orders placed via manual UPI QR or direct Bank Transfer:
              </p>
              <ul>
                <li>Our management manually transfers the refund amount to the customer's verified UPI ID or bank account.</li>
                <li>The admin records the bank UTR / IMPS transaction reference number directly in your order record.</li>
                <li><strong>Turnaround Time:</strong> Typically completed within 24 to 48 hours of approval.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2>5. Non-Refundable Scenarios</h2>
            <p>Refunds cannot be issued in the following circumstances:</p>
            <ul>
              <li>Claims submitted without an unbroken, continuous unboxing video.</li>
              <li>Claims reported more than 2 hours after courier parcel delivery.</li>
              <li>Livestock casualties resulting from improper water acclimation, unsuitable tank parameters, or aggression from existing tank mates.</li>
              <li>Parcels returned or delayed due to incorrect delivery addresses, wrong phone numbers, or repeated customer unavailability.</li>
            </ul>
          </section>

          <div className="policy-contact-box">
            <h3>Submit a Refund or DOA Claim</h3>
            <p>To report a transit issue or discuss an approved refund, reach out to our team:</p>
            <p><strong>Business Name:</strong> UDHAYA AQUATICS</p>
            <p><strong>Owner:</strong> UDHAYAKUMAR</p>
            <p><strong>Location:</strong> Rajapalayam, Virudhunagar District, Tamil Nadu, India</p>
            <p><strong>WhatsApp Support:</strong> <a href="https://wa.me/916381582969" target="_blank" rel="noreferrer">+91 63815 82969</a></p>
            <p><strong>Email:</strong> <a href="mailto:udhaya.aqua.pets@gmail.com">udhaya.aqua.pets@gmail.com</a></p>
            <p><strong>Support Hours:</strong> 7:00 AM – 9:00 PM (Monday – Sunday)</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default RefundPolicy;
