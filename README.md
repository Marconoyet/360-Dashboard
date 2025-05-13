# 🌐 360 Dashboard

**360 Dashboard** is a full-stack admin interface built to manage **localization (translation) JSON files** used by another live project — `360 Business` — hosted remotely.

This dashboard allows you to **fetch, edit, and update JSON locale files** with changes saved via a FTP.

---

## 🗂️ Project Structure
360-dashboard/
├── backend/ # Express.js backend to handle locale JSON operations
├── frontend/ # React frontend (Vite) with translation editor UI
└── .gitignore # Ignores node_modules and sensitive data

 
---

## ✨ Features

- 🌍 View and manage translation/localization keys
- ✍️ Edit translation values across multiple locales
- 📤 Push updates back to the server via FTP
- 📁 Connects to a JSON file used by the live `360 Business` project

---

## ⚙️ Requirements

- Node.js (v16 or newer)
- npm or yarn
- Git

---

## 🧪 Running the Project Locally

### 1. Clone the Repo

```bash
git clone https://github.com/Marconoyet/360-Dashboard.git
cd 360-Dashboard
```
### Backend Setup (/backend)
The backend serves as a bridge to the remote JSON locale file. You can run it locally or deploy it.

```bash
cd backend
npm install
```

### Frontend Setup (/frontend)
```bash
cd ../frontend
npm install
npm run dev
```
