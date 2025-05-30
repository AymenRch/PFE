import React from 'react';
import './Footer.css';
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-root">
      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <h2 className="footer-newsletter-title">Stay Updated with Market Insights</h2>
        <p className="footer-newsletter-desc">
          Get exclusive investment tips, market analysis, and new opportunities delivered to your inbox.
        </p>
        <form className="footer-newsletter-form" onSubmit={e => e.preventDefault()}>
          <input type="email" className="footer-newsletter-input" placeholder="Enter your email" required />
          <button type="submit" className="footer-newsletter-btn">Subscribe</button>
        </form>
      </div>

      {/* Main Footer Section */}
      <div className="footer-main">
        <div className="footer-col footer-brand">
          <div className="footer-logo">Grow<span style={{color:'#00915C'}}>Vest</span></div>
          <div className="footer-brand-desc">
            Your trusted partner in building wealth through smart investments. We're committed to helping you achieve your financial goals.
          </div>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Investment Options</div>
          <ul className="footer-list">
            <li>Real Estate</li>
            <li>Technology Startups</li>
            <li>Green Energy</li>
            <li>Healthcare</li>
            <li>Infrastructure</li>
            <li>Private Equity</li>
          </ul>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Resources</div>
          <ul className="footer-list">
            <li>Investment Guide</li>
            <li>Market Analysis</li>
            <li>Risk Assessment</li>
            <li>Tax Information</li>
            <li>FAQ</li>
            <li>Support</li>
          </ul>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Contact Us</div>
          <ul className="footer-contact-list">
            <li><MapPin size={16} /> 123 Financial District, New York, NY 10004</li>
            <li><Phone size={16} /> +1 (555) 123-4567</li>
            <li><Mail size={16} /> info@growvest.com</li>
          </ul>
          <div className="footer-support-box">
            <div className="footer-support-title">Customer Support</div>
            <div className="footer-support-desc">Available 24/7 to help with your investments</div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-copyright">
          © 2024 GrowVest. All rights reserved.
        </div>
        <div className="footer-policies">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
          <a href="#">Disclaimer</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;