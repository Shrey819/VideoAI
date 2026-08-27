'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, SplitSquareVertical, Subtitles, RotateCcw, Sparkles } from 'lucide-react';
import { useStudioStore } from '../store/studioStore';
import { STUDIO_BACKGROUND_PRESETS } from '@antigravity/shared';

export function ReelPlayer() {
  const {
    project,
    isPlaying,
    currentTime,
    duration,
    showComparison,
    showSubtitlesOverlay,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setShowComparison,
    setShowSubtitlesOverlay,
  } = useStudioStore();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [hasRealVideo, setHasRealVideo] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  // Handle Play/Pause sync with real video element
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, setIsPlaying]);

  // Virtual playback timer fallback if no real video is loaded
  useEffect(() => {
    if (!hasRealVideo) {
      if (isPlaying) {
        lastTimeRef.current = Date.now();
        const tick = () => {
          const now = Date.now();
          const delta = (now - lastTimeRef.current) / 1000;
          lastTimeRef.current = now;

          const maxDur = duration || 15;
          let nextTime = currentTime + delta;
          if (nextTime >= maxDur) {
            nextTime = 0;
          }
          setCurrentTime(nextTime);
          animationRef.current = requestAnimationFrame(tick);
        };
        animationRef.current = requestAnimationFrame(tick);
      } else if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, currentTime, duration, hasRealVideo, setCurrentTime]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoLoaded = () => {
    if (videoRef.current) {
      setHasRealVideo(true);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  // Find active transcript segment and active word based on currentTime
  const activeSegment = project?.transcript?.find(
    (seg) => currentTime >= seg.start && currentTime <= seg.end
  );

  const activeWord = activeSegment?.words?.find(
    (w) => currentTime >= w.start && currentTime <= w.end
  );

  const edits = project?.edits;
  const captionStyle = edits?.captions?.style || 'hormozi';
  const highlightCol = edits?.captions?.highlightColor || '#FACC15';
  const secondaryCol = edits?.captions?.secondaryHighlightColor || '#22C55E';
  const isUppercase = edits?.captions?.uppercase !== false;

  const currentBgPreset = STUDIO_BACKGROUND_PRESETS.find(
    (p) => p.id === edits?.background?.presetId
  ) || STUDIO_BACKGROUND_PRESETS[0];

  const blurAmount = (edits?.background?.blurStrength || 2) * 1.6;
  const isLightingMatch = edits?.background?.lightingMatch !== false;

  const videoSource = project?.renderedVideoUrl || project?.rawVideoUrl;

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 select-none">
      {/* 9:16 Vertical Reel Frame */}
      <div className="relative w-[340px] sm:w-[380px] h-[600px] sm:h-[675px] rounded-3xl overflow-hidden glass-panel border border-studio-border/80 shadow-2xl flex flex-col bg-studio-bg group">
        
        {/* Real HTML5 Video Player Layer (if available) */}
        {videoSource && (
          <video
            ref={videoRef}
            src={videoSource}
            playsInline
            muted={isMuted}
            onTimeUpdate={handleVideoTimeUpdate}
            onLoadedMetadata={handleVideoLoaded}
            onEnded={() => setIsPlaying(false)}
            onError={() => setHasRealVideo(false)}
            className={`absolute inset-0 w-full h-full object-cover z-0 ${
              hasRealVideo ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        )}

        {/* Studio Background & Protected Desk Layer (when previewing/compositing) */}
        {!hasRealVideo && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Background Environment Backdrop with Depth Blur */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105"
              style={{
                backgroundImage: currentBgPreset.lightingCast,
                filter: `blur(${blurAmount}px)`,
              }}
            />

            {/* Ambient Lighting Cast Overlay */}
            {isLightingMatch && (
              <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay transition-colors duration-500"
                style={{ backgroundColor: currentBgPreset.ambientColor }}
              />
            )}

            {/* Torso & Preserved Desk Elements */}
            <div className="absolute inset-0 flex flex-col justify-end">
              <div className="relative flex flex-col items-center justify-end h-[65%] w-full">
                
                {/* Creator Torso Silhouette with Garment Styling */}
                <div
                  className="w-48 sm:w-56 h-48 rounded-t-[60px] transition-all duration-500 shadow-2xl relative overflow-hidden flex flex-col items-center justify-start pt-1"
                  style={{
                    backgroundColor: edits?.outfit?.color || '#0f172a',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: isLightingMatch ? `0 0 40px ${currentBgPreset.ambientColor}` : undefined,
                  }}
                >
                  {/* Neckline Details Based on Garment Type */}
                  {edits?.outfit?.garmentType === 'hoodie' && (
                    <div className="w-24 h-6 rounded-b-2xl bg-black/40 border-b border-white/15 shadow-inner flex items-center justify-center">
                      <div className="w-8 h-1 bg-white/20 rounded-full" />
                    </div>
                  )}

                  {edits?.outfit?.garmentType === 'polo' && (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-4 rounded-b-lg bg-black/30 border-b border-white/20" />
                      <div className="w-3 h-8 bg-black/40 border-l border-r border-b border-white/10 flex flex-col items-center justify-around py-0.5">
                        <div className="w-1 h-1 rounded-full bg-white/40" />
                        <div className="w-1 h-1 rounded-full bg-white/40" />
                      </div>
                    </div>
                  )}

                  {edits?.outfit?.garmentType === 'sweater' && (
                    <div className="w-20 h-3 rounded-b-full bg-black/30 border-b-2 border-dashed border-white/20" />
                  )}

                  {(!edits?.outfit?.garmentType || edits?.outfit?.garmentType === 'tshirt') && (
                    <div className="w-20 h-3 rounded-b-full bg-black/25 border-b border-white/15" />
                  )}

                  {/* Fabric Wrinkle & Fold Shading Overlay */}
                  <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px]" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none" />
                  <div className="absolute bottom-0 w-full h-14 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Desk Surface & Protected Creator Tools */}
                <div className="w-full h-32 bg-gradient-to-b from-stone-900 via-stone-950 to-black border-t border-white/10 z-10 flex items-center justify-around px-6 relative">
                  {/* Keyboard Prop */}
                  <div className="w-36 h-12 bg-stone-800/90 rounded-lg border border-white/10 shadow-inner flex items-center justify-center">
                    <span className="text-[9px] text-stone-400 font-mono tracking-wider">KEYBOARD</span>
                  </div>

                  {/* Studio Microphone & Mug Props */}
                  <div className="flex items-center gap-3">
                    {/* Coffee Mug */}
                    <div className="w-8 h-8 rounded-full bg-stone-700/80 border border-amber-500/20 flex items-center justify-center shadow-md">
                      <div className="w-5 h-5 rounded-full bg-amber-950/70" />
                    </div>

                    {/* Microphone */}
                    <div className="w-10 h-16 bg-stone-800 rounded-t-full border border-white/10 flex flex-col items-center justify-start pt-1">
                      <div className="w-6 h-6 rounded-full bg-stone-700/80 border border-white/5" />
                      <span className="text-[7px] text-stone-400 font-mono mt-1">MIC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Split Comparison Slider (Raw Desk vs AI Studio) */}
        {showComparison && (
          <div
            className="absolute inset-0 z-10 border-r-2 border-white pointer-events-none bg-stone-900/95 overflow-hidden transition-none"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/70 backdrop-blur text-[11px] font-bold tracking-wide text-amber-300 border border-amber-500/30">
              ORIGINAL RAW
            </div>
            <div className="w-[380px] h-[675px] flex flex-col justify-end">
              <div className="h-44 w-52 mx-auto rounded-t-[50px] bg-slate-700/60" />
              <div className="w-full h-32 bg-stone-900" />
            </div>
          </div>
        )}

        {/* Top Header Overlay */}
        <div className="absolute top-0 inset-x-0 p-4 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/30 to-transparent">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-studio-accent/30 text-purple-200 border border-studio-accent/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-studio-cyan" />
              {currentBgPreset.name.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono text-stone-400">1080×1920 (9:16)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowComparison(!showComparison)}
              title="Toggle Before / After Split"
              className={`p-1.5 rounded-lg border transition-colors ${
                showComparison
                  ? 'bg-studio-cyan/20 border-studio-cyan text-studio-cyan'
                  : 'bg-black/40 border-white/10 text-white/70 hover:text-white'
              }`}
            >
              <SplitSquareVertical className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSubtitlesOverlay(!showSubtitlesOverlay)}
              title="Toggle Captions Overlay"
              className={`p-1.5 rounded-lg border transition-colors ${
                showSubtitlesOverlay
                  ? 'bg-studio-accent/20 border-studio-accent text-purple-300'
                  : 'bg-black/40 border-white/10 text-white/70 hover:text-white'
              }`}
            >
              <Subtitles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Dynamic Kinetic Subtitles Overlay & Keyword Callout Badge */}
        {showSubtitlesOverlay && edits?.captions?.enabled && activeSegment && (
          <div className="absolute inset-x-4 top-[50%] z-20 flex flex-col items-center justify-center text-center pointer-events-none px-2 space-y-2">
            
            {/* Animated Keyword Pop-Up Callout Badge */}
            {activeWord?.isKeyword && edits?.motion?.showKeywordBadges !== false && (
              <div
                className={`transition-all duration-200 flex items-center gap-1.5 shadow-2xl ${
                  edits?.motion?.calloutStyle === 'neon_glow'
                    ? 'bg-black/90 border border-cyan-400 text-cyan-300 px-3 py-1 rounded-xl shadow-glowCyan font-mono text-xs'
                    : edits?.motion?.calloutStyle === 'slide_fade'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-xl font-bold text-xs animate-pulse'
                    : edits?.motion?.calloutStyle === 'minimal_pill'
                    ? 'backdrop-blur-md bg-white/20 border border-white/40 text-white px-3 py-1 rounded-full font-semibold text-xs'
                    : 'bg-amber-400 text-stone-950 font-black px-3 py-1 rounded-xl shadow-glow animate-bounce text-xs'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>KEYWORD: {activeWord.word.toUpperCase()}</span>
              </div>
            )}

            <div
              className={`inline-flex flex-wrap justify-center items-center gap-x-2 gap-y-1 font-black px-4 py-2 rounded-2xl transition-all duration-150 ${
                captionStyle === 'hormozi'
                  ? 'drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)]'
                  : captionStyle === 'cyberpunk'
                  ? 'drop-shadow-[0_0_14px_rgba(6,182,212,0.8)]'
                  : 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
              }`}
              style={{
                fontSize: `${Math.max(22, Math.min(32, edits.captions.fontSize * 0.52))}px`,
                lineHeight: 1.15,
                letterSpacing: captionStyle === 'hormozi' ? '-0.03em' : '0.02em',
              }}
            >
              {activeSegment.words.map((w, idx) => {
                const isActive = activeWord?.word === w.word && activeWord?.start === w.start;
                const text = isUppercase ? w.word.toUpperCase() : w.word;

                let color = edits.captions.primaryColor || '#FFFFFF';
                if (isActive) {
                  color = highlightCol;
                } else if (w.isKeyword) {
                  color = secondaryCol;
                }

                return (
                  <span
                    key={idx}
                    className={`inline-block transition-all duration-100 ${
                      isActive ? 'scale-110 font-black animate-caption-bounce' : 'font-extrabold'
                    }`}
                    style={{
                      color: color,
                      textShadow: isActive
                        ? `0 0 16px ${highlightCol}80, 0 3px 6px #000000`
                        : '0 2px 4px #000000',
                    }}
                  >
                    {text}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Retention Progress Bar (Top or Bottom Position) */}
        {edits?.motion?.showProgressBar && (
          <div
            className={`absolute inset-x-4 h-1.5 rounded-full bg-white/15 overflow-hidden z-20 ${
              edits.motion.progressBarPosition === 'bottom' ? 'bottom-16' : 'top-12'
            }`}
          >
            <div
              className="h-full transition-all duration-100 shadow-glow"
              style={{
                width: `${(currentTime / (duration || 15)) * 100}%`,
                backgroundColor: edits.motion.progressBarColor || '#8B5CF6',
              }}
            />
          </div>
        )}

        {/* Center Play Button Overlay on Pause */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 z-20 m-auto w-16 h-16 rounded-full bg-studio-accent/80 hover:bg-studio-accent text-white flex items-center justify-center shadow-glow backdrop-blur transition-transform hover:scale-110"
          >
            <Play className="w-8 h-8 fill-white ml-1" />
          </button>
        )}

        {/* Bottom Playback Scrubber & Controls */}
        <div className="absolute bottom-0 inset-x-0 p-4 z-20 flex flex-col gap-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max={duration || 15}
              step="0.05"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-studio-accent hover:accent-purple-400"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-stone-300">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="hover:text-white">
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
              <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white flex items-center gap-1.5">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {/* Visual Audio Waveform Equalizer when playing */}
                {isPlaying && !isMuted && (
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-3 bg-studio-gold animate-pulse rounded-full" />
                    <span className="w-0.5 h-2 bg-studio-gold animate-bounce rounded-full" />
                    <span className="w-0.5 h-3.5 bg-studio-cyan animate-pulse rounded-full" />
                    <span className="w-0.5 h-1.5 bg-studio-cyan animate-bounce rounded-full" />
                  </div>
                )}
              </button>
              <span className="font-mono text-[11px] text-stone-400">
                0:{Math.floor(currentTime).toString().padStart(2, '0')} / 0:
                {Math.floor(duration || 15).toString().padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-studio-gold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                {edits?.audio?.voiceMode === 'ai_narrator' ? 'AI NARRATOR' : 'CLEAN AUDIO'}
              </span>
              <button
                onClick={() => {
                  setCurrentTime(0);
                  if (videoRef.current) videoRef.current.currentTime = 0;
                }}
                title="Restart Reel"
                className="hover:text-white p-1 rounded"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
