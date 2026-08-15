// api/content.js — Vercel Serverless Function
// GET /api/content?file=bio|projects|experience  →  JSON file contents

import jwt from 'jsonwebtoken';

const CORS_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://phoenixphan0.me';
const REPO = process.env.GITHUB_REPO || 'sanrobin/sanrobin.github.io';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const FILES = { bio: 'content/bio.json', projects: 'content/projects.json', experience: 'content/experience.json' };

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function verifyToken(req) {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  return jwt.verify(token, process.env.JWT_SECRET);
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    verifyToken(req);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const file = req.query.file;
  if (!FILES[file]) return res.status(400).json({ error: 'Invalid file parameter' });

  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${FILES[file]}?ref=${BRANCH}`;
  const ghRes = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'sanrobin-cms/1.0',
    },
  });

  if (!ghRes.ok) return res.status(ghRes.status).json({ error: 'GitHub API error' });

  const data = await ghRes.json();
  const content = JSON.parse(Buffer.from(data.content, 'base64').toString('utf-8'));

  return res.status(200).json({ content, sha: data.sha });
}
