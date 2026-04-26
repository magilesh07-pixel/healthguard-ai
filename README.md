# 🏥 HealthGuard AI

> **AI-powered clinical intelligence platform for early disease risk detection and medical scan analysis.**

[![Live Site](https://img.shields.io/badge/Live-Website-emerald?style=for-the-badge&logo=vercel)](https://healthguard-ai.vercel.app)
![HealthGuard AI](https://img.shields.io/badge/HealthGuard-AI%20Platform-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyMWMtNC45LTMuNS04LTcuNC04LTExYTggOCAwIDAgMSAxNiAwYzAgMy42LTMuMSA3LjUtOCAxMXoiLz48L3N2Zz4=)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite)
![Groq AI](https://img.shields.io/badge/Groq-Llama%204-orange?style=for-the-badge)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **AI Scan Analyzer** | Real-time Vision AI analysis using Llama 4 Scout for MRI, CT, and X-ray scans. |
| 📋 **Dynamic Protocols** | AI-generated clinical next steps tailored specifically to each scan's results. |
| 🛡️ **Vision Verification** | Autonomous detection and rejection of non-medical images to prevent hallucinations. |
| 📊 **Risk Dashboard** | Dynamic Cardiovascular, Metabolic & Neurological risk scores based on patient vitals. |
| 👤 **Health Profile** | Full patient record with Bio-Demographics, Clinical History & Lifestyle Factors. |
| 🔒 **Secure API Proxy** | Groq API key is kept server-side via Vercel serverless functions — never exposed. |

---

## 🚀 Live Demo

### **[healthguard-ai.vercel.app](https://healthguard-ai.vercel.app)**

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Framer Motion, Recharts, Lucide React
- **Styling**: Vanilla CSS with custom CSS variables (dark/light theme)
- **AI**: Groq API — LLaMA 3.3 70B Versatile
- **Routing**: React Router DOM v6
- **Backend**: Flask (Python) — Auth, SQLite History, AI Proxy
- **Database**: SQLite (healthguard.db)
- **Deployment**: Vercel / Heroku / DigitalOcean

---

## 📂 Project Structure

```
healthguard-ai/
├── public/                # Static assets
├── src/                   # React frontend
│   ├── components/        # UI components
│   ├── pages/             # Page views
│   └── main.jsx           # Entry point
├── app.py                 # Flask Backend (Auth, History, AI Proxy)
├── healthguard.db         # SQLite Database
├── requirements.txt       # Python dependencies
├── package.json           # Frontend dependencies & scripts
├── vite.config.js         # Vite configuration
└── index.html             # HTML entry point
```

---

## ⚙️ Local Setup

```bash
# Clone the repo
git clone https://github.com/magilesh07-pixel/healthguard-ai.git
cd healthguard-ai

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your Groq API key to .env:
# GROQ_API_KEY=your_key_here

# Start dev server
npm run dev
```

> Get a free Groq API key at [console.groq.com](https://console.groq.com)

---

## 🌐 Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add environment variable: `GROQ_API_KEY` = your Groq key
4. Click **Deploy**

---

## 👨‍💻 Developer

**Magilesh MB**  
GitHub: [@magilesh07-pixel](https://github.com/magilesh07-pixel)  
📧 [magilesh8@gmail.com](mailto:magilesh8@gmail.com)

---

## ⚠️ Disclaimer

HealthGuard AI is a **decision-support and portfolio demonstration tool**. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.

---

<p align="center">© 2026 HealthGuard AI — Designed & Developed by Magilesh MB (@magilesh07-pixel)</p>
