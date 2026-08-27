import * as fs from 'fs';
import * as path from 'path';
import { Project, VideoJob, DEFAULT_EDIT_CONFIG, PRESET_TEMPLATES } from '@antigravity/shared';

const STORAGE_ROOT = path.resolve(__dirname, '../../../../storage');
const DB_FILE = path.join(STORAGE_ROOT, 'cache', 'database.json');

interface DatabaseSchema {
  projects: Record<string, Project>;
  jobs: Record<string, VideoJob>;
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading database file, initializing empty db', err);
  }
  return { projects: {}, jobs: {} };
}

function saveDatabase(db: DatabaseSchema) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving database file', err);
  }
}

class StudioStore {
  private db: DatabaseSchema;

  constructor() {
    this.db = loadDatabase();
    this.seedDemoIfEmpty();
  }

  private seedDemoIfEmpty() {
    if (Object.keys(this.db.projects).length === 0) {
      const demoId = 'demo-coding-reel';
      const demoProject: Project = {
        id: demoId,
        title: 'Mastering Full-Stack AI Workflows',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rawVideoUrl: '/storage/uploads/sample_desk_video.mp4',
        rawVideoPath: path.join(STORAGE_ROOT, 'uploads', 'sample_desk_video.mp4'),
        thumbnailUrl: '/presets/cyberpunk.jpg',
        status: 'ready',
        duration: 15,
        metadata: {
          duration: 15.0,
          width: 1080,
          height: 1920,
          fps: 30,
          codec: 'h264',
          audioChannels: 2,
          sampleRate: 44100,
          sizeBytes: 12500000,
        },
        edits: {
          ...DEFAULT_EDIT_CONFIG,
          background: {
            prompt: 'High-end podcast studio with warm oak acoustic wood slats, Edison bulbs, and dark slate background',
            presetId: 'podcast_studio',
            blurStrength: 3,
            lightingMatch: true,
            matteFeather: 2,
          },
          outfit: {
            prompt: 'Minimalist heavyweight matte black oversized t-shirt',
            presetId: 'black_oversized_tee',
            garmentType: 'tshirt',
            color: '#0f172a',
            preserveWrinkles: true,
          },
          captions: {
            enabled: true,
            style: 'hormozi',
            primaryColor: '#FFFFFF',
            highlightColor: '#FACC15',
            secondaryHighlightColor: '#22C55E',
            maxWordsPerLine: 3,
            fontSize: 54,
            animation: 'bounce',
            uppercase: true,
            showEmojis: true,
          },
        },
        transcript: [
          {
            id: 0,
            start: 0.4,
            end: 4.2,
            text: 'Here is the single biggest secret to building fast with AI.',
            words: [
              { word: 'Here', start: 0.4, end: 0.8, confidence: 0.99 },
              { word: 'is', start: 0.8, end: 1.0, confidence: 0.99 },
              { word: 'the', start: 1.0, end: 1.2, confidence: 0.99 },
              { word: 'single', start: 1.2, end: 1.7, confidence: 0.99, isKeyword: true },
              { word: 'biggest', start: 1.7, end: 2.2, confidence: 0.99, isKeyword: true },
              { word: 'secret', start: 2.2, end: 2.8, confidence: 0.99, isKeyword: true },
              { word: 'to', start: 2.8, end: 3.1, confidence: 0.99 },
              { word: 'building', start: 3.1, end: 3.6, confidence: 0.99, isKeyword: true },
              { word: 'fast', start: 3.6, end: 3.9, confidence: 0.99, isKeyword: true },
              { word: 'with', start: 3.9, end: 4.1, confidence: 0.99 },
              { word: 'AI.', start: 4.1, end: 4.6, confidence: 0.99, isKeyword: true },
            ],
          },
          {
            id: 1,
            start: 4.8,
            end: 8.9,
            text: 'Most creators spend hours manually editing timelines and keyframes.',
            words: [
              { word: 'Most', start: 4.8, end: 5.2, confidence: 0.99 },
              { word: 'creators', start: 5.2, end: 5.8, confidence: 0.99, isKeyword: true },
              { word: 'spend', start: 5.8, end: 6.2, confidence: 0.99 },
              { word: 'hours', start: 6.2, end: 6.6, confidence: 0.99, isKeyword: true },
              { word: 'manually', start: 6.6, end: 7.2, confidence: 0.99, isKeyword: true },
              { word: 'editing', start: 7.2, end: 7.7, confidence: 0.99 },
              { word: 'timelines', start: 7.7, end: 8.3, confidence: 0.99, isKeyword: true },
              { word: 'and', start: 8.3, end: 8.5, confidence: 0.99 },
              { word: 'keyframes.', start: 8.5, end: 9.1, confidence: 0.99, isKeyword: true },
            ],
          },
          {
            id: 2,
            start: 9.3,
            end: 14.5,
            text: 'With Antigravity, you write one prompt and your entire desk video transforms into a high-retention reel.',
            words: [
              { word: 'With', start: 9.3, end: 9.6, confidence: 0.99 },
              { word: 'Antigravity,', start: 9.6, end: 10.4, confidence: 0.99, isKeyword: true },
              { word: 'you', start: 10.4, end: 10.6, confidence: 0.99 },
              { word: 'write', start: 10.6, end: 11.0, confidence: 0.99 },
              { word: 'one', start: 11.0, end: 11.3, confidence: 0.99, isKeyword: true },
              { word: 'prompt', start: 11.3, end: 11.8, confidence: 0.99, isKeyword: true },
              { word: 'and', start: 11.8, end: 12.0, confidence: 0.99 },
              { word: 'your', start: 12.0, end: 12.2, confidence: 0.99 },
              { word: 'entire', start: 12.2, end: 12.6, confidence: 0.99 },
              { word: 'desk', start: 12.6, end: 13.0, confidence: 0.99, isKeyword: true },
              { word: 'video', start: 13.0, end: 13.4, confidence: 0.99 },
              { word: 'transforms.', start: 13.4, end: 14.2, confidence: 0.99, isKeyword: true },
            ],
          },
        ],
      };
      this.db.projects[demoId] = demoProject;
      saveDatabase(this.db);
    }
  }

  public getProjects(): Project[] {
    return Object.values(this.db.projects).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public getProject(id: string): Project | undefined {
    return this.db.projects[id];
  }

  public saveProject(project: Project): Project {
    project.updatedAt = new Date().toISOString();
    this.db.projects[project.id] = project;
    saveDatabase(this.db);
    return project;
  }

  public deleteProject(id: string): boolean {
    if (this.db.projects[id]) {
      delete this.db.projects[id];
      saveDatabase(this.db);
      return true;
    }
    return false;
  }

  public getJob(id: string): VideoJob | undefined {
    return this.db.jobs[id];
  }

  public saveJob(job: VideoJob): VideoJob {
    job.updatedAt = new Date().toISOString();
    this.db.jobs[job.id] = job;
    saveDatabase(this.db);
    return job;
  }
}

export const studioStore = new StudioStore();
export { STORAGE_ROOT };
