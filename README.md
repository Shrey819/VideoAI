# Antigravity — AI Reel Editing Studio

> **Transform a raw creator desk video into a polished social-media reel with one click.**

Antigravity is an AI-first video editing platform focused on creators who record educational, coding, finance, productivity, business, or study videos from a fixed desk setup.

The goal is to make a creator upload a raw video recorded at their desk and receive a professional Instagram Reel / YouTube Short without manually editing anything.

---

## 💡 Product Philosophy: Prompt-First Editing

Instead of opening timelines, cutting keyframes, and adjusting layer masks, creators describe what they want in natural language:

- *"Replace background with a high-end podcast studio with warm oak wood slats."*
- *"Change shirt to a white oversized cotton tee."*
- *"Remove keyboard clicks and fan noise."*
- *"Add Alex Hormozi bounce subtitles with keyword highlights."*
- *"Add motion callouts and top retention progress bar."*

---

## 🎯 Fixed Input Format (V1 Scope)

- **Camera**: Static tripod-mounted camera, downward angle, zero movement or zoom.
- **Subject**: Seated at a table/desk, only torso and hands visible (**Face is NOT visible**).
- **Scene**: Table, laptop, keyboard, mouse, notebook, pen, coffee mug, and microphone remain strictly preserved. Everything behind the creator is editable.

---

## 📱 Output Format

- **Primary**: Vertical 9:16 (1080 × 1920, 30 FPS, H.264 MP4)
- **Also Supported**: 1:1 (Instagram Feed), 16:9 (YouTube), 4:5 (LinkedIn)

---

## 🚀 Core AI Features (6 Modules)

1. **Background AI**: Preserves table, props, and hands while seamlessly replacing the room with studio environments (Podcast Studio, Luxury Office, Cyberpunk Coder Room, Minimal Nordic Daylight).
2. **Outfit AI**: Inpaints apparel (white oversized tee, black hoodie, polo) while preserving natural fabric wrinkles, folds, and body pose.
3. **Audio AI**: Automatically eliminates fan noise, keyboard clicks, echo, and room resonance while keeping speech crisp.
4. **Voice AI**: Enhances creator voice clarity or replaces narration with synthetic voices synced to video timing.
5. **Caption AI**: Generates word-timestamped animated kinetic subtitles in Alex Hormozi, Cyberpunk Neon, Minimal, and Podcast styles.
6. **Motion Graphics AI**: Auto-highlights power keywords from speech with animated pop text, callouts, and retention progress bars.

---

## 🖥️ App Pages

- **Landing Page** (`/`): Product overview, prompt showcase, and interactive Before/After reel viewer.
- **Creator Dashboard** (`/dashboard`): Video upload with desk setup guideline checks, recent reels, and 1-click style presets.
- **Studio Editor** (`/editor/[id]`): 9:16 vertical reel preview player with synchronized bouncing captions, AI prompt director, and module controls.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start Studio
npm run dev
```

Open **[http://localhost:3030](http://localhost:3030)** in your browser.

---

## 📄 License
Proprietary — Antigravity Studio 2026.
