// api/seed.js — Run ONCE to create the admin user
// GET /api/seed?secret=SEED_SECRET&username=sanrobin&password=yourpassword

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.query.secret !== process.env.SEED_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { username, password } = req.query;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password query params required' });
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'portfolio_cms');
    const existing = await db.collection('users').findOne({ username });
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 12);
    await db.collection('users').insertOne({ username, passwordHash, createdAt: new Date() });
    return res.status(201).json({ ok: true, message: `User "${username}" created` });
  } finally {
    await client.close();
  }
}
