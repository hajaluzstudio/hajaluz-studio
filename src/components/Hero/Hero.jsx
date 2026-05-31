import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MessageSquare } from 'lucide-react';
import MagneticButton from '../MagneticButton/MagneticButton';
import './Hero.css';

const Hero = () => {
  const handleWhatsAppRedirect = () => {
    const phone = "5554991109159";
    const text = encodeURIComponent("Olá! Gostaria de solicitar um posicionamento estratégico e conhecer o Método da Haja Luz Studio.");
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleScrollToSobre = () => {
    document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' });
  };

  const titleText = "Haja Luz Studio";
  const subtitleText = "Onde a direção humana e o futuro digital se encontram.";

  return (
    <section className="hero-section hero-container" id="home">
      {/* Ambient Neon lights */}
      <div className="hero-neon-light hero-neon-cyan"></div>
      <div className="hero-neon-light hero-neon-violet"></div>

      {/* Centered Content Column */}
      <div className="hero-centered-content">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-brand"
        >
          // Artesania Física & Potência Neural
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hero-title-main"
        >
          {titleText}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="hero-subtitle-main"
        >
          {subtitleText}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="hero-cta"
        >
          <MagneticButton onClick={handleWhatsAppRedirect}>
            <span className="hero-cta-btn-content">
              <MessageSquare size={18} className="cta-icon" />
              Falar no WhatsApp
            </span>
          </MagneticButton>
        </motion.div>
      </div>

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

