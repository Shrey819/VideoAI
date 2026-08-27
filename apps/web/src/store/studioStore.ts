import { create } from 'zustand';
import {
  Project,
  VideoJob,
  EditConfig,
  DEFAULT_EDIT_CONFIG,
  PRESET_TEMPLATES,
  PipelineStage,
} from '@antigravity/shared';
import { interpretPrompt } from '@antigravity/prompts';

export type StudioTab = 'background' | 'outfit' | 'audio' | 'captions' | 'motion' | 'export';

interface StudioState {
  project: Project | null;
  activeTab: StudioTab;
  promptText: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  showComparison: boolean;
  showSubtitlesOverlay: boolean;
  isRendering: boolean;
  activeJob: VideoJob | null;
  recentPrompts: string[];

  // Actions
  setProject: (project: Project | null) => void;
  setActiveTab: (tab: StudioTab) => void;
  setPromptText: (prompt: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setShowComparison: (show: boolean) => void;
  setShowSubtitlesOverlay: (show: boolean) => void;
  updateEdits: (edits: Partial<EditConfig>) => void;
  applyPrompt: (prompt: string) => void;
  applyPreset: (presetId: string) => void;
  setActiveJob: (job: VideoJob | null) => void;
  setIsRendering: (isRendering: boolean) => void;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  project: null,
  activeTab: 'background',
  promptText: '',
  isPlaying: false,
  currentTime: 0,
  duration: 15,
  showComparison: false,
  showSubtitlesOverlay: true,
  isRendering: false,
  activeJob: null,
  recentPrompts: [
    'Replace background with modern podcast studio with warm oak wood slats',
    'Change shirt to white oversized cotton T-shirt',
    'Add Alex Hormozi bold yellow captions with bounce animation',
    'Remove keyboard clicks and fan noise',
    'Dark cyberpunk developer room with cyan ambient lighting',
  ],

  setProject: (project) => {
    set({
      project,
      duration: project?.metadata?.duration || 15,
      currentTime: 0,
      isPlaying: false,
    });
  },

  setActiveTab: (activeTab) => set({ activeTab }),
  setPromptText: (promptText) => set({ promptText }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setShowComparison: (showComparison) => set({ showComparison }),
  setShowSubtitlesOverlay: (showSubtitlesOverlay) => set({ showSubtitlesOverlay }),

  updateEdits: (newEdits) => {
    const { project } = get();
    if (!project) return;

    const updatedProject: Project = {
      ...project,
      edits: {
        ...project.edits,
        ...newEdits,
      },
    };

    set({ project: updatedProject });

    // Sync to API in background
    fetch(`/api/projects/${project.id}/edits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ edits: newEdits }),
    }).catch(console.error);
  },

  applyPrompt: (prompt) => {
    const { project, recentPrompts } = get();
    if (!project || !prompt.trim()) return;

    const result = interpretPrompt(prompt, project.edits);
    const updatedEdits: EditConfig = {
      ...project.edits,
      ...result.edits,
      background: {
        ...project.edits.background,
        ...(result.edits.background || {}),
      },
      outfit: {
        ...project.edits.outfit,
        ...(result.edits.outfit || {}),
      },
      audio: {
        ...project.edits.audio,
        ...(result.edits.audio || {}),
      },
      captions: {
        ...project.edits.captions,
        ...(result.edits.captions || {}),
      },
      motion: {
        ...project.edits.motion,
        ...(result.edits.motion || {}),
      },
    };

    const updatedProject: Project = {
      ...project,
      edits: updatedEdits,
    };

    const newRecents = [prompt, ...recentPrompts.filter((p) => p !== prompt)].slice(0, 8);

    set({
      project: updatedProject,
      promptText: '',
      recentPrompts: newRecents,
    });

    fetch(`/api/projects/${project.id}/prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    }).catch(console.error);
  },

  applyPreset: (presetId) => {
    const { project } = get();
    if (!project) return;

    const preset = PRESET_TEMPLATES.find((p) => p.id === presetId);
    if (!preset) return;

    const updatedEdits: EditConfig = {
      ...project.edits,
      ...preset.edits,
      background: {
        ...project.edits.background,
        ...(preset.edits.background || {}),
      },
      outfit: {
        ...project.edits.outfit,
        ...(preset.edits.outfit || {}),
      },
      captions: {
        ...project.edits.captions,
        ...(preset.edits.captions || {}),
      },
    };

    set({
      project: {
        ...project,
        edits: updatedEdits,
      },
    });

    fetch(`/api/projects/${project.id}/edits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ edits: preset.edits }),
    }).catch(console.error);
  },

  setActiveJob: (activeJob) => set({ activeJob }),
  setIsRendering: (isRendering) => set({ isRendering }),
}));
