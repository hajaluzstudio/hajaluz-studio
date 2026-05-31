import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import CartoonAnimation from '../CartoonAnimation/CartoonAnimation';
import './Hero.css';

const Hero = () => {
  const handleScrollToSobre = () => {
    document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section hero-container" id="home">
      {/* Cartoon Animation 100% full screen */}
      <CartoonAnimation />

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator" onClick={handleScrollToSobre} style={{ cursor: 'pointer' }}>
        <span>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown size={20} color="var(--color-accent-gold)" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

