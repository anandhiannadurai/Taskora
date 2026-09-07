import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

pdf_path = r"C:\Users\anand\OneDrive\Desktop\Taskora\Taskora_Project_Architecture_and_Learning_Guide.pdf"
doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    rightMargin=40,
    leftMargin=40,
    topMargin=40,
    bottomMargin=40
)

styles = getSampleStyleSheet()

# Custom Brand Styles
primary_color = colors.HexColor('#FF6B00')
secondary_color = colors.HexColor('#FF8C42')
dark_color = colors.HexColor('#111827')
bg_light = colors.HexColor('#F8FAFC')
card_border = colors.HexColor('#E2E8F0')

title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Title'],
    fontName='Helvetica-Bold',
    fontSize=26,
    leading=30,
    textColor=primary_color,
    alignment=TA_LEFT
)

subtitle_style = ParagraphStyle(
    'DocSubTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=13,
    leading=16,
    textColor=dark_color,
    alignment=TA_LEFT
)

heading1_style = ParagraphStyle(
    'H1',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=16,
    leading=20,
    textColor=dark_color,
    spaceBefore=14,
    spaceAfter=8
)

heading2_style = ParagraphStyle(
    'H2',
    parent=styles['Heading2'],
    fontName='Helvetica-Bold',
    fontSize=12,
    leading=15,
    textColor=primary_color,
    spaceBefore=10,
    spaceAfter=4
)

body_style = ParagraphStyle(
    'Body',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9.5,
    leading=13.5,
    textColor=colors.HexColor('#334155'),
    spaceAfter=6
)

bullet_style = ParagraphStyle(
    'Bullet',
    parent=body_style,
    leftIndent=15,
    bulletIndent=5,
    spaceAfter=3
)

code_style = ParagraphStyle(
    'CodeStyle',
    parent=styles['Normal'],
    fontName='Courier',
    fontSize=8.5,
    leading=11,
    textColor=colors.HexColor('#1E293B'),
    backColor=colors.HexColor('#F1F5F9'),
    borderColor=colors.HexColor('#CBD5E1'),
    borderWidth=0.5,
    borderPadding=6,
    spaceBefore=4,
    spaceAfter=6
)

story = []

# Title Section
story.append(Paragraph("Taskora — SaaS Project Study & Architecture Manual", title_style))
story.append(Paragraph("<b>Tagline:</b> Work Together. Finish Faster. &nbsp;|&nbsp; <b>Version:</b> 2.0.0 Production Ready", subtitle_style))
story.append(Spacer(1, 10))
story.append(HRFlowable(width="100%", thickness=2, color=primary_color, spaceBefore=0, spaceAfter=15))

# Executive Summary
story.append(Paragraph("1. Executive Summary & Core Vision", heading1_style))
story.append(Paragraph(
    "<b>Taskora</b> is an enterprise-grade full-stack SaaS project management platform engineered to streamline sprint execution, workspace delivery, and developer productivity. Built with a modern glassmorphic UI, custom branding, and a Pomodoro <b>Focus Mode</b> telemetry engine, Taskora offers software teams a cohesive environment to collaborate, track deliverables, and finish projects faster.",
    body_style
))

# Tech Stack Table
story.append(Spacer(1, 8))
story.append(Paragraph("2. Complete Technology Stack", heading1_style))

stack_data = [
    [Paragraph("<b>Layer</b>", body_style), Paragraph("<b>Technology / Framework</b>", body_style), Paragraph("<b>Purpose & Key Libraries</b>", body_style)],
    [Paragraph("<b>Frontend Core</b>", body_style), Paragraph("React 18 + Vite", body_style), Paragraph("Component-based UI engine with 500ms HMR dev server and optimized Rollup production builds.", body_style)],
    [Paragraph("<b>Styling & Brand</b>", body_style), Paragraph("Tailwind CSS v3", body_style), Paragraph("Custom design system tokens (#FF6B00 primary accent, #111827 dark slate, rounded-2xl 16px corners, glassmorphism overlays).", body_style)],
    [Paragraph("<b>SPA Routing</b>", body_style), Paragraph("React Router DOM v6", body_style), Paragraph("Declarative single-page routing (/overview, /workspace, /sprint, /members, /insights, /focus, /profile, /login, /register).", body_style)],
    [Paragraph("<b>HTTP Client</b>", body_style), Paragraph("Axios", body_style), Paragraph("Axios instance configured with JWT Bearer request interceptors and centralized response error handling.", body_style)],
    [Paragraph("<b>Data Visualization</b>", body_style), Paragraph("Recharts v2", body_style), Paragraph("Interactive SVG area charts, bar graphs, and pie charts featuring custom high-contrast Tooltip rendering.", body_style)],
    [Paragraph("<b>Backend Server</b>", body_style), Paragraph("Node.js + Express.js", body_style), Paragraph("Modular REST API architecture with controllers, middleware, CORS, and JSON body parsing.", body_style)],
    [Paragraph("<b>Auth & Security</b>", body_style), Paragraph("JWT + bcryptjs", body_style), Paragraph("JSON Web Tokens stored in headers/localStorage, password hashing, and Role-Based Access Control (RBAC).", body_style)],
    [Paragraph("<b>Database Layer</b>", body_style), Paragraph("PostgreSQL / SQLite", body_style), Paragraph("Dual-mode database adapter: production PostgreSQL pool with embedded SQLite zero-config dev fallback.", body_style)]
]

t_stack = Table(stack_data, colWidths=[110, 130, 290])
t_stack.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#FFF5ED')),
    ('TEXTCOLOR', (0, 0), (-1, 0), primary_color),
    ('GRID', (0, 0), (-1, -1), 0.5, card_border),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
]))
story.append(t_stack)

# Folder Structure & Architecture
story.append(Spacer(1, 12))
story.append(Paragraph("3. Folder Structure & Modular Architecture", heading1_style))
story.append(Paragraph("The project strictly adheres to feature-based modular organization on the client and MVC on the server:", body_style))

structure_text = """<b>Frontend Structure (client/src/):</b>
• <b>features/</b>: Domain modules (auth/, overview/, workspace/, sprint/, members/, insights/, focus/, profile/)
• <b>shared/</b>: Reusable UI components (Modal.jsx, Badge.jsx, CustomTooltip.jsx, EmptyState.jsx)
• <b>layouts/</b>: AppLayout.jsx, Sidebar.jsx (React Router NavLink), TopNav.jsx (Global search & notification dropdown)
• <b>services/</b>: api.js (Axios API client with request/response interceptors)
• <b>context/</b>: AuthContext.jsx, ThemeContext.jsx (Light/Dark mode), NotificationContext.jsx (Toast alerts)

<b>Backend Structure (server/src/):</b>
• <b>controllers/</b>: authController, workspaceController, taskController, memberController, insightsController, userController
• <b>routes/</b>: Express route definitions (/api/auth, /api/workspaces, /api/tasks, /api/members, /api/insights, /api/user)
• <b>middleware/</b>: authMiddleware.js (JWT verify Token & authorizeRoles middleware)
• <b>config/</b>: db.js (Dual DB Query wrapper), schema.js (5 table DDL definitions)
• <b>seed/</b>: seed.js (Populates realistic users, workspaces, sprint items, members, activity logs)"""

story.append(Paragraph(structure_text.replace('\n', '<br/>'), code_style))

# Modules Implemented
story.append(Spacer(1, 10))
story.append(Paragraph("4. Implemented Modules & Application Features", heading1_style))

modules = [
    ("Overview Dashboard", "Presents 4 key KPI cards (Active Workspaces, Tasks Completed Today, Team Efficiency, Productivity Score Gauge 95%), Weekly Progress Area Chart, Deadline Tracker, and Recent Activity Stream."),
    ("Workspace Module", "Manages the product pipeline across 4 stages: <b>Idea → Building → Testing → Delivered</b>. Features search, priority filtering, grid vs. table view toggle, and Create/Edit/Delete modals."),
    ("Sprint Board", "Interactive HTML5 Drag-and-Drop Kanban workflow covering <b>Backlog, In Progress, Review, Completed</b> columns. Instant optimistic state sync, task priority badges, and task details drawer modal."),
    ("Members Directory", "Team roster supporting role assignments (<b>Admin, Project Lead, Developer, Designer</b>), activity status indicators (<i>Active, Away, In Focus</i>), and member invitation/removal."),
    ("Insights Telemetry", "Analytics engine rendering Recharts Task Completion Rate pie chart, Workspace Progress bar chart, and Daily Productivity trends with high-contrast CustomTooltip styling."),
    ("Focus Mode (Unique Feature)", "Built-in <b>25-minute Pomodoro Focus Timer</b> bound to active sprint tasks. Includes play/pause/reset controls, progress ring, and session productivity metrics logger."),
    ("Profile & Settings", "User profile editor, password modification form, email notification toggles, and seamless dark mode switch.")
]

for title, desc in modules:
    story.append(Paragraph(f"• <b>{title}</b>: {desc}", bullet_style))

# Page Break for Clean DB & API Specs
story.append(PageBreak())

# Section 5: Database Schema & API Routes
story.append(Paragraph("5. Database Schema & REST API Specifications", heading1_style))

db_data = [
    [Paragraph("<b>Table Name</b>", body_style), Paragraph("<b>Key Columns</b>", body_style), Paragraph("<b>Relationship / Purpose</b>", body_style)],
    [Paragraph("<b>users</b>", body_style), Paragraph("id, name, email, password, role, avatar, title, bio, theme, created_at", body_style), Paragraph("Stores authentication credentials (hashed password via bcryptjs) and user preferences.", body_style)],
    [Paragraph("<b>workspaces</b>", body_style), Paragraph("id, name, description, priority, status, start_date, end_date, created_by", body_style), Paragraph("Stores project workspace pipelines (Idea, Building, Testing, Delivered).", body_style)],
    [Paragraph("<b>work_items</b>", body_style), Paragraph("id, title, description, priority, due_date, status, workspace_id, assigned_to", body_style), Paragraph("Sprint Kanban tasks linked to workspaces and assigned users (Backlog, In Progress, Review, Completed).", body_style)],
    [Paragraph("<b>team_members</b>", body_style), Paragraph("id, user_id, workspace_id, role, activity_status, joined_at", body_style), Paragraph("Links users to workspaces with specific roles and real-time activity status (Active, In Focus).", body_style)],
    [Paragraph("<b>activity_logs</b>", body_style), Paragraph("id, user_id, user_name, user_avatar, action, target, timestamp", body_style), Paragraph("Audit log trail recording task moves, workspace creation, and member invitations.", body_style)]
]

t_db = Table(db_data, colWidths=[90, 220, 220])
t_db.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F1F5F9')),
    ('GRID', (0, 0), (-1, -1), 0.5, card_border),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
]))
story.append(t_db)

# REST APIs Table
story.append(Spacer(1, 10))
story.append(Paragraph("REST API Endpoints Reference:", heading2_style))

api_data = [
    [Paragraph("<b>Method</b>", body_style), Paragraph("<b>Endpoint</b>", body_style), Paragraph("<b>Auth</b>", body_style), Paragraph("<b>Description & Payload</b>", body_style)],
    [Paragraph("POST", body_style), Paragraph("/api/auth/register", body_style), Paragraph("Public", body_style), Paragraph("Registers new user, hashes password, returns JWT token.", body_style)],
    [Paragraph("POST", body_style), Paragraph("/api/auth/login", body_style), Paragraph("Public", body_style), Paragraph("Authenticates email/password, returns signed JWT token.", body_style)],
    [Paragraph("POST", body_style), Paragraph("/api/auth/demo-login", body_style), Paragraph("Public", body_style), Paragraph("Single-click demo login for Admin, Project Lead, or Developer roles.", body_style)],
    [Paragraph("GET", body_style), Paragraph("/api/workspaces", body_style), Paragraph("JWT", body_style), Paragraph("Lists workspaces with status/priority filtering and computed progress %.", body_style)],
    [Paragraph("POST", body_style), Paragraph("/api/workspaces", body_style), Paragraph("JWT", body_style), Paragraph("Creates new workspace with Idea, Building, Testing, or Delivered stage.", body_style)],
    [Paragraph("GET", body_style), Paragraph("/api/tasks", body_style), Paragraph("JWT", body_style), Paragraph("Fetches sprint work items with workspace and assignee details.", body_style)],
    [Paragraph("PUT", body_style), Paragraph("/api/tasks/:id", body_style), Paragraph("JWT", body_style), Paragraph("Updates task stage during drag-and-drop or details edit.", body_style)],
    [Paragraph("GET", body_style), Paragraph("/api/members", body_style), Paragraph("JWT", body_style), Paragraph("Lists team members with active task counts and efficiency scores.", body_style)],
    [Paragraph("GET", body_style), Paragraph("/api/insights", body_style), Paragraph("JWT", body_style), Paragraph("Aggregates telemetry data for Recharts graphs and KPI metrics.", body_style)]
]

t_api = Table(api_data, colWidths=[55, 120, 45, 310])
t_api.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#FFF5ED')),
    ('GRID', (0, 0), (-1, -1), 0.5, card_border),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
]))
story.append(t_api)

# Section 6: Key Implementation Takeaways & Learning Concepts
story.append(Spacer(1, 12))
story.append(Paragraph("6. Key Full-Stack Developer Takeaways & Best Practices", heading1_style))

learnings = [
    ("Axios Request Interceptor", "Automatically injects the JWT token stored in <code>localStorage</code> into the <code>Authorization: Bearer &lt;token&gt;</code> HTTP header for every API request, avoiding repetitive code."),
    ("Recharts High-Contrast Tooltips", "Default Recharts tooltips can render dark text on dark backgrounds. By building a custom React <code>CustomTooltip</code> component, we enforce 100% white text contrast (#FFFFFF) on elevated slate boxes in both Light and Dark modes."),
    ("HTML5 Drag and Drop with Optimistic UI", "When moving a task card across Kanban columns, the UI state updates instantly on drag release for 60fps smoothness, while an async <code>PUT /api/tasks/:id</code> request updates the database in the background."),
    ("Pomodoro Focus Engine", "Stateful 25-minute timer using React <code>useEffect</code> interval loops, bound to active task state, tracking total focus minutes and completed sessions."),
    ("Dual Database Adapter Pattern", "The backend database wrapper (<code>server/src/config/db.js</code>) seamlessly connects to PostgreSQL in production environments while automatically providing an embedded SQLite file (<code>taskora.db</code>) for instant local zero-setup dev execution.")
]

for title, desc in learnings:
    story.append(Paragraph(f"• <b>{title}</b>: {desc}", bullet_style))

story.append(Spacer(1, 15))
story.append(HRFlowable(width="100%", thickness=1, color=card_border, spaceBefore=5, spaceAfter=10))
story.append(Paragraph("<b>Taskora SaaS Platform Manual</b> — Prepared for Technical Portfolio Review & Internship Evaluation.", ParagraphStyle('Footer', parent=body_style, alignment=TA_CENTER, fontName='Helvetica-Oblique', textColor=colors.HexColor('#64748B'))))

doc.build(story)
print("PDF Generated Successfully at:", pdf_path)
