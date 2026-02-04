# Notes Management API

A minimal REST API built with Node.js and Express for managing notes with basic intelligence beyond CRUD.

---

## Features (As per Assignment)

- Create notes with validation  
  - `title` and `content` are required  
  - Extra spaces are trimmed  
  - Empty strings are rejected  
- Rate limiting  
  - Maximum **5 note creations per minute**
- Get all notes  
  - Returns list of notes  
  - Sorted by most recently updated
- Update notes  
  - Partial updates allowed  
  - Returns a meaningful message if no changes are made  
  - Updates `updated_at` only when data changes
- Search notes  
  - Searches in both title and content  
  - Case-insensitive  
  - Ignores extra spaces  
  - Partial matching supported (e.g. `meet` → `meeting`)  
  - Returns error if query is empty

---

## Tech Stack

- Node.js
- Express.js
- express-rate-limit
- uuid

---

## Setup & Run

```bash
npm install
node index.js

Server runs on:

http://localhost:3000

API Endpoints

POST /notes – Create note

GET /notes – Get all notes

PUT /notes/:id – Update note

GET /notes/search?q=keyword – Search notes

Testing

All endpoints were tested using Postman, including validation, search, update, and rate limiting cases.