'use client';

import React from 'react';
import {
  Image as ImageIcon,
  Shirt,
  Mic,
  Subtitles,
  Activity,
  Sliders,
  Check,
  Sparkles,
} from 'lucide-react';
import { useStudioStore, StudioTab } from '../store/studioStore';
import {
  CaptionStyleType,
  STUDIO_BACKGROUND_PRESETS,
  OUTFIT_STYLE_PRESETS,
  CREATOR_COLOR_PALETTES,
  AI_NARRATOR_VOICES,
  MOTION_CALLOUT_STYLES,
  PROGRESS_BAR_COLORS,
} from '@antigravity/shared';

const TABS: { id: StudioTab; label: string; icon: React.ElementType }[] = [
  { id: 'background', label: 'Background', icon: ImageIcon },
  { id: 'outfit', label: 'Outfit', icon: Shirt },
  { id: 'audio', label: 'Voice & Audio', icon: Mic },
  { id: 'captions', label: 'Captions', icon: Subtitles },
  { id: 'motion', label: 'Motion FX', icon: Activity },
  { id: 'export', label: 'Export', icon: Sliders },
];

export function ModuleInspector() {
  const { project, activeTab, setActiveTab, updateEdits, setCurrentTime, setProject } =
    useStudioStore();
  const [isEditingScript, setIsEditingScript] = React.useState(false);
  const [customScriptText, setCustomScriptText] = React.useState('');
  const [isTranscribing, setIsTranscribing] = React.useState(false);

  const edits = project?.edits;

  if (!edits) return null;

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl border border-studio-border overflow-hidden">
      {/* Module Tabs Header */}
      <div className="flex items-center gap-1 p-2 bg-studio-surface/90 border-b border-studio-border overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-studio-accent text-white shadow-glow'
                  : 'text-studio-textMuted hover:text-white hover:bg-studio-panel'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="p-5 overflow-y-auto flex-1 space-y-5 text-sm">
        {/* TAB 1: BACKGROUND AI */}
        {activeTab === 'background' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-studio-cyan" />
                Studio Background AI
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                DESK PROTECTED
              </span>
            </div>

            {/* Studio Environment Presets Gallery */}
            <div>
              <label className="text-xs text-studio-textMuted font-medium block mb-1.5">
                Studio Environments
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STUDIO_BACKGROUND_PRESETS.map((env) => {
                  const isSelected = edits.background.presetId === env.id;
                  return (
                    <button
                      key={env.id}
                      onClick={() =>
                        updateEdits({
                          background: {
                            ...edits.background,
                            presetId: env.id,
                            prompt: env.defaultPrompt,
                          },
                        })
                      }
                      className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        isSelected
                          ? 'bg-studio-accent/20 border-studio-accent text-white shadow-glow'
                          : 'bg-studio-panel/70 border-studio-border text-slate-300 hover:border-studio-borderLight hover:bg-studio-panel'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{env.icon}</span>
                          <span>{env.name}</span>
                        </span>
                        <span className="text-[9px] font-mono uppercase text-studio-cyan">
                          {env.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-studio-textMuted line-clamp-2 leading-tight">
                        {env.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Scene Prompt */}
            <div>
              <label className="text-xs text-studio-textMuted font-medium block mb-1.5">
                Custom Scene Prompt
              </label>
              <textarea
                value={edits.background.prompt}
                onChange={(e) =>
                  updateEdits({
                    background: { ...edits.background, prompt: e.target.value },
                  })
                }
                rows={2}
                className="w-full rounded-xl bg-studio-panel border border-studio-border p-2.5 text-xs text-slate-200 focus:outline-none focus:border-studio-accent resize-none"
              />
            </div>

            {/* Sliders: Depth Blur & Edge Feathering */}
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-studio-textMuted">Depth of Field Blur</span>
                  <span className="text-white font-mono">{edits.background.blurStrength}x</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="0.5"
                  value={edits.background.blurStrength}
                  onChange={(e) =>
                    updateEdits({
                      background: {
                        ...edits.background,
                        blurStrength: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-studio-accent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-studio-textMuted">Matte Edge Feathering</span>
                  <span className="text-white font-mono">{edits.background.matteFeather || 2}px</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="6"
                  step="0.5"
                  value={edits.background.matteFeather || 2}
                  onChange={(e) =>
                    updateEdits({
                      background: {
                        ...edits.background,
                        matteFeather: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-studio-cyan"
                />
              </div>
            </div>

            {/* Lighting Match Harmonizer */}
            <div className="pt-2 border-t border-studio-border flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Lighting Match Harmonizer
                </span>
                <span className="text-[11px] text-studio-textMuted">
                  Casts ambient room glow onto hands & desk
                </span>
              </div>
              <input
                type="checkbox"
                checked={edits.background.lightingMatch}
                onChange={(e) =>
                  updateEdits({
                    background: {
                      ...edits.background,
                      lightingMatch: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 accent-studio-accent rounded"
              />
            </div>

            {/* Protected Props List Indicator */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px]">
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Protected Real-World Desk Objects:</span>
              </span>
              <p className="text-stone-400 text-[10px] leading-relaxed">
                Table Surface, Hands & Arms, Keyboard, Mouse, Laptop, Microphone, Coffee Mug, Pen.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: OUTFIT AI */}
        {activeTab === 'outfit' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Shirt className="w-4 h-4 text-studio-accent" />
                Torso Apparel AI
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono font-bold">
                POSE LOCKED
              </span>
            </div>

            {/* Apparel Style Presets */}
            <div>
              <label className="text-xs text-studio-textMuted font-medium block mb-1.5">
                Apparel Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {OUTFIT_STYLE_PRESETS.map((style) => {
                  const isSelected = edits.outfit.garmentType === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() =>
                        updateEdits({
                          outfit: {
                            ...edits.outfit,
                            garmentType: style.id,
                            fabricTexture: style.fabricTexture,
                          },
                        })
                      }
                      className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                        isSelected
                          ? 'bg-studio-accent/20 border-studio-accent text-white shadow-glow'
                          : 'bg-studio-panel/70 border-studio-border text-slate-300 hover:border-studio-borderLight hover:bg-studio-panel'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{style.icon}</span>
                          <span>{style.name}</span>
                        </span>
                        <span className="text-[9px] font-mono text-studio-accent font-semibold">
                          {style.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-studio-textMuted line-clamp-2 leading-tight">
                        {style.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Creator Color Palette Swatches */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="text-studio-textMuted font-medium">
                  Color Swatches
                </label>
                <span className="font-mono text-slate-200 text-[11px]">
                  {edits.outfit.color}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {CREATOR_COLOR_PALETTES.map((c) => {
                  const isSelected = edits.outfit.color.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.hex}
                      onClick={() =>
                        updateEdits({
                          outfit: { ...edits.outfit, color: c.hex },
                        })
                      }
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'border-studio-cyan bg-studio-cyan/10 ring-1 ring-studio-cyan'
                          : 'border-white/10 bg-black/40 hover:border-white/20'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-white/20 shadow"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-[9px] text-slate-300 truncate w-full text-center">
                        {c.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Apparel Prompt */}
            <div>
              <label className="text-xs text-studio-textMuted font-medium block mb-1.5">
                Custom Garment Description
              </label>
              <input
                type="text"
                value={edits.outfit.prompt}
                onChange={(e) =>
                  updateEdits({
                    outfit: { ...edits.outfit, prompt: e.target.value },
                  })
                }
                placeholder="e.g. Heavyweight minimalist matte black cotton crewneck"
                className="w-full rounded-xl bg-studio-panel border border-studio-border p-2.5 text-xs text-slate-200 focus:outline-none focus:border-studio-accent"
              />
            </div>

            {/* Wrinkle & Fold Preservation Toggle */}
            <div className="pt-2 border-t border-studio-border flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Preserve Natural Wrinkles & Folds
                </span>
                <span className="text-[11px] text-studio-textMuted">
                  Locks fabric drape, movement, and natural creases
                </span>
              </div>
              <input
                type="checkbox"
                checked={edits.outfit.preserveWrinkles}
                onChange={(e) =>
                  updateEdits({
                    outfit: {
                      ...edits.outfit,
                      preserveWrinkles: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 accent-studio-accent rounded"
              />
            </div>

            {/* Garment Protection Summary Box */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px]">
              <span className="font-semibold text-purple-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Protected Anatomical Boundaries:</span>
              </span>
              <p className="text-stone-400 text-[10px] leading-relaxed">
                Neckline position, shoulder posture, arms, hands, and physical typing/writing motion remain 100% untouched.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIO & VOICE AI */}
        {activeTab === 'audio' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Mic className="w-4 h-4 text-studio-gold" />
                Audio AI & Voice Studio
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono font-bold">
                EBU R128 (-16 LUFS)
              </span>
            </div>

            {/* Acoustic Denoising Toggles */}
            <div className="space-y-2.5">
              <label className="text-xs text-studio-textMuted font-medium block">
                Acoustic Polish & Noise Cancellation
              </label>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-studio-panel border border-studio-border">
                <div>
                  <span className="text-xs text-slate-200 font-semibold block">
                    🌬️ Fan & Room Resonance Denoise
                  </span>
                  <span className="text-[10px] text-studio-textMuted">
                    Eliminates AC hum and background drone
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={edits.audio.removeFanNoise}
                  onChange={(e) =>
                    updateEdits({
                      audio: { ...edits.audio, removeFanNoise: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-studio-accent rounded"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-studio-panel border border-studio-border">
                <div>
                  <span className="text-xs text-slate-200 font-semibold block">
                    ⌨️ Keyboard & Desk Click Removal
                  </span>
                  <span className="text-[10px] text-studio-textMuted">
                    Filters mechanical switch clatter & mouse clicks
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={edits.audio.removeKeyboardClicks}
                  onChange={(e) =>
                    updateEdits({
                      audio: {
                        ...edits.audio,
                        removeKeyboardClicks: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-studio-accent rounded"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-studio-panel border border-studio-border">
                <div>
                  <span className="text-xs text-slate-200 font-semibold block">
                    🎙️ Room Echo & Reverb Cancellation
                  </span>
                  <span className="text-[10px] text-studio-textMuted">
                    Removes bare-wall room reverberation
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={edits.audio.removeRoomEcho !== false}
                  onChange={(e) =>
                    updateEdits({
                      audio: {
                        ...edits.audio,
                        removeRoomEcho: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-studio-accent rounded"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-studio-panel border border-studio-border">
                <div>
                  <span className="text-xs text-slate-200 font-semibold block">
                    📊 Broadcast Loudness Normalization
                  </span>
                  <span className="text-[10px] text-studio-textMuted">
                    Levels volume to social media standard (-16 LUFS)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={edits.audio.normalizeLoudness}
                  onChange={(e) =>
                    updateEdits({
                      audio: {
                        ...edits.audio,
                        normalizeLoudness: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-studio-accent rounded"
                />
              </div>
            </div>

            {/* Voice Mode Selector */}
            <div className="pt-2 border-t border-studio-border space-y-2.5">
              <label className="text-xs text-studio-textMuted font-medium block">
                Narration & Voice Studio
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    updateEdits({ audio: { ...edits.audio, voiceMode: 'enhanced' } })
                  }
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    edits.audio.voiceMode === 'enhanced'
                      ? 'bg-studio-accent/20 border-studio-accent text-white shadow-glow'
                      : 'bg-studio-panel/70 border-studio-border text-slate-300 hover:border-studio-borderLight hover:bg-studio-panel'
                  }`}
                >
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>✨</span>
                    <span>Enhanced Voice</span>
                  </span>
                  <span className="text-[10px] text-studio-textMuted leading-tight">
                    Keep your real voice with studio clarity & tone polish
                  </span>
                </button>

                <button
                  onClick={() =>
                    updateEdits({
                      audio: { ...edits.audio, voiceMode: 'ai_narrator' },
                    })
                  }
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    edits.audio.voiceMode === 'ai_narrator'
                      ? 'bg-studio-accent/20 border-studio-accent text-white shadow-glow'
                      : 'bg-studio-panel/70 border-studio-border text-slate-300 hover:border-studio-borderLight hover:bg-studio-panel'
                  }`}
                >
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>🎙️</span>
                    <span>AI Narrator</span>
                  </span>
                  <span className="text-[10px] text-studio-textMuted leading-tight">
                    Replace voice with synthetic narrator synced to timing
                  </span>
                </button>
              </div>

              {/* AI Narrator Voices Gallery (when AI Narrator is chosen) */}
              {edits.audio.voiceMode === 'ai_narrator' && (
                <div className="space-y-2 pt-1 animate-fadeIn">
                  <span className="text-[11px] font-semibold text-studio-cyan block">
                    Select Synthetic Narrator Voice:
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {AI_NARRATOR_VOICES.map((v) => {
                      const isSelected = (edits.audio.narratorVoice || 'deep_english_male') === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() =>
                            updateEdits({
                              audio: { ...edits.audio, narratorVoice: v.id },
                            })
                          }
                          className={`w-full p-2.5 rounded-xl border text-left flex items-start justify-between gap-2 transition-all ${
                            isSelected
                              ? 'bg-studio-accent/20 border-studio-accent text-white shadow-glow'
                              : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span>{v.icon}</span>
                              <span className="text-xs font-bold text-white">{v.name}</span>
                              <span className="text-[9px] font-mono text-studio-cyan bg-studio-cyan/10 px-1.5 py-0.2 rounded">
                                {v.tone}
                              </span>
                            </div>
                            <p className="text-[10px] text-studio-textMuted">
                              {v.description}
                            </p>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-studio-cyan flex-shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Speech Pacing Multiplier */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-studio-textMuted font-medium">Speech Rate Pacing</span>
                  <span className="text-white font-mono">{edits.audio.speechRateMultiplier || 1.0}x</span>
                </div>
                <input
                  type="range"
                  min="0.9"
                  max="1.3"
                  step="0.05"
                  value={edits.audio.speechRateMultiplier || 1.0}
                  onChange={(e) =>
                    updateEdits({
                      audio: {
                        ...edits.audio,
                        speechRateMultiplier: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-studio-gold"
                />
              </div>
            </div>

            {/* Audio Polish Guarantee Summary */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px]">
              <span className="font-semibold text-amber-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Zero Audio Warping Guarantee:</span>
              </span>
              <p className="text-stone-400 text-[10px] leading-relaxed">
                Speech cadence, tone harmonics, and vocal warmth are preserved. No artificial robotic phasing.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: CAPTIONS AI */}
        {activeTab === 'captions' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Subtitles className="w-4 h-4 text-studio-cyan" />
                Kinetic Captions AI
              </h3>
              <input
                type="checkbox"
                checked={edits.captions.enabled}
                onChange={(e) =>
                  updateEdits({
                    captions: { ...edits.captions, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 accent-studio-accent"
              />
            </div>

            <div>
              <label className="text-xs text-studio-textMuted font-medium block mb-1.5">
                Caption Style Template
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'hormozi', name: 'Alex Hormozi (Bold Bounce)' },
                    { id: 'cyberpunk', name: 'Cyberpunk Neon' },
                    { id: 'podcast', name: 'Podcast Karaoke' },
                    { id: 'minimal', name: 'Nordic Clean' },
                  ] as const
                ).map((st) => (
                  <button
                    key={st.id}
                    onClick={() =>
                      updateEdits({
                        captions: {
                          ...edits.captions,
                          style: st.id as CaptionStyleType,
                        },
                      })
                    }
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      edits.captions.style === st.id
                        ? 'bg-studio-accent/20 border-studio-accent text-white shadow-glow'
                        : 'bg-studio-panel border-studio-border text-slate-400 hover:text-white'
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-studio-textMuted font-medium block mb-1.5">
                Keyword Highlight Color
              </label>
              <div className="flex items-center gap-2">
                {[
                  { hex: '#FACC15', label: 'Hormozi Gold' },
                  { hex: '#22C55E', label: 'Viral Emerald' },
                  { hex: '#06B6D4', label: 'Cyan Electric' },
                  { hex: '#EC4899', label: 'Magenta Pink' },
                  { hex: '#FFFFFF', label: 'Pure White' },
                ].map((c) => (
                  <button
                    key={c.hex}
                    onClick={() =>
                      updateEdits({
                        captions: { ...edits.captions, highlightColor: c.hex },
                      })
                    }
                    title={c.label}
                    className={`w-7 h-7 rounded-full border transition-transform ${
                      edits.captions.highlightColor === c.hex
                        ? 'scale-125 border-white ring-2 ring-studio-cyan'
                        : 'border-white/20 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-studio-border flex items-center justify-between">
              <span className="text-xs text-slate-200">Force UPPERCASE</span>
              <input
                type="checkbox"
                checked={edits.captions.uppercase}
                onChange={(e) =>
                  updateEdits({
                    captions: { ...edits.captions, uppercase: e.target.checked },
                  })
                }
                className="w-4 h-4 accent-studio-accent"
              />
            </div>

            {/* Spoken Transcript & Frame-Accurate Speech Understanding */}
            {project?.transcript && project.transcript.length > 0 && (
              <div className="pt-3 border-t border-studio-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>🎙️ Speech & Frame Synchronization</span>
                    <span className="text-[10px] font-mono text-studio-cyan bg-studio-cyan/10 px-1.5 py-0.5 rounded border border-studio-cyan/30">
                      30.00 FPS Sync
                    </span>
                  </span>
                  <button
                    onClick={() => setIsEditingScript(!isEditingScript)}
                    className="text-[11px] text-studio-cyan hover:underline font-medium"
                  >
                    {isEditingScript ? 'Close Script Editor' : '✏️ Edit / Re-Align Script'}
                  </button>
                </div>

                {/* Speech Understanding Analytics Stats */}
                {(() => {
                  const allWords = project.transcript.flatMap((s) => s.words || []);
                  const totalWords = allWords.length;
                  const keywordsCount = allWords.filter((w) => w.isKeyword).length;
                  const duration = project.duration || 15;
                  const wpm = duration > 0 ? Math.round((totalWords / duration) * 60) : 150;

                  return (
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                      <div>
                        <span className="text-[10px] text-studio-textMuted block">Spoken Words</span>
                        <span className="text-xs font-bold text-white font-mono">{totalWords}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-studio-textMuted block">Pacing Cadence</span>
                        <span className="text-xs font-bold text-studio-gold font-mono">{wpm} WPM</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-studio-textMuted block">Power Keywords</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          {keywordsCount} ({totalWords > 0 ? Math.round((keywordsCount / totalWords) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Custom Script Editor & Frame Re-Alignment */}
                {isEditingScript && (
                  <div className="p-3 rounded-2xl bg-studio-panel border border-studio-accent/40 space-y-2 animate-fadeIn">
                    <label className="text-xs font-bold text-white block">
                      Edit Script & Auto-Align Word Frames
                    </label>
                    <textarea
                      rows={3}
                      value={customScriptText}
                      onChange={(e) => setCustomScriptText(e.target.value)}
                      placeholder="Type or paste custom transcript text here to automatically assign every word to video time frames..."
                      className="w-full rounded-xl bg-black/50 border border-studio-border p-2.5 text-xs text-slate-200 focus:outline-none focus:border-studio-accent resize-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={async () => {
                          if (!customScriptText.trim()) return;
                          setIsTranscribing(true);
                          try {
                            const res = await fetch(`/api/projects/${project.id}/transcribe`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ customText: customScriptText }),
                            });
                            const data = await res.json();
                            if (data.project) {
                              setProject(data.project);
                              setIsEditingScript(false);
                            }
                          } catch (e) {
                            console.error('Re-alignment error:', e);
                          } finally {
                            setIsTranscribing(false);
                          }
                        }}
                        disabled={isTranscribing || !customScriptText.trim()}
                        className="px-3 py-1.5 rounded-lg bg-studio-accent hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isTranscribing ? 'Aligning Frames...' : 'Auto-Align Words to Frames'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Spoken Word Timeline with Frame Multiple Tags */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {project.transcript.map((seg) => (
                    <div
                      key={seg.id}
                      className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 hover:border-studio-accent/40 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-studio-textMuted">
                        <span className="text-studio-cyan font-bold">Phrase #{seg.id + 1}</span>
                        <span className="bg-white/5 px-2 py-0.5 rounded">
                          0:{seg.start.toFixed(2)}s → 0:{seg.end.toFixed(2)}s (Frame {Math.round(seg.start * 30)} - {Math.round(seg.end * 30)})
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {seg.words.map((w, wIdx) => (
                          <div
                            key={wIdx}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs transition-all ${
                              w.isKeyword
                                ? 'bg-amber-500/15 border-amber-400/50 text-amber-300 font-bold shadow-sm'
                                : 'bg-studio-panel/80 border-white/10 text-slate-200 hover:border-studio-cyan/50 hover:bg-studio-panel'
                            }`}
                          >
                            {/* Click word to jump playback to exact video frame */}
                            <button
                              onClick={() => setCurrentTime(w.start)}
                              title={`Jump to Frame ${Math.round(w.start * 30)} (0:${w.start.toFixed(2)}s)`}
                              className="hover:text-studio-cyan hover:underline flex items-center gap-1"
                            >
                              <span>{w.word}</span>
                              <span className="text-[9px] font-mono opacity-50">
                                {w.start.toFixed(2)}s
                              </span>
                            </button>

                            {/* Keyword Toggle Icon Button */}
                            <button
                              onClick={() => {
                                const updatedTranscript = [...project.transcript!];
                                const targetSeg = updatedTranscript.find((s) => s.id === seg.id);
                                if (targetSeg && targetSeg.words[wIdx]) {
                                  targetSeg.words[wIdx].isKeyword = !targetSeg.words[wIdx].isKeyword;
                                  targetSeg.words[wIdx].highlightColor = targetSeg.words[wIdx].isKeyword
                                    ? edits.captions.highlightColor || '#FACC15'
                                    : undefined;
                                }
                                fetch(`/api/projects/${project.id}/transcript`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ transcript: updatedTranscript }),
                                })
                                  .then((r) => r.json())
                                  .then((d) => {
                                    if (d.project) setProject(d.project);
                                  })
                                  .catch(console.error);
                              }}
                              title={w.isKeyword ? 'Remove Keyword Highlight' : 'Tag as Power Keyword'}
                              className={`p-0.5 rounded transition-transform hover:scale-125 ${
                                w.isKeyword ? 'text-amber-400' : 'text-stone-500 hover:text-stone-300'
                              }`}
                            >
                              <Sparkles className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: MOTION GRAPHICS */}
        {activeTab === 'motion' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-studio-cyan" />
                Motion Graphics & Retention AI
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono font-bold">
                RETENTION BOOST
              </span>
            </div>

            {/* Retention Progress Bar Settings */}
            <div className="space-y-3 p-3 rounded-2xl bg-studio-panel/80 border border-studio-border">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-white font-semibold block">
                    ⚡ Retention Progress Bar
                  </span>
                  <span className="text-[10px] text-studio-textMuted">
                    Smooth animated progress line maximizing reel completion rate
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={edits.motion.showProgressBar}
                  onChange={(e) =>
                    updateEdits({
                      motion: {
                        ...edits.motion,
                        showProgressBar: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-studio-accent rounded"
                />
              </div>

              {edits.motion.showProgressBar && (
                <div className="space-y-2.5 pt-2 border-t border-white/5 animate-fadeIn">
                  {/* Position Toggle: Top / Bottom */}
                  <div>
                    <label className="text-[11px] text-studio-textMuted block mb-1">
                      Screen Position
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['top', 'bottom'] as const).map((pos) => (
                        <button
                          key={pos}
                          onClick={() =>
                            updateEdits({
                              motion: {
                                ...edits.motion,
                                progressBarPosition: pos,
                              },
                            })
                          }
                          className={`p-1.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
                            (edits.motion.progressBarPosition || 'top') === pos
                              ? 'bg-studio-accent/20 border-studio-accent text-white shadow-glow'
                              : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Progress Bar Color Palette */}
                  <div>
                    <label className="text-[11px] text-studio-textMuted block mb-1">
                      Progress Bar Color
                    </label>
                    <div className="flex items-center gap-2">
                      {PROGRESS_BAR_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          onClick={() =>
                            updateEdits({
                              motion: {
                                ...edits.motion,
                                progressBarColor: c.hex,
                              },
                            })
                          }
                          title={c.name}
                          className={`w-6 h-6 rounded-full border transition-transform ${
                            edits.motion.progressBarColor === c.hex
                              ? 'scale-125 border-white ring-2 ring-studio-cyan'
                              : 'border-white/20 hover:scale-110'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Keyword Pop-Up Callout Badges */}
            <div className="space-y-3 p-3 rounded-2xl bg-studio-panel/80 border border-studio-border">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-white font-semibold block">
                    💡 Keyword Pop-Up Callout Badges
                  </span>
                  <span className="text-[10px] text-studio-textMuted">
                    Animated visual chips popping on power words
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={edits.motion.showKeywordBadges !== false}
                  onChange={(e) =>
                    updateEdits({
                      motion: {
                        ...edits.motion,
                        showKeywordBadges: e.target.checked,
                        calloutBadges: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-studio-accent rounded"
                />
              </div>

              {edits.motion.showKeywordBadges !== false && (
                <div className="space-y-2 pt-2 border-t border-white/5 animate-fadeIn">
                  <label className="text-[11px] text-studio-textMuted block">
                    Animation Physics & Style
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {MOTION_CALLOUT_STYLES.map((style) => {
                      const isSelected = (edits.motion.calloutStyle || 'bounce') === style.id;
                      return (
                        <button
                          key={style.id}
                          onClick={() =>
                            updateEdits({
                              motion: {
                                ...edits.motion,
                                calloutStyle: style.id,
                              },
                            })
                          }
                          className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all ${
                            isSelected
                              ? 'bg-studio-accent/20 border-studio-accent text-white shadow-glow'
                              : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">
                              {style.name}
                            </span>
                            <span className="text-[9px] font-mono text-studio-cyan">
                              {style.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-studio-textMuted line-clamp-2">
                            {style.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Visual Focus Arrows & Sounds */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-studio-panel border border-studio-border">
                <div>
                  <span className="text-xs text-slate-200 font-semibold block">
                    🎯 Visual Focus Callout Arrows
                  </span>
                  <span className="text-[10px] text-studio-textMuted">
                    Subtle highlight arrows pointing to key visual props
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={edits.motion.showFocusArrows !== false}
                  onChange={(e) =>
                    updateEdits({
                      motion: {
                        ...edits.motion,
                        showFocusArrows: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-studio-accent rounded"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-studio-panel border border-studio-border">
                <div>
                  <span className="text-xs text-slate-200 font-semibold block">
                    🔊 Synchronized Pop & Whoosh SFX
                  </span>
                  <span className="text-[10px] text-studio-textMuted">
                    Subtle acoustic sound effects matching visual pops
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={edits.motion.soundEffects}
                  onChange={(e) =>
                    updateEdits({
                      motion: {
                        ...edits.motion,
                        soundEffects: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-studio-accent rounded"
                />
              </div>
            </div>

            {/* Keyword Trigger Summary Box */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px]">
              <span className="font-semibold text-cyan-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Retention Science Configured:</span>
              </span>
              <p className="text-stone-400 text-[10px] leading-relaxed">
                Visual change every 1.5–2.5 seconds keeps TikTok, Instagram, and YouTube Shorts retention at peak levels.
              </p>
            </div>
          </div>
        )}

        {/* TAB 6: EXPORT */}
        {activeTab === 'export' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Reel Export & Download Engine
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                1080x1920 (30FPS)
              </span>
            </div>

            {/* Render / Download Action Card */}
            {project?.renderedVideoUrl ? (
              <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-950/40 via-studio-panel to-black border border-emerald-500/30 space-y-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Your Reel Is Rendered & Ready!</h4>
                    <p className="text-[10px] text-stone-400">1080×1920 30FPS MP4 with burned kinetic subtitles</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <a
                    href={`/api/projects/${project.id}/download`}
                    download
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
                  >
                    <span>⬇️ Download 1080×1920 MP4</span>
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Reel studio link copied to clipboard!');
                    }}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10"
                  >
                    🔗 Copy Shareable Studio Link
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-studio-panel border border-studio-border space-y-2">
                <span className="text-xs font-bold text-white block">Ready to Generate Final MP4</span>
                <p className="text-[11px] text-studio-textMuted leading-relaxed">
                  Click the 1-Click Render button in the bottom status bar to composite your background, outfit, cleaned audio, and burned kinetic subtitles.
                </p>
              </div>
            )}

            <div>
              <label className="text-xs text-studio-textMuted font-medium block mb-1.5">
                Target Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '9:16', label: '9:16 (Reel / Shorts)' },
                  { id: '1:1', label: '1:1 (Instagram)' },
                  { id: '16:9', label: '16:9 (YouTube)' },
                  { id: '4:5', label: '4:5 (LinkedIn)' },
                ].map((ar) => (
                  <button
                    key={ar.id}
                    onClick={() =>
                      updateEdits({
                        export: {
                          ...edits.export,
                          aspectRatio: ar.id as any,
                        },
                      })
                    }
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      edits.export.aspectRatio === ar.id
                        ? 'bg-studio-accent/20 border-studio-accent text-white shadow-glow'
                        : 'bg-studio-panel border-studio-border text-slate-400'
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Output Specifications */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Output Resolution:</span>
                <span className="font-mono text-slate-200 font-semibold">1080 × 1920 (9:16)</span>
              </div>
              <div className="flex justify-between">
                <span>Frame Rate:</span>
                <span className="font-mono text-slate-200">30.00 FPS</span>
              </div>
              <div className="flex justify-between">
                <span>Video Codec:</span>
                <span className="font-mono text-slate-200">H.264 (libx264)</span>
              </div>
              <div className="flex justify-between">
                <span>Audio Standard:</span>
                <span className="font-mono text-slate-200">AAC • EBU R128 (-16 LUFS)</span>
              </div>
              <div className="flex justify-between">
                <span>Subtitles:</span>
                <span className="font-mono text-slate-200">Burned-in Word ASS Subtitles</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
