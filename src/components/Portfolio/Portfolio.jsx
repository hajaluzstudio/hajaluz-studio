import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Film, Target, Compass, Sparkles, Video, Mic, Monitor, Paintbrush, Play, Type, Camera, FilmIcon, Award, X } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { getYouTubeId, getYouTubeThumbnail, isGoogleDriveUrl, getGoogleDriveDirectLink } from '../../services/youtubeHelper';
import './Portfolio.css';

const Portfolio = ({ selectedCategory = 'Todos', setSelectedCategory, dataUpdateTrigger = 0 }) => {
  const containerRef = useRef(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [glitchIdx, setGlitchIdx] = useState(null);
  const [realProjects, setRealProjects] = useState([]);
  const [lightboxMedia, setLightboxMedia] = useState(null);
  const timeoutsRef = useRef({});

  useEffect(() => {
    setRealProjects(dataService.getProjects());
  }, [dataUpdateTrigger]);

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

  const handleMouseEnter = (e, idx) => {
    setHoveredIdx(idx);
    setGlitchIdx(idx);
    
    const video = e.currentTarget.querySelector('.card-video');
    if (video && typeof video.play === 'function') {
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
    if (video && typeof video.pause === 'function') {
      video.pause();
      video.currentTime = 0;
    }
  };

  const handleCardClick = (proj) => {
    const ytId = getYouTubeId(proj.video);
    if (ytId) {
      setLightboxMedia({ type: 'youtube', src: ytId });
    } else if (isGoogleDriveUrl(proj.video)) {
      setLightboxMedia({ type: 'direct', src: getGoogleDriveDirectLink(proj.video) });
    } else if (proj.video.startsWith('data:video') || proj.video.endsWith('.mp4') || proj.video.includes('mixkit.co')) {
      setLightboxMedia({ type: 'direct', src: proj.video });
    } else {
      window.open(proj.video, '_blank');
    }
  };

  const projectsToDisplay = getFilteredProjects();

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

        <div className={`portfolio-grid ${selectedCategory === 'Reels' ? 'reels-grid' : ''}`}>
          {projectsToDisplay.map((proj, idx) => {
            const Icon = proj.icon || categoryIcons[proj.category] || Sparkles;
            const isHovered = hoveredIdx === idx;
            const isGlitching = glitchIdx === idx;

            const ytId = getYouTubeId(proj.video);
            const isYt = !!ytId;
            const isDrive = isGoogleDriveUrl(proj.video);
            
            const coverImage = isYt && (!proj.image || proj.image.startsWith('/logo') || proj.image === '' || proj.image === '/favicon.svg') 
              ? getYouTubeThumbnail(proj.video) 
              : proj.image;

            const videoSource = isDrive ? getGoogleDriveDirectLink(proj.video) : proj.video;
            const isReels = proj.category === 'Reels' || proj.secondaryCategory === 'Reels';

            return (
              <motion.div 
                key={proj.title + idx}
                className={`portfolio-card-wrapper ${isReels ? 'reels-vertical' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                onMouseEnter={(e) => handleMouseEnter(e, idx)}
                onMouseLeave={(e) => handleMouseLeave(e, idx)}
                onClick={() => handleCardClick(proj)}
              >
                <div className={`portfolio-card glass-panel ${isGlitching ? 'glitch-active' : ''} ${proj.isFictive ? 'fictive-card' : ''}`}>
                  {/* Card Media Layer */}
                  <div className="card-media-wrapper">
                    {/* Background Static Image */}
                    <img 
                      src={coverImage} 
                      alt={proj.title} 
                      className={`card-image ${isHovered ? 'image-fade' : ''}`} 
                      onError={(e) => {
                        if (isYt && e.target.src.includes('maxresdefault')) {
                          e.target.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                        }
                      }}
                    />
                    
                    {/* Hover Video Loop */}
                    {isHovered && (
                      isYt ? (
                        <iframe 
                          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0`}
                          className={`card-video video-active`}
                          allow="autoplay; encrypted-media"
                          style={{ border: 'none', pointerEvents: 'none', transform: 'scale(1.35)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }}
                          title={proj.title}
                        />
                      ) : (
                        <video 
                          src={videoSource} 
                          loop 
                          muted 
                          playsInline 
                          autoPlay
                          className={`card-video video-active`}
                        />
                      )
                    )}
                    
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

      {/* Cinematic Lightbox Video Player Modal */}
      <AnimatePresence>
        {lightboxMedia && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxMedia(null)}
          >
            <button className="lightbox-close-btn" onClick={() => setLightboxMedia(null)} aria-label="Fechar cinema">
              <X size={24} />
            </button>
            
            <motion.div 
              className="lightbox-content-box"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '980px', width: '100%' }}
            >
              <div className="video-player-aspect-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid rgba(230, 173, 69, 0.25)', boxShadow: '0 30px 60px rgba(0,0,0,0.9), 0 0 50px rgba(230,173,69,0.05)' }}>
                {lightboxMedia.type === 'youtube' ? (
                  <iframe 
                    src={`https://www.youtube.com/embed/${lightboxMedia.src}?autoplay=1&controls=1&modestbranding=1&rel=0`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    title="Cinema Player"
                  />
                ) : (
                  <video 
                    src={lightboxMedia.src}
                    controls
                    autoPlay
                    playsInline
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000', border: 'none', objectFit: 'contain' }}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
