// api/save.js — Vercel Serverless Function
// POST /api/save  { file, content, sha }  →  { ok, sha, commitUrl }

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

async function getLatestSha(filePath) {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}?ref=${BRANCH}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'sanrobin-cms/1.0',
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data.sha;
    }
  } catch (err) {
    console.error('Error fetching latest SHA:', err);
  }
  return null;
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

  const { file, content, sha: passedSha } = req.body || {};
  if (!FILES[file] || !content) {
    return res.status(400).json({ error: 'Missing file or content' });
  }

  const targetPath = FILES[file];
  let fileSha = passedSha || (await getLatestSha(targetPath));

  if (!fileSha) {
    fileSha = await getLatestSha(targetPath);
  }

  const encoded = Buffer.from(JSON.stringify(content, null, 2) + '\n').toString('base64');
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${targetPath}`;

  const commitData = {
    message: `cms(${file}): update via admin panel [${user.username}]`,
    content: encoded,
    sha: fileSha,
    branch: BRANCH,
  };

  let ghRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'sanrobin-cms/1.0',
    },
    body: JSON.stringify(commitData),
  });

  // If conflict (409), attempt once with fresh SHA
  if (ghRes.status === 409) {
    const freshSha = await getLatestSha(targetPath);
    if (freshSha && freshSha !== fileSha) {
      commitData.sha = freshSha;
      ghRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'sanrobin-cms/1.0',
        },
        body: JSON.stringify(commitData),
      });
    }
  }

  if (!ghRes.ok) {
    const err = await ghRes.json().catch(() => ({}));
    let errMsg = err.message || 'GitHub API error';
    if (ghRes.status === 403 && errMsg.includes('Resource not accessible')) {
      errMsg = 'GitHub Personal Access Token lacks "Contents: Read and write" permission for this repository.';
    }
    return res.status(ghRes.status).json({ error: errMsg });
  }

  const data = await ghRes.json();
  const newSha = data.content?.sha || fileSha;
  return res.status(200).json({ ok: true, sha: newSha, commitUrl: data.commit?.html_url });
}

