import './Footer.css';

const Footer = () => (
  <footer className="footer-section">
    <div className="footer-main">
      <div className="footer-links">
        <h4>Customer Care</h4>
        <ul>
          <li>Contact Us</li>
          <li>Shipping</li>
          <li>Returns</li>
          <li>FAQ</li>
        </ul>
      </div>
      <div className="footer-links">
        <h4>Collections</h4>
        <ul>
          <li>Phones</li>
          <li>Headphones</li>
          <li>Smart Watches</li>
          <li>Laptops</li>
        </ul>
      </div>
      <div className="footer-links">
        <h4>Info</h4>
        <ul>
          <li>About Us</li>
          <li>Privacy Policy</li>
          <li>Terms & Conditions</li>
        </ul>
      </div>
      <div className="footer-contact">
        <h4>Contact</h4>
        <p>Email: support@alalamya.com</p>
        <p>Phone: +123 456 7890</p>
        <div className="footer-payments">
          <img src="https://dummyimage.com/40x24/eee/333&text=Visa" alt="Visa" />
          <img src="https://dummyimage.com/40x24/ddd/333&text=MC" alt="MasterCard" />
          <img src="https://dummyimage.com/40x24/ccc/333&text=PayPal" alt="PayPal" />
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2024 Alalamya. All rights reserved.</span>
    </div>
  </footer>
);

export default Footer; 