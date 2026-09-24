# Anjana R. — Flagship AI & ML Portfolio Suite

A modern, high-performance personal portfolio suite showcasing academic distinction and engineering projects in **Artificial Intelligence, Machine Learning, Data Structures & Algorithms, and Full-Stack Web Development**.

---

## 🌟 Suite Architecture & Directory Structure

```
anjana-portfolio/
│
├── index.html          # Flagship Portfolio (Interactive Neural Canvas, Bento Grid, Skills, Projects, Resume Modal)
├── style.css           # Unified Cyber-Luxe Design System (CSS Variables, Glassmorphism, Responsive, Modal, Print)
├── script.js           # Dynamics Engine (Neural Canvas, Typewriter, Tilt, ScrollSpy, Filters, Form, Modal)
│
├── mark-sorter.html    # Mark Sorter Pro (5-Algorithm Workbench, Asc/Desc Toggle, Multi-Lang Code, Web Audio Synth)
├── skyline.html        # Skyline Weather Station (Atmospheric Physics, 24h Hourly, Solar Arc, AQI Sensors)
│
├── Anjana_R_Resume.docx # Formatted Word Document Resume (Ready for immediate download)
├── generate_resume.js  # Generator script for valid Word document (.docx)
├── serve.js            # Lightweight Node.js local static server with MIME types
└── README.md           # Documentation & Customization Guide
```

---

## 🚀 Key Highlights Across All Applications

### 1. Flagship Portfolio (`index.html`, `style.css`, `script.js`)
- **Verified Academic Data**: Highlights Anjana R.'s 2nd-year B.Tech journey at MVJ College of Engineering with an outstanding **9.10 SGPA**, Pre-University (**85%**), and Class X (**95.05%**).
- **Visual Design**: Deep obsidian background (`#070a13`), luminous cyan/indigo aurora gradients, frosted glass panels (`backdrop-filter: blur(18px)`), and modern typography with `Space Grotesk`, `Inter`, and `Fira Code`.
- **Interactive Neural Synapse Canvas**: Procedural floating nodes connected by glowing synapses that dynamically respond to mouse proximity.
- **Dynamic Typewriter Subtitle**: Real-time role cycling with authentic blinking terminal cursor.
- **Bento Grid Architecture**: Showcases profile summary, what she brings (Teamwork, Problem Solving, Communication, Time Management), campus leadership (Event Coordinator - Swayam, Cultural Club), and languages (English, Malayalam, Kannada, Tamil).
- **Interactive Skills Matrix**: Filterable categories (`All`, `Programming`, `Core Subjects`, `Tools & Database`, `Soft Skills`) with animated proficiency meter tracks.
- **Featured Projects Grid**: Highlight cards with direct links to live interactive tools (`mark-sorter.html` and `skyline.html`), tech tags, and GitHub source links.
- **Functional Contact Terminal**: Simulated message transmission with instant toast notifications and a one-click **"Copy Email"** clipboard button.
- **Interactive Resume Modal & Print Preview**: Direct in-browser resume viewer with instant print button and direct `.docx` download.
- **Mobile Responsive Navigation**: Fluid navigation bar that collapses into an animated glassmorphic drawer on mobile viewports.

---

### 2. Mark Sorter Pro (`mark-sorter.html`)
- **Multi-Algorithm Engine**: Complete implementations of:
  1. **Selection Sort** ($O(n^2)$ time, $O(1)$ space)
  2. **Bubble Sort** ($O(n^2)$ time, $O(1)$ space)
  3. **Insertion Sort** ($O(n^2)$ time, $O(1)$ space)
  4. **Quick Sort** ($O(n \log n)$ time, $O(\log n)$ space)
  5. **Merge Sort** ($O(n \log n)$ time, $O(n)$ space)
- **Ascending vs. Descending (Rank Order) Mode**: Switch between ascending order (lowest to highest) and descending rank order (highest mark / Rank #1 first).
- **Play-When-Done Auto-Replay**: Eliminates freezes when playback completes; clicking Play automatically restarts the simulation cleanly.
- **Live Progress Bar & Counter**: Real-time progress percentage bar and step telemetry (`Step X / Y`).
- **Multi-Language Code Inspector**: Toggle algorithm source code between **Python**, **C**, and **C++** (matching Anjana's core programming languages), with active execution line highlighting.
- **Dual Visualizer Modes**:
  - **Height Bars**: Bar heights proportional to student exam marks (0–100%) with responsive widths for up to 25 items.
  - **Student Cards View**: Displays student avatars, mark scores, Roll numbers, and grade badges (A+, A, B, C, F).
- **Web Audio API Sound Synth**: Generates real-time audio pitches mapped to mark values during comparisons and placements with clean exponential envelopes.
- **Smart Presets**: One-click loaders for *Exam Marks*, *Random 10*, *Nearly Sorted*, and *Reversed (Worst Case)*.
- **Copy Marks to Clipboard**: Quick button to copy current mark values for easy sharing.

---

### 3. Skyline Weather Station (`skyline.html`)
- **Atmospheric Physics Engine**: Dynamic canvas backgrounds adapting to *Sunny, Night, Cloudy, Rainy, Stormy, and Snowy* weather states.
- **Metric (°C) / Imperial (°F) Switcher**: Instant temperature conversion across all forecasts.
- **24-Hour Hourly Trajectory**: Horizontal slider with weather icons, temperatures, and precipitation bars.
- **5-Day Outlook**: High/low temperatures, weather icons, and rain probabilities.
- **Comprehensive Sensors**: Humidity, Wind Speed, UV Index with health ratings, Air Quality Index (AQI), and Precipitation percentage.
- **Solar Arc Tracker**: Calculated sunrise and sunset times based on location.
- **Zero-Config Demo Mode**: Preset chips for Tokyo, London, Bengaluru, New York, Paris, Sydney, and atmospheric simulation states.

---

## 🛠️ How to Open and Run

### Option A: Direct Browser Launch
You can open the files directly in any modern web browser:
1. Double-click `index.html` to open the main portfolio.
2. Navigate seamlessly between `index.html`, `mark-sorter.html`, and `skyline.html`.

### Option B: Local Node.js Server
Run the included lightweight static server:
```bash
node serve.js
```
Then visit:
```
http://localhost:3000/
```
Endpoints:
- Main Portfolio: `http://localhost:3000/index.html`
- Mark Sorter Pro: `http://localhost:3000/mark-sorter.html`
- Skyline Weather: `http://localhost:3000/skyline.html`
- Resume Document: `http://localhost:3000/Anjana_R_Resume.docx`
