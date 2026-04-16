# 🏥 PulseTech Hospital Dashboard

**Production-grade Hospital Intelligence System** — real-time patient monitoring, AI-powered insights, appointment management, and resource tracking.

---

## 🚀 Quick Start (3 Steps)

### Prerequisites
- Node.js v18+ → https://nodejs.org
- npm v9+

---

### Step 1 — Backend Setup

```bash
cd pulsetech/backend
npm install
node server.js
```

✅ API server starts at **http://localhost:5000**
✅ WebSocket live sync starts at **ws://localhost:5000**

---

### Step 2 — Frontend Setup

Open a **new terminal**:

```bash
cd pulsetech/frontend
npm install --legacy-peer-deps
npm start
```

✅ React app opens at **http://localhost:3000**

---

### Step 3 — Login

| Role          | Username    | Password    | Access |
|---------------|-------------|-------------|--------|
| 👨‍⚕️ Doctor     | `dr.sharma` | `doctor123` | Dashboard, Patients, Appointments, AI Insights |
| 🛠 Admin       | `admin`     | `admin123`  | Full access including Resources |
| 🗂 Receptionist | `reception` | `recept123` | Dashboard & Appointments only |

---

## 📁 Project Structure

```
pulsetech/
├── backend/
│   ├── server.js          ← Express REST API + WebSocket server
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.jsx                        ← Root app shell
        ├── index.js                       ← React entry point
        ├── index.css                      ← Design system (CSS variables, components)
        │
        ├── context/
        │   └── AuthContext.jsx            ← Login state (localStorage persistence)
        │
        ├── hooks/
        │   └── useWebSocket.js            ← Auto-reconnect WebSocket hook
        │
        ├── utils/
        │   └── api.js                     ← All API calls (single source of truth)
        │
        ├── components/
        │   ├── Sidebar.jsx                ← Navigation (role-filtered)
        │   ├── Topbar.jsx                 ← Live clock, notifications, export
        │   ├── ECGChart.jsx               ← SVG ECG renderer with glow effects
        │   └── NotificationsPanel.jsx     ← Slide-in notification center
        │
        └── pages/
            ├── LoginPage.jsx              ← Auth with demo hints
            ├── DashboardPage.jsx          ← Stats, charts, emergency banner
            ├── AppointmentsPage.jsx       ← Smart sorted table, status updates
            ├── PatientsPage.jsx           ← Live vitals, ECG, doctor notes
            ├── AnalyticsPage.jsx          ← AI predictions, ICU forecast
            └── ResourcesPage.jsx          ← Bed availability, doctor workload
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with username/password |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | All patients with live vitals + ECG data |
| GET | `/api/patients/:id` | Single patient detail |
| PATCH | `/api/patients/:id/notes` | Update doctor notes |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments` | Today's appointments (smart sorted) |
| PATCH | `/api/appointments/:id` | Update status / fields |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/overview` | Dashboard stats (totals, risk counts, ICU) |
| GET | `/api/analytics/trends` | Weekly charts data |
| GET | `/api/analytics/ai-insights` | AI predictions + urgent care list |

### Resources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/beds` | All ward bed occupancy + waiting times |
| GET | `/api/doctors` | Doctor list with workload % |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | All notifications |
| PATCH | `/api/notifications/:id/read` | Mark one as read |
| PATCH | `/api/notifications/read-all` | Mark all as read |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/export` | Download full JSON report |

---

## ✅ Feature Checklist

### Core Features
- [x] **Role-based auth** — Doctor / Admin / Receptionist with filtered navigation
- [x] **Real-time vitals** — WebSocket push every 5 seconds (auto-reconnect)
- [x] **Emergency banner** — Animated red alert for high-risk patients
- [x] **Smart appointment sorting** — High risk first → age priority
- [x] **Live ECG snapshots** — SVG waveform with glow per risk level
- [x] **Doctor notes** — Edit & save per patient
- [x] **Status updates** — Change appointment status live

### Analytics & AI
- [x] **Patient load prediction** — Tomorrow's expected count
- [x] **ICU demand forecast** — High / Moderate / Low
- [x] **Peak hour prediction** — Busiest time slot
- [x] **Staffing suggestions** — Auto-generated based on ICU %
- [x] **Risk trend charts** — Stacked weekly bar chart
- [x] **Urgent care flagging** — AI-ranked patient list

### Resources
- [x] **Bed availability** — All 11 wards with % occupancy
- [x] **Waiting time estimate** — Per ward
- [x] **Doctor workload** — Capacity bars + status badges

### UI/UX
- [x] **Dark hospital-grade theme** — Custom CSS design system
- [x] **Live clock + date** — Topbar
- [x] **Notification center** — Unread badge + panel
- [x] **Export report** — Download JSON from any page
- [x] **Responsive layout** — Mobile-friendly sidebar collapse
- [x] **Chart.js integration** — Line, Bar, Doughnut

---

## 🔄 Real-Time Architecture

```
Backend (Node.js)
    │
    ├── REST API  ──────────────────→ React pages poll every 8–15s
    │
    └── WebSocket (ws://localhost:5000)
            │
            ├── VITALS_UPDATE (every 5s) ──→ Patient cards update live
            └── APPOINTMENT_UPDATE       ──→ Appointment status syncs
```

---

## 🏗 Extending for Production

### Connect a real database (MongoDB)
```bash
npm install mongoose
```
Replace the in-memory arrays in `server.js` with Mongoose models.

### Add JWT authentication
```bash
npm install jsonwebtoken bcryptjs
```
Hash passwords in DB, sign JWT on login, verify middleware on all routes.

### Environment variables
Create `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pulsetech
JWT_SECRET=your_secret_here
```

### Deploy
- **Backend**: Railway, Render, or AWS EC2
- **Frontend**: Vercel, Netlify, or S3+CloudFront
- **Database**: MongoDB Atlas (free tier available)

---

## 🧪 Sample Test Data

The system ships with **12 patients** across ICU, General, Surgical, Maternity, Ortho, and Urology wards:

| Patient | Condition | Risk | Ward |
|---------|-----------|------|------|
| Arjun Kapoor, 67M | Acute MI | 🔴 High | ICU-A |
| Sunita Reddy, 72F | Stroke | 🔴 High | ICU-B |
| Kavita Joshi, 61F | COPD | 🔴 High | ICU-A |
| Suresh Iyer, 78M | Heart Failure | 🔴 High | ICU-C |
| Geeta Mishra, 34F | Preeclampsia | 🔴 High | Maternity |
| Meera Patel, 54F | Hypertension | 🟡 Medium | Gen-B |
| Vikram Singh, 45M | Pneumonia | 🟡 Medium | Gen-C |
| Pooja Nair, 43F | Diabetes T2 | 🟡 Medium | Gen-A |
| Deepak Rao, 50M | Liver Cirrhosis | 🟡 Medium | Gen-D |
| Rohit Kumar, 38M | Appendicitis | 🟢 Low | Surgical |
| Amit Sharma, 29M | Femur Fracture | 🟢 Low | Orthopedic |
| Lakshmi Devi, 55F | Kidney Stone | 🟢 Low | Urology |

---

## 📝 License
MIT — Free to use for educational and commercial purposes.
