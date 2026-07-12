# 🚀 GrowEasy AI CSV Importer

An AI-powered CSV Importer built as part of the GrowEasy Full Stack Developer Assignment.

The application allows users to upload CSV files, preview the uploaded data, intelligently transform the data into the required CRM schema using Google Gemini AI, validate records, skip invalid entries, and display import results.

---

# 🌐 Live Demo

### Frontend
https://groweasy-ai-importer-gilt.vercel.app

### Backend
https://groweasy-ai-importer-backend-cxtn.onrender.com

---

# ✨ Features

- Upload CSV files
- Drag & Drop Support
- CSV Preview
- AI-powered CRM Mapping
- Batch Processing (50 records per batch)
- Invalid Record Detection
- Imported & Skipped Count
- Skipped Records Table
- Automatic Uploaded File Cleanup
- Responsive UI
- Live Deployment

---

# 🧠 AI Processing Flow

```text
CSV Upload
      │
      ▼
CSV Preview
      │
      ▼
Batch Processing (50 rows)
      │
      ▼
Google Gemini AI
      │
      ▼
CRM JSON Conversion
      │
      ▼
Validation
      │
      ├── Valid Records
      │
      └── Skipped Records
      │
      ▼
Display Import Summary
```

---

# 🛠 Tech Stack

## Frontend

- Next.js 16
- React 19
- Tailwind CSS
- React Dropzone

## Backend

- Node.js
- Express.js
- Multer
- csvtojson
- Google Gemini API

## Deployment

- Vercel
- Render

---

# 📂 Folder Structure

```text
groweasy-ai-importer
│
├── frontend
│   ├── src
│   ├── app
│   └── components
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── uploads
│   └── server.js
│
└── sample-data
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/pratham94380/groweasy-ai-importer.git
```

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

Create `.env`

```env
GEMINI_API_KEY=YOUR_API_KEY
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# API Endpoints

## Upload CSV

```
POST /upload
```

Returns

- CSV Preview
- Total Rows

---

## Import CSV

```
POST /import
```

Returns

- Imported Records
- Skipped Records
- Import Summary

---

# Validation Rules

✅ Import if

- Email exists

OR

- Phone exists

❌ Skip if

- Email missing
- Phone missing

---

# Screenshots

### Upload
screenshots/home.png

### CSV Preview
screenshots/preview.png


### Parsed CRM Records
screenshots/Parsed_CRM_Records.png

### Skipped Records

screenshots/skipped_records.png
---

# Future Improvements

- Authentication
- Database Integration
- Duplicate Detection
- Progress Bar
- Export Failed Records
- Retry Failed Imports
- Multiple CRM Support

---

# Assignment Highlights

✔ CSV Upload

✔ CSV Preview

✔ AI Mapping

✔ Batch Processing

✔ Validation

✔ Skip Logic

✔ Imported/Skipped Summary

✔ Responsive UI

✔ Live Deployment

---

# Author

**Pratham Rajulwar**

GitHub

https://github.com/pratham94380

LinkedIn

https://www.linkedin.com/in/pratham-rajulwar-932254285/

---

