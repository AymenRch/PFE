import React from 'react';
import LandingHero from '../components/LandingHome';
import Features from '../components/Features';
import About from '../components/About';
import Footer from '../components/Footer';
import Header from '../components/Header'


const LandingPage = () => {
  return (
    <div>
      <Header/>
      <section id="hero">
        <LandingHero />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="contact">
        {/* You can add a Contact component or content here if needed */}
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;