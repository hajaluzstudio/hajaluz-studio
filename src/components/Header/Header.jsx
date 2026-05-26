import React, { useState, useEffect } from 'react';
import { brandConfig } from '../../brandConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Video, Mic, Film, Sparkles, Monitor, Paintbrush, Play, Type, Camera, FilmIcon, Award, Compass } from 'lucide-react';
import './Header.css';

const Header = ({ onEquipeClick, onSobreClick, onCategoryClick }) => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScrollEvent = () => {
      if (window.scrollY > 25) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScrollEvent);
    return () => window.removeEventListener('scroll', handleScrollEvent);
  }, []);

  const portfolioCategories = [
    { name: 'Reels', icon: Video, desc: 'Vídeos dinâmicos de alto engajamento.' },
    { name: 'Entrevistas', icon: Mic, desc: 'Conversas e diálogos profundos.' },
    { name: 'Podcast\'s', icon: Compass, desc: 'Gravações em estúdio de alta fidelidade.' },
    { name: 'Clipes', icon: Play, desc: 'Produções musicais cinematográficas.' },
    { name: 'Aniversários', icon: Award, desc: 'Eventos e memórias inesquecíveis.' },
    { name: 'Sites', icon: Monitor, desc: 'Portais digitais de alta costura.' },
    { name: 'Design Gráfico', icon: Paintbrush, desc: 'Identidade visual e peças premium.' },
    { name: 'Motion Design', icon: Sparkles, desc: 'Animações gráficas sofisticadas.' },
    { name: 'Logotipo', icon: Type, desc: 'Marcas fortes com DNA estratégico.' },
    { name: 'Fotografia', icon: Camera, desc: 'Captação fática e lentes de cinema.' },
    { name: 'Documentário', icon: FilmIcon, desc: 'Histórias reais com peso marrativo.' },
    { name: 'Produção de Show', icon: Film, desc: 'Cobertura de eventos de grande porte.' },
  ];

  const megaMenuVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.4, 
        ease: [0.16, 1, 0.3, 1] 
      }
    },
    exit: { 
      opacity: 0, 
      y: 10, 
      scale: 0.98,
      transition: { 
        duration: 0.25, 
        ease: 'easeIn' 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.02,
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  };

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : 'header-transparent'}`}>
      <div className="header-logo" onClick={() => handleScroll('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <img 
          src={brandConfig.logoUrl} 
          alt="Haja Luz Studio Logo" 
          style={{ width: brandConfig.headerLogoWidth, height: brandConfig.headerLogoHeight, objectFit: 'contain' }}
          className="logo-img" 
        />
      </div>

      <nav className="header-nav">
        <a href="#home" onClick={(e) => { e.preventDefault(); handleScroll('home'); }}>Início</a>
        <a href="#sobre" onClick={(e) => { e.preventDefault(); onSobreClick && onSobreClick(); }}>Sobre</a>
        
        {/* Navigation portfolio with Mega Menu dropdown */}
        <div 
          className="nav-portfolio-wrapper"
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          onMouseLeave={() => setIsMegaMenuOpen(false)}
        >
          <a 
            href="#portfolio" 
            className={`nav-portfolio-trigger ${isMegaMenuOpen ? 'active' : ''}`}
            onClick={(e) => { 
              e.preventDefault(); 
              if (onCategoryClick) {
                onCategoryClick('todos');
              } else {
                window.location.search = '?category=todos';
              }
            }}
          >
            Portfólio <ChevronDown size={14} className="chevron-icon" />
          </a>

          <AnimatePresence>
            {isMegaMenuOpen && (
              <motion.div 
                className="mega-menu-container glass-panel"
                variants={megaMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="mega-menu-grid">
                  {portfolioCategories.map((cat, index) => {
                    const Icon = cat.icon;
                    return (
                      <motion.div 
                        key={cat.name}
                        className="mega-menu-item"
                        custom={index}
                        variants={itemVariants}
                        whileHover={{ x: 6, transition: { duration: 0.2 } }}
                        onClick={() => {
                          const slug = cat.name.toLowerCase().replace("'", "");
                          if (onCategoryClick) {
                            onCategoryClick(slug);
                          } else {
                            window.location.search = '?category=' + encodeURIComponent(slug);
                          }
                          setIsMegaMenuOpen(false);
                        }}
                      >
                        <div className="mega-item-icon-wrapper">
                          <Icon size={16} className="mega-item-icon" />
                        </div>
                        <div className="mega-item-text">
                          <span className="mega-item-name">{cat.name}</span>
                          <span className="mega-item-desc">{cat.desc}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <a href="#equipe" onClick={(e) => { e.preventDefault(); onEquipeClick && onEquipeClick(); }}>Equipe</a>
        <a href="#contato" onClick={(e) => { e.preventDefault(); handleScroll('contato'); }}>Contatos</a>
      </nav>
    </header>
  );
};

export default Header;
