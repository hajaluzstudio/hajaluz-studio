import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Film, Target, Compass, Sparkles, Video, Mic, Monitor, Paintbrush, Play, Type, Camera, FilmIcon, Award, X } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { getYouTubeId, getYouTubeThumbnail, isGoogleDriveUrl, getGoogleDriveDirectLink, getGoogleDriveId } from '../../services/youtubeHelper';
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
    const hasCarousel = proj.carouselImages && proj.carouselImages.length > 0;
    
    if (proj.category === 'Aniversários' || hasCarousel) {
      setLightboxMedia({
        type: 'event',
        title: proj.title,
        description: proj.description || '',
        video: proj.video ? (getYouTubeId(proj.video) ? { type: 'youtube', src: getYouTubeId(proj.video) } : isGoogleDriveUrl(proj.video) ? { type: 'drive', src: getGoogleDriveId(proj.video) } : { type: 'direct', src: proj.video }) : null,
        images: proj.carouselImages || [],
        currentIndex: 0,
        views: proj.views || ''
      });
      return;
    }

    const ytId = getYouTubeId(proj.video);
    if (ytId) {
      setLightboxMedia({ type: 'youtube', src: ytId, title: proj.title, views: proj.views || '' });
    } else if (isGoogleDriveUrl(proj.video)) {
      setLightboxMedia({ type: 'drive', src: getGoogleDriveId(proj.video), title: proj.title, views: proj.views || '' });
    } else if (proj.video && (proj.video.startsWith('data:video') || proj.video.endsWith('.mp4') || proj.video.includes('mixkit.co'))) {
      setLightboxMedia({ type: 'direct', src: proj.video, title: proj.title, views: proj.views || '' });
    } else {
      window.open(proj.video || proj.image, '_blank');
    }
  };

  const handleNextSlide = () => {
    setLightboxMedia(prev => {
      if (!prev || !prev.images || prev.images.length === 0) return prev;
      const nextIdx = (prev.currentIndex + 1) % prev.images.length;
      return { ...prev, currentIndex: nextIdx };
    });
  };

  const handlePrevSlide = () => {
    setLightboxMedia(prev => {
      if (!prev || !prev.images || prev.images.length === 0) return prev;
      const prevIdx = (prev.currentIndex - 1 + prev.images.length) % prev.images.length;
      return { ...prev, currentIndex: prevIdx };
    });
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
            const hasCustomCover = proj.image && !proj.image.startsWith('/logo') && proj.image !== '' && proj.image !== '/favicon.png';
            const videoSource = isDrive ? getGoogleDriveDirectLink(proj.video) : proj.video;
            const isReels = proj.category === 'Reels' || proj.secondaryCategory === 'Reels';

            let coverImage = proj.image;
            let useVideoCover = false;

            if (isYt) {
              if (!hasCustomCover) {
                coverImage = getYouTubeThumbnail(proj.video);
              }
            } else if (videoSource && !hasCustomCover) {
              useVideoCover = !isDrive;
            }

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
                    {/* Background Static Image or Preloaded Video Cover */}
                    {useVideoCover ? (
                      <video 
                        src={videoSource} 
                        preload="metadata" 
                        className={`card-image ${isHovered ? 'image-fade' : ''}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <img 
                        src={coverImage || '/favicon.png'} 
                        alt={proj.title} 
                        className={`card-image ${isHovered ? 'image-fade' : ''}`} 
                        onError={(e) => {
                          if (isYt && e.target.src.includes('maxresdefault')) {
                            e.target.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                          }
                        }}
                      />
                    )}
                    
                    {/* Hover Video Loop */}
                    {isHovered && (
                      isYt ? (
                        <iframe 
                          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&vq=hd1080`}
                          className={`card-video video-active`}
                          allow="autoplay; encrypted-media"
                          style={{ border: 'none', pointerEvents: 'none', transform: 'scale(1.35)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }}
                          title={proj.title}
                        />
                      ) : isDrive ? (
                        <div 
                          className="card-video video-active drive-hover-placeholder" 
                          style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '100%', 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            background: 'rgba(5, 3, 2, 0.78)', 
                            border: '1.5px solid rgba(230, 173, 69, 0.35)', 
                            gap: '0.8rem', 
                            zIndex: 2,
                            backdropFilter: 'blur(3px)'
                          }}
                        >
                          <div 
                            style={{ 
                              width: '46px', 
                              height: '46px', 
                              borderRadius: '50%', 
                              background: 'rgba(230, 173, 69, 0.12)', 
                              border: '1.5px solid var(--color-accent-gold)', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              color: 'var(--color-accent-gold)', 
                              boxShadow: '0 0 18px rgba(230, 173, 69, 0.35)',
                              animation: 'pulse-star 2s infinite ease-in-out'
                            }}
                          >
                            <Play size={18} fill="var(--color-accent-gold)" style={{ marginLeft: '2px' }} />
                          </div>
                          <span 
                            style={{ 
                              fontSize: '0.6rem', 
                              fontFamily: 'Space Grotesk, monospace', 
                              color: 'var(--color-accent-gold)', 
                              textTransform: 'uppercase', 
                              letterSpacing: '0.1em',
                              fontWeight: 600
                            }}
                          >
                            Abrir no Cinema
                          </span>
                        </div>
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
              style={{ maxWidth: lightboxMedia.type === 'event' ? '1100px' : '980px', width: '100%' }}
            >
              {lightboxMedia.type === 'event' ? (
                /* EVENT SLIDESHOW AND DETAILS MODE */
                <div className="event-lightbox-container" style={{ display: 'grid', gridTemplateColumns: lightboxMedia.video ? '1.1fr 0.9fr' : '1fr', gap: '2rem', width: '100%', padding: '1rem' }}>
                  
                  {/* Left Column: Event Video (or Info block if no video) */}
                  <div className="event-left-column" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {lightboxMedia.video && (
                      <div className="video-player-aspect-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid rgba(230, 173, 69, 0.25)', boxShadow: '0 15px 30px rgba(0,0,0,0.8)' }}>
                        {lightboxMedia.video.type === 'youtube' ? (
                          <iframe 
                            src={`https://www.youtube.com/embed/${lightboxMedia.video.src}?autoplay=1&loop=1&playlist=${lightboxMedia.video.src}&controls=1&modestbranding=1&rel=0&vq=hd1080`}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                            title="Event Video Player"
                          />
                        ) : lightboxMedia.video.type === 'drive' ? (
                          <iframe 
                            src={`https://drive.google.com/file/d/${lightboxMedia.video.src}/preview`}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            title="Event Video Player"
                          />
                        ) : (
                          <video 
                            src={lightboxMedia.video.src}
                            controls
                            playsInline
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000', border: 'none', objectFit: 'contain' }}
                          />
                        )}
                      </div>
                    )}

                    {/* Event Metadata (Title and Description) */}
                    <div className="event-info-block" style={{ textAlign: 'left' }}>
                      <h3 className="event-lightbox-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#fff', marginBottom: '0.2rem', letterSpacing: '-0.01em', fontWeight: 600 }}>
                        {lightboxMedia.title}
                      </h3>
                      {lightboxMedia.views && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-accent-cyan)', fontFamily: 'Space Grotesk, monospace', display: 'block', marginBottom: '0.8rem', fontWeight: 500 }}>
                          {lightboxMedia.views} visualizações
                        </span>
                      )}
                      <p className="event-lightbox-desc" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6', fontWeight: 300, marginTop: 0 }}>
                        {lightboxMedia.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Carousel Photo Slideshow */}
                  {lightboxMedia.images && lightboxMedia.images.length > 0 && (
                    <div className="event-right-column event-photo-carousel-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', position: 'relative' }}>
                      <div className="active-slide-frame" style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid rgba(230, 173, 69, 0.25)', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.8)' }}>
                        <img 
                          src={lightboxMedia.images[lightboxMedia.currentIndex]} 
                          alt={`Slide ${lightboxMedia.currentIndex + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />

                        {/* Slide Arrows overlay */}
                        {lightboxMedia.images.length > 1 && (
                          <>
                            <button 
                              type="button" 
                              onClick={handlePrevSlide} 
                              className="slide-arrow-btn prev-arrow" 
                              style={{ position: 'absolute', left: '0.8rem', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease', zIndex: 10, fontSize: '1.2rem', fontWeight: 'bold' }}
                            >
                              ‹
                            </button>
                            <button 
                              type="button" 
                              onClick={handleNextSlide} 
                              className="slide-arrow-btn next-arrow" 
                              style={{ position: 'absolute', right: '0.8rem', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease', zIndex: 10, fontSize: '1.2rem', fontWeight: 'bold' }}
                            >
                              ›
                            </button>
                          </>
                        )}

                        {/* counter badge */}
                        <span className="slide-counter-badge" style={{ position: 'absolute', bottom: '0.8rem', right: '0.8rem', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(230,173,69,0.2)', color: 'var(--color-accent-gold)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                          {lightboxMedia.currentIndex + 1} / {lightboxMedia.images.length}
                        </span>
                      </div>

                      {/* Small Thumbnails strip indicator */}
                      {lightboxMedia.images.length > 1 && (
                        <div className="slideshow-thumbnails-strip" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.2rem 0', scrollbarWidth: 'none' }}>
                          {lightboxMedia.images.map((img, thumbIdx) => (
                            <div 
                              key={thumbIdx} 
                              onClick={() => setLightboxMedia(prev => ({ ...prev, currentIndex: thumbIdx }))}
                              style={{ 
                                width: '55px', 
                                height: '55px', 
                                borderRadius: '6px', 
                                overflow: 'hidden', 
                                cursor: 'pointer', 
                                border: lightboxMedia.currentIndex === thumbIdx ? '2px solid var(--color-accent-gold)' : '1px solid rgba(255,255,255,0.1)',
                                opacity: lightboxMedia.currentIndex === thumbIdx ? 1 : 0.4,
                                transition: 'all 0.3s ease',
                                flexShrink: 0
                              }}
                            >
                              <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ) : (
                /* REGULAR VIDEO SINGLE PLAYER MODE */
                <div className="video-player-aspect-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid rgba(230, 173, 69, 0.25)', boxShadow: '0 30px 60px rgba(0,0,0,0.9), 0 0 50px rgba(230,173,69,0.05)' }}>
                  {lightboxMedia.type === 'youtube' ? (
                    <iframe 
                      src={`https://www.youtube.com/embed/${lightboxMedia.src}?autoplay=1&loop=1&playlist=${lightboxMedia.src}&controls=1&modestbranding=1&rel=0&vq=hd1080`}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      title="Cinema Player"
                    />
                  ) : lightboxMedia.type === 'drive' ? (
                    <iframe 
                      src={`https://drive.google.com/file/d/${lightboxMedia.src}/preview`}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="autoplay; encrypted-media"
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
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
