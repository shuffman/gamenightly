import express from 'express'
import { DatabaseSync } from 'node:sqlite'
import { randomUUID, randomBytes } from 'crypto'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const dataDir = process.env.DATA_DIR || path.join(__dirname, '..', 'data')
fs.mkdirSync(dataDir, { recursive: true })

const db = new DatabaseSync(path.join(dataDir, 'gamenightly.db'))
db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA foreign_keys = ON')

db.exec(`
  create table if not exists calendars (
    id text primary key,
    name text not null,
    created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  create table if not exists invitees (
    id text primary key,
    calendar_id text not null references calendars(id) on delete cascade,
    name text not null,
    token text unique not null,
    created_at text not null default (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  create table if not exists availability (
    id text primary key,
    invitee_id text not null references invitees(id) on delete cascade,
    date text not null,
    available integer not null default 1,
    unique(invitee_id, date)
  );

  create index if not exists idx_invitees_calendar_id on invitees(calendar_id);
  create index if not exists idx_invitees_token on invitees(token);
  create index if not exists idx_availability_invitee_id on availability(invitee_id);
`)

const app = express()
app.use(express.json())

app.post('/api/calendars', (req, res) => {
  const name = (req.body?.name || '').trim()
  if (!name) return res.status(400).json({ error: 'Name is required' })

  const id = randomUUID()
  db.prepare('insert into calendars (id, name) values (?, ?)').run(id, name)
  res.status(201).json(db.prepare('select * from calendars where id = ?').get(id))
})

app.get('/api/calendars/:id', (req, res) => {
  const calendar = db
    .prepare('select * from calendars where id = ?')
    .get(req.params.id)
  if (!calendar) return res.status(404).json({ error: 'Calendar not found' })
  res.json(calendar)
})

app.get('/api/calendars/:id/invitees', (req, res) => {
  const invitees = db
    .prepare('select * from invitees where calendar_id = ? order by created_at')
    .all(req.params.id)
  res.json(invitees)
})

app.post('/api/calendars/:id/invitees', (req, res) => {
  const calendar = db
    .prepare('select id from calendars where id = ?')
    .get(req.params.id)
  if (!calendar) return res.status(404).json({ error: 'Calendar not found' })

  const name = (req.body?.name || '').trim()
  if (!name) return res.status(400).json({ error: 'Name is required' })

  const id = randomUUID()
  const token = randomBytes(16).toString('base64url')
  db.prepare(
    'insert into invitees (id, calendar_id, name, token) values (?, ?, ?, ?)'
  ).run(id, calendar.id, name, token)
  res.status(201).json(db.prepare('select * from invitees where id = ?').get(id))
})

app.get('/api/calendars/:id/availability', (req, res) => {
  const rows = db
    .prepare(
      `select a.invitee_id, a.date, a.available
       from availability a
       join invitees i on i.id = a.invitee_id
       where i.calendar_id = ?`
    )
    .all(req.params.id)
  res.json(rows)
})

app.get('/api/respond/:token', (req, res) => {
  const invitee = db
    .prepare('select * from invitees where token = ?')
    .get(req.params.token)
  if (!invitee) return res.status(404).json({ error: 'Invalid link' })

  const calendar = db
    .prepare('select * from calendars where id = ?')
    .get(invitee.calendar_id)
  const availability = db
    .prepare('select date, available from availability where invitee_id = ?')
    .all(invitee.id)

  res.json({ invitee, calendar, availability })
})

app.put('/api/respond/:token/availability', (req, res) => {
  const invitee = db
    .prepare('select id from invitees where token = ?')
    .get(req.params.token)
  if (!invitee) return res.status(404).json({ error: 'Invalid link' })

  const { date, available } = req.body || {}
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Valid date (YYYY-MM-DD) is required' })
  }

  db.prepare(
    `insert into availability (id, invitee_id, date, available)
     values (?, ?, ?, ?)
     on conflict (invitee_id, date) do update set available = excluded.available`
  ).run(randomUUID(), invitee.id, date, available ? 1 : 0)

  res.json({ ok: true })
})

const distDir = path.join(__dirname, '..', 'dist')
app.use(express.static(distDir))
app.use((req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

const port = process.env.PORT || 3000
app.listen(port, '0.0.0.0', () => {
  console.log(`GameNightly listening on port ${port}, data in ${dataDir}`)
})
