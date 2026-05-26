import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './MagneticButton.css';

const MagneticButton = ({ children, onClick, className = '' }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={`magnetic-btn ${className}`}
      onClick={onClick}
    >
      <span className="magnetic-btn-text">{children}</span>
      <div className="magnetic-btn-glow"></div>
    </motion.button>
  );
};

export default MagneticButton;
