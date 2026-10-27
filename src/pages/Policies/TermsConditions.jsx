import Seo from "../../components/Seo/Seo";
import Footer from "../../components/Footer/Footer";

function TermsConditions() {
  return (
    <>
      <Seo
        title="Terms & Conditions — UDHAYA AQUATICS"
        description="Terms and conditions for purchasing ornamental fish, tanks, and aquarium supplies from UDHAYA AQUATICS."
        canonical={window.location.origin + "/terms-and-conditions"}
      />
      <div className="policy-page">
        <header className="policy-header">
          <h1>Terms & Conditions</h1>
          <div className="policy-meta">
            <strong>UDHAYA AQUATICS</strong> <span>•</span> Last Updated: October 2026
          </div>
        </header>

        <div className="policy-content">
          <section>
            <h2>1. Agreement to Terms</h2>
            <p>
              These Terms and Conditions constitute a legally binding agreement between you and <strong>UDHAYA AQUATICS</strong> ("Company", "we", "us", or "our"), regarding your access to and use of our website and purchase of aquarium pets, plants, tanks, and accessories.
            </p>
            <p>
              By accessing the website or placing an order, you agree that you have read, understood, and agreed to be bound by all of these Terms and Conditions. If you do not agree with all of these terms, please discontinue use immediately.
            </p>
          </section>

          <section>
            <h2>2. Business Information & Eligibility</h2>
            <p>
              <strong>UDHAYA AQUATICS</strong> is a proprietary business owned and operated by <strong>UDHAYAKUMAR</strong>, located in Rajapalayam, Virudhunagar District, Tamil Nadu, India. To place an order, you must be at least 18 years old or be under the supervision of a parent or legal guardian.
            </p>
          </section>

          <section>
            <h2>3. Product Details, Stock & Pricing</h2>
            <ul>
              <li><strong>Currency:</strong> All prices displayed on our website are in Indian Rupees (INR - ₹).</li>
              <li><strong>Live Stock Variations:</strong> Due to natural biological variations, live fish (e.g., Betta fish, Guppies, exotic freshwater varieties) and aquatic plants may exhibit slight variations in color patterns, finnage, and exact size compared to sample photographs.</li>
              <li><strong>Pricing & Availability:</strong> Product prices, promotions, and stock levels are subject to change without prior notice. The final payable amount is calculated server-side based on the verified prices at checkout.</li>
              <li><strong>Stock Reservation:</strong> Placing an item in your shopping cart does not reserve inventory until an order is placed.</li>
            </ul>
          </section>

          <section>
            <h2>4. Live Fish & Dead on Arrival (DOA) Policy</h2>
            <div className="policy-card policy-card-alert">
              <strong>Live Delivery Guarantee & Mandatory Unboxing Video:</strong>
              <p style={{ marginTop: "8px" }}>
                We pack all live ornamental fish with premium medical oxygen, specialized insulated containers, and water conditioners to ensure their safety during transit. In the rare event that a fish arrives Dead on Arrival (DOA):
              </p>
              <ol style={{ marginTop: "6px" }}>
                <li>The customer <strong>must record a clear, continuous unboxing video</strong> starting from the unopened sealed parcel showing the shipping label, opening the box, and inspecting the fish inside the transparent sealed bag.</li>
                <li>The unboxing video must be shared with us on WhatsApp (<strong>+91 63815 82969</strong>) or email (<strong>udhaya.aqua.pets@gmail.com</strong>) within <strong>2 hours</strong> of parcel delivery recorded by the courier.</li>
                <li>Once verified, we will arrange a free replacement in your next order or process a refund for the deceased livestock item.</li>
                <li>Claims made without an unbroken unboxing video or reported after 2 hours from courier delivery cannot be accepted due to external acclimation factors.</li>
              </ol>
            </div>
          </section>

          <section>
            <h2>5. Order Placement & Payment</h2>
            <ul>
              <li><strong>Order Confirmation:</strong> An order is confirmed once payment has been successfully verified (automatically via Razorpay online payment, or through manual store verification of the submitted UTR and payment screenshot).</li>
              <li><strong>Payment Methods:</strong> We accept online payments via Razorpay (Debit/Credit Cards, UPI, NetBanking) and direct UPI QR / Bank Transfer with payment proof.</li>
              <li><strong>Anti-Fraud:</strong> Each transaction reference (UTR) can only be submitted once. Duplicate or fraudulent UTR submissions will result in immediate cancellation of the order.</li>
            </ul>
          </section>

          <section>
            <h2>6. Shipping & Delivery</h2>
            <ul>
              <li>Customers are solely responsible for providing complete, accurate shipping information (including street address, landmarks, and correct 6-digit postal pincode).</li>
              <li>Orders are dispatched through reputable courier partners (e.g., The Professional Courier). Estimated transit time is typically 2 to 5 business days depending on destination.</li>
              <li>We are not liable for transit delays caused by extreme weather conditions, natural disasters, courier strikes, or incorrect addresses provided by the customer.</li>
            </ul>
          </section>

          <section>
            <h2>7. Cancellation & Refunds</h2>
            <p>
              Cancellations and refunds are governed strictly by our dedicated <a href="/cancellation-policy">Cancellation Policy</a> and <a href="/refund-policy">Return & Refund Policy</a>. Orders may be directly cancelled before packing begins; once custom oxygen packing commences, cancellation requests are reviewed by store management.
            </p>
          </section>

          <section>
            <h2>8. Website Usage & Intellectual Property</h2>
            <p>
              All content on this website, including logos, images, product descriptions, banners, and layout, is the proprietary intellectual property of UDHAYA AQUATICS. You may not reproduce, duplicate, or copy any material without prior written consent.
            </p>
          </section>

          <section>
            <h2>9. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or related to these terms or purchases shall be subject to the exclusive jurisdiction of the competent courts in Rajapalayam / Virudhunagar District, Tamil Nadu, India.
            </p>
          </section>

          <div className="policy-contact-box">
            <h3>Contact Us Regarding Terms</h3>
            <p><strong>Business Name:</strong> UDHAYA AQUATICS</p>
            <p><strong>Proprietor:</strong> UDHAYAKUMAR</p>
            <p><strong>Location:</strong> Rajapalayam, Virudhunagar District, Tamil Nadu, India - 626117</p>
            <p><strong>Phone / WhatsApp:</strong> +91 63815 82969</p>
            <p><strong>Email:</strong> udhaya.aqua.pets@gmail.com</p>
            <p><strong>Business Hours:</strong> 7:00 AM – 9:00 PM (Monday – Sunday)</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TermsConditions;
