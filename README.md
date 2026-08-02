<div align="center">

# 🧑‍💼 Employee Management System (EMS)

**Streamline employee management, attendance, payroll, and workforce analytics through a centralized platform.**

</div>

---

## Overview

EMS is a single-page React app backed by Firebase Firestore. Admins manage the full employee lifecycle (profiles, attendance, projects, payroll, reports), while employees get their own portal to view their attendance, payslips, and profile. All data syncs to Firestore in real time, so changes made by an admin appear live for anyone else viewing the app.

## Why EMS?

Employee data is often spread across spreadsheets and disconnected systems, making attendance, payroll, and reporting difficult to manage. EMS centralizes workforce operations into one real-time platform, giving administrators a single source of truth while enabling employees to access their own records through a self-service portal.

## Images

<table>
  <tr>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/1Sch8aTgr6ZPwjF9XDdtq5WjhAfIpfjAw/view?usp=drive_link"><img src="https://drive.google.com/uc?export=view&id=1Sch8aTgr6ZPwjF9XDdtq5WjhAfIpfjAw" alt="L[...]
      <div style="margin-top:8px; font-weight:700">Login page</div>
    </td>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/1mvNUzJqRe0LkTEOkPQUw7hgmbbH4XT4M/view?usp=drive_link"><img src="https://drive.google.com/uc?export=view&id=1mvNUzJqRe0LkTEOkPQUw7hgmbbH4XT4M" alt="A[...]
      <div style="margin-top:8px; font-weight:700">Admin dashboard</div>
    </td>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/1vQRMJe_jVA2OQOR7IjGPHdK-RweHIm40/view?usp=drive_link"><img src="https://drive.google.com/uc?export=view&id=1vQRMJe_jVA2OQOR7IjGPHdK-RweHIm40" alt="P[...]
      <div style="margin-top:8px; font-weight:700">Payslip module</div>
    </td>
  </tr>
  <tr>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/14cWV8iJiZDFNR-k5q7HbuPfucq05Wt1X/view?usp=drive_link"><img src="https://drive.google.com/uc?export=view&id=14cWV8iJiZDFNR-k5q7HbuPfucq05Wt1X" alt="P[...]
      <div style="margin-top:8px; font-weight:700">Payslip Details</div>
    </td>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/18AExBuE4suc35LkAkjHWHUpI0OpR0ilT/view?usp=drive_link"><img src="https://drive.google.com/uc?export=view&id=18AExBuE4suc35LkAkjHWHUpI0OpR0ilT" alt="R[...]
      <div style="margin-top:8px; font-weight:700">Report hub</div>
    </td>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/1ijeu8oJUsmxZ4aOmBXUi2vKC3TRL7OT7/view?usp=drive_link"><img src="https://drive.google.com/uc?export=view&id=1ijeu8oJUsmxZ4aOmBXUi2vKC3TRL7OT7" alt="E[...]
      <div style="margin-top:8px; font-weight:700">Employee Dashboard</div>
    </td>
  </tr>
</table>

## Video Link

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
- 🧑‍🤝‍🧑 **Employee management** — add/edit/remove employee profiles: contact info, department, designation, bank details, salary structure (basic, DA, HRA, medical, other allowances[...]
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
<div align="center">

# 🧭 PM Strategist

**Turn a one-line idea into a complete product roadmap — phases, tasks, budget, risk, and timeline — generated by AI.**

</div>

---

## Overview

PM Strategist is an AI-powered project planning platform. Describe what you want to build, and it acts as a solution architect + PM to generate an MVP → V2 → Scale roadmap — then lets you explore it across Kanban, Gantt, budget, risk, and dependency views, refine it through chat, and export it as Markdown or a polished PDF.

## Why PM Strategist?

Traditional AI assistants generate text. PM Strategist transforms ideas into structured project plans that can be refined, visualized, tracked, and exported. Instead of repeatedly prompting an AI, users work with a persistent roadmap that evolves as project requirements change.

## Images

<table>
  <tr>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/1Vn_4GCDuXZjfog1eelZkTyP85Mdh2JV1/view?usp=drive_link"><img src="https://drive.google.com/uc?export=view&id=1Vn_4GCDuXZjfog1eelZkTyP85Mdh2JV1" alt="Roadmap Overview" width="420"></a>
      <div style="margin-top:8px; font-weight:700">Roadmap View</div>
    </td>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/1jFHda-2MkMvw2M9T7tNFMGJmouDR12_u/view?usp=sharing"><img src="https://drive.google.com/uc?export=view&id=1jFHda-2MkMvw2M9T7tNFMGJmouDR12_u" alt="Kanban Board" width="420"></a>
      <div style="margin-top:8px; font-weight:700">Kanban View</div>
    </td>
  </tr>
  <tr>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/1zrFLC5J3IyZNg4eu4dnr4D_CD2QG6Fyz/view?usp=sharing"><img src="https://drive.google.com/uc?export=view&id=1zrFLC5J3IyZNg4eu4dnr4D_CD2QG6Fyz" alt="Dependency Graph" width="420"></a>
      <div style="margin-top:8px; font-weight:700">Dependency Graph</div>
    </td>
    <td style="vertical-align:top; text-align:center">
      <a href="https://drive.google.com/file/d/1di7AU2m2WJINs1uA_Htgy2S31nbVcbYD/view?usp=sharing"><img src="https://drive.google.com/uc?export=view&id=1di7AU2m2WJINs1uA_Htgy2S31nbVcbYD" alt="Risk Matrix" width="420"></a>
      <div style="margin-top:8px; font-weight:700">Risk Matrix</div>
    </td>
  </tr>
</table>

## Video link
🎥 Demo video - [click here to watch the demo video](https://drive.google.com/file/d/1BizL4DSUQEl7MrsNGp2LTPVHSLeI9lRI/view?usp=sharing)

## Table of Contents

- [Overview](#overview)
- [Why PM Strategist?](#why-pm-strategist)
- [Images](#images)
- [Who It's For](#who-its-for)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Notes](#notes)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Who It's For

PM Strategist is built for anyone who needs to turn a raw idea into a credible, structured plan without a dedicated PM on hand:

- 🎓 **Students** — scope coursework and capstone projects with a realistic plan
- 💼 **Freelancers** — turn client briefs into scoped, priced project plans fast
- 🚀 **Startup founders** — go from idea to an investor- or team-ready roadmap
- 🏢 **Small businesses** — plan new products or internal initiatives without a PM function
- ⏱️ **Hackathon teams** — get an MVP scope and task split in minutes, not hours
- 🧑‍💻 **Solo developers** — stay organized and realistic about scope, budget, and time
- 👥 **College project teams** — divide work by role and track progress collaboratively

## Features

- 🧠 **AI-generated roadmaps** — one project idea becomes a structured plan: summary, client-impact statement, proposed tech stack, time-to-MVP estimate, kickstart checklist, and 3–4 iterati[...]
- 💬 **Conversational refinement** — a chat sidebar lets you ask the AI to adjust scope, add tasks, reprioritize, or explain its reasoning; it returns a fully updated roadmap in place.
- 🎛️ **Scenario planning** — rescale by budget/timeline multipliers ("leaner & faster" vs. "premium & thorough") and the AI re-justifies strategy, tech choices, and tasks while preserving t[...]
- 📊 **Multiple views:**
  - Kanban board for task status
  - Gantt chart for scheduling and duration
  - Dependency graph (D3) for task relationships
  - Budget dashboard by phase/department
  - Risk matrix (impact × probability) with mitigations
  - Resource/workload view by department
  - Issues tracker linked to specific tasks
  - Progress breakdown view
- 📤 **Exports** — download as Markdown or a formatted multi-page PDF report.
- 🔐 **Auth & persistence** — optional Firebase Authentication (Google or anonymous) and Firestore storage to save and revisit roadmaps.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 4, Framer Motion |
| Data viz | Recharts, D3 |
| Backend | Express, Socket.io |
| AI | `@google/genai` — Gemini 2.5 Flash, structured JSON output |
| Auth/DB | Firebase Authentication, Firestore |
| Export | jsPDF, file-saver, html2canvas, html-to-image |

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [Gemini API key](https://ai.google.dev/) from Google AI Studio
- A Firebase api key is needed for storing the data in cloud 

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/BugganaBiswajithReddy/pm-strategist.git
cd pm-strategist

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
```

Then edit `.env`:

```env
GEMINI_API_KEY="your-gemini-api-key"
APP_URL="http://localhost:3000"
```

**(Optional) Firebase setup** — sign-in and saved roadmaps require a Firebase project. Replace the placeholder values in `firebase-applet-config.json` with your own Firebase web app config (Pro[...]

```bash
# 4. Run it
npm run dev
```

The app runs at **http://localhost:3000** (Express + Vite dev middleware + Socket.io in one process).

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (Express + Vite + Socket.io) |
| `npm run build` | Build the client and bundle the server for production |
| `npm start` | Run the production build (`dist/server.cjs`) |
| `npm run preview` | Preview the built client with Vite |
| `npm run lint` | Type-check the project with `tsc --noEmit` |
| `npm run clean` | Remove the `dist` build output |

## Project Structure

```
pm-strategist/
├── server.ts                    # Express + Socket.io server, Vite middleware, /api routes
├── src/
│   ├── App.tsx                  # Main app shell, auth, roadmap state, view routing
│   ├── main.tsx                 # React entry point
│   ├── lib/
│   │   ├── gemini.ts             # Gemini client, roadmap/chat schemas, AI calls
│   │   │   ├── export.ts             # Markdown/PDF export logic
│   │   ├── formatters.ts         # Currency/time/effort formatting helpers
│   │   └── utils.ts              # Shared utilities
│   └── components/
│       ├── GanttChart.tsx
│       ├── KanbanBoard.tsx
│       ├── BudgetDashboard.tsx
│       ├── DependencyGraph.tsx
│       ├── RiskMatrix.tsx
│       ├── ResourceWorkload.tsx
│       ├── ProgressBreakdownView.tsx
│       ├── IssuesView.tsx / IssueModal.tsx
│       ├── TaskModal.tsx
│       └── ChatSidebar.tsx
├── firebase-applet-config.json  # Firebase web app config
├── firestore.rules              # Firestore security rules
└── firebase-blueprint.json      # Firestore data model reference
```

## Challenges & Learnings

Building PM Strategist involved more than integrating AI into a web application—it required designing an end-to-end product planning platform capable of transforming a single project idea into a structured, interactive roadmap while maintaining consistency across multiple planning views.

### AI Roadmap Generation

One of the biggest challenges was generating structured and reliable project roadmaps from natural language input. The application was designed to use structured prompts and predefined JSON schemas to ensure AI responses remained consistent while adapting to different project requirements.

### Product Workflow Design

Designing PM Strategist required translating real-world product management workflows into an intuitive application. The challenge was creating a seamless experience that guides users from idea generation to roadmap planning, task organization, dependency analysis, budgeting, risk assessment, and project execution.

### Unified Data Architecture

Multiple planning modules—including the Roadmap View, Kanban Board, Dependency Network, Budget Dashboard, Risk Matrix, Resource Workload, and Progress Tracking—share the same underlying roadmap data. Designing a unified data structure that keeps every view synchronized while supporting AI-driven updates was a key architectural challenge.

### Interactive AI Refinement

Allowing users to modify roadmaps through conversational AI required ensuring that every refinement remained consistent across tasks, timelines, budgets, risks, and dependencies without breaking the overall project structure.

### Building a Scalable Application

As new planning modules were introduced, maintaining reusable React components and separating business logic from presentation became essential for scalability, maintainability, and future feature expansion.

### Key Learnings

- Designed structured AI workflows using prompt engineering and JSON-based responses.
- Translated product management concepts into an interactive application by designing workflows for roadmap generation, task prioritization, dependency visualization, budgeting, and risk analysis.
- Built multiple project management visualizations from a unified roadmap data model.
- Improved application scalability through reusable React components and modular architecture.
- Gained practical experience designing AI-assisted planning tools that balance flexible AI output with predictable application behavior.
- Strengthened my understanding of product planning, solution architecture, and user-centric workflow design.

## Roadmap

Planned enhancements for future releases:

- 👥 **Team collaboration** — invite teammates onto a roadmap with shared, real-time editing
- 🗂️ **Shared workspaces** — group roadmaps under a team or client workspace instead of per-user
- 🔑 **Role-based access** — Owner/Editor/Viewer permissions per roadmap or workspace
- 🏢 **Organization-wide planning** — cross-roadmap visibility for teams managing multiple projects at once

Have a feature request? Open an issue to discuss it.

## Contributing

Issues and pull requests are welcome. If you're adding a feature, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push and open a PR

## License

This project is licensed under the [MIT License]


## Getting Started

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd employee-management-system

# 2. Install dependencies
npm install

# 3. Configure Firebase
```

Replace the placeholder values in `firebase-applet-config.json` with your own Firebase web app config (Firebase Console → Project Settings → General → Your apps), and deploy `firestore.rule[...]

```bash
# 4. Run the app
npm run dev
```

The app runs at **http://localhost:3000**.

**Default admin login:** `admin` / `password123` (set on first run — change it immediately via Settings once you're in). Employee accounts default to `password123` until an employee sets their [...]

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

This project is licensed under the MIT License. See the (LICENSE) file for details.
