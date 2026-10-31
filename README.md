# 3D Anime.js Slideshow & DNA Helix

A high-performance 3D slideshow showcasing spatial card perspective transitions and an animated 3D DNA double helix built with **React 18**, **Anime.js**, and **Vite**, inspired by Julian Garnier's [animejs.com](https://animejs.com) with an editorial light theme.

---

## ✨ Features

- **Editorial Light Aesthetic**: Inter + Lora typography, warm canvas backdrop, soft card shadows, and refined visual craft.
- **3D Kinetic DNA Helix**:
  - Built using Anime.js continuous rotation (`rotateY`), staggered wave sinusoidal translations (`translateZ`, `scale`, `opacity`), and dynamic base pair nodes.
  - Operates both as a live kinetic backdrop for the 3D slideshow and as a standalone full-screen 3D model.
  - **Interactive 3D Studio**: Click and drag to orbit / tilt the DNA in 3D space (`rotateX`, `rotateY`).
  - Real-time parameter controls: Pair density (16–40 base pairs), rotation speed, play/pause, reset view, and light color schemes (*Classic Blue*, *Nature Green*, *Warm Sunset*, *Monochrome*).
- **3D Image Slideshow / Carousel**:
  - True CSS 3D perspective deck (`transform-style: preserve-3d`).
  - Staggered Anime.js reveals on slide switch: animated badges, kinetic titles, descriptions, and tag pills.
  - Interactive 3D tilt: mouse cursor movements tilt the active card in real-time.
  - Autoplay toggle, forward/back buttons, dot pagination, and keyboard arrow navigation.
- **Lag-Free 60 FPS Performance**: Hardware-accelerated GPU 3D transforms (`translate3d`, `rotateY`), batched requestAnimationFrame updates, and memory leak prevention.

---

## 🛠️ Tech Stack

- **React 18**
- **Anime.js** (Kinetic animations, SVG/DOM transitions, easing)
- **Vite**
- **Vanilla CSS** (3D perspective stages, preserve-3d, CSS custom properties)
- **Fonts**: Inter, Lora, JetBrains Mono

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/piyushartist01/react-3d-animejs-slider.git

# Navigate into the project folder
cd react-3d-animejs-slider

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

---

## 📦 Build for Production

```bash
npm run build
```

The production assets will be built into the `dist/` folder.

---

## 📄 License

MIT
