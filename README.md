<div align="center">

# 🧑‍💼 Employee Management System (EMS)

**Streamline employee management, attendance, payroll, and workforce analytics through a centralized platform.**

</div>

---

## Overview

EMS is a single-page React app backed by Firebase Firestore. Admins manage the full employee lifecycle (profiles, attendance, projects, payroll, reports), while employees get their own portal to view [...]

## Why EMS?

Employee data is often spread across spreadsheets and disconnected systems, making attendance, payroll, and reporting difficult to manage. EMS centralizes workforce operations into one real-time platf[...]

## Images

<table>
  <tr>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/1Sch8aTgr6ZPwjF9XDdtq5WjhAfIpfjAw/view?usp=sharing"><img src="https://drive.google.com/uc?export=view&id=1Sch8aTgr6ZPwjF9XDdtq5WjhAfIpfjAw" alt="Login screen" style="max-width:420px; width:100%; height:auto;"/></a>
      <div style="margin-top:8px; font-weight:700">Login page</div>
    </td>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/1mvNUzJqRe0LkTEOkPQUw7hgmbbH4XT4M/view?usp=drive_link"><img src="https://drive.google.com/uc?export=view&id=1mvNUzJqRe0LkTEOkPQUw7hgmbbH4XT4M" alt="Dashboard overview" style="max-width:420px; width:100%; height:auto;"/></a>
      <div style="margin-top:8px; font-weight:700">Admin dashboard</div>
    </td>
  </tr>
  <tr>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/1vQRMJe_jVA2OQOR7IjGPHdK-RweHIm40/view?usp=drive_link"><img src="https://drive.google.com/uc?export=view&id=1vQRMJe_jVA2OQOR7IjGPHdK-RweHIm40" alt="Payslips list" style="max-width:420px; width:100%; height:auto;"/></a>
      <div style="margin-top:8px; font-weight:700">Payslip module</div>
    </td>
    <td style="vertical-align:top; text-align:center">
      <a href="assets/images/overview-4.png"><img src="assets/images/overview-4.png" alt="Payslip details" style="max-width:420px; width:100%; height:auto;"/></a>
      <div style="margin-top:8px; font-weight:700">Payslip details</div>
    </td>
  </tr>
</table>

🎥Demo video [Click here to watch video](https://drive.google.com/file/d/1jL3xwIz6Eq0CtLZUOTkOcgyuDCJUrE0D/view?usp=drive_link)

## Table of Contents

- [Overview](#overview)
- [Why EMS?](#why-ems)
- [Who It's For](#who-its-for)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Challenges & Learnings](#challenges--learnings)
- [Future Roadmap](#future-roadmap)
- [License](#license)

## Who It's For

EMS is built for small teams and organizations that need core HR functionality without a full-scale HRIS:

- 🏢 **Small businesses** — manage employees and payroll without dedicated HR software
- 👔 **HR admins** — track attendance, leave, and salary structures from one dashboard
- 💰 **Payroll teams** — auto-generate payslips from attendance records over any date range
- 👥 **Employees** — self-service access to attendance history, payslips, and profile
- 📊 **Managers** — analytics on department breakdown, salary distribution, and attendance trends

## Features

- 🔐 **Dual login** — separate Admin and Employee sign-in flows (`UnifiedLogin`), with forced password change on an employee's first login.
- 🧑‍🤝‍🧑 **Employee management** — add/edit/remove employee profiles: contact info, department, designation, bank details, salary structure (basic, DA, HRA, medical, other allowances/ded[...]
- 🕒 **Attendance tracking** — mark daily attendance per employee (Present, Absent, Leave, Out of Station, Half Day, Late Arrival), with check-in/out times and working hours.
- 📁 **Projects** — create projects, assign employees, and track status (Not Started, In Progress, On Hold, Completed).
- 💵 **Payroll / payslips** — auto-calculated payslips derived from attendance records over a date range (payable days, total earnings, deductions, net salary) with payment status tracking.
- 📄 **Reports** — generate Employee, Attendance, Salary, and Department reports on demand.
- 📊 **Analytics dashboard** — charts (via Recharts) for department breakdown, salary distribution, and attendance trends, filterable by department and date range.
- 📤 **Exports** — download attendance reports as PDF or Excel (`jsPDF` + `xlsx`).
- 📝 **Activity log** — audit trail of employee additions, updates, deletions, and attendance actions.
- 🔄 **Real-time sync** — Firestore `onSnapshot` listeners keep employees, attendance, projects, payslips, and reports in sync across sessions.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 4 |
| Data viz | Recharts |
| Backend / DB | Firebase Firestore (client SDK, real-time listeners) |
| Export | jsPDF, xlsx (SheetJS) |
| UI | lucide-react, Framer Motion (`motion`) |

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [Firebase](https://firebase.google.com/) project with Firestore enabled (for persistence — see below)

## Getting Started

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd employee-management-system

# 2. Install dependencies
npm install

# 3. Configure Firebase
```

Replace the placeholder values in `firebase-applet-config.json` with your own Firebase web app config (Firebase Console → Project Settings → General → Your apps), and deploy `firestore.rules` to[...]

```bash
# 4. Run the app
npm run dev
```

The app runs at **http://localhost:3000**.

**Default admin login:** `admin` / `password123` (set on first run — change it immediately via Settings once you're in). Employee accounts default to `password123` until an employee sets their own.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Type-check the project with `tsc --noEmit` |
| `npm run clean` | Remove build output |

## Project Structure

```
employee-management-system/
├── src/
│   ├── App.tsx                     # App shell, auth state, tab routing, data loading
│   ├── main.tsx                    # React entry point
│   ├── firebase.ts                 # Firebase app + Firestore init
│   ├── types.ts                    # Shared TypeScript types (Employee, Payslip, Project, etc.)
│   ├── data/mockData.ts            # Seed/demo data
│   ├── services/
│   │   ├── auth.ts                  # Admin credential storage/verification
│   │   ├── storage.ts                # Firestore read/write per collection
│   │   └── firebaseSync.ts           # Real-time onSnapshot sync + error handling
│   ├── utils/
│   │   ├── salaryCalculator.ts       # Payslip calculation from attendance
│   │   └── exportAttendance.ts       # PDF/Excel attendance export
│   └── components/
│       ├── Sidebar.tsx / Header.tsx
│       ├── DashboardModule.tsx
│       ├── EmployeesModule.tsx / EmployeeFormModal.tsx / EmployeeViewModal.tsx
│       ├── AttendanceModule.tsx / MarkAttendanceModal.tsx / AttendanceViewModal.tsx
│       ├── ProjectsModule.tsx
│       ├── PayslipsModule.tsx
│       ├── AnalyticsModule.tsx
│       ├── ReportsModule.tsx
│       ├── UnifiedLogin.tsx / EmployeeDashboardView.tsx
│       ├── ChangePasswordModal.tsx / EmployeeChangePassword.tsx
│       ├── SettingsModal.tsx / ConfirmModal.tsx / Toast.tsx / ErrorBoundary.tsx
├── firebase-applet-config.json     # Firebase web app config
└── firestore.rules                 # Firestore security rules
