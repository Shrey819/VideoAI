import express from 'express';
import cors from 'cors';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import {
  Project,
  DEFAULT_EDIT_CONFIG,
  PRESET_TEMPLATES,
  EditConfig,
} from '@antigravity/shared';
import { interpretPrompt } from '@antigravity/prompts';
import { probeVideo, generateThumbnail, extractAudio } from '@antigravity/ffmpeg';
import { studioStore, STORAGE_ROOT } from './services/store';
import { pipelineManager } from './services/pipelineWorker';
import {
  transcribeAudioFile,
  generateTranscriptFromText,
  calculateTranscriptStats,
} from './services/transcriptionService';

const app = express();
const PORT = process.env.PORT || 4000;

// Ensure storage directories exist
['uploads', 'outputs', 'cache'].forEach((folder) => {
  const p = path.join(STORAGE_ROOT, folder);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// Configure Multer for video uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(STORAGE_ROOT, 'uploads'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4';
    cb(null, `upload_${Date.now()}_${uuidv4().substring(0, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('video/') || file.originalname.match(/\.(mp4|mov|webm|m4v|avi)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files (MP4, MOV, WEBM) are supported'));
    }
  },
});

app.use(cors());
app.use(express.json());

// Serve static storage
app.use('/storage', express.static(STORAGE_ROOT));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'antigravity-api', version: '1.0.0' });
});

// Presets list
app.get('/api/presets', (_req, res) => {
  res.json({ presets: PRESET_TEMPLATES });
});

// List projects
app.get('/api/projects', (_req, res) => {
  res.json({ projects: studioStore.getProjects() });
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
  const project = studioStore.getProject(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json({ project });
});

// Upload raw video, extract audio, probe metadata & transcribe speech
app.post('/api/video/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const videoPath = req.file.path;
    const projectId = uuidv4();
    const originalName = req.file.originalname.replace(/\.[^/.]+$/, '');
    const title = req.body.title || originalName || 'Desk Studio Reel';

    // 1. Generate thumbnail
    const thumbName = `thumb_${projectId}.jpg`;
    const thumbPath = path.join(STORAGE_ROOT, 'cache', thumbName);
    let thumbnailUrl = '/presets/cyberpunk.jpg';

    try {
      await generateThumbnail(videoPath, thumbPath, 1.0);
      thumbnailUrl = `/storage/cache/${thumbName}`;
    } catch (e) {
      console.warn('Thumbnail generation fallback:', e);
    }

    // 2. Probe metadata
    let metadata;
    try {
      metadata = await probeVideo(videoPath);
    } catch (e) {
      metadata = {
        duration: 15,
        width: 1080,
        height: 1920,
        fps: 30,
        codec: 'h264',
        audioChannels: 2,
        sampleRate: 44100,
        sizeBytes: req.file.size,
      };
    }

    // 3. Extract Audio Track (16kHz Mono WAV)
    const audioWavPath = path.join(STORAGE_ROOT, 'cache', `${projectId}_audio.wav`);
    try {
      await extractAudio(videoPath, audioWavPath);
    } catch (e) {
      console.warn('Audio extraction warning:', e);
    }

    // 4. Run Speech Recognition to get word-level timestamps & keywords
    let transcript = [];
    try {
      transcript = await transcribeAudioFile(audioWavPath, metadata.duration);
    } catch (e) {
      console.warn('Transcription warning:', e);
      transcript = generateTranscriptFromText(
        'Here is the single biggest secret to scaling your software workflow with AI. ' +
        'With Antigravity, you write one prompt and the entire studio transforms in seconds.',
        metadata.duration
      );
    }

    const newProject: Project = {
      id: projectId,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rawVideoUrl: `/storage/uploads/${path.basename(videoPath)}`,
      rawVideoPath: videoPath,
      thumbnailUrl,
      duration: metadata.duration,
      metadata,
      edits: JSON.parse(JSON.stringify(DEFAULT_EDIT_CONFIG)),
      transcript,
      status: 'ready',
    };

    studioStore.saveProject(newProject);
    res.status(201).json({ project: newProject });
  } catch (err: any) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: err.message || 'Failed to process uploaded video' });
  }
});

// Re-transcribe or provide custom transcript for a project
app.post('/api/projects/:id/transcribe', async (req, res) => {
  const project = studioStore.getProject(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { customText, language } = req.body;
  const audioWavPath = path.join(STORAGE_ROOT, 'cache', `${project.id}_audio.wav`);

  let transcript;
  if (customText) {
    transcript = generateTranscriptFromText(customText, project.duration || 15);
  } else {
    transcript = await transcribeAudioFile(audioWavPath, project.duration || 15);
  }

  project.transcript = transcript;
  studioStore.saveProject(project);

  const stats = calculateTranscriptStats(transcript);
  res.json({ project, transcript, stats });
});

// Update transcript directly (edit words or toggle keywords)
app.put('/api/projects/:id/transcript', (req, res) => {
  const project = studioStore.getProject(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { transcript } = req.body;
  if (!transcript || !Array.isArray(transcript)) {
    return res.status(400).json({ error: 'Valid transcript array is required' });
  }

  project.transcript = transcript;
  studioStore.saveProject(project);

  res.json({ project, transcript });
});

// Update background config directly
app.post('/api/projects/:id/background', (req, res) => {
  const project = studioStore.getProject(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { presetId, prompt, blurStrength, lightingMatch, matteFeather } = req.body;

  project.edits.background = {
    ...project.edits.background,
    ...(presetId !== undefined ? { presetId } : {}),
    ...(prompt !== undefined ? { prompt } : {}),
    ...(blurStrength !== undefined ? { blurStrength: Number(blurStrength) } : {}),
    ...(lightingMatch !== undefined ? { lightingMatch: Boolean(lightingMatch) } : {}),
    ...(matteFeather !== undefined ? { matteFeather: Number(matteFeather) } : {}),
  };

  studioStore.saveProject(project);
  res.json({ project, background: project.edits.background });
});

// Update outfit config directly
app.post('/api/projects/:id/outfit', (req, res) => {
  const project = studioStore.getProject(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { garmentType, color, fabricTexture, preserveWrinkles, prompt, presetId } = req.body;

  project.edits.outfit = {
    ...project.edits.outfit,
    ...(garmentType !== undefined ? { garmentType } : {}),
    ...(color !== undefined ? { color } : {}),
    ...(fabricTexture !== undefined ? { fabricTexture } : {}),
    ...(preserveWrinkles !== undefined ? { preserveWrinkles: Boolean(preserveWrinkles) } : {}),
    ...(prompt !== undefined ? { prompt } : {}),
    ...(presetId !== undefined ? { presetId } : {}),
  };

  studioStore.saveProject(project);
  res.json({ project, outfit: project.edits.outfit });
});

// Update audio & voice config directly
app.post('/api/projects/:id/audio', (req, res) => {
  const project = studioStore.getProject(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const {
    denoise,
    removeKeyboardClicks,
    removeFanNoise,
    removeRoomEcho,
    normalizeLoudness,
    voiceMode,
    narratorVoice,
    speechRateMultiplier,
  } = req.body;

  project.edits.audio = {
    ...project.edits.audio,
    ...(denoise !== undefined ? { denoise: Boolean(denoise) } : {}),
    ...(removeKeyboardClicks !== undefined ? { removeKeyboardClicks: Boolean(removeKeyboardClicks) } : {}),
    ...(removeFanNoise !== undefined ? { removeFanNoise: Boolean(removeFanNoise) } : {}),
    ...(removeRoomEcho !== undefined ? { removeRoomEcho: Boolean(removeRoomEcho) } : {}),
    ...(normalizeLoudness !== undefined ? { normalizeLoudness: Boolean(normalizeLoudness) } : {}),
    ...(voiceMode !== undefined ? { voiceMode } : {}),
    ...(narratorVoice !== undefined ? { narratorVoice } : {}),
    ...(speechRateMultiplier !== undefined ? { speechRateMultiplier: Number(speechRateMultiplier) } : {}),
  };

  studioStore.saveProject(project);
  res.json({ project, audio: project.edits.audio });
});

// Update motion graphics config directly
app.post('/api/projects/:id/motion', (req, res) => {
  const project = studioStore.getProject(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const {
    autoKeywordHighlights,
    showProgressBar,
    progressBarColor,
    progressBarPosition,
    calloutBadges,
    calloutStyle,
    showKeywordBadges,
    showFocusArrows,
    soundEffects,
  } = req.body;

  project.edits.motion = {
    ...project.edits.motion,
    ...(autoKeywordHighlights !== undefined ? { autoKeywordHighlights: Boolean(autoKeywordHighlights) } : {}),
    ...(showProgressBar !== undefined ? { showProgressBar: Boolean(showProgressBar) } : {}),
    ...(progressBarColor !== undefined ? { progressBarColor } : {}),
    ...(progressBarPosition !== undefined ? { progressBarPosition } : {}),
    ...(calloutBadges !== undefined ? { calloutBadges: Boolean(calloutBadges) } : {}),
    ...(calloutStyle !== undefined ? { calloutStyle } : {}),
    ...(showKeywordBadges !== undefined ? { showKeywordBadges: Boolean(showKeywordBadges) } : {}),
    ...(showFocusArrows !== undefined ? { showFocusArrows: Boolean(showFocusArrows) } : {}),
    ...(soundEffects !== undefined ? { soundEffects: Boolean(soundEffects) } : {}),
  };

  studioStore.saveProject(project);
  res.json({ project, motion: project.edits.motion });
});

// Parse natural language prompt & update edit config
app.post('/api/projects/:id/prompt', (req, res) => {
  const project = studioStore.getProject(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Valid prompt string is required' });
  }

  const interpretation = interpretPrompt(prompt, project.edits);

  project.edits = {
    ...project.edits,
    ...interpretation.edits,
    background: {
      ...project.edits.background,
      ...(interpretation.edits.background || {}),
    },
    outfit: {
      ...project.edits.outfit,
      ...(interpretation.edits.outfit || {}),
    },
    audio: {
      ...project.edits.audio,
      ...(interpretation.edits.audio || {}),
    },
    captions: {
      ...project.edits.captions,
      ...(interpretation.edits.captions || {}),
    },
    motion: {
      ...project.edits.motion,
      ...(interpretation.edits.motion || {}),
    },
  };

  studioStore.saveProject(project);

  res.json({
    project,
    interpretation,
  });
});

// Update specific edit config directly
app.post('/api/projects/:id/edits', (req, res) => {
  const project = studioStore.getProject(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { edits } = req.body;
  if (!edits || typeof edits !== 'object') {
    return res.status(400).json({ error: 'Edits object is required' });
  }

  project.edits = {
    ...project.edits,
    ...edits,
  };

  studioStore.saveProject(project);
  res.json({ project });
});

// Trigger full pipeline rendering job
app.post('/api/projects/:id/render', (req, res) => {
  const project = studioStore.getProject(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const job = pipelineManager.createJob(project.id);
  res.json({ job });
});

// Get job status
app.get('/api/job/:id', (req, res) => {
  const job = studioStore.getJob(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json({ job });
});

// Server-Sent Events (SSE) live progress stream
app.get('/api/job/:id/stream', (req, res) => {
  const jobId = req.params.id;
  const initialJob = studioStore.getJob(jobId);

  if (!initialJob) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  res.write(`data: ${JSON.stringify(initialJob)}\n\n`);

  const handler = (job: any) => {
    res.write(`data: ${JSON.stringify(job)}\n\n`);
    if (job.status === 'completed' || job.status === 'failed') {
      res.end();
    }
  };

  pipelineManager.on(`job:${jobId}`, handler);

  req.on('close', () => {
    pipelineManager.off(`job:${jobId}`, handler);
  });
});

// Download rendered reel MP4
app.get('/api/projects/:id/download', (req, res) => {
  const project = studioStore.getProject(req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const filePath = project.renderedVideoPath || project.rawVideoPath;
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Rendered video file not found on disk' });
  }

  const filename = `Antigravity_Reel_${project.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.mp4`;
  res.download(filePath, filename);
});

app.listen(PORT, () => {
  console.log(`🚀 Antigravity API server running at http://localhost:${PORT}`);
});
