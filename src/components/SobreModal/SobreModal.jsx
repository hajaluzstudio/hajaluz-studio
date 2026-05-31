import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, Maximize2, FolderOpen } from 'lucide-react';
import './SobreModal.css';

const SobreModal = ({ isOpen, onClose }) => {
  const [activeZoomImage, setActiveZoomImage] = useState(null);
  const [tiltStyle, setTiltStyle] = useState({});

  // Disable background scrolling when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const backstagePhotos = [
    { src: '/felipe_costa_collage.jpg', title: 'Felipe Costa // Ensaios de Direção Criativa' },
    { src: '/felipe_tv_studio.jpg', title: 'Estúdio de TV // Gravações e Entrevistas' },
    { src: '/galo_felipe.jpg', title: 'Felipe Costa & Neto Fagundes // Galpão Crioulo' },
    { src: '/joel_marques_felipe.jpg', title: 'Felipe Costa & Joel Marques // Parceria de Legado' },
    { src: '/borghetti_felipe.jpg', title: 'Felipe Costa & Renato Borghetti // O Grande Encontro' },
    { src: '/oswaldir_felipe.jpg', title: 'Felipe Costa & Oswaldir // Direção & Legado' }
  ];

  const instagramPosts = [
    { src: '/shark.png', title: 'Produção Comercial de Luxo // Shark' },
    { src: '/felipe_costa.jpg', title: 'Felipe Costa // Diretor Criativo & Fundador' },
    { src: '/felipe_costa_collage.jpg', title: 'Direção de Cena // Ensaios e Expressões' },
    { src: '/felipe_tv_studio.jpg', title: 'Produção em Estúdio // TV e Bastidores' },
    { src: '/galo_felipe.jpg', title: 'Felipe Costa & Neto Fagundes // Gravação no Galpão Crioulo' },
    { src: '/joel_marques_felipe.jpg', title: 'Felipe Costa & Joel Marques // Parceria Histórica' },
    { src: '/borghetti_felipe.jpg', title: 'Felipe Costa & Renato Borghetti // O Grande Encontro' },
    { src: '/oswaldir_felipe.jpg', title: 'Felipe Costa & Oswaldir // Direção de Clipes' }
  ];

  // 3D Parallax Tilt Effect for smartphone mockup
  const handleMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Calculate rotation degree (max 10 degrees rotation for safety)
    const rotateX = -(y / (rect.height / 2)) * 10;
    const rotateY = (x / (rect.width / 2)) * 10;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease'
    });
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const dashboardVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 40 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 240, damping: 26 } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.96, 
      y: 20,
      transition: { duration: 0.2 } 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 90, damping: 14 }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="sobre-modal-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div 
          className="sobre-modal-container glass-panel museum-book-style"
          variants={dashboardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Panel */}
          <div className="sobre-modal-header">
            <div className="sobre-modal-header-title-wrap">
              <Terminal size={18} className="sobre-modal-header-icon" />
              <span className="sobre-modal-header-title">Haja Luz Studio // Manifesto & Direção Estratégica</span>
            </div>
            
            <button className="sobre-modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={18} />
            </button>
          </div>

          {/* Modal Scrollable Workspace */}
          <div className="sobre-modal-body museum-book-body">
            
            {/* --- PAGE 1: DIREÇÃO DE CRIAÇÃO (CEO - FELIPE COSTA) --- */}
            <div className="book-page-first">
              <motion.div 
                className="book-page-first-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="director-museum-portrait-wrapper" variants={itemVariants}>
                  <img 
                    src="/felipe_costa.jpg" 
                    alt="Felipe Costa // Diretor Criativo" 
                    className="director-museum-portrait"
                    onClick={() => setActiveZoomImage({ src: '/felipe_costa.jpg', title: 'Felipe Costa // Diretor Criativo & Fundador' })}
                    style={{ cursor: 'zoom-in' }}
                  />
                  <div className="cinematic-photo-zoom-icon" style={{ bottom: '15px', right: '15px', opacity: 1, transform: 'scale(1)' }}>
                    <Maximize2 size={12} />
                  </div>
                </motion.div>

                <motion.span className="sobre-modal-tag" style={{ color: 'var(--color-accent-gold)', marginBottom: '0.5rem' }} variants={itemVariants}>
                  Diretor Criativo
                </motion.span>
                
                <motion.h2 className="book-title-gold" variants={itemVariants}>
                  Felipe Costa
                </motion.h2>
                
                <motion.div className="book-subtitle-spaced" variants={itemVariants}>
                  Criação Híbrida
                </motion.div>

                <motion.div className="book-bio-paragraphs" variants={containerVariants}>
                  <motion.p className="book-bio-paragraph" variants={itemVariants}>
                    Como CEO da Haja Luz Studio, Felipe Costa lidera uma verdadeira "casa de ideias" focada em transformar conceitos em presença, estratégia e conexão. Com formação em Design Gráfico e pós-graduação em Produção Audiovisual, Felipe possui uma longa trajetória no mercado, incluindo uma passagem de destaque pelo Grupo RBS TV.
                  </motion.p>
                  
                  <motion.p className="book-bio-paragraph" variants={itemVariants}>
                    Atuando como diretor criativo com especialização em motion design e VFX, Felipe construiu um portfólio robusto, tendo colaborado com nomes como o cantor Sergio Reis e prestando assessoria contínua ao cantor Oswaldir.
                  </motion.p>

                  <motion.div className="book-bio-quote" variants={itemVariants}>
                    "Muitas pessoas criticam a criação com IA, mas ela é uma ferramenta, assim como o Adobe After Effects ou Illustrator. Ela não faz por você; ela faz o que você direciona. A automação de agentes de IA ajuda muito, mas o storytelling e o briefing continuam sendo humanos, assim como a execução final."
                  </motion.div>

                  <motion.p className="book-bio-paragraph" variants={itemVariants}>
                    Sua abordagem diferencia-se pela atuação híbrida, unindo a sensibilidade da direção humana clássica à potência da inteligência artificial. Para Felipe, a IA é uma aliada estratégica: ela automatiza o workflow enquanto o storytelling e o briefing permanecem sob absoluto controle humano, garantindo um resultado final único.
                  </motion.p>

                  <motion.p className="book-bio-paragraph" variants={itemVariants}>
                    Sob sua liderança, a Haja Luz Studio consolida-se como uma produtora híbrida de referência, onde a alma da artesania orgânica encontra a velocidade neural do amanhã para criar identidades únicas e inconfundíveis.
                  </motion.p>
                </motion.div>
              </motion.div>
            </div>

            {/* --- BLOCK 2: HISTÓRIAS EM FORMA & PROPÓSITO --- */}
            <div className="sobre-modal-block block-historias" style={{ paddingTop: '2rem' }}>
              <div className="sobre-modal-grid reversed">
                <div className="historias-text-col">
                  <span className="sobre-modal-tag">Experiência que conecta</span>
                  <h3 className="sobre-modal-heading">Histórias que ganham forma.</h3>
                  <p className="sobre-modal-body-text" style={{ marginBottom: '1.5rem' }}>
                    Produções, campanhas e projetos de alta fidelidade que conectam pessoas, marcas e cultura. Cada parceria da Haja Luz Studio é construída sobre bases sólidas de confiança, criatividade fática e excelência técnica.
                  </p>
                  <button 
                    onClick={() => {
                      window.location.search = '?category=todos';
                    }} 
                    className="museum-portfolio-access-btn"
                  >
                    <FolderOpen size={15} />
                    <span>Acessar Portfólio Completo</span>
                  </button>
                </div>

                <div className="historias-image-col">
                  <div 
                    className="cinematic-photo-wrapper"
                    onClick={() => setActiveZoomImage({ src: '/sergio_reis_felipe.jpg', title: 'Felipe Costa & Sergio Reis // Parceria de Sucesso' })}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src="/sergio_reis_felipe.jpg" alt="Felipe Costa & Sergio Reis" className="cinematic-photo" />
                    <div className="cinematic-photo-glow"></div>
                    <div className="cinematic-photo-zoom-icon">
                      <Maximize2 size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- BLOCK 3: POETIC QUOTE --- */}
            <div className="sobre-modal-quote-section">
              <div className="quote-gold-divider"></div>
              <p className="poetic-quote-text">
                "Nada é criado por acaso. Tudo tem luz, intenção e direção."
              </p>
              <span className="quote-author">Felipe Costa // Fundador da Haja Luz Studio</span>
              <div className="quote-gold-divider"></div>
            </div>

            {/* --- BLOCK 4: CONEXÕES & INSTAGRAM --- */}
            <div className="sobre-modal-block block-conexoes">
              <div className="sobre-modal-grid">
                
                {/* Interactive Instagram Smartphone Mockup */}
                <div className="conexoes-phone-col">
                  <span className="sobre-modal-tag" style={{ alignSelf: 'flex-start' }}>Acompanhe Meu Dia a Dia</span>
                  
                  <div 
                    className="smartphone-iphone-container"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={tiltStyle}
                  >
                    <div className="iphone-speaker-notch"></div>
                    <div className="iphone-screen-header">
                      <span className="iphone-time">18:20</span>
                      <div className="iphone-signals">
                        <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" style={{ marginRight: '3px' }}>
                          <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.07 19.66 10.48 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                        </svg>
                        <span className="iphone-battery">99%</span>
                      </div>
                    </div>

                    <div className="instagram-app-viewport">
                      <div className="ig-header-bar">
                        <span className="ig-username">felipecostaoficial</span>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="ig-top-icon">
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                        </svg>
                      </div>

                      <div className="ig-profile-stats-row">
                        <div className="ig-avatar-wrap">
                          <img src="/felipe_costa.jpg" alt="Felipe Costa" className="ig-avatar-photo" />
                        </div>
                        
                        <div className="ig-stats-box">
                          <div className="ig-stat-col">
                            <span className="stat-number">112</span>
                            <span className="stat-label">posts</span>
                          </div>
                          <div className="ig-stat-col">
                            <span className="stat-number">7.348</span>
                            <span className="stat-label">seguidores</span>
                          </div>
                          <div className="ig-stat-col">
                            <span className="stat-number">420</span>
                            <span className="stat-label">seguindo</span>
                          </div>
                        </div>
                      </div>

                      <div className="ig-bio-box">
                        <span className="ig-fullname">Felipe Costa</span>
                        <span className="ig-category">Criador(a) de conteúdo digital</span>
                        <span className="ig-bio-text">
                          EDITOR MIDIA AUDIOVISUAL @rbstv<br />
                          DESIGN GRÁFICO | MOTION DESIGN<br />
                          Portfólio ⬇️
                        </span>
                        <a href="https://www.hajaluz.studio" target="_blank" rel="noopener noreferrer" className="ig-link-text">
                          www.hajaluz.studio
                        </a>
                      </div>

                      <div className="ig-highlights-row">
                        <div className="ig-highlight-bubble">
                          <div className="highlight-img-wrap"><img src="/traco_e_tom.png" alt="Highlight" /></div>
                          <span className="highlight-label">Traço e Tom</span>
                        </div>
                        <div className="ig-highlight-bubble">
                          <div className="highlight-img-wrap"><img src="/destino_de_peao.png" alt="Highlight" /></div>
                          <span className="highlight-label">Destino de Peão</span>
                        </div>
                        <div className="ig-highlight-bubble">
                          <div className="highlight-img-wrap"><img src="/shark.png" alt="Highlight" /></div>
                          <span className="highlight-label">Shark</span>
                        </div>
                        <div className="ig-highlight-bubble">
                          <div className="highlight-img-wrap"><img src="/piquezin_do_sul.png" alt="Highlight" /></div>
                          <span className="highlight-label">Piquezin do Sul</span>
                        </div>
                      </div>

                      <div className="ig-buttons-row">
                        <button className="ig-btn ig-btn-primary">Seguindo</button>
                        <button className="ig-btn">Mensagem</button>
                        <a href="https://wa.me/5554991109159" target="_blank" rel="noopener noreferrer" className="ig-btn">WhatsApp</a>
                      </div>

                      <div className="ig-scroll-hint">// Role para ver mais posts ⬇️</div>

                      {/* Interactive grid posts preview list */}
                      <div className="ig-posts-grid-mock">
                        {instagramPosts.map((post, idx) => (
                          <div 
                            key={idx} 
                            className="grid-post-item"
                            onClick={() => setActiveZoomImage(post)}
                            style={{ cursor: 'zoom-in' }}
                            title="Clique para ampliar"
                          >
                            <img src={post.src} alt={post.title} />
                            <div className="post-overlay-zoom">
                              <Maximize2 size={12} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Backstages Collage Grid */}
                <div className="conexoes-grid-col">
                  <span className="sobre-modal-tag">Experiências em repertório</span>
                  <h3 className="sobre-modal-heading">Projetos e conexões</h3>
                  <p className="sobre-modal-body-text" style={{ marginBottom: '2.5rem' }}>
                    Alguns dos artistas, marcas, captações fáticas e criações neurais de vanguarda que fazem parte da história do estúdio.
                  </p>

                  <div className="backstages-collage-grid">
                    {backstagePhotos.map((photo, index) => (
                      <div 
                        key={index} 
                        className="collage-photo-wrapper glass-panel"
                        onClick={() => setActiveZoomImage(photo)}
                        style={{ cursor: 'zoom-in' }}
                      >
                        <img src={photo.src} alt={photo.title} className="collage-photo" />
                        <div className="collage-photo-overlay">
                          <span className="collage-photo-title">{photo.title}</span>
                          <Maximize2 size={12} className="collage-zoom-icon" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>

      {/* Dynamic Lightbox zoom viewer modal */}
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
    </AnimatePresence>
  );
};

export default SobreModal;
