import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const DATA_DIR = path.join(__dirname, 'data');
  const RANKINGS_FILE = path.join(DATA_DIR, 'rankings.json');

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  function readRankings(): any[] {
    try {
      if (fs.existsSync(RANKINGS_FILE)) {
        const raw = fs.readFileSync(RANKINGS_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Erro ao ler rankings:', e);
    }
    return [];
  }

  function writeRankings(rankings: any[]) {
    try {
      fs.writeFileSync(RANKINGS_FILE, JSON.stringify(rankings, null, 2), 'utf-8');
    } catch (e) {
      console.error('Erro ao salvar rankings:', e);
    }
  }

  // Initial seed if file is empty
  if (!fs.existsSync(RANKINGS_FILE) || readRankings().length === 0) {
    const todayStr = new Date().toISOString().split('T')[0];
    const initialSeed = [
      {
        id: 'seed_1',
        userId: 'seed_u1',
        nickname: 'BaierDoGoiás',
        mode: 'LEGEND',
        formation: '4-3-3',
        totalGoals: 433,
        difference: 0,
        isExact: true,
        date: todayStr,
        timestamp: Date.now() - 3600000 * 2,
      },
      {
        id: 'seed_2',
        userId: 'seed_u2',
        nickname: 'CeniArtilheiro',
        mode: 'CLASSIC',
        formation: '4-4-2',
        totalGoals: 434,
        difference: 1,
        isExact: false,
        date: todayStr,
        timestamp: Date.now() - 3600000 * 3,
      },
      {
        id: 'seed_3',
        userId: 'seed_u3',
        nickname: 'ReiDoPontosCorridos',
        mode: 'CLASSIC',
        formation: '3-4-3',
        totalGoals: 712,
        difference: 279,
        isExact: false,
        date: todayStr,
        timestamp: Date.now() - 3600000 * 4,
      },
      {
        id: 'seed_4',
        userId: 'seed_u4',
        nickname: 'MuralhaTricolor',
        mode: 'CLASSIC',
        formation: '4-5-1',
        totalGoals: 435,
        difference: 2,
        isExact: false,
        date: todayStr,
        timestamp: Date.now() - 3600000 * 5,
      },
      {
        id: 'seed_5',
        userId: 'seed_u5',
        nickname: 'FredGoleador',
        mode: 'CLASSIC',
        formation: '3-5-2',
        totalGoals: 654,
        difference: 221,
        isExact: false,
        date: todayStr,
        timestamp: Date.now() - 3600000 * 6,
      },
    ];
    writeRankings(initialSeed);
  }

  // GET /api/rankings: Return live rankings for today and all-time
  app.get('/api/rankings', (req, res) => {
    const list = readRankings();
    res.json(list);
  });

  // POST /api/rankings: Submit real score from current player
  app.post('/api/rankings', (req, res) => {
    const entry = req.body;
    if (!entry || !entry.nickname || typeof entry.totalGoals !== 'number') {
      return res.status(400).json({ error: 'Dados de pontuação inválidos' });
    }

    const current = readRankings();
    const todayStr = new Date().toISOString().split('T')[0];
    const diff = Math.abs(entry.totalGoals - 433);

    const newRecord = {
      id: `rank_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: entry.userId || `user_${Date.now()}`,
      nickname: String(entry.nickname).trim().substring(0, 25),
      avatarUrl: entry.avatarUrl,
      mode: entry.mode || 'CLASSIC',
      formation: entry.formation || '4-3-3',
      totalGoals: entry.totalGoals,
      difference: diff,
      isExact: entry.totalGoals === 433,
      date: todayStr,
      timestamp: Date.now(),
    };

    const updated = [newRecord, ...current].slice(0, 250);
    writeRankings(updated);
    res.json(updated);
  });

  // Mount Vite dev server or serve production build
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Brasileirão 433 Server running on port ${PORT}`);
  });
}

startServer();
