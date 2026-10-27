import Seo from "../../components/Seo/Seo";
import Footer from "../../components/Footer/Footer";

function ShippingPolicy() {
  return (
    <>
      <Seo
        title="Shipping & Delivery Policy — UDHAYA AQUATICS"
        description="Shipping and delivery guidelines for live fish, aquarium tanks, and accessories shipped from UDHAYA AQUATICS, Rajapalayam."
        canonical={window.location.origin + "/shipping-policy"}
      />
      <div className="policy-page">
        <header className="policy-header">
          <h1>Shipping & Delivery Policy</h1>
          <div className="policy-meta">
            <strong>UDHAYA AQUATICS</strong> <span>•</span> Last Updated: October 2026
          </div>
        </header>

        <div className="policy-content">
          <section>
            <h2>1. Shipping Coverage & Locations</h2>
            <p>
              <strong>UDHAYA AQUATICS</strong> delivers aquarium fish, customized tanks, aquatic plants, feeds, and accessories across <strong>Tamil Nadu and all serviceable pincodes throughout India</strong>.
            </p>
            <p>
              Delivery feasibility for live aquatic pets is verified based on your shipping state and postal pincode to ensure transit time does not exceed safe live-transport limits.
            </p>
          </section>

          <section>
            <h2>2. Specialized Packaging for Live Aquatic Pets</h2>
            <p>
              Shipping live ornamental fish requires utmost care and specialized packaging protocols. At UDHAYA AQUATICS, we follow strict safety standards:
            </p>
            <ul>
              <li><strong>Medical Grade Pure Oxygen:</strong> Each fish is packed in double-layer virgin poly-bags filled with pure medical-grade oxygen to sustain them safely for up to 72 hours.</li>
              <li><strong>Conditioned Water:</strong> Treated with anti-stress, anti-bacterial water conditioners to minimize transit stress.</li>
              <li><strong>Thermal Insulation:</strong> Placed inside sturdy thermocol / styrofoam insulated boxes and outer corrugated shipping cartons to protect against external temperature swings.</li>
              <li><strong>Live Animal Priority Labeling:</strong> Boxes are clearly marked with "Live Ornamental Fish — Handle With Extreme Care" labels.</li>
            </ul>
          </section>

          <section>
            <h2>3. Shipping Charges & Calculation</h2>
            <div className="policy-card">
              <p>
                <strong>Transparent Pricing:</strong> Shipping charges are calculated dynamically at checkout based on destination distance and package tier (Local, Tamil Nadu State, and Rest of India).
              </p>
              <ul style={{ marginTop: "8px" }}>
                <li>The exact delivery fee is computed server-side directly from our backend delivery rules.</li>
                <li>Free shipping is automatically applied when your order qualifies under active promotional threshold rules.</li>
                <li>No hidden shipping charges or unexpected handling fees are added at payment time.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2>4. Dispatch Schedule & Delivery Timelines</h2>
            <ul>
              <li><strong>Order Processing Time:</strong> Orders are prepared within 24 to 48 hours of payment verification. For live fish, fasting before packing is maintained for safe water quality during transit.</li>
              <li><strong>Dispatch Days:</strong> To prevent live livestock parcels from being held over weekends at courier depots, live fish are typically dispatched from Monday through Thursday.</li>
              <li><strong>Estimated Delivery Times:</strong>
                <ul>
                  <li><strong>Within Tamil Nadu:</strong> 1 to 2 business days from dispatch.</li>
                  <li><strong>South India (Kerala, Karnataka, Andhra, Telangana):</strong> 2 to 3 business days from dispatch.</li>
                  <li><strong>Rest of India (Serviceable Metro / Urban areas):</strong> 3 to 5 business days from dispatch.</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2>5. Order Tracking</h2>
            <p>
              Once your parcel has been handed over to our courier partner (e.g., The Professional Courier), a tracking number and courier details are assigned to your order. You can monitor live tracking:
            </p>
            <ul>
              <li>Directly in your <strong>My Profile &rarr; Track Order</strong> dashboard.</li>
              <li>Through dispatch notification emails sent to your registered email address.</li>
              <li>Through WhatsApp delivery updates sent to your registered contact number.</li>
            </ul>
          </section>

          <section>
            <h2>6. Customer Responsibilities for Delivery</h2>
            <div className="policy-card policy-card-alert">
              <strong>Ensuring Prompt Delivery:</strong>
              <ul style={{ marginTop: "6px" }}>
                <li>Please ensure your mobile phone is reachable so the delivery executive can contact you upon arrival.</li>
                <li>Please receive the parcel on the <strong>first delivery attempt</strong>. Any delays in receiving live fish parcels increases stress on the livestock.</li>
                <li>Ensure someone is available at the provided delivery address to receive and acclimate the fish immediately.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2>7. Delivery Delays & Exceptions</h2>
            <p>
              While we partner with express delivery carriers, unforeseen delays may occasionally arise due to adverse weather, festival volume, or courier transit disruptions. In such circumstances, our customer support team actively tracks the parcel with the courier hub to expedite delivery.
            </p>
          </section>

          <div className="policy-contact-box">
            <h3>Shipping Support Contact</h3>
            <p>For urgent shipping status or tracking assistance, contact our dispatch desk:</p>
            <p><strong>Business:</strong> UDHAYA AQUATICS</p>
            <p><strong>Dispatch Hub:</strong> Rajapalayam, Virudhunagar District, Tamil Nadu, India</p>
            <p><strong>Phone / WhatsApp:</strong> +91 63815 82969</p>
            <p><strong>Email:</strong> udhaya.aqua.pets@gmail.com</p>
            <p><strong>Working Hours:</strong> 7:00 AM – 9:00 PM (Monday – Sunday)</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ShippingPolicy;
