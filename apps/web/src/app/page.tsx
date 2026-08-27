'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Video,
  Shirt,
  Image as ImageIcon,
  Mic,
  Subtitles,
  Activity,
  Layers,
  CheckCircle,
  Play,
  SplitSquareVertical,
  Check,
  Zap,
  Sliders,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'after' | 'before'>('after');

  return (
    <div className="min-h-screen flex flex-col bg-studio-bg overflow-x-hidden selection:bg-studio-accent selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Glow ambient backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-studio-accent/25 to-studio-cyan/20 blur-[130px] rounded-full pointer-events-none -z-10" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-studio-panel border border-studio-border/80 text-xs font-semibold text-studio-cyan mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-studio-cyan" />
          <span>Prompt-to-Reel AI Studio for Fixed Desk Creators</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.12]">
          Turn raw desk recordings into{' '}
          <span className="bg-gradient-to-r from-studio-cyan via-purple-400 to-pink-400 bg-clip-text text-transparent">
            viral reels with one prompt.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-studio-textMuted max-w-2xl leading-relaxed">
          Antigravity is not a HeyGen clone. It&apos;s an AI-first studio built for educational, coding, finance & productivity creators. Upload raw desk footage — AI replaces your room, clothes, cleans audio, and crafts Alex Hormozi captions automatically.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-studio-accent to-purple-600 hover:from-purple-500 hover:to-indigo-600 text-white flex items-center gap-2.5 shadow-glow transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-studio-cyan" />
            <span>Open Studio Editor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/editor/demo-coding-reel"
            className="px-8 py-4 rounded-2xl text-sm font-bold bg-studio-panel hover:bg-studio-border border border-studio-border text-slate-200 hover:text-white flex items-center gap-2.5 transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 text-studio-gold fill-current" />
            <span>Try Interactive Demo</span>
          </Link>
        </div>

        {/* Target Constraints Notice */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-studio-textMuted">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" /> Static Tripod Camera
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" /> Face Hidden / Torso & Hands
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" /> Preserves Desk & Props
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" /> 1080×1920 30FPS MP4
          </span>
        </div>
      </section>

      {/* Interactive Transformation Showcase */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="glass-panel rounded-3xl border border-studio-border p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
          
          {/* Left Text & Prompt Demo */}
          <div className="flex-1 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-studio-gold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Prompt-First Editing</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              No timelines. No keyframes. <br />
              <span className="text-studio-accent">Just prompt the AI.</span>
            </h2>

            <p className="text-sm text-studio-textMuted leading-relaxed">
              Instead of dragging scissors and adjusting layer masks for 2 hours in Premiere or CapCut, you write instructions like a director. Antigravity interprets the prompt and executes the entire pipeline in parallel.
            </p>

            {/* Prompt Box Demo */}
            <div className="p-4 rounded-2xl bg-studio-panel border border-studio-border/90 space-y-3 shadow-inner">
              <span className="text-[11px] font-mono text-studio-cyan font-bold uppercase tracking-wider">
                Example Director Prompt:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 font-mono bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed">
                &ldquo;Replace my room with a podcast studio with warm oak acoustic wood slats. Change my shirt to a black oversized tee. Add Alex Hormozi bounce captions in bold yellow.&rdquo;
              </p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>AI parses & executes across all 6 microservices in &lt; 30s</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/editor/demo-coding-reel"
                className="px-6 py-3 rounded-xl text-xs font-bold bg-studio-accent hover:bg-studio-accentHover text-white flex items-center gap-2 transition-all shadow-glow"
              >
                <span>Launch Studio with this Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: Live Interactive Reel Preview */}
          <div className="flex-shrink-0 flex flex-col items-center">
            {/* Toggle State */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-studio-panel border border-studio-border mb-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('after')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'after'
                    ? 'bg-studio-accent text-white shadow-glow'
                    : 'text-studio-textMuted hover:text-white'
                }`}
              >
                ✨ Antigravity Studio (AI)
              </button>
              <button
                onClick={() => setActiveTab('before')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'before'
                    ? 'bg-stone-700 text-white'
                    : 'text-studio-textMuted hover:text-white'
                }`}
              >
                📹 Raw Desk Video
              </button>
            </div>

            {/* Reel Frame Container */}
            <div className="w-[280px] sm:w-[320px] h-[500px] sm:h-[570px] rounded-3xl overflow-hidden glass-panel border border-studio-border/90 shadow-2xl relative flex flex-col justify-end bg-studio-bg">
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{
                  backgroundImage:
                    activeTab === 'after'
                      ? 'radial-gradient(circle at 50% 30%, rgba(245,158,11,0.25) 0%, rgba(120,53,15,0.15) 50%, #0c0a09 100%)'
                      : 'linear-gradient(to bottom, #1e293b, #0f172a)',
                }}
              />

              {/* Subject Silhouette */}
              <div className="relative flex flex-col items-center justify-end h-[65%] w-full z-10">
                <div
                  className="w-44 h-40 rounded-t-[50px] transition-colors duration-500 shadow-2xl relative overflow-hidden"
                  style={{
                    backgroundColor: activeTab === 'after' ? '#0f172a' : '#64748b',
                  }}
                >
                  <div className="absolute bottom-0 w-full h-10 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Desk Surface */}
                <div className="w-full h-28 bg-gradient-to-b from-stone-900 to-black border-t border-white/10 flex items-center justify-around px-4">
                  <div className="w-28 h-10 bg-stone-800 rounded border border-white/10 flex items-center justify-center">
                    <span className="text-[8px] text-stone-400 font-mono">KEYBOARD</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-stone-700 border border-amber-500/20" />
                </div>
              </div>

              {/* Subtitles Overlay */}
              {activeTab === 'after' && (
                <div className="absolute inset-x-4 top-[56%] z-20 flex flex-col items-center text-center">
                  <div className="font-black text-xl leading-tight px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur border border-white/10 drop-shadow-2xl">
                    <span className="text-white">SCALING WITH </span>
                    <span className="text-studio-gold animate-caption-bounce inline-block">AI WORKFLOWS</span>
                  </div>
                </div>
              )}

              {/* Top Tag */}
              <div className="absolute top-4 left-4 z-20">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur border border-white/10 text-slate-200">
                  {activeTab === 'after' ? '🚀 1080x1920 REEL' : 'RAW 1080P'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core AI Modules Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            6 Modular AI Services in One Engine
          </h2>
          <p className="mt-3 text-sm text-studio-textMuted">
            Each stage is independently replaceable, ultra-fast, and tuned for desk creator workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Module 1 */}
          <div className="glass-card rounded-2xl p-6 border border-studio-border hover:border-studio-borderLight transition-all flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-studio-cyan/10 border border-studio-cyan/20 flex items-center justify-center text-studio-cyan group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Module 1 — Background AI</h3>
            <p className="text-xs text-studio-textMuted leading-relaxed">
              Replaces the room behind you with luxury podcast studios, dark RGB coder caves, or minimal Nordic daylight setups while preserving desk & hands.
            </p>
          </div>

          {/* Module 2 */}
          <div className="glass-card rounded-2xl p-6 border border-studio-border hover:border-studio-borderLight transition-all flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Shirt className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Module 2 — Outfit AI</h3>
            <p className="text-xs text-studio-textMuted leading-relaxed">
              Inpaints apparel (white oversized tee, black hoodie, polo) while strictly locking natural wrinkles, fabric folds, and lighting consistency.
            </p>
          </div>

          {/* Module 3 */}
          <div className="glass-card rounded-2xl p-6 border border-studio-border hover:border-studio-borderLight transition-all flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Module 3 — Audio AI</h3>
            <p className="text-xs text-studio-textMuted leading-relaxed">
              Removes background fan hum, keyboard clatter, echo, and room resonance with FFT denoisers and EBU R128 studio loudness normalization.
            </p>
          </div>

          {/* Module 4 */}
          <div className="glass-card rounded-2xl p-6 border border-studio-border hover:border-studio-borderLight transition-all flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Module 4 — Voice AI</h3>
            <p className="text-xs text-studio-textMuted leading-relaxed">
              Enhance user pronunciation and clarity, or seamlessly replace narration with deep English or Hindi synthetic narrators synced to timing.
            </p>
          </div>

          {/* Module 5 */}
          <div className="glass-card rounded-2xl p-6 border border-studio-border hover:border-studio-borderLight transition-all flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
              <Subtitles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Module 5 — Caption AI</h3>
            <p className="text-xs text-studio-textMuted leading-relaxed">
              Generates word-timestamped subtitles in Alex Hormozi bounce, TikTok minimal, Cyberpunk neon, or Podcast karaoke typography styles.
            </p>
          </div>

          {/* Module 6 */}
          <div className="glass-card rounded-2xl p-6 border border-studio-border hover:border-studio-borderLight transition-all flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Module 6 — Motion Graphics AI</h3>
            <p className="text-xs text-studio-textMuted leading-relaxed">
              Automatically identifies high-retention keywords from speech to render animated pop text, underlines, highlight boxes, and progress bars.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-studio-border py-10 px-6 text-center text-xs text-studio-textMuted">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-studio-accent flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-200">ANTIGRAVITY STUDIO</span>
            <span>— AI Reel Editing Studio for Creators</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/editor/demo-coding-reel" className="hover:text-white transition-colors">
              Studio Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
