import React, { useState, useEffect, useRef, useCallback } from 'react';
import anime from 'animejs';

const SLIDES_DATA = [
  {
    id: 1,
    title: 'Synthetic Genetics',
    category: 'Bioengineering',
    description: 'Programmable macromolecular polymers and automated genetic compilation pipelines for artificial cellular mechanics.',
    tags: ['DNA', 'Biotech', 'Nanotech'],
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80',
    color: '#00f5d4'
  },
  {
    id: 2,
    title: 'Neural Networks',
    category: 'Deep Architecture',
    description: 'Autonomous synaptic clustering visualizing multi-dimensional tensor activation flows in ultra-dense spatial volumes.',
    tags: ['AI', 'Synapse', 'Cognition'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    color: '#f72585'
  },
  {
    id: 3,
    title: 'Quantum Resonance',
    category: 'Particle Physics',
    description: 'Observation of phase coherence across subatomic lattices under extreme cryogenic electromagnetic confinement.',
    tags: ['Quantum', 'Superlattice', 'Optics'],
    image: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1000&q=80',
    color: '#7209b7'
  },
  {
    id: 4,
    title: 'Cosmic Horizons',
    category: 'Astrophysics',
    description: 'Relativistic gravitational lensing mapping deep-field light distortion around supermassive stellar anomalies.',
    tags: ['Cosmos', 'Spacetime', 'Nebula'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
    color: '#4361ee'
  },
  {
    id: 5,
    title: 'Cybernetic Kinetics',
    category: 'Algorithmic Art',
    description: 'Fluid mathematical vector manifolds undulating through parameterized continuous motion simulations.',
    tags: ['Kinetic', 'Anime.js', 'Vector'],
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1000&q=80',
    color: '#fee440'
  }
];

export default function Slider3D() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const deckRef = useRef(null);
  const activeSlideRef = useRef(null);

  // Trigger Anime.js transition whenever slide index changes
  useEffect(() => {
    if (!deckRef.current) return;

    const activeEl = deckRef.current.querySelector('.slide-card.active');
    if (activeEl) {
      // Stagger animate title, description, and badges
      const title = activeEl.querySelector('.slide-title');
      const desc = activeEl.querySelector('.slide-desc');
      const badge = activeEl.querySelector('.slide-badge');
      const tags = activeEl.querySelectorAll('.tag-chip');

      anime({
        targets: [badge, title, desc, ...tags],
        translateY: [25, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 800,
        delay: anime.stagger(60, { start: 150 })
      });

      // Pulse glow effect
      anime({
        targets: activeEl,
        scale: [0.96, 1],
        duration: 600,
        easing: 'easeOutElastic(1, .8)'
      });
    }
  }, [currentIndex]);

  // Autoplay timer
  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % SLIDES_DATA.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + SLIDES_DATA.length) % SLIDES_DATA.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % SLIDES_DATA.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine 3D card layout position
  const getCardClass = (idx) => {
    const total = SLIDES_DATA.length;
    const diff = (idx - currentIndex + total) % total;

    if (diff === 0) return 'slide-card active';
    if (diff === 1) return 'slide-card next';
    if (diff === total - 1) return 'slide-card prev';
    return 'slide-card hidden';
  };

  // RAF-batched 3D tilt — eliminates per-event style writes
  const tiltRafRef = useRef(null);

  const handleCardMouseMove = useCallback((e, idx) => {
    if (idx !== currentIndex) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rX = -(y / (rect.height / 2)) * 11;
    const rY = (x / (rect.width / 2)) * 13;

    if (tiltRafRef.current) cancelAnimationFrame(tiltRafRef.current);
    tiltRafRef.current = requestAnimationFrame(() => {
      card.style.transform =
        `translate3d(0, 0, 80px) rotateX(${rX}deg) rotateY(${rY}deg) scale(1.015)`;
      tiltRafRef.current = null;
    });
  }, [currentIndex]);

  const handleCardMouseLeave = useCallback((e, idx) => {
    if (idx !== currentIndex) return;
    if (tiltRafRef.current) cancelAnimationFrame(tiltRafRef.current);
    tiltRafRef.current = null;
    e.currentTarget.style.transform =
      'translate3d(0, 0, 80px) rotateX(0deg) rotateY(0deg) scale(1)';
  }, [currentIndex]);

  return (
    <section className="slideshow-hero">
      <div className="slideshow-header">
        <div className="hero-pill">⚡ Powered by Anime.js 3D Engine</div>
        <h2 className="hero-title">Dimensional Visions</h2>
        <p className="hero-subtitle">
          Experience responsive spatial 3D card depth transitions synchronized with fluid biological helical animation.
        </p>
      </div>

      {/* 3D Viewport Deck */}
      <div className="carousel-viewport">
        <div ref={deckRef} className="carousel-deck">
          {SLIDES_DATA.map((slide, idx) => {
            const cardClass = getCardClass(idx);
            return (
              <div
                key={slide.id}
                className={cardClass}
                onClick={() => {
                  if (cardClass.includes('prev')) handlePrev();
                  if (cardClass.includes('next')) handleNext();
                }}
                onMouseMove={(e) => handleCardMouseMove(e, idx)}
                onMouseLeave={(e) => handleCardMouseLeave(e, idx)}
              >
                <div className="slide-image-wrapper">
                  <img src={slide.image} alt={slide.title} className="slide-image" />
                </div>

                <div className="slide-badge">{slide.category}</div>

                <div className="slide-info">
                  <h3 className="slide-title">{slide.title}</h3>
                  <p className="slide-desc">{slide.description}</p>
                  <div className="slide-tags">
                    {slide.tags.map(t => (
                      <span key={t} className="tag-chip">#{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="carousel-controls">
        <button className="nav-arrow-btn" onClick={handlePrev} title="Previous Slide (Left Arrow)">
          ←
        </button>

        <div className="nav-dots">
          {SLIDES_DATA.map((_, i) => (
            <button
              key={i}
              className={`nav-dot ${i === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(i)}
              title={`Jump to slide ${i + 1}`}
            />
          ))}
        </div>

        <button className="nav-arrow-btn" onClick={handleNext} title="Next Slide (Right Arrow)">
          →
        </button>

        <button
          className={`autoplay-toggle ${isAutoplay ? 'playing' : ''}`}
          onClick={() => setIsAutoplay(!isAutoplay)}
          title="Toggle Autoplay"
        >
          <span className="pulse-indicator"></span>
          <span>{isAutoplay ? 'Autoplay Active' : 'Autoplay Paused'}</span>
        </button>
      </div>
    </section>
  );
}
