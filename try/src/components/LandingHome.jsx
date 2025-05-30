import React from 'react'
import {Link } from 'react-router-dom'
import './hero.css'
import { ArrowRight, TrendingUp, Shield, DollarSign } from 'lucide-react';


const LandingHero = () =>{
  return (
    <section className="landing-hero-section">
      {/* Background decorations */}
      <div className="landing-hero-bg-decoration">
        <div className="landing-hero-decoration-1"></div>
        <div className="landing-hero-decoration-2"></div>
      </div>
      
        <div className="landing-hero-grid">
          <div className="landing-hero-text">
            <h1 className="landing-hero-title">
              Smart Investments for a
              <span className="landing-hero-title-highlight"> Brighter Future</span>
            </h1>
            <p className="landing-hero-subtitle">
              Join thousands of investors who trust our platform to grow their wealth through carefully curated investment opportunities with proven returns.
            </p>
            <div className="landing-hero-buttons">
              <Link to="/auth" className="landing-hero-btn landing-hero-btn-primary">
                Start Investing Today <ArrowRight style={{ marginLeft: '0.5rem' }} />
              </Link>
              <Link to="/auth" className="landing-hero-btn landing-hero-btn-outline">
                Learn More
              </Link>
            </div>
            
            {/* Stats */}
            <div className="landing-hero-stats">
              <div className="landing-hero-stat">
                <div className="landing-hero-stat-value">$2.5B+</div>
                <div className="landing-hero-stat-label">Assets Managed</div>
              </div>
              <div className="landing-hero-stat">
                <div className="landing-hero-stat-value">15.2%</div>
                <div className="landing-hero-stat-label">Avg. Returns</div>
              </div>
              <div className="landing-hero-stat">
                <div className="landing-hero-stat-value">50K+</div>
                <div className="landing-hero-stat-label">Happy Investors</div>
              </div>
            </div>
          </div>
          
          <div className="landing-hero-dashboard-wrapper">
            <div className="landing-hero-dashboard">
              <div className="landing-hero-dashboard-title">Investment Dashboard</div>
              <div className="landing-hero-dashboard-chart">
                <TrendingUp className="landing-hero-dashboard-chart-icon" />
              </div>
              <div className="landing-hero-dashboard-cards">
                <div className="landing-hero-dashboard-card">
                  <div className="landing-hero-dashboard-card-info">
                    <div className="landing-hero-dashboard-card-icon landing-hero-dashboard-card-icon-green">
                      <DollarSign />
                    </div>
                    <div>
                      <div className="landing-hero-dashboard-card-title">Tech Growth Fund</div>
                      <div className="landing-hero-dashboard-card-sub">+18.5% YTD</div>
                    </div>
                  </div>
                  <div className="landing-hero-dashboard-card-value">$12,450</div>
                </div>
                
                <div className="landing-hero-dashboard-card">
                  <div className="landing-hero-dashboard-card-info">
                    <div className="landing-hero-dashboard-card-icon landing-hero-dashboard-card-icon-alt">
                      <Shield />
                    </div>
                    <div>
                      <div className="landing-hero-dashboard-card-title">Stable Income</div>
                      <div className="landing-hero-dashboard-card-sub">+12.3% YTD</div>
                    </div>
                  </div>
                  <div className="landing-hero-dashboard-card-value">$8,920</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
};

export default LandingHero