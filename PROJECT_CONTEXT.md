# ANTIGRAVITY — AI Reel Editing Studio (Master Product Context)

## Project Identity

**Project Name:** Antigravity

**Tagline:** AI-powered reel editing studio that transforms a raw creator video into a polished social-media reel with one click.

Antigravity is **not** a HeyGen clone.

It is an AI-first video editing platform focused on creators who record educational, coding, finance, productivity, business, or study videos from a fixed desk setup.

The goal is to make a creator upload a raw video and receive a professional Instagram Reel / YouTube Short without manually editing anything.

---

# Vision

Build the easiest AI reel editor for creators.

A user uploads one raw video recorded at their desk.

Antigravity automatically:
* Replaces the room/background with studio-grade environments.
* Changes clothing (shirt/hoodie/color) while preserving folds and pose.
* Removes background noise, keyboard clicks, and fan hum.
* Replaces or enhances the narrator voice if requested.
* Generates word-timestamped animated captions.
* Adds motion graphics, callouts, and keyword highlights.
* Exports a polished vertical reel.

Everything feels like AI editing the video intelligently rather than providing complex manual timeline tools.

---

# Product Philosophy

Antigravity is built around **Prompt Editing**.

Instead of opening timelines, cutting keyframes, and adjusting layer masks, creators tell AI what they want in natural language.

### Example Prompts:
* *"Make this look like a premium productivity reel."*
* *"Replace my background with a modern podcast studio with warm oak wood slats."*
* *"Change my T-shirt to a white oversized tee."*
* *"Use a deep English narrator voice."*
* *"Add Alex Hormozi bounce captions in bold yellow."*
* *"Highlight every business and coding keyword."*

The AI interprets these prompts and executes the edits across the entire video.

---

# Target Audience

Creators who produce content for:
* **Instagram Reels**
* **YouTube Shorts**
* **LinkedIn Videos**
* **Coding Tutorials**
* **Study / Productivity Content**
* **Finance & Business Insights**
* **Educational Explanations**

Most creators shoot videos using a phone mounted above or in front of a desk.

---

# Fixed Input Format (Core V1 Rules)

This is the standard input format for Antigravity V1.

## 📷 Camera Rules
* Static camera.
* Tripod mounted.
* No camera movement.
* No zoom while recording.

## 👤 Person Rules
* Face is **NOT** visible.
* Camera is angled slightly downward.
* Only torso/chest/hands are visible.
* User is sitting at a table or desk.
* Hands write, type, point, or gesture naturally.

## 🖥️ Scene Rules
Visible desk objects may include:
* Table / Desk surface.
* Notebook & Pen.
* Keyboard & Mouse.
* Laptop.
* Microphone.
* Coffee mug.
* Phone.

**Rule:** The table, desk props, and hands always remain strictly preserved. Everything behind the creator is dynamically editable.

---

# Output Format

### Default Export:
* **Vertical Reel (9:16)**
* **1080 × 1920 Resolution**
* **30 FPS**
* **H.264 MP4**

### Also Supported:
* **1:1** — Square (Instagram Feed)
* **16:9** — Landscape (YouTube / Desktop)
* **4:5** — Portrait (LinkedIn / Facebook)

---

# Core AI Features (V1 Scope)

## Module 1 — Background AI
**Purpose:** Replace the room while preserving the creator, hands, table, and desk props.
* **Preserves:** Torso silhouette, hands, desk surface, keyboard, laptop, microphone, coffee mug, and lighting harmony.
* **Environments:** Podcast Studio, Luxury Executive Office, RGB / Cyberpunk Coder Cave, Minimal Nordic Workspace, Daylight Nature Window.

## Module 2 — Outfit AI
**Purpose:** Edit and enhance only the torso clothing.
* **Options:** White oversized T-shirt, Matte black tee, Minimalist hoodie, Polo, Brand apparel.
* **Rules:** Strictly preserves natural wrinkles, fabric folds, body pose, and illumination. No artificial warping or body shape alterations.

## Module 3 — Audio AI
**Purpose:** Clean and polish studio audio.
* **Eliminates:** Fan hum, mechanical keyboard clicks, street noise, room echo, and background conversations.
* **Preserves:** Natural speech cadence, tone, and dynamics.

## Module 4 — Voice AI
**Purpose:** Replace or enhance voice narration.
* **Clean Voice Mode:** Keep user's voice, polish clarity, balance loudness, remove hesitations ("umm", "aaa", awkward pauses).
* **AI Voice Mode:** Replace narration with synthetic voices (Deep English Male, Calm English Female, Hindi Male) with synchronized timing.

## Module 5 — Caption AI
**Purpose:** Generate word-timestamped kinetic subtitles automatically.
* **Styles:** Alex Hormozi (Bold Bounce), Cyberpunk Neon, Minimal Nordic, Podcast Karaoke.
* **Features:** Active word bounce animation, multi-color keyword highlighting, uppercase toggles, and emoji support.

## Module 6 — Motion Graphics AI
**Purpose:** Automatically generate visual emphasis and retention hooks from speech transcript.
* **Elements:** Animated pop text, keyword underlines, callout boxes, arrows, focus circles, and top retention progress bars.

---

# What Antigravity Will NOT Do (V1 Scope Constraints)

To maintain photorealism and high output quality, Antigravity V1 intentionally does **NOT** build:
* ❌ AI avatar generation.
* ❌ Talking face generation.
* ❌ Face swap.
* ❌ Lip sync.
* ❌ Full-body character generation.
* ❌ Cartoon or anime filters.

Every output remains strictly photorealistic and grounded in the creator's real desk recording.

---

# Complete User Experience Workflow

```
1. Upload raw desk video
         ↓
2. AI analyzes scene, speech & props
         ↓
3. Creator prompts desired look ("Podcast studio + Alex Hormozi captions")
         ↓
4. AI applies background, apparel, audio & subtitle edits
         ↓
5. Creator previews reel & split-screen comparison
         ↓
6. One-click export to 1080×1920 MP4
```

No timeline slicing, manual masking, or keyframing required.

---

# UI/UX & Design System

### Aesthetic Theme
Dark premium creator UI inspired by Runway, Arc Browser, Linear, and CapCut Desktop.

### Color Palette
* **Background:** Obsidian / Slate (`#090a0f`, `#11131c`)
* **Accents:** Electric Purple (`#8b5cf6`), Cyan Electric (`#06b6d4`)
* **Secondary:** Emerald Green (`#10b981`), Gold / Warm Amber (`#facc15`)
* **Text:** Bright White (`#f8fafc`), Muted Slate (`#94a3b8`)

### Visual Style
* Glassmorphism with backdrop blurs.
* Smooth glow borders and rounded floating cards.
* Clean kinetic typography.

---

# Pages & App Structure

## 1. Landing Page
* Hero with headline and prompt-to-reel demonstration.
* Interactive Before (Raw Desk) vs After (AI Studio) reel player.
* Core features and 6 AI modules showcase.
* Creator setup guidelines and 1-click preset templates.

## 2. Creator Dashboard
* New Reel creation trigger.
* Recent projects grid with thumbnail previews and statuses.
* Style preset gallery (Alex Hormozi Viral, Cyberpunk Coder, Podcast Studio, Nordic Minimal).

## 3. Studio Editor Layout
* **Left Sidebar:** Module controls (Background AI, Outfit AI, Audio & Voice, Captions, Motion Graphics, Export Settings).
* **Center Canvas:** 9:16 Vertical Reel Player with real-time word-by-word bouncing caption preview and Before/After split slider.
* **Right Sidebar:** AI Prompt Director with natural language input box, suggestion pills, and style presets.
* **Bottom Bar:** Real-time editing pipeline progress tracker and 1-click MP4 export action.

---

# Feature Roadmap

### Phase 1 — Foundation
* Desk video ingestion and setup guidelines validator.
* Studio editor workspace with 9:16 vertical reel preview.
* Preset template library.

### Phase 2 — AI Editing
* Prompt-driven background replacement (desk & props preserved).
* Audio denoising and click elimination.
* Dynamic word-level caption styles (Hormozi, Neon, Minimal, Podcast).

### Phase 3 — Visual AI
* Torso apparel inpainting and color swatches.
* Automated keyword motion graphics and progress bars.
* Studio color harmonizing.

### Phase 4 — Voice Studio
* Voice enhancement and speech clarity normalization.
* Synthetic AI narrator replacement with timing synchronization.

### Phase 5 — Smart Editing
* Multi-prompt chaining and director presets.
* Automated viral hook suggestions.
* Batch reel generation.

---

# Success Criteria for V1

A creator records a simple 20-second desk video on a tripod.

They upload it to Antigravity, type one prompt or choose a preset, and receive:
* ✅ Studio-quality background environment.
* ✅ Upgraded clothing style.
* ✅ Studio-clean audio with zero noise or clicks.
* ✅ Word-bouncing animated captions with keyword highlights.
* ✅ Retention progress bar and motion callouts.
* ✅ A ready-to-post 1080×1920 vertical Instagram Reel / YouTube Short.

No manual video editing software is required.
