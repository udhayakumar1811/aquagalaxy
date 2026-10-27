import Seo from "../../components/Seo/Seo";
import Footer from "../../components/Footer/Footer";

function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy — UDHAYA AQUATICS"
        description="Privacy Policy of UDHAYA AQUATICS. Learn how we collect, use, and protect your personal and order data."
        canonical={window.location.origin + "/privacy-policy"}
      />
      <div className="policy-page">
        <header className="policy-header">
          <h1>Privacy Policy</h1>
          <div className="policy-meta">
            <strong>UDHAYA AQUATICS</strong> <span>•</span> Last Updated: October 2026
          </div>
        </header>

        <div className="policy-content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to <strong>UDHAYA AQUATICS</strong> ("we", "our", or "us"). We are committed to protecting the privacy, confidentiality, and security of our customers ("you", "your"). This Privacy Policy explains what personal information we collect, why we collect it, how it is used and safeguarded, and your rights concerning your personal data when using our website and purchasing our aquatic pets and supplies.
            </p>
            <p>
              By accessing our website or placing an order, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>To process and fulfill your aquatic orders efficiently, we collect the following personal information:</p>
            <ul>
              <li><strong>Contact Information:</strong> Full name, mobile phone number, WhatsApp number, and email address.</li>
              <li><strong>Delivery Address Details:</strong> Complete postal address, city, district, state, and 6-digit postal pincode.</li>
              <li><strong>Order & Transaction Information:</strong> Items purchased, quantity, prices, discount coupons used, delivery charges, and timestamps.</li>
              <li><strong>Payment-Related Proof (Where Applicable):</strong> UPI Transaction Reference Number / UTR number and uploaded payment confirmation screenshots for manual UPI or Bank Transfer orders.</li>
              <li><strong>Online Payment Gateway Identifiers:</strong> Razorpay Order IDs and Razorpay Payment IDs generated during online transactions.</li>
              <li><strong>Account Credentials:</strong> Securely encrypted/hashed passwords for registered user accounts.</li>
            </ul>

            <div className="policy-card policy-card-alert">
              <strong>Important Financial Protection:</strong> We <u>never</u> collect, process, or store sensitive banking credentials, Credit/Debit card numbers, CVV codes, net banking passwords, or UPI PINs. Online card and netbanking transactions are handled directly through RBI-authorized payment aggregators (Razorpay) using bank-grade 256-bit encryption.
            </div>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>The information we collect is strictly used for legitimate business operations:</p>
            <ul>
              <li>To verify, process, and fulfill your orders for aquarium livestock, plants, and accessories.</li>
              <li>To calculate accurate delivery charges based on your delivery state and pincode.</li>
              <li>To coordinate dispatch and door delivery with our logistics partners (e.g., The Professional Courier).</li>
              <li>To send order confirmation, shipment dispatch notifications, and tracking IDs via email and WhatsApp.</li>
              <li>To assist with customer support inquiries, live delivery guidance, and unboxing verification.</li>
              <li>To prevent fraudulent orders, duplicate UTR submissions, and unauthorized account access.</li>
            </ul>
          </section>

          <section>
            <h2>4. Data Protection & Security Measures</h2>
            <p>
              We implement comprehensive technical and organizational safeguards to keep your personal data secure:
            </p>
            <ul>
              <li><strong>Secure Transport (HTTPS):</strong> All data transmitted between your browser and our servers is encrypted using Secure Sockets Layer / Transport Layer Security (TLS).</li>
              <li><strong>Credential Security:</strong> User passwords are encrypted using one-way cryptographic hashing (bcrypt) before storage.</li>
              <li><strong>Private Proof Storage:</strong> Customer payment screenshots are stored in private cloud storage with restricted access and can only be viewed via time-limited, signed URLs by authorized store staff and the ordering customer.</li>
              <li><strong>Access Control:</strong> Backend access is strictly restricted to authenticated staff with role-based permissions (RBAC).</li>
            </ul>
          </section>

          <section>
            <h2>5. Sharing of Information with Third Parties</h2>
            <p>
              We do <strong>not</strong> sell, rent, or trade your personal information to marketing agencies or unauthorized third parties. We share information only with trusted service providers necessary for fulfilling your purchase:
            </p>
            <ul>
              <li><strong>Logistics Partners:</strong> Recipient name, address, phone number, and pincode are shared with courier partners (e.g., The Professional Courier) solely for parcel delivery.</li>
              <li><strong>Payment Gateway:</strong> For online checkout, Razorpay processes transaction details under strict PCI-DSS Level 1 compliance.</li>
              <li><strong>Communication Services:</strong> Automated transactional email and WhatsApp updates via official APIs (Meta Cloud API / SMTP).</li>
              <li><strong>Legal Compliance:</strong> We may disclose information if required by law or lawful governmental authorities.</li>
            </ul>
          </section>

          <section>
            <h2>6. Cookies & Tracking Technologies</h2>
            <p>
              Our website uses essential session cookies and local storage only to remember your shopping cart items, theme preferences, and authentication state. We do not use third-party tracking cookies or invasive advertising trackers.
            </p>
          </section>

          <section>
            <h2>7. Customer Rights & Data Retention</h2>
            <p>
              You have the right to access, update, or correct your personal information at any time through your Profile dashboard. If you wish to delete your account or request data removal, please contact our support team. Order records are retained for statutory accounting and warranty fulfillment periods.
            </p>
          </section>

          <div className="policy-contact-box">
            <h3>Grievance & Privacy Inquiries</h3>
            <p>If you have any questions regarding this Privacy Policy or how your data is handled, please contact:</p>
            <p><strong>Business Name:</strong> UDHAYA AQUATICS</p>
            <p><strong>Proprietor:</strong> UDHAYAKUMAR</p>
            <p><strong>Location:</strong> Rajapalayam, Virudhunagar District, Tamil Nadu, India - 626117</p>
            <p><strong>Email:</strong> <a href="mailto:udhaya.aqua.pets@gmail.com">udhaya.aqua.pets@gmail.com</a></p>
            <p><strong>Phone / WhatsApp:</strong> <a href="tel:+916381582969">+91 63815 82969</a></p>
            <p><strong>Support Hours:</strong> 7:00 AM – 9:00 PM (Monday – Sunday)</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PrivacyPolicy;
