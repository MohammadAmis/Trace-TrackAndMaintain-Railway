# Trace & Track - Railway Information System

A comprehensive, role-based operational dashboard system for Indian Railways. Built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Deployment (Netlify + Backend)

### Frontend (Netlify)
1. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
2. **Environment Variables**:
   - Configure `VITE_API_BASE_URL` in Netlify dashboard pointing to your deployed backend API.
3. **SPA Support**:
   - The `_redirects` file is already in `public/` to handle React Router navigation.

### Backend
1. **Environment Variables**:
   - Create a `.env` file based on `.env.example`.
   - Ensure `CORS_ORIGIN` is set to your Netlify URL.
2. **Database**:
   - Ensure your MongoDB Atlas IP Whitelist allows the backend server.

---

## 🛠️ Local Development

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Data Seeding (Optional)
```bash
cd backend
npm run data:import
```

---

## 🏗️ Architecture & Features

### Core Modules
- **SLA Tracking**: Real-time monitoring of maintenance deadlines with automatic escalation.
- **Analytics**: Comprehensive KPIs and system health metrics using Recharts.
- **Role-Based Access (RBAC)**: Support for Super Admin, Zonal Admin, Depot Officer, etc.
- **Inspection Logs**: QR-code ready inspection logging for railway assets.

### Tech Stack
- **Frontend**: React 19, Vite, Lucide React, Recharts.
- **Backend**: Express 5 (Alpha), Mongoose, JWT Auth, Helmet, Morgan.
- **Styling**: Glassmorphism via Vanilla CSS.

---

## 📝 License
ISC License
