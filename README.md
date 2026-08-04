<div align="center">

#  Employee Management System (EMS)

**Streamline employee management, attendance, payroll, and workforce analytics through a centralized platform.**

</div>

---

## Overview

EMS is a single-page React app backed by Firebase Firestore. Admins manage the full employee lifecycle (profiles, attendance, projects, payroll, reports), while employees get their own portal to view payslips and attendance.

## Why EMS?

Employee data is often spread across spreadsheets and disconnected systems, making attendance, payroll, and reporting difficult to manage. EMS centralizes workforce operations into one real-time platform.

## Images

<table>
  <tr>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/1Sch8aTgr6ZPwjF9XDdtq5WjhAfIpfjAw/view?usp=drive_link"><img src="https://drive.google.com/uc?export=view&id=1Sch8aTgr6ZPwjF9XDdtq5WjhAfIpfjAw" alt="Login page" width="280" /></a>
      <div style="margin-top:8px; font-weight:700">Login page</div>
    </td>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/1mvNUzJqRe0LkTEOkPQUw7hgmbbH4XT4M/view?usp=drive_link"><img src="https://drive.google.com/uc?export=view&id=1mvNUzJqRe0LkTEOkPQUw7hgmbbH4XT4M" alt="Admin dashboard" width="280" /></a>
      <div style="margin-top:8px; font-weight:700">Admin dashboard</div>
    </td>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/1vQRMJe_jVA2OQOR7IjGPHdK-RweHIm40/view?usp=drive_link"><img src="https://drive.google.com/uc?export=view&id=1vQRMJe_jVA2OQOR7IjGPHdK-RweHIm40" alt="Payslip module" width="280" /></a>
      <div style="margin-top:8px; font-weight:700">Payslip module</div>
    </td>
  </tr>
  <tr>
    <td style="vertical-align:top; text-align:center">
      <a href="https://github.com/BugganaBiswajithReddy/Employeemanagementsystem/blob/main/images/pay%20slip%20details.png">
  <img src="https://raw.githubusercontent.com/BugganaBiswajithReddy/Employeemanagementsystem/main/images/pay%20slip%20details.png" alt="Payslip Details" width="280" />
</a>
      <a href="https://github.com/BugganaBiswajithReddy/Employeemanagementsystem/blob/main/images/pay%20slip%20details.png"><img src="https://raw.githubusercontent.com/BugganaBiswajithReddy/Employeemanagementsystem/main/images/pay%20slip%20details.png" alt="Payslip Details" width="280" /></a>
      <div style="margin-top:8px; font-weight:700">Payslip Details</div>
    </td>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/18AExBuE4suc35LkAkjHWHUpI0OpR0ilT/view?usp=drive_link"><img src="https://drive.google.com/uc?export=view&id=18AExBuE4suc35LkAkjHWHUpI0OpR0ilT" alt="Report hub" width="280" /></a>
      <div style="margin-top:8px; font-weight:700">Report hub</div>
    </td>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/1ijeu8oJUsmxZ4aOmBXUi2vKC3TRL7OT7/view?usp=drive_link"><img src="https://drive.google.com/uc?export=view&id=1ijeu8oJUsmxZ4aOmBXUi2vKC3TRL7OT7" alt="Employee Dashboard" width="280" /></a>
      <div style="margin-top:8px; font-weight:700">Employee Dashboard</div>
    </td>
  </tr>
</table>

## Video link

🎥Demo video - [Click here to watch video](https://drive.google.com/file/d/1jL3xwIz6Eq0CtLZUOTkOcgyuDCJUrE0D/view?usp=drive_link)

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
- 🧑‍🤝‍🧑 **Employee management** — add/edit/remove employee profiles: contact info, department, designation, bank details, salary structure (basic, DA, HRA, medical, other allowances)
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
- A [Firebase](https://firebase.google.com/) project with Firestore enabled (
- A Firebase api key is needed to store the data in cloud.

## Getting Started

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd employee-management-system

# 2. Install dependencies
npm install

# 3. Configure Firebase
```

Replace the placeholder values in `firebase-applet-config.json` with your own Firebase web app config (Firebase Console → Project Settings → General → Your apps), and deploy `firestore.rules` accordingly.

```bash
# 4. Run the app
npm run dev
```

The app runs at **http://localhost:3000**.

**Default admin login:** `admin` / `password123` (set on first run — change it immediately via Settings once you're in). Employee accounts default to `password123` until an employee sets their own password.

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

Designing a scalable Firestore data model was one of the primary challenges. The application stores employees, attendance, payroll, reports, projects, and authentication data across multiple collections.

### Role-Based Access

The application supports separate Administrator and Employee portals. Designing the application to provide different permissions and interfaces while sharing the same underlying data required implementing granular access control.

### Payroll & Attendance Integration

Generating payroll required combining attendance records with employee salary structures, allowances, deductions, and payable working days. Building this workflow helped in designing business logic that handles edge cases such as unpaid leaves and half-days.

### Real-Time Synchronization

Ensuring that updates made by administrators were reflected instantly across the application was another important challenge. Firestore's real-time listeners were used to synchronize employee records and payslips across sessions.

### Building a Modular Application

As the project grew, maintaining clean and reusable code became increasingly important. The application was organized into reusable React components and separate utility modules, making it easier to onboard new contributors and add features.

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

This project is licensed under the [MIT License].
