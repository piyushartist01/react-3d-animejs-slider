import React, { useEffect, useRef, useState, useCallback } from 'react';
import anime from 'animejs';

export default function DnaHelix({ isInteractive = false }) {
  const helixRef = useRef(null);
  const animationsRef = useRef([]);

  // Studio params
  const [rungCount, setRungCount] = useState(28);
  const [speed, setSpeed] = useState(6000);
  const [colorTheme, setColorTheme] = useState('classic');
  const [isPlaying, setIsPlaying] = useState(true);

  // Drag-rotate state stored in refs to avoid React re-renders during mousemove
  const rotRef = useRef({ x: 15, y: 0 });
  const [rotDisplay, setRotDisplay] = useState({ x: 15, y: 0 });
  const isDraggingRef = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  const themes = {
    classic: { a: '#1a56db', b: '#ea580c', label: 'Classic Blue' },
    nature:  { a: '#16a34a', b: '#0891b2', label: 'Nature Green' },
    warm:    { a: '#dc2626', b: '#d97706', label: 'Warm Sunset' },
    mono:    { a: '#374151', b: '#6b7280', label: 'Monochrome' },
  };
  const currentColors = themes[colorTheme] || themes.classic;

  // Anime.js animations
  useEffect(() => {
    if (!helixRef.current) return;

    // Pause & clear old animations
    animationsRef.current.forEach(a => a.pause && a.pause());
    animationsRef.current = [];

    const rungs  = helixRef.current.querySelectorAll('.dna-rung');
    const nodesA = helixRef.current.querySelectorAll('.dna-node.node-a');
    const nodesB = helixRef.current.querySelectorAll('.dna-node.node-b');
    const bars   = helixRef.current.querySelectorAll('.dna-bar');

    if (!rungs.length) return;

    // 1. Continuous Y rotation per rung (GPU-composited)
    const rotAnim = anime({
      targets: rungs,
      rotateY: (_el, i) => [i * (360 / rungCount), i * (360 / rungCount) + 360],
      duration: speed,
      easing: 'linear',
      loop: true,
      autoplay: isPlaying,
    });

    // 2. Staggered Z wave — A nodes
    const waveA = anime({
      targets: nodesA,
      translateZ: [-50, 50],
      scale: [0.75, 1.25],
      opacity: [0.5, 1],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      duration: speed / 2,
      delay: anime.stagger(100, { from: 'first' }),
      autoplay: isPlaying,
    });

    // 3. Staggered Z wave — B nodes (inverted)
    const waveB = anime({
      targets: nodesB,
      translateZ: [50, -50],
      scale: [1.25, 0.75],
      opacity: [1, 0.5],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      duration: speed / 2,
      delay: anime.stagger(100, { from: 'first' }),
      autoplay: isPlaying,
    });

    // 4. Bar pulse — cheap opacity + scaleX
    const barPulse = anime({
      targets: bars,
      opacity: [0.3, 0.85],
      scaleX: [0.88, 1.04],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutQuad',
      duration: speed / 3,
      delay: anime.stagger(80, { from: 'center' }),
      autoplay: isPlaying,
    });

    animationsRef.current = [rotAnim, waveA, waveB, barPulse];

    return () => {
      animationsRef.current.forEach(a => a.pause && a.pause());
    };
  }, [rungCount, speed, colorTheme, isPlaying]);

  // ── Drag rotation using RAF to avoid mid-frame style flushes ──
  const applyRotation = useCallback(() => {
    if (helixRef.current) {
      helixRef.current.style.transform =
        `rotateX(${rotRef.current.x}deg) rotateY(${rotRef.current.y}deg)`;
    }
    rafRef.current = null;
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (!isInteractive) return;
    isDraggingRef.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, [isInteractive]);

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current || !isInteractive) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;

    rotRef.current = {
      x: Math.max(-60, Math.min(60, rotRef.current.x - dy * 0.35)),
      y: rotRef.current.y + dx * 0.38,
    };
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    // Batch DOM write into next animation frame
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(applyRotation);
    }
  }, [isInteractive, applyRotation]);

  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      // Sync display state so React re-render doesn't reset transform
      setRotDisplay({ ...rotRef.current });
    }
  }, []);

  // Touch support for mobile drag
  const handleTouchStart = useCallback((e) => {
    if (!isInteractive) return;
    isDraggingRef.current = true;
    const t = e.touches[0];
    lastMousePos.current = { x: t.clientX, y: t.clientY };
  }, [isInteractive]);

  const handleTouchMove = useCallback((e) => {
    if (!isDraggingRef.current || !isInteractive) return;
    e.preventDefault();
    const t = e.touches[0];
    const dx = t.clientX - lastMousePos.current.x;
    const dy = t.clientY - lastMousePos.current.y;

    rotRef.current = {
      x: Math.max(-60, Math.min(60, rotRef.current.x - dy * 0.35)),
      y: rotRef.current.y + dx * 0.38,
    };
    lastMousePos.current = { x: t.clientX, y: t.clientY };

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(applyRotation);
    }
  }, [isInteractive, applyRotation]);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
    setRotDisplay({ ...rotRef.current });
  }, []);

  const togglePlay = () => setIsPlaying(p => !p);

  const resetView = () => {
    rotRef.current = { x: 15, y: 0 };
    setRotDisplay({ x: 15, y: 0 });
    applyRotation();
  };

  return (
    <div
      className={`dna-backdrop-layer ${isInteractive ? 'interactive-mode' : ''}`}
      style={{
        '--dna-a': currentColors.a,
        '--dna-b': currentColors.b,
      }}
    >
      <div
        className="dna-stage"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        title={isInteractive ? 'Drag to rotate' : ''}
      >
        <div
          ref={helixRef}
          className="dna-helix-3d"
          style={{
            transform: `rotateX(${rotDisplay.x}deg) rotateY(${rotDisplay.y}deg)`,
          }}
        >
          {Array.from({ length: rungCount }).map((_, idx) => (
            <div
              key={idx}
              className="dna-rung"
              style={{ transform: `rotateY(${idx * (360 / rungCount)}deg)` }}
            >
              <div className="dna-node node-a" />
              <div className="dna-bar" />
              <div className="dna-node node-b" />
            </div>
          ))}
        </div>
      </div>

      {isInteractive && (
        <div className="dna-studio-controls">
          <button className="control-pill-btn" onClick={togglePlay}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>

          <div className="studio-input-group">
            <span>Pairs ({rungCount}):</span>
            <input
              type="range"
              min="16" max="40"
              value={rungCount}
              onChange={e => setRungCount(Number(e.target.value))}
              className="studio-slider"
            />
          </div>

          <div className="studio-input-group">
            <span>Speed:</span>
            <input
              type="range"
              min="2000" max="10000" step="500"
              value={12000 - speed}
              onChange={e => setSpeed(12000 - Number(e.target.value))}
              className="studio-slider"
            />
          </div>

          <div className="studio-input-group">
            <span>Theme:</span>
            <select
              value={colorTheme}
              onChange={e => setColorTheme(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              {Object.entries(themes).map(([key, t]) => (
                <option key={key} value={key} style={{ background: '#0f111a', color: '#fff' }}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <button className="control-pill-btn" onClick={resetView}>
            ↺ Reset
          </button>
        </div>
      )}
    </div>
  );
}
