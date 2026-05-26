import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Film, Target, Compass, Sparkles, Video, Mic, Monitor, Paintbrush, Play, Type, Camera, FilmIcon, Award } from 'lucide-react';
import './Portfolio.css';

const Portfolio = ({ selectedCategory = 'Todos', setSelectedCategory }) => {
  const containerRef = useRef(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [glitchIdx, setGlitchIdx] = useState(null);
  const timeoutsRef = useRef({});

  const allCategories = [
    'Todos',
    'Reels',
    'Entrevistas',
    'Podcast\'s',
    'Clipes',
    'Aniversários',
    'Sites',
    'Design Gráfico',
    'Motion Design',
    'Logotipo',
    'Fotografia',
    'Documentário',
    'Produção de Show'
  ];

  const realProjects = [
    {
      title: 'Traço e Tom',
      category: 'Clipes',
      secondaryCategory: 'Podcast\'s',
      image: '/traco_e_tom.png',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-electronic-music-dj-playing-at-club-41712-large.mp4',
      icon: Film,
      isReal: true
    },
    {
      title: 'Destino de Peão',
      category: 'Documentário',
      secondaryCategory: 'Entrevistas',
      image: '/destino_de_peao.png',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-misty-mountains-and-pine-trees-43224-large.mp4',
      icon: Compass,
      isReal: true
    },
    {
      title: 'Piquezin do Sul',
      category: 'Reels',
      secondaryCategory: 'Motion Design',
      image: '/piquezin_do_sul.png',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-graphic-animation-of-futuristic-lines-and-dots-41617-large.mp4',
      icon: Sparkles,
      isReal: true
    },
    {
      title: 'Shark',
      category: 'Design Gráfico',
      secondaryCategory: 'Logotipo',
      image: '/shark.png',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-lines-rotating-in-a-loop-41616-large.mp4',
      icon: Target,
      isReal: true
    }
  ];

  const categoryIcons = {
    'Reels': Video,
    'Entrevistas': Mic,
    'Podcast\'s': Compass,
    'Clipes': Play,
    'Aniversários': Award,
    'Sites': Monitor,
    'Design Gráfico': Paintbrush,
    'Motion Design': Sparkles,
    'Logotipo': Type,
    'Fotografia': Camera,
    'Documentário': FilmIcon,
    'Produção de Show': Film,
    'Todos': Target
  };

  const getFilteredProjects = () => {
    if (selectedCategory === 'Todos') {
      return realProjects;
    }

    const matchingReal = realProjects.filter(p => 
      p.category === selectedCategory || p.secondaryCategory === selectedCategory
    );

    const placeholderImages = [
      '/bezaleel.png',
      '/enoque.png',
      '/calebe.png'
    ];

    const placeholderVideos = [
      'https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-lines-rotating-in-a-loop-41616-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-graphic-animation-of-futuristic-lines-and-dots-41617-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-misty-mountains-and-pine-trees-43224-large.mp4'
    ];

    const fictiveProjects = [
      {
        title: `${selectedCategory} // Produção Fictícia #01`,
        category: selectedCategory,
        image: placeholderImages[0],
        video: placeholderVideos[0],
        icon: categoryIcons[selectedCategory] || Sparkles,
        isFictive: true
      },
      {
        title: `${selectedCategory} // Produção Fictícia #02`,
        category: selectedCategory,
        image: placeholderImages[1],
        video: placeholderVideos[1],
        icon: categoryIcons[selectedCategory] || Compass,
        isFictive: true
      },
      {
        title: `${selectedCategory} // Produção Fictícia #03`,
        category: selectedCategory,
        image: placeholderImages[2],
        video: placeholderVideos[2],
        icon: categoryIcons[selectedCategory] || Film,
        isFictive: true
      }
    ];

    return [...matchingReal, ...fictiveProjects];
  };

  const projectsToDisplay = getFilteredProjects();

  const handleMouseEnter = (e, idx) => {
    setHoveredIdx(idx);
    setGlitchIdx(idx);
    
    const video = e.currentTarget.querySelector('.card-video');
    if (video) {
      video.play().catch(() => {});
    }

    if (timeoutsRef.current[idx]) clearTimeout(timeoutsRef.current[idx]);
    timeoutsRef.current[idx] = setTimeout(() => {
      setGlitchIdx(null);
    }, 500);
  };

  const handleMouseLeave = (e, idx) => {
    setHoveredIdx(null);
    setGlitchIdx(null);
    if (timeoutsRef.current[idx]) clearTimeout(timeoutsRef.current[idx]);
    
    const video = e.currentTarget.querySelector('.card-video');
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <section className="portfolio-section" id="portfolio" ref={containerRef}>
      <div className="portfolio-container">
        <motion.div 
          className="portfolio-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="portfolio-subtitle">Galeria de Destaques</span>
          <h2 className="portfolio-title">Nosso Portfólio</h2>
          <p className="portfolio-description-lead">
            Uma seleção de produções autorais e comerciais de alto impacto visual, onde a direção humana orgânica encontra o poder sintético digital.
          </p>
        </motion.div>

        {/* Categories horizontal scrolling filter bar */}
        <div className="portfolio-filters-wrapper">
          <div className="portfolio-filters-container">
            {allCategories.map((cat) => {
              const Icon = categoryIcons[cat] || Target;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`portfolio-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                >
                  <Icon size={13} className="filter-btn-icon" />
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="portfolio-grid">
          {projectsToDisplay.map((proj, idx) => {
            const Icon = proj.icon;
            const isHovered = hoveredIdx === idx;
            const isGlitching = glitchIdx === idx;

            return (
              <motion.div 
                key={proj.title}
                className="portfolio-card-wrapper"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                onMouseEnter={(e) => handleMouseEnter(e, idx)}
                onMouseLeave={(e) => handleMouseLeave(e, idx)}
              >
                <div className={`portfolio-card glass-panel ${isGlitching ? 'glitch-active' : ''} ${proj.isFictive ? 'fictive-card' : ''}`}>
                  {/* Card Media Layer */}
                  <div className="card-media-wrapper">
                    {/* Background Static Image */}
                    <img 
                      src={proj.image} 
                      alt={proj.title} 
                      className={`card-image ${isHovered ? 'image-fade' : ''}`} 
                    />
                    
                    {/* Hover Video Loop */}
                    <video 
                      src={proj.video} 
                      loop 
                      muted 
                      playsInline 
                      className={`card-video ${isHovered ? 'video-active' : ''}`}
                    />
                    
                    {/* TV Static Noise Overlay for Glitch */}
                    {isGlitching && <div className="static-noise-overlay"></div>}
                    
                    <div className="card-image-overlay"></div>

                    {/* Fictive Badge overlay */}
                    {proj.isFictive && (
                      <div className="fictive-badge">
                        <span>Fictício // Aguardando Arquivo</span>
                      </div>
                    )}
                  </div>

                  {/* Glassmorphic Project Info Card */}
                  <div className="project-info glass-panel">
                    <div className="project-meta">
                      <div className="project-icon-wrapper">
                        <Icon size={14} />
                      </div>
                      <span className="project-category">
                        {proj.isFictive ? `${proj.category} (Fictício)` : proj.category}
                      </span>
                    </div>
                    <div className="project-title-row">
                      <h3 className="project-title">{proj.title}</h3>
                      <div className="project-link-icon">
                        <ExternalLink size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
