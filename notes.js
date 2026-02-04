const express = require("express");
const rateLimit = require("express-rate-limit");
const { v4: uuid } = require("uuid");

const router = express.Router();

/* In-memory storage */
let notes = [];

/* Rate limiter: max 5 notes per minute */
const createLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: "Too many notes created. Try again later." }
});

/* =========================
   CREATE NOTE
   POST /notes
========================= */
router.post("/", createLimiter, (req, res) => {
  let { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  title = title.trim();
  content = content.trim();

  if (!title || !content) {
    return res.status(400).json({ error: "Empty strings are not allowed" });
  }

  const note = {
    id: uuid(),
    title,
    content,
    created_at: new Date(),
    updated_at: new Date()
  };

  notes.push(note);
  res.status(201).json(note);
});

/* =========================
   SEARCH NOTES
   GET /notes/search?q=text
   (must be ABOVE /:id)
========================= */
router.get("/search", (req, res) => {
  let q = req.query.q;

  if (!q || !q.trim()) {
    return res.status(400).json({ error: "Search query cannot be empty" });
  }

  q = q.trim().toLowerCase();

  const results = notes.filter(note =>
    note.title.toLowerCase().includes(q) ||
    note.content.toLowerCase().includes(q)
  );

  res.json(results);
});

/* =========================
   GET ALL NOTES
   GET /notes
========================= */
router.get("/", (req, res) => {
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
  );
  res.json(sortedNotes);
});

/* =========================
   UPDATE NOTE
   PUT /notes/:id
========================= */
router.put("/:id", (req, res) => {
  const note = notes.find(n => n.id === req.params.id);

  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  let updated = false;

  if (req.body.title !== undefined) {
    const newTitle = req.body.title.trim();
    if (newTitle && newTitle !== note.title) {
      note.title = newTitle;
      updated = true;
    }
  }

  if (req.body.content !== undefined) {
    const newContent = req.body.content.trim();
    if (newContent && newContent !== note.content) {
      note.content = newContent;
      updated = true;
    }
  }

  if (!updated) {
    return res.json({ message: "No changes detected" });
  }

  note.updated_at = new Date();
  res.json(note);
});

/* Export router */
module.exports = router;
