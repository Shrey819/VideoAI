import { EditConfig, DEFAULT_EDIT_CONFIG, PRESET_TEMPLATES } from '@antigravity/shared';

export interface ParsedPromptResult {
  detectedModules: string[];
  edits: Partial<EditConfig>;
  summary: string;
}

/**
 * System prompt used for LLM-based intelligent prompt interpretation
 */
export const ANTIGRAVITY_SYSTEM_PROMPT = `
You are the AI Director for Antigravity, an AI-powered reel studio for desk-recorded creator videos.
Your job is to parse natural language user edit requests into structured configuration overrides for 6 modules:
1. Background AI (room replacement, lighting, aesthetic)
2. Outfit AI (clothing type, color, material, preserving body pose)
3. Audio AI (noise cleanup, click removal, voice mode)
4. Voice AI (narrator voice selection, tone)
5. Caption AI (style: 'hormozi' | 'minimal' | 'cyberpunk' | 'podcast' | 'neon', colors, bounce animation)
6. Motion Graphics AI (keywords, callouts, progress bars)

Rules:
- Antigravity strictly preserves table, hands, notebook, mic, laptop, and desk props.
- No face or lip sync is involved (creator face is not in frame).
- Output must be strict JSON matching the Antigravity EditConfig schema.
`;

/**
 * Heuristic/rule-based prompt interpreter for instant real-time feedback
 */
export function interpretPrompt(userPrompt: string, currentConfig: EditConfig = DEFAULT_EDIT_CONFIG): ParsedPromptResult {
  const text = userPrompt.toLowerCase();
  const detectedModules: string[] = [];
  const edits: Partial<EditConfig> = {};

  // Check against preset templates first
  for (const preset of PRESET_TEMPLATES) {
    if (text.includes(preset.id) || text.includes(preset.name.toLowerCase())) {
      detectedModules.push(`preset:${preset.name}`);
      return {
        detectedModules,
        edits: preset.edits,
        summary: `Applied preset: ${preset.name}`,
      };
    }
  }

  // 1. Background Interpretation
  if (
    text.includes('background') ||
    text.includes('room') ||
    text.includes('studio') ||
    text.includes('office') ||
    text.includes('behind me') ||
    text.includes('wall') ||
    text.includes('window')
  ) {
    detectedModules.push('background');
    edits.background = {
      ...currentConfig.background,
      prompt: userPrompt,
    };

    if (text.includes('podcast')) {
      edits.background.prompt = 'High-end podcast studio with warm oak acoustic wood slats, Edison bulbs, and dark slate background';
    } else if (text.includes('cyberpunk') || text.includes('rgb') || text.includes('coding')) {
      edits.background.prompt = 'Dark developer room with soft cyan and purple neon ambient strip lighting on acoustic wall';
    } else if (text.includes('luxury') || text.includes('executive')) {
      edits.background.prompt = 'Luxury minimalist executive office with dark marble, warm architectural lighting, and city view';
    } else if (text.includes('minimal') || text.includes('nordic') || text.includes('clean') || text.includes('white')) {
      edits.background.prompt = 'Minimalist bright Scandinavian daylight studio with large window showing garden greenery';
    }
  }

  // 2. Outfit Interpretation
  if (
    text.includes('shirt') ||
    text.includes('t-shirt') ||
    text.includes('tee') ||
    text.includes('hoodie') ||
    text.includes('outfit') ||
    text.includes('clothes') ||
    text.includes('clothing') ||
    text.includes('polo') ||
    text.includes('sweater')
  ) {
    detectedModules.push('outfit');
    edits.outfit = {
      ...currentConfig.outfit,
      prompt: userPrompt,
    };

    if (text.includes('hoodie')) {
      edits.outfit.garmentType = 'hoodie';
    } else if (text.includes('polo')) {
      edits.outfit.garmentType = 'polo';
    } else if (text.includes('sweater')) {
      edits.outfit.garmentType = 'sweater';
    } else {
      edits.outfit.garmentType = 'tshirt';
    }

    if (text.includes('white')) {
      edits.outfit.color = '#FFFFFF';
    } else if (text.includes('black')) {
      edits.outfit.color = '#0F172A';
    } else if (text.includes('grey') || text.includes('gray') || text.includes('charcoal')) {
      edits.outfit.color = '#334155';
    } else if (text.includes('beige') || text.includes('cream')) {
      edits.outfit.color = '#F5F5DC';
    } else if (text.includes('blue') || text.includes('navy')) {
      edits.outfit.color = '#1E3A8A';
    }
  }

  // 3. Captions Interpretation
  if (
    text.includes('caption') ||
    text.includes('subtitle') ||
    text.includes('hormozi') ||
    text.includes('tiktok') ||
    text.includes('text') ||
    text.includes('subtitles')
  ) {
    detectedModules.push('captions');
    edits.captions = {
      ...currentConfig.captions,
      enabled: true,
    };

    if (text.includes('hormozi')) {
      edits.captions.style = 'hormozi';
      edits.captions.highlightColor = '#FACC15'; // Yellow
      edits.captions.secondaryHighlightColor = '#22C55E'; // Green
      edits.captions.animation = 'bounce';
      edits.captions.uppercase = true;
      edits.captions.maxWordsPerLine = 2;
    } else if (text.includes('cyberpunk') || text.includes('neon')) {
      edits.captions.style = 'cyberpunk';
      edits.captions.highlightColor = '#06B6D4'; // Cyan
      edits.captions.secondaryHighlightColor = '#A855F7'; // Purple
      edits.captions.animation = 'pop';
    } else if (text.includes('minimal') || text.includes('clean')) {
      edits.captions.style = 'minimal';
      edits.captions.highlightColor = '#3B82F6';
      edits.captions.animation = 'none';
      edits.captions.uppercase = false;
    } else if (text.includes('podcast')) {
      edits.captions.style = 'podcast';
      edits.captions.highlightColor = '#F59E0B';
      edits.captions.animation = 'fade';
    }

    if (text.includes('yellow')) edits.captions.highlightColor = '#FACC15';
    if (text.includes('green')) edits.captions.highlightColor = '#22C55E';
    if (text.includes('cyan') || text.includes('blue')) edits.captions.highlightColor = '#06B6D4';
    if (text.includes('purple') || text.includes('pink')) edits.captions.highlightColor = '#EC4899';
  }

  // 4. Audio & Voice Interpretation
  if (
    text.includes('audio') ||
    text.includes('voice') ||
    text.includes('noise') ||
    text.includes('click') ||
    text.includes('narrator') ||
    text.includes('sound')
  ) {
    detectedModules.push('audio');
    edits.audio = {
      ...currentConfig.audio,
      denoise: true,
      removeKeyboardClicks: true,
    };

    if (text.includes('deep english') || text.includes('male narrator')) {
      edits.audio.voiceMode = 'ai_narrator';
      edits.audio.narratorVoice = 'deep_english_male';
    } else if (text.includes('female narrator')) {
      edits.audio.voiceMode = 'ai_narrator';
      edits.audio.narratorVoice = 'calm_english_female';
    } else if (text.includes('hindi')) {
      edits.audio.voiceMode = 'ai_narrator';
      edits.audio.narratorVoice = 'hindi_male';
    } else if (text.includes('my voice') || text.includes('original voice') || text.includes('clean my voice')) {
      edits.audio.voiceMode = 'enhanced';
    }
  }

  // 5. Motion Graphics
  if (
    text.includes('motion') ||
    text.includes('highlight') ||
    text.includes('progress bar') ||
    text.includes('callout') ||
    text.includes('arrows') ||
    text.includes('graphic')
  ) {
    detectedModules.push('motion');
    edits.motion = {
      ...currentConfig.motion,
      autoKeywordHighlights: true,
      showProgressBar: text.includes('progress') || currentConfig.motion.showProgressBar,
      calloutBadges: text.includes('callout') || text.includes('badge') || currentConfig.motion.calloutBadges,
    };
  }

  const summary = detectedModules.length > 0
    ? `Configured ${detectedModules.join(', ')} from prompt`
    : 'Updated AI prompt instructions';

  return {
    detectedModules,
    edits,
    summary,
  };
}
