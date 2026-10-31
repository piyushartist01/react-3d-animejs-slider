import React, { useState } from 'react';
import DnaHelix from './components/DnaHelix';
import Slider3D from './components/Slider3D';

export default function App() {
  const [activeTab, setActiveTab] = useState('slideshow'); // 'slideshow' | 'dna-studio'

  return (
    <div className="app-container">
      <div className="anime-grid-bg"></div>

      {/* Top Navbar */}
      <nav className="site-nav">
        <div className="logo-group">
          <div className="logo-symbol">A</div>
          <span className="logo-text">ANIME.JS</span>
          <span className="logo-tag">3D Engine</span>
        </div>

        <div className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'slideshow' ? 'active' : ''}`}
            onClick={() => setActiveTab('slideshow')}
          >
            <span>🪐 3D Slideshow</span>
          </button>
          <button
            className={`nav-tab-btn ${activeTab === 'dna-studio' ? 'active' : ''}`}
            onClick={() => setActiveTab('dna-studio')}
          >
            <span>🧬 3D DNA Studio</span>
          </button>
        </div>

        <div className="nav-actions">
          <a
            href="https://animejs.com"
            target="_blank"
            rel="noreferrer"
            className="control-pill-btn"
          >
            ↗ Animejs.com
          </a>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="dna-section-wrapper" style={{ flex: 1 }}>
        {activeTab === 'slideshow' ? (
          <>
            {/* 3D DNA Double Helix as Kinetic Animated Backdrop */}
            <DnaHelix isInteractive={false} />
            {/* Foreground 3D Slideshow */}
            <Slider3D />
          </>
        ) : (
          /* Full Interactive 3D DNA Studio */
          <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 140px)' }}>
            <div style={{ textAlign: 'center', paddingTop: '20px', position: 'relative', zIndex: 15 }}>
              <span className="hero-pill">🧬 Molecular 3D Simulation</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginTop: '6px', color: 'var(--text-primary)' }}>
                Interactive Anime.js DNA Helix
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '560px', margin: '6px auto 0' }}>
                Click and drag to rotate the helical strand in 3D space. Customize speed, base pairs, and colors below.
              </p>
            </div>
            <DnaHelix isInteractive={true} />
          </div>
        )}
      </main>

      {/* Footer Info Bar */}
      <footer className="anime-status-footer">
        <div>
          <span>FRAMEWORK: </span>
          <strong className="anime-badge">React 18 + Anime.js</strong>
        </div>
        <div>
          <span>STATUS: </span>
          <strong style={{ color: '#16a34a' }}>READY</strong>
        </div>
      </footer>
    </div>
  );
}
