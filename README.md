# 🏥 HealthGuard AI

> **AI-powered clinical intelligence platform for early disease risk detection and medical scan analysis.**

![HealthGuard AI](https://img.shields.io/badge/HealthGuard-AI%20Platform-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyMWMtNC45LTMuNS04LTcuNC04LTExYTggOCAwIDAgMSAxNiAwYzAgMy42LTMuMSA3LjUtOCAxMXoiLz48L3N2Zz4=)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)
![Groq AI](https://img.shields.io/badge/Groq-LLaMA%203.3-orange?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **AI Scan Analyzer** | Upload MRI, CT, X-Ray scans and get a simulated clinical AI report powered by LLaMA 3.3 |
| 📊 **Risk Dashboard** | Dynamic Cardiovascular, Metabolic & Neurological risk scores based on patient vitals |
| 👤 **Health Profile** | Full patient record with Bio-Demographics, Clinical History & Lifestyle Factors |
| 📋 **Patient Intake Portal** | Comprehensive health form to capture vitals, family history, and lifestyle data |
| 🌗 **Dark / Light Mode** | Seamless theme switching with accessible contrast across all pages |
| 🔒 **Secure API Proxy** | Groq API key is kept server-side via a Vercel serverless function — never exposed to the browser |
| 📱 **Mobile Responsive** | Full mobile navigation with animated hamburger menu |

---

## 🚀 Live Demo

> **[healthguard-ai.vercel.app](https://healthguard-ai.vercel.app)** *(add your link after deploying)*

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Framer Motion, Recharts, Lucide React
- **Styling**: Vanilla CSS with custom CSS variables (dark/light theme)
- **AI**: Groq API — LLaMA 3.3 70B Versatile
- **Routing**: React Router DOM v6
- **Backend**: Vercel Serverless Functions (API proxy)
- **Deployment**: Vercel

---

## 📂 Project Structure

```
healthguard-ai/
├── api/
│   └── analyze.js          # Serverless proxy — keeps API key secret
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── HealthForm.jsx
│   │   └── RiskChart.jsx
│   ├── pages/
│   │   ├── Landing.jsx     # Landing page with animations
│   │   ├── Home.jsx        # Risk Intelligence Dashboard
│   │   ├── Scans.jsx       # AI Scan Analyzer
│   │   ├── Intake.jsx      # Patient Intake Portal
│   │   ├── HealthProfile.jsx
│   │   └── Info.jsx        # Resources & Legal hub
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css           # Global theme variables
├── .env.example
├── vercel.json
└── index.html
```

---

## ⚙️ Local Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/healthguard-ai.git
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

**M.B.Magilesh**  
📧 [magilesh8@gmail.com](mailto:magilesh8@gmail.com)

---

## ⚠️ Disclaimer

HealthGuard AI is a **decision-support and portfolio demonstration tool**. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.

---

<p align="center">© 2026 HealthGuard AI — Designed & Developed by M.B.Magilesh</p>
