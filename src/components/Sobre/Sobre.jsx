import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import './Sobre.css';

const Sobre = ({ onOpenManifesto }) => {
  const [activeZoomImage, setActiveZoomImage] = useState(null);

  return (
    <section className="sobre-section" id="sobre">
      {/* Background neon ambient glows */}
      <div className="sobre-neon sobre-neon-violet"></div>
      <div className="sobre-neon sobre-neon-cyan"></div>

      <div className="sobre-container">
        
        {/* --- BLOCK 1: ESSÊNCIA & CRIATIVIDADE COM PROPÓSITO --- */}
        <div className="sobre-block block-essencia">
          <div className="sobre-grid-two-col">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="essencia-text-col"
            >
              <span className="sobre-tag">Sobre a Haja Luz</span>
              <h2 className="sobre-heading-large">Criatividade<br />com propósito.</h2>
              <p className="sobre-lead-text">
                A Haja Luz Studio transforma ideias em presença, estratégia e conexão.
              </p>
              
              <div className="concept-scripture-box">
                <span className="scripture-heading">// A Alquimia Híbrida: O Antigo & O Novo</span>
                <p className="scripture-paragraph">
                  Projetamos a mescla perfeita entre a alma da artesania orgânica e o poder matemático da inteligência artificial. Nossos agentes autônomos são inspirados no rigor estético, sabedoria e capacidade de reconstrução de grandes personagens da história — de Bezaleel a Salomão. Unimos o peso fático da direção humana clássica com a velocidade neural do amanhã, criando uma identidade única e inconfundível.
                </p>
              </div>

              {/* Action Button to direct to the rest of the information */}
              <div style={{ marginTop: '2.5rem' }}>
                <button onClick={onOpenManifesto} className="open-manifesto-btn">
                  <span>Visualizar Manifesto Completo</span>
                  <ChevronRight size={14} className="btn-arrow" />
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="essencia-image-col"
            >
              <div 
                className="ceo-photo-wrapper"
                onClick={() => setActiveZoomImage({ src: '/felipe_costa.jpg', title: 'Felipe Costa - CEO Haja Luz Studio' })}
                style={{ cursor: 'pointer' }}
                title="Clique para ampliar"
              >
                <img src="/felipe_costa.jpg" alt="Felipe Costa - CEO Haja Luz Studio" className="ceo-photo" />
                <div className="ceo-photo-scanline"></div>
                <div className="ceo-photo-glow-border"></div>
              </div>
            </motion.div>
          </div>
        </div>

      </div>

      {/* Dynamic Lightbox zoom viewer modal for CEO Portrait */}
      <AnimatePresence>
        {activeZoomImage && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveZoomImage(null)}
          >
            <button className="lightbox-close-btn" onClick={() => setActiveZoomImage(null)} aria-label="Fechar zoom">
              <X size={24} />
            </button>
            
            <motion.div 
              className="lightbox-content-box"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={activeZoomImage.src} alt={activeZoomImage.title} className="lightbox-img" />
              <div className="lightbox-caption">{activeZoomImage.title}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Sobre;
