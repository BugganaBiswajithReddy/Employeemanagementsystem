<div align="center">

# 🧑‍💼 Employee Management System (EMS)

**Manage employees, track attendance, run payroll, and view workforce analytics — with separate admin and employee self-service logins.**

</div>

---

## Overview

EMS is a single-page React app backed by Firebase Firestore. Admins manage the full employee lifecycle (profiles, attendance, projects, payroll, reports), while employees get their own portal to view their attendance, payslips, and profile. All data syncs to Firestore in real time, so changes made by an admin appear live for anyone else viewing the app.

## Why EMS?

Employee data is often spread across spreadsheets and disconnected systems, making attendance, payroll, and reporting difficult to manage. EMS centralizes workforce operations into one real-time platform, giving administrators a single source of truth while enabling employees to access their own records through a self-service portal.
Images 

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
- 💰 **Payroll teams** — auto-generate payslips from attendance data over any date range
- 👥 **Employees** — self-service access to attendance history, payslips, and profile
- 📊 **Managers** — analytics on department breakdown, salary distribution, and attendance trends

## Features

- 🔐 **Dual login** — separate Admin and Employee sign-in flows (`UnifiedLogin`), with forced password change on an employee's first login.
- 🧑‍🤝‍🧑 **Employee management** — add/edit/remove employee profiles: contact info, department, designation, bank details, salary structure (basic, DA, HRA, medical, other allowances/deductions), and leave balance.
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

Replace the placeholder values in `firebase-applet-config.json` with your own Firebase web app config (Firebase Console → Project Settings → General → Your apps), and deploy `firestore.rules` to your project.

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
```

## Challenges & Learnings

Building the Employee Management System involved more than implementing features—it required designing a scalable application capable of managing multiple HR workflows while maintaining a simple and intuitive user experience.

### Firestore Data Modeling

Designing a scalable Firestore data model was one of the primary challenges. The application stores employees, attendance, payroll, reports, projects, and authentication data across multiple collections while maintaining real-time synchronization and efficient querying.

### Role-Based Access

The application supports separate Administrator and Employee portals. Designing the application to provide different permissions and interfaces while sharing the same underlying data required implementing role-based access throughout the system.

### Payroll & Attendance Integration

Generating payroll required combining attendance records with employee salary structures, allowances, deductions, and payable working days. Building this workflow helped in designing business logic that accurately generates employee payslips.

### Real-Time Synchronization

Ensuring that updates made by administrators were reflected instantly across the application was another important challenge. Firestore's real-time listeners were used to synchronize employee records, attendance, payroll, and project data without requiring manual refreshes.

### Building a Modular Application

As the project grew, maintaining clean and reusable code became increasingly important. The application was organized into reusable React components and separate utility modules, making it easier to maintain, extend, and scale with additional HR features.

### Key Learnings

- Designed a scalable NoSQL database structure using Firebase Firestore.
- Built a role-based application with separate administrator and employee experiences.
- Implemented real-time data synchronization across multiple modules.
- Developed payroll calculation logic based on attendance and salary components.
- Improved application maintainability through reusable React components and modular project architecture.
- Gained practical experience designing and implementing an end-to-end employee management solution.

## Future Roadmap

Planned enhancements for future releases:

- 🖐️ **Biometric Attendance** — integrate biometric devices to automatically record employee check-in and check-out times with real-time attendance synchronization.
- 🤖 **AI Workforce Analysis** — generate AI-powered insights from attendance, payroll, and workforce data to identify trends, anomalies, and productivity patterns.
- 📝 **Leave Approval Workflow** — enable employees to submit leave requests while allowing managers and administrators to review, approve, or reject them.
- 📧 **Email Notifications** — send automated notifications for attendance updates, leave approvals, payroll generation, and important HR announcements.
- 📈 **Performance Reviews** — provide structured employee performance evaluations with goals, feedback, and appraisal tracking.
- 📂 **Employee Document Management** — securely store and manage employee documents such as ID proofs, contracts, certificates, and other HR records.
- 🏢 **Multi-Organization Support** — support multiple organizations or business branches within a single platform while maintaining separate employee and payroll data.

## License

No license file is currently included in this repository. Add a `LICENSE` file (e.g. MIT) if you intend to open-source this project.
