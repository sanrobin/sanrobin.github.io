// api/save.js — Vercel Serverless Function
// POST /api/save  { file, content, sha }  →  { ok, commitUrl }

import jwt from 'jsonwebtoken';

const CORS_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://phoenixphan0.me';
const REPO = process.env.GITHUB_REPO || 'sanrobin/sanrobin.github.io';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const FILES = { bio: 'content/bio.json', projects: 'content/projects.json', experience: 'content/experience.json' };

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
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
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let user;
  try {
    user = verifyToken(req);
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { file, content, sha } = req.body || {};
  if (!FILES[file] || !content || !sha) {
    return res.status(400).json({ error: 'Missing file, content, or sha' });
  }

  const encoded = Buffer.from(JSON.stringify(content, null, 2) + '\n').toString('base64');
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${FILES[file]}`;

  const ghRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `cms(${file}): update via admin panel [${user.username}]`,
      content: encoded,
      sha,
      branch: BRANCH,
    }),
  });

  if (!ghRes.ok) {
    const err = await ghRes.json();
    return res.status(ghRes.status).json({ error: err.message || 'GitHub API error' });
  }

  const data = await ghRes.json();
  return res.status(200).json({ ok: true, commitUrl: data.commit?.html_url });
}
