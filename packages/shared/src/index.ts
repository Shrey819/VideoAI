/**
 * Antigravity Studio - Core Shared Types & Interfaces
 */

export type AspectRatio = '9:16' | '1:1' | '16:9' | '4:5';
export type VideoResolution = '1080p' | '720p' | '4k';
export type CaptionStyleType = 'hormozi' | 'minimal' | 'cyberpunk' | 'podcast' | 'neon';
export type CaptionAnimation = 'bounce' | 'pop' | 'fade' | 'slide' | 'none';
export type VoiceMode = 'original' | 'enhanced' | 'ai_narrator';

export type PipelineStage =
  | 'idle'
  | 'extract_audio'
  | 'transcribing_speech'
  | 'foreground_segmentation'
  | 'background_generation'
  | 'outfit_editing'
  | 'audio_denoising'
  | 'voice_synthesis'
  | 'caption_generation'
  | 'motion_graphics'
  | 'ffmpeg_composition'
  | 'completed'
  | 'failed';

export interface BackgroundConfig {
  prompt: string;
  presetId?: string;
  blurStrength: number; // 0 to 10
  lightingMatch: boolean;
  matteFeather: number;
}

export interface OutfitConfig {
  prompt: string;
  presetId?: string;
  garmentType: 'tshirt' | 'hoodie' | 'polo' | 'sweater' | 'custom';
  color: string;
  fabricTexture?: 'heavyweight_cotton' | 'matte_fleece' | 'pique_cotton' | 'fine_knit';
  preserveWrinkles: boolean;
}

export interface AudioConfig {
  denoise: boolean;
  removeKeyboardClicks: boolean;
  removeFanNoise: boolean;
  removeRoomEcho: boolean;
  normalizeLoudness: boolean;
  voiceMode: VoiceMode;
  narratorVoice: string; // 'deep_english_male', 'calm_english_female', 'hindi_male', etc.
  speechRateMultiplier: number;
}

export interface CaptionsConfig {
  enabled: boolean;
  style: CaptionStyleType;
  primaryColor: string; // Hex e.g. #FFFFFF
  highlightColor: string; // Hex e.g. #FACC15 (Yellow)
  secondaryHighlightColor: string; // Hex e.g. #38BDF8 (Cyan)
  maxWordsPerLine: number;
  fontSize: number;
  animation: CaptionAnimation;
  uppercase: boolean;
  showEmojis: boolean;
}

export interface MotionConfig {
  autoKeywordHighlights: boolean;
  showProgressBar: boolean;
  progressBarColor: string;
  progressBarPosition: 'top' | 'bottom';
  calloutBadges: boolean;
  calloutStyle: 'bounce' | 'neon_glow' | 'slide_fade' | 'minimal_pill';
  showKeywordBadges: boolean;
  showFocusArrows: boolean;
  soundEffects: boolean;
}

export interface ExportConfig {
  aspectRatio: AspectRatio;
  resolution: VideoResolution;
  fps: number;
  format: 'mp4';
  bitrate: string; // e.g. '8M'
}

export interface EditConfig {
  background: BackgroundConfig;
  outfit: OutfitConfig;
  audio: AudioConfig;
  captions: CaptionsConfig;
  motion: MotionConfig;
  export: ExportConfig;
}

export interface TranscriptWord {
  word: string;
  start: number; // seconds
  end: number;   // seconds
  confidence: number;
  isKeyword?: boolean;
  highlightColor?: string;
}

export interface TranscriptSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  words: TranscriptWord[];
}

export interface VideoMetadata {
  duration: number; // seconds
  width: number;
  height: number;
  fps: number;
  codec: string;
  audioChannels: number;
  sampleRate: number;
  sizeBytes: number;
}

export interface Project {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  rawVideoUrl: string;
  rawVideoPath: string;
  thumbnailUrl?: string;
  duration?: number;
  metadata?: VideoMetadata;
  edits: EditConfig;
  transcript?: TranscriptSegment[];
  renderedVideoUrl?: string;
  renderedVideoPath?: string;
  status: 'draft' | 'processing' | 'ready' | 'error';
}

export interface VideoJob {
  id: string;
  projectId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0 - 100
  currentStage: PipelineStage;
  stageMessage: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
  resultUrl?: string;
}

export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  category: 'productivity' | 'coding' | 'podcast' | 'finance' | 'minimal';
  thumbnail: string;
  edits: Partial<EditConfig>;
  examplePrompt: string;
}

export const DEFAULT_EDIT_CONFIG: EditConfig = {
  background: {
    prompt: 'Modern high-end creator studio with warm ambient backlighting and acoustic wood slats',
    presetId: 'podcast_studio',
    blurStrength: 2,
    lightingMatch: true,
    matteFeather: 2,
  },
  outfit: {
    prompt: 'Minimalist heavyweight matte black oversized t-shirt',
    presetId: 'black_oversized_tee',
    garmentType: 'tshirt',
    color: '#111827',
    preserveWrinkles: true,
  },
  audio: {
    denoise: true,
    removeKeyboardClicks: true,
    removeFanNoise: true,
    removeRoomEcho: true,
    normalizeLoudness: true,
    voiceMode: 'enhanced',
    narratorVoice: 'deep_english_male',
    speechRateMultiplier: 1.0,
  },
  captions: {
    enabled: true,
    style: 'hormozi',
    primaryColor: '#FFFFFF',
    highlightColor: '#FACC15', // Yellow
    secondaryHighlightColor: '#22C55E', // Emerald Green
    maxWordsPerLine: 3,
    fontSize: 54,
    animation: 'bounce',
    uppercase: true,
    showEmojis: true,
  },
  motion: {
    autoKeywordHighlights: true,
    showProgressBar: true,
    progressBarColor: '#8B5CF6',
    progressBarPosition: 'top',
    calloutBadges: true,
    calloutStyle: 'bounce',
    showKeywordBadges: true,
    showFocusArrows: true,
    soundEffects: false,
  },
  export: {
    aspectRatio: '9:16',
    resolution: '1080p',
    fps: 30,
    format: 'mp4',
    bitrate: '12M',
  },
};

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'hormozi_viral',
    name: 'Alex Hormozi Viral Reel',
    description: 'High energy bold yellow & green bounce captions, punchy contrast, studio workspace',
    category: 'productivity',
    thumbnail: '/presets/hormozi.jpg',
    examplePrompt: 'Make this look like a high-retention viral reel with bold yellow Hormozi captions',
    edits: {
      captions: {
        enabled: true,
        style: 'hormozi',
        primaryColor: '#FFFFFF',
        highlightColor: '#FACC15',
        secondaryHighlightColor: '#22C55E',
        maxWordsPerLine: 2,
        fontSize: 58,
        animation: 'bounce',
        uppercase: true,
        showEmojis: true,
      },
      background: {
        prompt: 'Luxury modern concrete and walnut executive study with soft warm uplighting',
        blurStrength: 3,
        lightingMatch: true,
        matteFeather: 2,
      },
      outfit: {
        prompt: 'Oversized charcoal cotton crewneck t-shirt',
        garmentType: 'tshirt',
        color: '#1f2937',
        preserveWrinkles: true,
      },
    },
  },
  {
    id: 'rgb_coder',
    name: 'Cyberpunk / RGB Coder',
    description: 'Neon cyan & purple backlighting, dark mode studio, tech keyword badges',
    category: 'coding',
    thumbnail: '/presets/cyberpunk.jpg',
    examplePrompt: 'Replace room with a dark futuristic coding room with soft cyan and purple neon glow',
    edits: {
      captions: {
        enabled: true,
        style: 'cyberpunk',
        primaryColor: '#E2E8F0',
        highlightColor: '#06B6D4',
        secondaryHighlightColor: '#A855F7',
        maxWordsPerLine: 3,
        fontSize: 50,
        animation: 'pop',
        uppercase: false,
        showEmojis: true,
      },
      background: {
        prompt: 'Dark minimalist programmer workspace with subtle cyan LED wall lightbars and floating shelves',
        blurStrength: 2,
        lightingMatch: true,
        matteFeather: 2,
      },
      outfit: {
        prompt: 'Matte black minimalist hoodie with subtle fabric texture',
        garmentType: 'hoodie',
        color: '#09090b',
        preserveWrinkles: true,
      },
    },
  },
  {
    id: 'podcast_studio',
    name: 'Premium Podcast Studio',
    description: 'Warm acoustic panels, warm Edison bulbs, pristine voice clarity',
    category: 'podcast',
    thumbnail: '/presets/podcast.jpg',
    examplePrompt: 'Make this a top-tier podcast studio with acoustic wood slat wall and deep clear narrator audio',
    edits: {
      captions: {
        enabled: true,
        style: 'podcast',
        primaryColor: '#F8FAFC',
        highlightColor: '#F59E0B',
        secondaryHighlightColor: '#EF4444',
        maxWordsPerLine: 4,
        fontSize: 48,
        animation: 'fade',
        uppercase: false,
        showEmojis: true,
      },
      background: {
        prompt: 'Cozy modern broadcast podcast studio with vertical oak acoustic slats and warm ambient lamps',
        blurStrength: 4,
        lightingMatch: true,
        matteFeather: 2,
      },
    },
  },
  {
    id: 'minimal_nordic',
    name: 'Nordic Clean Productivity',
    description: 'Clean Scandinavian aesthetic, large daylight window, crisp minimal typography',
    category: 'productivity',
    thumbnail: '/presets/nordic.jpg',
    examplePrompt: 'Minimalist bright Scandinavian daylight study with lush greenery outside large window',
    edits: {
      captions: {
        enabled: true,
        style: 'minimal',
        primaryColor: '#0F172A',
        highlightColor: '#3B82F6',
        secondaryHighlightColor: '#64748B',
        maxWordsPerLine: 4,
        fontSize: 44,
        animation: 'none',
        uppercase: false,
        showEmojis: false,
      },
      background: {
        prompt: 'Sunlit minimalist Scandinavian studio with large floor-to-ceiling glass window showing lush green trees',
        blurStrength: 3,
        lightingMatch: true,
        matteFeather: 2,
      },
      outfit: {
        prompt: 'Crisp white heavyweight organic cotton t-shirt',
        garmentType: 'tshirt',
        color: '#FFFFFF',
        preserveWrinkles: true,
      },
    },
  },
];

export interface StudioEnvironmentOption {
  id: string;
  name: string;
  category: string;
  description: string;
  ambientColor: string;
  lightingCast: string;
  defaultPrompt: string;
  icon: string;
}

export const STUDIO_BACKGROUND_PRESETS: StudioEnvironmentOption[] = [
  {
    id: 'podcast_studio',
    name: 'Podcast Studio',
    category: 'Podcast / Talk',
    description: 'Vertical oak acoustic slats with warm amber Edison bulb backlighting',
    ambientColor: 'rgba(245, 158, 11, 0.25)',
    lightingCast: 'radial-gradient(circle at 50% 30%, rgba(245,158,11,0.28) 0%, rgba(120,53,15,0.15) 50%, #0c0a09 100%)',
    defaultPrompt: 'Modern high-end broadcast podcast studio with vertical oak acoustic wood slats and warm Edison ambient lamps',
    icon: '🎙️',
  },
  {
    id: 'rgb_coder',
    name: 'Cyberpunk Coder',
    category: 'Coding / Tech',
    description: 'Dark acoustic panels with cyan and purple ambient LED lightbars',
    ambientColor: 'rgba(6, 182, 212, 0.25)',
    lightingCast: 'radial-gradient(circle at 50% 30%, rgba(6,182,212,0.3) 0%, rgba(168,85,247,0.2) 50%, #090a0f 100%)',
    defaultPrompt: 'Dark programmer workstation room with subtle cyan and purple ambient LED lightbars on acoustic paneling',
    icon: '💻',
  },
  {
    id: 'minimal_nordic',
    name: 'Nordic Daylight',
    category: 'Productivity',
    description: 'Crisp Scandinavian sunlit room with large window and lush trees',
    ambientColor: 'rgba(255, 255, 255, 0.18)',
    lightingCast: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.15) 0%, rgba(30,41,59,0.3) 60%, #090a0f 100%)',
    defaultPrompt: 'Sunlit minimalist Scandinavian studio with large floor-to-ceiling glass window showing lush green trees',
    icon: '🌿',
  },
  {
    id: 'luxury_executive',
    name: 'Luxury Executive',
    category: 'Finance / Business',
    description: 'Dark polished Nero Marquina marble with panoramic night city skyline',
    ambientColor: 'rgba(148, 163, 184, 0.2)',
    lightingCast: 'radial-gradient(circle at 50% 30%, rgba(148,163,184,0.22) 0%, rgba(15,23,42,0.4) 60%, #020617 100%)',
    defaultPrompt: 'Luxury modern executive office with dark polished marble, subtle architectural spotlights, and night city skyline',
    icon: '🏙️',
  },
  {
    id: 'nature_window',
    name: 'Forest Canopy',
    category: 'Study / Calm',
    description: 'Warm cedar studio overlooking sunlit pine forest and morning mist',
    ambientColor: 'rgba(34, 197, 94, 0.2)',
    lightingCast: 'radial-gradient(circle at 50% 35%, rgba(34,197,94,0.22) 0%, rgba(20,83,45,0.15) 55%, #052e16 100%)',
    defaultPrompt: 'Cozy cedar architectural workspace with floor-to-ceiling glass window overlooking a serene sunlit forest',
    icon: '🌲',
  },
];

export interface ApparelStyleOption {
  id: 'tshirt' | 'hoodie' | 'polo' | 'sweater';
  name: string;
  category: string;
  description: string;
  defaultColor: string;
  fabricTexture: 'heavyweight_cotton' | 'matte_fleece' | 'pique_cotton' | 'fine_knit';
  icon: string;
}

export const OUTFIT_STYLE_PRESETS: ApparelStyleOption[] = [
  {
    id: 'tshirt',
    name: 'Oversized T-Shirt',
    category: 'Minimal Casual',
    description: 'Heavyweight 280 GSM cotton crewneck with clean dropped shoulder silhouette',
    defaultColor: '#0F172A',
    fabricTexture: 'heavyweight_cotton',
    icon: '👕',
  },
  {
    id: 'hoodie',
    name: 'Minimalist Hoodie',
    category: 'Tech / Modern',
    description: 'Premium matte fleece pullover hoodie with clean drawstring-free collar',
    defaultColor: '#18181B',
    fabricTexture: 'matte_fleece',
    icon: '🧥',
  },
  {
    id: 'polo',
    name: 'Classic Polo',
    category: 'Smart Casual',
    description: 'Refined structured cotton pique polo with tailored collar and button placket',
    defaultColor: '#1E293B',
    fabricTexture: 'pique_cotton',
    icon: '👔',
  },
  {
    id: 'sweater',
    name: 'Fine Knit Sweater',
    category: 'Executive / Autumn',
    description: 'Minimalist merino crewneck knit with subtle ribbed cuffs and hem',
    defaultColor: '#334155',
    fabricTexture: 'fine_knit',
    icon: '🧶',
  },
];

export interface ColorSwatchOption {
  name: string;
  hex: string;
  category: string;
}

export const CREATOR_COLOR_PALETTES: ColorSwatchOption[] = [
  { name: 'Obsidian Black', hex: '#0F172A', category: 'Dark' },
  { name: 'Matte Charcoal', hex: '#1E293B', category: 'Dark' },
  { name: 'Heather Slate', hex: '#334155', category: 'Neutral' },
  { name: 'Crisp White', hex: '#F8FAFC', category: 'Light' },
  { name: 'Sand Beige', hex: '#E2D9C8', category: 'Warm' },
  { name: 'Midnight Navy', hex: '#1E3A8A', category: 'Rich' },
  { name: 'Forest Emerald', hex: '#064E3B', category: 'Rich' },
  { name: 'Vintage Terracotta', hex: '#9A3412', category: 'Warm' },
];

export interface NarratorVoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female';
  accent: string;
  tone: string;
  description: string;
  icon: string;
}

export const AI_NARRATOR_VOICES: NarratorVoiceOption[] = [
  {
    id: 'deep_english_male',
    name: 'Marcus (Deep Studio)',
    gender: 'male',
    accent: 'American (US)',
    tone: 'Authoritative & Calm',
    description: 'Deep, rich broadcast voice ideal for productivity, tech, and finance breakdowns',
    icon: '🎙️',
  },
  {
    id: 'calm_english_female',
    name: 'Elena (Articulate)',
    gender: 'female',
    accent: 'American (US)',
    tone: 'Crisp & Educational',
    description: 'Clear, modern instructional voice suited for coding tutorials and tutorials',
    icon: '👩',
  },
  {
    id: 'hindi_male',
    name: 'Aarav (Hindi Creator)',
    gender: 'male',
    accent: 'Indian (Hindi / Hinglish)',
    tone: 'Natural & Engaging',
    description: 'Authentic Indian creator tone with high retention pacing',
    icon: '🇮🇳',
  },
  {
    id: 'energetic_creator',
    name: 'Leo (Viral Energy)',
    gender: 'male',
    accent: 'American (US)',
    tone: 'Punchy & Dynamic',
    description: 'Fast-paced, high-engagement delivery modeled for viral retention hooks',
    icon: '⚡',
  },
  {
    id: 'british_storyteller',
    name: 'Arthur (British Classic)',
    gender: 'male',
    accent: 'British (UK)',
    tone: 'Sophisticated & Deep',
    description: 'Distinguished documentary-style British narrator with crisp enunciation',
    icon: '🇬🇧',
  },
];

export interface MotionCalloutStyleOption {
  id: 'bounce' | 'neon_glow' | 'slide_fade' | 'minimal_pill';
  name: string;
  category: string;
  description: string;
  previewClass: string;
}

export const MOTION_CALLOUT_STYLES: MotionCalloutStyleOption[] = [
  {
    id: 'bounce',
    name: 'Spring Bounce',
    category: 'High Retention',
    description: 'Dynamic spring pop with high-impact drop shadow and scale animation',
    previewClass: 'animate-bounce shadow-glow',
  },
  {
    id: 'neon_glow',
    name: 'Cyberpunk Neon',
    category: 'Tech / Gaming',
    description: 'Electric cyan glowing border with pulsing illuminated text',
    previewClass: 'shadow-glowCyan border-cyan-400',
  },
  {
    id: 'slide_fade',
    name: 'Slide & Fade',
    category: 'Smooth / Modern',
    description: 'Smooth top-down slide with subtle motion blur fade',
    previewClass: 'translate-y-0 opacity-100',
  },
  {
    id: 'minimal_pill',
    name: 'Minimal Glass Pill',
    category: 'Clean / Luxury',
    description: 'Frosted glass badge with sleek typography and subtle gold border',
    previewClass: 'backdrop-blur-md border-white/20',
  },
];

export const PROGRESS_BAR_COLORS = [
  { name: 'Electric Purple', hex: '#8B5CF6' },
  { name: 'Cyan Glow', hex: '#06B6D4' },
  { name: 'Hormozi Gold', hex: '#FACC15' },
  { name: 'Viral Emerald', hex: '#22C55E' },
  { name: 'Sunset Orange', hex: '#F97316' },
  { name: 'Pure White', hex: '#FFFFFF' },
];
