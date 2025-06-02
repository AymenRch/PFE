import React from 'react';
import './About.css';
import { Award, Shield, Users, Globe } from 'lucide-react';

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-video-wrapper about-animate-left">
          <video
            className="about-video"
            src="http://localhost:9000/uploads/video.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
        <div className="about-description about-animate-right">
          <h2 className="about-title">
            About <span className="about-title-highlight">GrowVest</span>
          </h2>
          <p className="about-lead">
            Since 2015, we've been democratizing access to premium investment opportunities. Our platform combines cutting-edge technology with expert financial analysis to deliver superior returns for our investors.
          </p>
          <div className="about-features-grid">
            <div className="about-feature-card">
              <div className="about-feature-icon about-feature-icon-bg"><Award size={28} /></div>
              <div>
                <div className="about-feature-title">Award Winning</div>
                <div className="about-feature-desc">Recognized as the "Best Investment Platform" by FinTech Awards 2023</div>
              </div>
            </div>
            <div className="about-feature-card">
              <div className="about-feature-icon about-feature-icon-bg-alt"><Shield size={28} /></div>
              <div>
                <div className="about-feature-title">Secure & Regulated</div>
                <div className="about-feature-desc">SEC registered and fully compliant with financial regulations</div>
              </div>
            </div>
            <div className="about-feature-card">
              <div className="about-feature-icon about-feature-icon-bg"><Users size={28} /></div>
              <div>
                <div className="about-feature-title">Expert Team</div>
                <div className="about-feature-desc">50+ investment professionals with decades of experience</div>
              </div>
            </div>
            <div className="about-feature-card">
              <div className="about-feature-icon about-feature-icon-bg-alt"><Globe size={28} /></div>
              <div>
                <div className="about-feature-title">Global Reach</div>
                <div className="about-feature-desc">Investment opportunities across 25+ countries worldwide</div>
              </div>
            </div>
          </div>
          <div className="about-mission-box">
            <div className="about-mission-title">Our Mission</div>
            <div className="about-mission-desc">
              To make sophisticated investment strategies accessible to everyone, while maintaining the highest standards of transparency, security, and performance.
            </div>
          </div>
          <div className="about-buttons-row">
            <button className="about-btn about-btn-primary">Learn More About Us</button>
            <button className="about-btn about-btn-outline">View Our Team</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;