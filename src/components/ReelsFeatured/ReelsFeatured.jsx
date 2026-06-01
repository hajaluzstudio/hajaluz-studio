import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowLeft, ArrowRight, Eye, Sparkles, MessageSquare, X } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { getYouTubeId, getYouTubeThumbnail, isGoogleDriveUrl, getGoogleDriveDirectLink, getGoogleDriveId } from '../../services/youtubeHelper';
import MagneticButton from '../MagneticButton/MagneticButton';
import './ReelsFeatured.css';

const ReelsFeatured = ({ dataUpdateTrigger = 0 }) => {
  const scrollContainerRef = useRef(null);
  const [reels, setReels] = useState([]);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [lightboxMedia, setLightboxMedia] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    // Load and filter reels from dataService
    const allProjects = dataService.getProjects() || [];
    const filteredReels = allProjects.filter(p => {
      const isReelCategory = 
        p.category === 'Reels' || 
        p.secondaryCategory === 'Reels' || 
        p.category === 'Motion Design' || 
        p.secondaryCategory === 'Motion Design';
      return isReelCategory && p.video;
    });
    
    // Sort by views or highlight the best ones
    const sorted = [...filteredReels].sort((a, b) => {
      const viewsA = parseInt(a.views) || 0;
      const viewsB = parseInt(b.views) || 0;
      return viewsB - viewsA; // Top views first
    });

    setReels(sorted);
  }, [dataUpdateTrigger]);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollPosition);
      // Run once initially
      setTimeout(checkScrollPosition, 500);
      window.addEventListener('resize', checkScrollPosition);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [reels]);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75; // Scroll 75% of view width
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCardClick = (reel) => {
    const ytId = getYouTubeId(reel.video);
    if (ytId) {
      setLightboxMedia({ type: 'youtube', src: ytId, title: reel.title, views: reel.views || '' });
    } else if (isGoogleDriveUrl(reel.video)) {
      setLightboxMedia({ type: 'drive', src: getGoogleDriveId(reel.video), title: reel.title, views: reel.views || '' });
    } else if (reel.video && (reel.video.startsWith('data:video') || reel.video.endsWith('.mp4') || reel.video.includes('mixkit.co'))) {
      setLightboxMedia({ type: 'direct', src: reel.video, title: reel.title, views: reel.views || '' });
    } else {
      window.open(reel.video || reel.image, '_blank');
    }
  };

  const formatViews = (val) => {
    if (!val) return 'Viral';
    const num = parseInt(val);
    if (isNaN(num)) return val;
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1).replace('.', ',')}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num;
  };

  const handleWhatsAppRedirect = () => {
    const phone = "5554991109159";
    const text = encodeURIComponent("Olá! Gostaria de solicitar um posicionamento estratégico e conhecer o Método da Haja Luz Studio.");
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  if (reels.length === 0) return null;

  return (
    <section className="reels-featured-section" id="reels-featured">
      {/* Background glow overlay */}
      <div className="reels-glow reels-glow-gold"></div>
      
      <div className="reels-featured-container">
        
        {/* Section Header */}
        <div className="reels-header">
          <div className="reels-header-info">
            <span className="reels-tag">// CASE DE SUCESSO</span>
            <h2 className="reels-title">Reels Estratégicos</h2>
            <p className="reels-subtitle">
              Vídeos verticais de alta retenção projetados sob iluminação cinematográfica e engenharia de timeline para viralizar o seu produto de forma orgânica.
            </p>
          </div>
          
          {/* Scroll Navigation Arrows */}
          <div className="reels-navigation-arrows">
            <button 
              className={`arrow-btn ${!canScrollLeft ? 'arrow-disabled' : ''}`}
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <ArrowLeft size={18} />
            </button>
            <button 
              className={`arrow-btn ${!canScrollRight ? 'arrow-disabled' : ''}`}
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel Tracks */}
        <div className="reels-carousel-wrapper">
          <div className="reels-scroll-track" ref={scrollContainerRef}>
            {reels.map((reel, idx) => {
              const isHovered = hoveredIdx === idx;
              const ytId = getYouTubeId(reel.video);
              const isYt = !!ytId;
              const isDrive = isGoogleDriveUrl(reel.video);
              const videoSource = isDrive ? getGoogleDriveDirectLink(reel.video) : reel.video;
              
              let coverImage = reel.image;
              if (isYt && (!coverImage || coverImage === '' || coverImage.startsWith('/logo'))) {
                coverImage = getYouTubeThumbnail(reel.video);
              }
              if (!coverImage || coverImage === '') {
                coverImage = '/favicon.png';
              }

              return (
                <motion.div 
                  key={reel.title + '-' + idx}
                  className="reels-vertical-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: Math.min(idx * 0.08, 0.4) }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => handleCardClick(reel)}
                >
                  <div className="reel-smartphone-frame glass-panel">
                    
                    {/* View Counter Badge */}
                    <div className="reel-metric-badge">
                      <Eye size={12} className="metric-icon" />
                      <span>{formatViews(reel.views)} views</span>
                    </div>

                    {/* Smartphone Camera Notch */}
                    <div className="smartphone-notch"></div>

                    {/* Video / Cover Media block */}
                    <div className="reel-media-box">
                      
                      {/* Static Cover Image */}
                      <img 
                        src={coverImage} 
                        alt={reel.title} 
                        className={`reel-cover-img ${isHovered ? 'img-faded' : ''}`}
                        onError={(e) => {
                          if (isYt && e.target.src.includes('maxresdefault')) {
                            e.target.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                          }
                        }}
                      />

                      {/* Video Player on Hover */}
                      {isHovered && (
                        isYt ? (
                          <iframe 
                            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&vq=hd1080`}
                            className="reel-hover-video"
                            allow="autoplay; encrypted-media"
                            style={{ border: 'none', pointerEvents: 'none', transform: 'scale(1.35)' }}
                            title={reel.title}
                          />
                        ) : isDrive ? (
                          <video 
                            src={videoSource}
                            loop 
                            muted 
                            playsInline 
                            autoPlay
                            className="reel-hover-video"
                          />
                        ) : (
                          <video 
                            src={videoSource} 
                            loop 
                            muted 
                            playsInline 
                            autoPlay
                            className="reel-hover-video"
                          />
                        )
                      )}

                      {/* Black overlay mask */}
                      <div className="reel-media-mask"></div>

                      {/* Floating Play Button */}
                      <div className="reel-center-play">
                        <div className="play-ring">
                          <Play size={20} fill="var(--color-accent-gold)" color="var(--color-accent-gold)" style={{ marginLeft: '3px' }} />
                        </div>
                      </div>
                    </div>

                    {/* Reel Title Card info */}
                    <div className="reel-card-footer">
                      <span className="reel-footer-client">{reel.client || 'Haja Luz Studio'}</span>
                      <h3 className="reel-footer-title">{reel.title}</h3>
                      {reel.role && <span className="reel-footer-role">// {reel.role}</span>}
                    </div>

                  </div>
                </motion.div>
              );
            })}

            {/* Final Call to Action inside the scroll track */}
            <div className="reels-final-cta-card">
              <div className="final-cta-card-content glass-panel">
                <div className="cta-icon-glow">
                  <Sparkles size={24} className="cta-sparkle" />
                </div>
                <h3>Quer viralizar sua marca?</h3>
                <p>Solicite seu roteiro estratégico personalizado de Reels hoje mesmo.</p>
                
                <MagneticButton onClick={handleWhatsAppRedirect}>
                  <span className="cta-btn-whatsapp-text">
                    <MessageSquare size={16} />
                    Falar no WhatsApp
                  </span>
                </MagneticButton>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Cinematic Lightbox Player Overlay (duplicated from Portfolio for seamless operation) */}
      <AnimatePresence>
        {lightboxMedia && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxMedia(null)}
            style={{ zIndex: 100000 }}
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
              style={{ maxWidth: '440px', width: '92%', aspectRatio: '9 / 16', borderRadius: '20px', overflow: 'hidden' }}
            >
              <div className="video-player-aspect-wrapper" style={{ position: 'relative', width: '100%', height: '100%', background: '#000', border: '1.5px solid rgba(230, 173, 69, 0.25)', boxShadow: '0 30px 60px rgba(0,0,0,0.95)' }}>
                {lightboxMedia.type === 'youtube' ? (
                  <iframe 
                    src={`https://www.youtube.com/embed/${lightboxMedia.src}?autoplay=1&loop=1&playlist=${lightboxMedia.src}&controls=1&modestbranding=1&rel=0&vq=hd1080`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    title={lightboxMedia.title}
                  />
                ) : lightboxMedia.type === 'drive' ? (
                  <iframe 
                    src={`https://drive.google.com/file/d/${lightboxMedia.src}/preview`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={lightboxMedia.title}
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

export default ReelsFeatured;
