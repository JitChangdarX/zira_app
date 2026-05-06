import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
import "../css/todo.css";
import axios from "axios";
import api from "../../utils/apiurl";
import UnderConstructionToast from "./UnderConstruction/UnderConstructionToast";

const INITIAL_TASKS = {
  todo: [
    {
      id: "TASK-124",
      title: "Fix auth session timeout",
      priority: "high",
      tags: ["bug", "backend"],
      assignee: "MK",
      assigneeName: "Mark Kumar",
      due: "Today",
      progress: 20,
      color: "#3b82f6",
      desc: "Session tokens are expiring too early causing users to be logged out unexpectedly. Investigate JWT config.",
    },
    {
      id: "TASK-120",
      title: "Write unit test cases",
      priority: "medium",
      tags: ["testing", "frontend"],
      assignee: "SR",
      assigneeName: "Sarah Reeves",
      due: "Thu 12 Apr",
      progress: 0,
      color: "#a855f7",
      desc: "Add Jest + React Testing Library test coverage for all core components.",
    },
    {
      id: "TASK-125",
      title: "Update project README",
      priority: "low",
      tags: ["docs"],
      assignee: "JP",
      assigneeName: "Jake Park",
      due: "Fri 13 Apr",
      progress: 0,
      color: "#14b8a6",
      desc: "Document setup instructions, environment variables, and deployment guide.",
    },
  ],
  inprog: [
    {
      id: "TASK-119",
      title: "Refactor API response layer",
      priority: "medium",
      tags: ["backend", "api"],
      assignee: "MK",
      assigneeName: "Mark Kumar",
      due: "Tomorrow",
      progress: 65,
      color: "#3b82f6",
      desc: "Standardize API response format across all endpoints to use { data, meta, errors } envelope.",
    },
    {
      id: "TASK-115",
      title: "UI responsiveness fixes",
      priority: "medium",
      tags: ["UI", "frontend"],
      assignee: "SR",
      assigneeName: "Sarah Reeves",
      due: "Wed 10 Apr",
      progress: 90,
      color: "#a855f7",
      desc: "Fix layout breakpoints for mobile and tablet viewports. Focus on dashboard and list views.",
    },
  ],
  done: [
    {
      id: "TASK-101",
      title: "Deploy v2.1 to production",
      priority: "low",
      tags: ["devops"],
      assignee: "JP",
      assigneeName: "Jake Park",
      due: "2h ago",
      progress: 100,
      color: "#14b8a6",
      desc: "Deployed successfully to prod with zero-downtime rolling update.",
    },
    {
      id: "TASK-100",
      title: "Update technical documentation",
      priority: "low",
      tags: ["docs"],
      assignee: "MK",
      assigneeName: "Mark Kumar",
      due: "Yesterday",
      progress: 100,
      color: "#3b82f6",
      desc: "All API endpoints documented in Notion. Swagger spec updated.",
    },
    {
      id: "TASK-99",
      title: "Fix login redirect loop",
      priority: "low",
      tags: ["bug", "backend"],
      assignee: "SR",
      assigneeName: "Sarah Reeves",
      due: "Mon",
      progress: 100,
      color: "#a855f7",
      desc: "Resolved infinite redirect caused by misconfigured OAuth callback URL.",
    },
  ],
};

const BURNDOWN = [
  { day: "Apr 1", ideal: 80, actual: 80 },
  { day: "Apr 3", ideal: 68, actual: 72 },
  { day: "Apr 5", ideal: 56, actual: 60 },
  { day: "Apr 7", ideal: 44, actual: 52 },
  { day: "Apr 9", ideal: 32, actual: 34 },
  { day: "Apr 11", ideal: 20, actual: null },
  { day: "Apr 13", ideal: 8, actual: null },
];

const DAILY = [
  { day: "Mon", done: 2, created: 4 },
  { day: "Tue", done: 4, created: 3 },
  { day: "Wed", done: 3, created: 5 },
  { day: "Thu", done: 5, created: 2 },
  { day: "Fri", done: 2, created: 6 },
  { day: "Sat", done: 1, created: 1 },
];

const TREND = [
  { day: "Mon", created: 4, completed: 2 },
  { day: "Tue", created: 3, completed: 4 },
  { day: "Wed", created: 5, completed: 3 },
  { day: "Thu", created: 2, completed: 5 },
  { day: "Fri", created: 6, completed: 2 },
  { day: "Sat", created: 1, completed: 4 },
];

const TASK_SPLIT = [
  { name: "Features", value: 45, color: "#3b82f6" },
  { name: "Bugs", value: 38, color: "#ef4444" },
  { name: "Chores", value: 17, color: "#555c6e" },
];

const WEEKLY_REPORT = [
  { week: "W1", planned: 20, done: 18, bugs: 3 },
  { week: "W2", planned: 22, done: 19, bugs: 2 },
  { week: "W3", planned: 18, done: 22, bugs: 5 },
  { week: "W4", planned: 25, done: 21, bugs: 1 },
];

const TEAM_PERF = [
  { subject: "Backend", MK: 90, SR: 60, JP: 40 },
  { subject: "Frontend", MK: 70, SR: 95, JP: 55 },
  { subject: "Testing", MK: 50, SR: 80, JP: 85 },
  { subject: "Docs", MK: 65, SR: 55, JP: 90 },
  { subject: "DevOps", MK: 85, SR: 40, JP: 75 },
];

const TEAM_ACTIVITY = [
  {
    av: "JD",
    color: "#0F6E56",
    name: "John completed TASK-100",
    sub: "Deploy docs update merged",
    time: "2h ago",
    online: true,
  },
  {
    av: "SR",
    color: "#993C1D",
    name: "Sarah commented TASK-119",
    sub: "Needs code review before merge",
    time: "4h ago",
    online: false,
  },
  {
    av: "MK",
    color: "#1d4ed8",
    name: "Mark assigned TASK-124 to you",
    sub: "Auth bug — critical priority",
    time: "5h ago",
    online: true,
  },
  {
    av: "AM",
    color: "#7c3aed",
    name: "Alisha opened TASK-126",
    sub: "New feature: dark mode toggle",
    time: "6h ago",
    online: false,
  },
];

const DEADLINES = [
  {
    id: "TASK-124",
    name: "Fix auth session timeout",
    date: "Today",
    status: "Overdue risk",
    statusColor: "#ef4444",
    statusBg: "rgba(239,68,68,0.12)",
    dot: "#ef4444",
  },
  {
    id: "TASK-119",
    name: "Refactor API response layer",
    date: "Tomorrow",
    status: "Due soon",
    statusColor: "#f59e0b",
    statusBg: "rgba(245,158,11,0.12)",
    dot: "#f59e0b",
  },
  {
    id: "TASK-120",
    name: "Write unit test cases",
    date: "Thu 12 Apr",
    status: "On track",
    statusColor: "#60a5fa",
    statusBg: "rgba(59,130,246,0.12)",
    dot: "#3b82f6",
  },
  {
    id: "TASK-125",
    name: "Update README",
    date: "Fri 13 Apr",
    status: "On track",
    statusColor: "#86efac",
    statusBg: "rgba(34,197,94,0.12)",
    dot: "#22c55e",
  },
];

const VELOCITY = [
  { label: "Backend", pct: 80, count: 8, color: "#3b82f6" },
  { label: "Frontend", pct: 60, count: 6, color: "#a855f7" },
  { label: "DevOps", pct: 30, count: 3, color: "#14b8a6" },
  { label: "Bugs", pct: 40, count: 4, color: "#ef4444" },
  { label: "Docs", pct: 20, count: 2, color: "#555c6e" },
];

const ACTIVITY_FEED = [
  {
    icon: "✅",
    bg: "rgba(34,197,94,.1)",
    text: "TASK-100 marked as done by John",
    time: "Today 9:32 AM",
  },
  {
    icon: "💬",
    bg: "rgba(59,130,246,.1)",
    text: "Sarah left a comment on TASK-119",
    time: "Today 8:15 AM",
  },
  {
    icon: "🚨",
    bg: "rgba(239,68,68,.1)",
    text: "TASK-124 priority escalated to High",
    time: "Yesterday 5:45 PM",
  },
  {
    icon: "🔀",
    bg: "rgba(168,85,247,.1)",
    text: "TASK-115 moved to In Review",
    time: "Yesterday 3:20 PM",
  },
  {
    icon: "⏰",
    bg: "rgba(245,158,11,.1)",
    text: "TASK-120 deadline extended to Thu",
    time: "Mon 4:00 PM",
  },
];

const NOTIFICATIONS = [
  {
    id: 1,
    icon: "🚨",
    title: "TASK-124 is overdue",
    sub: "Fix auth session timeout was due Today",
    time: "5m ago",
    unread: true,
    color: "#ef4444",
  },
  {
    id: 2,
    icon: "💬",
    title: "New comment on TASK-119",
    sub: "Sarah: Needs code review before merge",
    time: "1h ago",
    unread: true,
    color: "#3b82f6",
  },
  {
    id: 3,
    icon: "✅",
    title: "TASK-101 completed",
    sub: "Jake deployed v2.1 to production",
    time: "2h ago",
    unread: true,
    color: "#22c55e",
  },
  {
    id: 4,
    icon: "👤",
    title: "Mark invited you to Phoenix",
    sub: "You've been added as Lead Engineer",
    time: "3h ago",
    unread: false,
    color: "#a855f7",
  },
  {
    id: 5,
    icon: "⏰",
    title: "Sprint ends in 3 days",
    sub: "Sprint 14 · Apr 1–14 · 21 tasks open",
    time: "Today",
    unread: false,
    color: "#f59e0b",
  },
];

const NAV_ITEMS = [
  { icon: "⊞", label: "Dashboard", badge: 28 },
  { icon: "◫", label: "Board" },
  { icon: "▤", label: "Backlog", badge: 14 },
  { icon: "⏱", label: "Timeline" },
  { icon: "📊", label: "Reports" },
  { icon: "🏢", label: "Organizations" },
  { icon: "🔔", label: "Notifications", notif: true },
];

const PROJECTS = [
  { color: "#3b82f6", name: "Phoenix App", tasks: 8 },
  { color: "#a855f7", name: "Orion API", tasks: 5 },
  { color: "#14b8a6", name: "Nova UI", tasks: 12 },
  { color: "#f59e0b", name: "Atlas Backend", tasks: 3 },
];

const INITIAL_ORGS = [
  {
    id: "ORG-001",
    name: "Acme Corp",
    members: 12,
    projects: 4,
    plan: "Pro",
    color: "#3b82f6",
    avatar: "AC",
  },
  {
    id: "ORG-002",
    name: "Nova Studio",
    members: 8,
    projects: 3,
    plan: "Team",
    color: "#a855f7",
    avatar: "NS",
  },
  {
    id: "ORG-003",
    name: "Atlas Labs",
    members: 5,
    projects: 2,
    plan: "Free",
    color: "#14b8a6",
    avatar: "AL",
  },
];

const TIMELINE_ITEMS = [
  {
    id: "TASK-124",
    title: "Fix auth session timeout",
    start: 1,
    end: 3,
    color: "#ef4444",
    assignee: "MK",
    status: "todo",
  },
  {
    id: "TASK-119",
    title: "Refactor API response layer",
    start: 2,
    end: 7,
    color: "#3b82f6",
    assignee: "MK",
    status: "inprog",
  },
  {
    id: "TASK-115",
    title: "UI responsiveness fixes",
    start: 3,
    end: 6,
    color: "#a855f7",
    assignee: "SR",
    status: "inprog",
  },
  {
    id: "TASK-120",
    title: "Write unit test cases",
    start: 5,
    end: 9,
    color: "#14b8a6",
    assignee: "SR",
    status: "todo",
  },
  {
    id: "TASK-125",
    title: "Update project README",
    start: 8,
    end: 10,
    color: "#f59e0b",
    assignee: "JP",
    status: "todo",
  },
  {
    id: "TASK-101",
    title: "Deploy v2.1 to production",
    start: 1,
    end: 2,
    color: "#22c55e",
    assignee: "JP",
    status: "done",
  },
];

const DAYS = [
  "Apr 1",
  "Apr 2",
  "Apr 3",
  "Apr 4",
  "Apr 5",
  "Apr 6",
  "Apr 7",
  "Apr 8",
  "Apr 9",
  "Apr 10",
  "Apr 11",
  "Apr 12",
  "Apr 13",
  "Apr 14",
];

const tagColor = (t) => {
  if (["bug", "blocker"].includes(t)) return "tag-red";
  if (["backend", "api"].includes(t)) return "tag-blue";
  if (["frontend", "UI"].includes(t)) return "tag-purple";
  if (["testing"].includes(t)) return "tag-teal";
  if (["docs"].includes(t)) return "tag-green";
  if (["devops"].includes(t)) return "tag-amber";
  return "tag-blue";
};

function TaskCard({ task, onDragStart, onClick }) {
  return (
    <div
      className={`task-card ${task.priority} ${task.progress === 100 ? "done-card" : ""}`}
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="task-top">
        <div className="task-title">{task.title}</div>
        <div className="task-id">{task.id}</div>
      </div>
      <div className="task-tags">
        {task.tags.map((t) => (
          <span key={t} className={`tag ${tagColor(t)}`}>
            {t}
          </span>
        ))}
      </div>
      <div className="task-bottom">
        <span className={`priority-pill p-${task.priority}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        <span className="task-date">📅 {task.due}</span>
        <div
          className="task-av"
          style={{
            background: `linear-gradient(135deg,${task.color},${task.color}99)`,
          }}
        >
          {task.assignee}
        </div>
      </div>
      {task.progress > 0 && (
        <div className="task-progress">
          <div className="tp-row">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="tp-bar">
            <div className="tp-fill" style={{ width: `${task.progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="ct-label">{label}</div>
      {payload.map(
        (p) =>
          p.value != null && (
            <div key={p.name} className="ct-row" style={{ color: p.color }}>
              {p.name}: <strong>{p.value}</strong>
            </div>
          ),
      )}
    </div>
  );
}

function OwnerLogoButton({ user, onClick, isOpen }) {
  return (
    <button
      className={`owner-logo-btn ${isOpen ? "active" : ""}`}
      onClick={onClick}
      title="Owner Dashboard"
    >
      <div className="owner-logo-crown">♛</div>
      <div
        className="owner-logo-avatar"
        style={{ background: user.avatarColor }}
      >
        {user.avatar}
        <div className="owner-logo-online" />
      </div>
      <div className="owner-logo-info">
        <div className="owner-logo-name">{user.name}</div>
        <div className="owner-logo-role">Owner · {user.plan}</div>
      </div>
      <svg
        className={`owner-caret ${isOpen ? "open" : ""}`}
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}

function UserMenu({ darkMode, setDarkMode, onLogout }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("profile");
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const user = {
    name: "Mark Kumar",
    email: "mark.kumar@company.com",
    role: "Lead Engineer",
    plan: "Pro",
    orgName: "Phoenix App",
    avatar: "MK",
    avatarColor: "linear-gradient(135deg, #3b82f6, #a855f7)",
    taskCount: 8,
    completedCount: 12,
    streak: 7,
    joinDate: "Jan 2024",
    lastActive: "Just now",
    isOwner: true,
  };

  return (
    <div className="user-menu-wrap" ref={ref}>
      <OwnerLogoButton
        user={user}
        onClick={() => setOpen(!open)}
        isOpen={open}
      />
      {open && (
        <div className="user-dropdown">
          <div className="ud-header">
            <div className="ud-avatar-wrap">
              <div
                className="ud-avatar"
                style={{ background: user.avatarColor }}
              >
                {user.avatar}
              </div>
              {user.isOwner && <div className="ud-crown">♛</div>}
              <div className="ud-online-ring" />
            </div>
            <div className="ud-info">
              <div className="ud-name">{user.name}</div>
              <div className="ud-email">{user.email}</div>
              <div className="ud-badges">
                <span className="ud-badge role">{user.role}</span>
                {user.isOwner && (
                  <span className="ud-badge owner">♛ Owner</span>
                )}
                <span className="ud-badge plan">{user.plan}</span>
              </div>
            </div>
          </div>
          <div className="ud-stats">
            <div className="ud-stat">
              <div className="ud-stat-val">{user.taskCount}</div>
              <div className="ud-stat-key">Open Tasks</div>
            </div>
            <div className="ud-stat">
              <div className="ud-stat-val green">{user.completedCount}</div>
              <div className="ud-stat-key">Completed</div>
            </div>
            <div className="ud-stat">
              <div className="ud-stat-val orange">{user.streak}d</div>
              <div className="ud-stat-key">Streak</div>
            </div>
          </div>
          <div className="ud-tabs">
            {["profile", "settings", "team"].map((t) => (
              <button
                key={t}
                className={`ud-tab ${tab === t ? "active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          {tab === "profile" && (
            <div className="ud-body">
              {[
                ["Member since", user.joinDate, ""],
                ["Last active", user.lastActive, "green"],
                ["Organization", user.orgName, ""],
                ["Plan", user.plan, ""],
              ].map(([k, v, cls]) => (
                <div key={k} className="ud-meta-row">
                  <span className="ud-meta-key">{k}</span>
                  <span className={`ud-meta-val ${cls}`}>{v}</span>
                </div>
              ))}
              <div className="ud-links">
                <a href="#" className="ud-link">
                  View profile
                </a>
                <a href="#" className="ud-link">
                  Activity log
                </a>
              </div>
            </div>
          )}
          {tab === "settings" && (
            <div className="ud-body">
              <div className="ud-setting-row">
                <div>
                  <div className="ud-setting-label">Dark mode</div>
                  <div className="ud-setting-sub">
                    Toggle light / dark theme
                  </div>
                </div>
                <button
                  className={`ud-toggle ${darkMode ? "on" : ""}`}
                  onClick={() => setDarkMode(!darkMode)}
                >
                  <div className="ud-toggle-thumb" />
                </button>
              </div>
              <div className="ud-setting-row">
                <div>
                  <div className="ud-setting-label">Email notifications</div>
                  <div className="ud-setting-sub">Receive daily digest</div>
                </div>
                <button className="ud-toggle on">
                  <div className="ud-toggle-thumb" />
                </button>
              </div>
            </div>
          )}
          {tab === "team" && (
            <div className="ud-body">
              {[
                {
                  av: "SR",
                  color: "#a855f7",
                  name: "Sarah Reeves",
                  role: "Frontend Dev",
                  online: false,
                },
                {
                  av: "JP",
                  color: "#14b8a6",
                  name: "Jake Park",
                  role: "DevOps Eng",
                  online: true,
                },
              ].map((m) => (
                <div key={m.av} className="ud-team-row">
                  <div className="ud-team-av-wrap">
                    <div
                      className="ud-team-av"
                      style={{
                        background: `linear-gradient(135deg,${m.color},${m.color}99)`,
                      }}
                    >
                      {m.av}
                    </div>
                    {m.online && <div className="ud-team-online" />}
                  </div>
                  <div>
                    <div className="ud-team-name">{m.name}</div>
                    <div className="ud-team-role">{m.role}</div>
                  </div>
                  <button className="ud-team-msg">→</button>
                </div>
              ))}
            </div>
          )}
          <div className="ud-footer">
            <button
              className="ud-logout-btn"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NotifPanel({ open, onClose, notifications, onMarkRead }) {
  const unreadCount = notifications.filter((n) => n.unread).length;
  return (
    <>
      {open && <div className="panel-overlay" onClick={onClose} />}
      <div className={`notif-panel ${open ? "open" : ""}`}>
        <div className="notif-panel-head">
          <div className="notif-panel-title">
            Notifications{" "}
            {unreadCount > 0 && (
              <span className="notif-count">{unreadCount}</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="np-btn" onClick={onMarkRead}>
              Mark all read
            </button>
            <button className="np-close" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>
        <div className="notif-list">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notif-item ${n.unread ? "unread" : ""}`}
            >
              <div
                className="notif-icon"
                style={{ background: `${n.color}20`, color: n.color }}
              >
                {n.icon}
              </div>
              <div className="notif-body">
                <div className="notif-title">{n.title}</div>
                <div className="notif-sub">{n.sub}</div>
                <div className="notif-time">{n.time}</div>
              </div>
              {n.unread && <div className="notif-dot" />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function TaskDetailPanel({ task, onClose, onStatusChange, tasks }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      av: "SR",
      color: "#a855f7",
      text: "Investigated the issue — looks like the JWT secret rotation is causing this.",
      time: "2h ago",
    },
    {
      av: "MK",
      color: "#3b82f6",
      text: "Can you check the Redis session store config too?",
      time: "1h ago",
    },
  ]);
  const addComment = () => {
    if (!comment.trim()) return;
    setComments([
      ...comments,
      { av: "MK", color: "#3b82f6", text: comment, time: "Just now" },
    ]);
    setComment("");
  };
  const getStatus = () => {
    if (tasks.todo.find((t) => t.id === task.id)) return "todo";
    if (tasks.inprog.find((t) => t.id === task.id)) return "inprog";
    return "done";
  };
  const status = getStatus();
  const statusColors = { todo: "#60a5fa", inprog: "#fbbf24", done: "#4ade80" };

  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <div className="task-detail-panel">
        <div className="tdp-header">
          <div>
            <div className="tdp-id">{task.id}</div>
            <div className="tdp-title">{task.title}</div>
          </div>
          <button className="np-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="tdp-body">
          <div className="tdp-row">
            <div className="tdp-field">
              <div className="tdp-field-label">Status</div>
              <select
                className="tdp-select"
                value={status}
                style={{ color: statusColors[status] }}
                onChange={(e) => onStatusChange(task, e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="inprog">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="tdp-field">
              <div className="tdp-field-label">Priority</div>
              <span className={`priority-pill p-${task.priority}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
            <div className="tdp-field">
              <div className="tdp-field-label">Assignee</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  className="task-av"
                  style={{
                    background: `linear-gradient(135deg,${task.color},${task.color}99)`,
                    width: 22,
                    height: 22,
                    fontSize: 9,
                  }}
                >
                  {task.assignee}
                </div>
                <span className="tdp-val">{task.assigneeName}</span>
              </div>
            </div>
            <div className="tdp-field">
              <div className="tdp-field-label">Due Date</div>
              <span
                className="tdp-val"
                style={{
                  color: task.priority === "high" ? "#ef4444" : "inherit",
                }}
              >
                📅 {task.due}
              </span>
            </div>
          </div>
          <div className="tdp-section">
            <div className="tdp-section-title">Progress — {task.progress}%</div>
            <div className="tdp-progress-bar">
              <div
                className="tdp-progress-fill"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
          <div className="tdp-section">
            <div className="tdp-section-title">Description</div>
            <div className="tdp-desc">
              {task.desc || "No description provided."}
            </div>
          </div>
          <div className="tdp-section">
            <div className="tdp-section-title">Tags</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {task.tags.map((t) => (
                <span key={t} className={`tag ${tagColor(t)}`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="tdp-section">
            <div className="tdp-section-title">
              Comments ({comments.length})
            </div>
            <div className="tdp-comments">
              {comments.map((c, i) => (
                <div key={i} className="tdp-comment">
                  <div
                    className="tdp-comment-av"
                    style={{
                      background: `linear-gradient(135deg,${c.color},${c.color}99)`,
                    }}
                  >
                    {c.av}
                  </div>
                  <div className="tdp-comment-body">
                    <div className="tdp-comment-text">{c.text}</div>
                    <div className="tdp-comment-time">{c.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="tdp-comment-input">
              <div
                className="tdp-comment-av"
                style={{
                  background: "linear-gradient(135deg,#3b82f6,#a855f7)",
                }}
              >
                MK
              </div>
              <input
                className="form-input"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addComment()}
              />
              <button
                className="btn btn-primary"
                style={{ padding: "6px 12px", fontSize: 12 }}
                onClick={addComment}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SprintHealth({ tasks }) {
  const total = tasks.todo.length + tasks.inprog.length + tasks.done.length;
  const done = tasks.done.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="sprint-health">
      <div className="sh-left">
        <div className="sh-label">Sprint 14 · Apr 1–14</div>
        <div className="sh-bar">
          <div className="sh-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="sh-meta">
          {done}/{total} tasks · 3 days left · {pct}% complete
        </div>
      </div>
      <div
        className={`sh-status ${pct >= 70 ? "good" : pct >= 40 ? "warn" : "risk"}`}
      >
        {pct >= 70 ? "On Track" : pct >= 40 ? "At Risk" : "Behind"}
      </div>
    </div>
  );
}

function TimelineView() {
  const statusColors = { todo: "#3b82f6", inprog: "#f59e0b", done: "#22c55e" };
  const statusLabels = { todo: "To Do", inprog: "In Progress", done: "Done" };
  const today = 10;
  return (
    <div className="timeline-view fade-up">
      <div className="section-header" style={{ marginBottom: 16 }}>
        <div className="section-label">Timeline — Sprint 14</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.entries(statusLabels).map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "var(--text2)",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: statusColors[k],
                }}
              />
              {v}
            </div>
          ))}
        </div>
      </div>
      <div className="tl-grid">
        <div className="tl-label-col" />
        <div className="tl-days">
          {DAYS.map((d, i) => (
            <div
              key={d}
              className={`tl-day ${i + 1 === today ? "tl-day--today" : ""}`}
            >
              {d.replace("Apr ", "")}
              {i + 1 === today && <div className="tl-today-line" />}
            </div>
          ))}
        </div>
      </div>
      {TIMELINE_ITEMS.map((item) => (
        <div key={item.id} className="tl-row">
          <div className="tl-label-col">
            <div className="tl-item-id">{item.id}</div>
            <div className="tl-item-title">{item.title}</div>
          </div>
          <div className="tl-days">
            {DAYS.map((_, i) => {
              const day = i + 1;
              const inRange = day >= item.start && day <= item.end;
              const isStart = day === item.start,
                isEnd = day === item.end;
              return (
                <div key={i} className="tl-cell">
                  {inRange && (
                    <div
                      className="tl-bar"
                      style={{
                        background: item.color,
                        borderRadius:
                          isStart && isEnd
                            ? 6
                            : isStart
                              ? "6px 0 0 6px"
                              : isEnd
                                ? "0 6px 6px 0"
                                : 0,
                        opacity: item.status === "done" ? 0.5 : 1,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportsPage({ tasks }) {
  const total = tasks.todo.length + tasks.inprog.length + tasks.done.length;
  const doneCount = tasks.done.length;
  const completion = total ? Math.round((doneCount / total) * 100) : 0;
  return (
    <div className="fade-up">
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.8px",
              color: "var(--text)",
            }}
          >
            Reports & Analytics
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)" }}>
            Sprint 14 — Apr 1 to Apr 14
          </div>
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 13 }}>
          Export PDF
        </button>
      </div>
      <div className="report-kpis">
        {[
          {
            label: "Sprint Velocity",
            val: "23 pts",
            sub: "vs 19 last sprint",
            color: "#3b82f6",
            icon: "⚡",
            trend: "up",
          },
          {
            label: "Completion Rate",
            val: `${completion}%`,
            sub: "tasks done",
            color: "#22c55e",
            icon: "✅",
            trend: "up",
          },
          {
            label: "Bugs Filed",
            val: "5",
            sub: "↓ 3 vs last sprint",
            color: "#ef4444",
            icon: "🐛",
            trend: "down",
          },
          {
            label: "Avg Cycle Time",
            val: "2.4d",
            sub: "per task",
            color: "#a855f7",
            icon: "⏱",
            trend: "neutral",
          },
          {
            label: "Team Satisfaction",
            val: "4.7/5",
            sub: "from last retro",
            color: "#f59e0b",
            icon: "⭐",
            trend: "up",
          },
          {
            label: "Blockers Resolved",
            val: "8",
            sub: "this sprint",
            color: "#14b8a6",
            icon: "🔓",
            trend: "up",
          },
        ].map((k) => (
          <div key={k.label} className="report-kpi">
            <div className="rkpi-icon">{k.icon}</div>
            <div className="rkpi-val" style={{ color: k.color }}>
              {k.val}
            </div>
            <div className="rkpi-label">{k.label}</div>
            <div className={`rkpi-sub ${k.trend}`}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="report-charts-row">
        <div className="chart-card">
          <div className="chart-title">Weekly Sprint Performance</div>
          <div className="chart-sub">Planned vs Done vs Bugs</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WEEKLY_REPORT} barSize={10}>
              <XAxis
                dataKey="week"
                tick={{ fontSize: 10, fill: "var(--text3)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--text3)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="planned"
                fill="#555c6e"
                radius={[3, 3, 0, 0]}
                name="Planned"
              />
              <Bar
                dataKey="done"
                fill="#3b82f6"
                radius={[3, 3, 0, 0]}
                name="Done"
              />
              <Bar
                dataKey="bugs"
                fill="#ef4444"
                radius={[3, 3, 0, 0]}
                name="Bugs"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-title">Team Radar Performance</div>
          <div className="chart-sub">By skill area this sprint</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={TEAM_PERF} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 9, fill: "var(--text3)" }}
              />
              <Radar
                name="Mark"
                dataKey="MK"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.15}
              />
              <Radar
                name="Sarah"
                dataKey="SR"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.15}
              />
              <Radar
                name="Jake"
                dataKey="JP"
                stroke="#14b8a6"
                fill="#14b8a6"
                fillOpacity={0.15}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-title">Cumulative Flow</div>
          <div className="chart-sub">Task distribution over time</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={TREND}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "var(--text3)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--text3)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                dataKey="created"
                stroke="#a855f7"
                fill="rgba(168,85,247,0.15)"
                name="Created"
              />
              <Area
                dataKey="completed"
                stroke="#22c55e"
                fill="rgba(34,197,94,0.15)"
                name="Completed"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function OwnerDashboard() {
  return (
    <div className="fade-up">
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="owner-page-crown">♛</div>
            <div
              style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}
            >
              Owner Dashboard
            </div>
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)" }}>
            Full organizational view — owners only
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-ghost" style={{ fontSize: 12 }}>
            Export Report
          </button>
          <button className="btn btn-primary" style={{ fontSize: 12 }}>
            + New Project
          </button>
        </div>
      </div>
      <div className="owner-kpis">
        {[
          {
            label: "Total Revenue",
            val: "$285,400",
            sub: "↑ +18% this quarter",
            color: "#22c55e",
            icon: "💰",
          },
          {
            label: "Active Projects",
            val: "4",
            sub: "2 on track, 2 at risk",
            color: "#3b82f6",
            icon: "📁",
          },
          {
            label: "Team Members",
            val: "12",
            sub: "4 online now",
            color: "#a855f7",
            icon: "👥",
          },
          {
            label: "Budget Used",
            val: "76%",
            sub: "$186.5k of $245k",
            color: "#f59e0b",
            icon: "📊",
          },
          {
            label: "Client NPS",
            val: "8.4",
            sub: "↑ from 7.9 last quarter",
            color: "#14b8a6",
            icon: "⭐",
          },
          {
            label: "Open Bugs",
            val: "5",
            sub: "↓ from 8 last sprint",
            color: "#ef4444",
            icon: "🐛",
          },
        ].map((k) => (
          <div key={k.label} className="owner-kpi-card">
            <div className="okpi-icon">{k.icon}</div>
            <div className="okpi-val" style={{ color: k.color }}>
              {k.val}
            </div>
            <div className="okpi-label">{k.label}</div>
            <div className="okpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="owner-charts-row">
        <div className="chart-card">
          <div className="chart-title">Revenue Trend</div>
          <div className="chart-sub">Monthly this year</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart
              data={[
                { month: "Jan", value: 42000 },
                { month: "Feb", value: 38000 },
                { month: "Mar", value: 55000 },
                { month: "Apr", value: 61000 },
                { month: "May", value: 58000 },
                { month: "Jun", value: 72000 },
              ]}
            >
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "var(--text3)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--text3)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                dataKey="value"
                stroke="#f59e0b"
                fill="rgba(245,158,11,0.15)"
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-title">Project Health</div>
          <div className="chart-sub">Status of active projects</div>
          {[
            { name: "Phoenix App", health: 92, color: "#22c55e" },
            { name: "Orion API", health: 78, color: "#f59e0b" },
            { name: "Nova UI", health: 95, color: "#3b82f6" },
            { name: "Atlas Backend", health: 64, color: "#ef4444" },
          ].map((p) => (
            <div key={p.name} style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 3,
                }}
              >
                <span style={{ color: "var(--text2)" }}>{p.name}</span>
                <span style={{ color: p.color, fontWeight: 700 }}>
                  {p.health}%
                </span>
              </div>
              <div className="tp-bar">
                <div
                  className="tp-fill"
                  style={{ width: `${p.health}%`, background: p.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Todo() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [activeFilter, setActiveFilter] = useState("all");
  const [view, setView] = useState("board");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [orgModal, setOrgModal] = useState(false);
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "medium",
    status: "todo",
    tags: "",
    desc: "",
    due: "",
  });
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [orgs, setOrgs] = useState(INITIAL_ORGS);
  const [newOrg, setNewOrg] = useState({ name: "", description: "" });
  const [modalStep, setModalStep] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [notifPanel, setNotifPanel] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [selectedTask, setSelectedTask] = useState(null);
  const dragRef = useRef(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light",
    );
  }, [darkMode]);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        setModal(true);
      }
      if (e.key === "Escape") {
        setModal(false);
        setInviteModal(false);
        setOrgModal(false);
        setSelectedTask(null);
        setNotifPanel(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const addToast = (msg, icon = "ℹ️", type = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, icon, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  const handleDragStart = (col, idx) => {
    dragRef.current = { col, idx };
  };
  const handleDrop = (targetCol) => {
    if (!dragRef.current || dragRef.current.col === targetCol) return;
    const { col, idx } = dragRef.current;
    const card = tasks[col][idx];
    setTasks((prev) => ({
      ...prev,
      [col]: prev[col].filter((_, i) => i !== idx),
      [targetCol]: [
        ...prev[targetCol],
        { ...card, progress: targetCol === "done" ? 100 : card.progress },
      ],
    }));
    addToast(
      `Moved to ${{ todo: "To Do", inprog: "In Progress", done: "Done" }[targetCol]}`,
      "✅",
      "success",
    );
    dragRef.current = null;
  };

  const createTask = () => {
    if (!newTask.title.trim()) {
      addToast("Please enter a task title", "⚠️", "warn");
      return;
    }
    const task = {
      id: `TASK-${Math.floor(Math.random() * 900 + 100)}`,
      title: newTask.title,
      priority: newTask.priority,
      tags: newTask.tags
        ? newTask.tags
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : ["general"],
      assignee: "MK",
      assigneeName: "Mark Kumar",
      due: newTask.due || "TBD",
      progress: 0,
      color: "#3b82f6",
      desc: newTask.desc,
    };
    setTasks((prev) => ({
      ...prev,
      [newTask.status]: [...prev[newTask.status], task],
    }));
    addToast(`"${newTask.title}" created!`, "🎉", "success");
    setModal(false);
    setModalStep(0);
    setNewTask({
      title: "",
      priority: "medium",
      status: "todo",
      tags: "",
      desc: "",
      due: "",
    });
  };

  const createOrgs = () => {
    navigate("/organization/:id");
  };

  const handleStatusChange = (task, newStatus) => {
    const oldStatus = ["todo", "inprog", "done"].find((s) =>
      tasks[s].find((t) => t.id === task.id),
    );
    if (!oldStatus || oldStatus === newStatus) return;
    setTasks((prev) => ({
      ...prev,
      [oldStatus]: prev[oldStatus].filter((t) => t.id !== task.id),
      [newStatus]: [
        ...prev[newStatus],
        { ...task, progress: newStatus === "done" ? 100 : task.progress },
      ],
    }));
    addToast(
      `Moved to ${{ todo: "To Do", inprog: "In Progress", done: "Done" }[newStatus]}`,
      "✅",
      "success",
    );
  };

  const sendInvite = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      addToast("Enter a valid email", "⚠️", "warn");
      return;
    }
    addToast(`Invite sent to ${inviteEmail}`, "📧", "success");
    setInviteEmail("");
    setInviteModal(false);
  };

  const createOrg = () => {};

  const handleLogout = async () => {
    try {
      await axios.post(
        api.logout_user_api,
        {},
        {
          withCredentials: true,
        },
      );

      localStorage.removeItem("AUTH-X");

      addToast("Logged out successfully", "👋", "info");

      // ⏳ wait 1 second then redirect
      setTimeout(() => {
        window.location.href = "/signup"; // or your route
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const filterTask = (task) => {
    if (search && !task.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (activeFilter === "high" && task.priority !== "high") return false;
    if (activeFilter === "mine" && task.assignee !== "MK") return false;
    if (
      ["backend", "frontend"].includes(activeFilter) &&
      !task.tags.includes(activeFilter)
    )
      return false;
    return true;
  };

  const colMeta = [
    { key: "todo", label: "To Do", color: "#3b82f6", labelColor: "#60a5fa" },
    {
      key: "inprog",
      label: "In Progress",
      color: "#f59e0b",
      labelColor: "#fbbf24",
    },
    { key: "done", label: "Done", color: "#22c55e", labelColor: "#4ade80" },
  ];
  const allTasks = [...tasks.todo, ...tasks.inprog, ...tasks.done];
  const statusLabel = { todo: "To Do", inprog: "In Progress", done: "Done" };
  const getTaskStatus = (task) => {
    if (tasks.todo.find((t) => t.id === task.id)) return "todo";
    if (tasks.inprog.find((t) => t.id === task.id)) return "inprog";
    return "done";
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <NotifPanel
        open={notifPanel}
        onClose={() => setNotifPanel(false)}
        notifications={notifications}
        onMarkRead={() =>
          setNotifications((n) => n.map((x) => ({ ...x, unread: false })))
        }
      />
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          tasks={tasks}
          onClose={() => setSelectedTask(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      <div className="app">
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-logo">
            <div className="logo-icon">⚡</div>
            <div>
              <div className="logo-text">ProBoard</div>
              <div className="logo-ver">v3.4.0 · World #1</div>
            </div>
          </div>
          <div style={{ padding: "0 12px 8px" }}>
            <SprintHealth tasks={tasks} />
          </div>
          <div className="sidebar-section">Navigation</div>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className={`nav-item ${activeNav === item.label ? "active" : ""}`}
              onClick={() => {
                setActiveNav(item.label);
                setSidebarOpen(false);
                if (item.label === "Notifications") setNotifPanel(true);
              }}
            >
              <div className={`nav-icon ${item.notif ? "notif-rel" : ""}`}>
                {item.icon}
                {item.notif && unreadCount > 0 && (
                  <div className="notif-dot">{unreadCount}</div>
                )}
              </div>
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </div>
          ))}
          <div
            className={`nav-item ${activeNav === "Owner" ? "active" : ""}`}
            onClick={() => {
              setActiveNav("Owner");
              setSidebarOpen(false);
            }}
          >
            <span className="nav-icon">♛</span>
            <span>Owner View</span>
            <span className="nav-badge owner-nav-badge">PRO</span>
          </div>
          <div className="sidebar-section">Projects</div>
          {PROJECTS.map((p) => (
            <div key={p.name} className="proj-item">
              <div className="proj-dot" style={{ background: p.color }} />
              <span>{p.name}</span>
              <span className="proj-task-count">{p.tasks}</span>
            </div>
          ))}
          <div className="sidebar-section">Team</div>
          <div
            className="nav-item"
            onClick={() => {
              setInviteModal(true);
              setSidebarOpen(false);
            }}
          >
            <span className="nav-icon">✉️</span> Invite via Email
          </div>
          <div
            className="nav-item"
            onClick={() => {
              setOrgModal(true);
              setSidebarOpen(false);
            }}
          >
            <span className="nav-icon">＋</span> New Organization
          </div>
          <div className="nav-item">
            <span className="nav-icon">⚙</span> Settings
          </div>
          <div className="sidebar-shortcut-hint">
            <div className="ssh-row">
              <kbd>K</kbd> Create task
            </div>
            <div className="ssh-row">
              <kbd>/</kbd> Quick search
            </div>
          </div>
          <div className="sidebar-bottom">
            <div className="user-row">
              <div
                className="avatar"
                style={{
                  background: "linear-gradient(135deg,#3b82f6,#a855f7)",
                }}
              >
                MK
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="user-name">Mark Kumar</div>
                <div className="user-role">
                  Lead Engineer ·{" "}
                  <span className="owner-badge-inline">♛ Owner</span>
                </div>
              </div>
              <button
                className="logout-icon-btn"
                title="Log out"
                onClick={handleLogout}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <button
              className="hamburger"
              onClick={() => setSidebarOpen((o) => !o)}
            >
              ☰
            </button>
            <div className="topbar-title">
              {activeNav === "Organizations"
                ? "Organizations"
                : activeNav === "Reports"
                  ? "Reports"
                  : activeNav === "Timeline"
                    ? "Timeline"
                    : activeNav === "Owner"
                      ? "Owner Dashboard"
                      : "Phoenix App"}
              {![
                "Organizations",
                "Reports",
                "Timeline",
                "Notifications",
                "Owner",
              ].includes(activeNav) && (
                <span className="sprint-badge">Sprint 14 · Apr 1–14</span>
              )}
              {activeNav === "Owner" && (
                <span className="sprint-badge owner-sprint-badge">
                  ♛ Owner Only
                </span>
              )}
            </div>
            <div className="search-box">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="icon-btn theme-btn"
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle theme"
            >
              {darkMode ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <button
              className={`icon-btn notif-btn ${unreadCount > 0 ? "has-notif" : ""}`}
              title="Notifications"
              onClick={() => setNotifPanel(!notifPanel)}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <div className="notif-badge">{unreadCount}</div>
              )}
            </button>
            <button className="btn btn-primary" onClick={() => setModal(true)}>
              ＋ Task
            </button>
            <UserMenu
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onLogout={handleLogout}
            />
          </div>

          <div className="content">
            {activeNav === "Timeline" && <TimelineView />}
            {activeNav === "Reports" && <ReportsPage tasks={tasks} />}
            {activeNav === "Owner" && <OwnerDashboard />}
            {activeNav === "Organizations" && (
              <div className="fade-up">
                <div className="section-header" style={{ marginBottom: 24 }}>
                  <div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: "var(--text)",
                      }}
                    >
                      Organizations
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text2)" }}>
                      Manage your teams and workspaces
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => createOrgs()}
                  >
                    ＋ New Organization
                  </button>
                </div>
                <div className="orgs-grid">
                  {orgs.map((org) => (
                    <div key={org.id} className="org-card">
                      <div className="org-card-top">
                        <div
                          className="org-avatar"
                          style={{
                            background: `linear-gradient(135deg,${org.color},${org.color}88)`,
                          }}
                        >
                          {org.avatar}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="org-name">{org.name}</div>
                          <div className="org-id">{org.id}</div>
                        </div>
                        <span
                          className={`org-plan plan-${org.plan.toLowerCase()}`}
                        >
                          {org.plan}
                        </span>
                      </div>
                      <div className="org-stats">
                        <div className="org-stat">
                          <span className="org-stat-val">{org.members}</span>
                          <span className="org-stat-label">Members</span>
                        </div>
                        <div className="org-stat">
                          <span className="org-stat-val">{org.projects}</span>
                          <span className="org-stat-label">Projects</span>
                        </div>
                      </div>
                      <div className="org-actions">
                        <button
                          className="btn btn-ghost"
                          style={{ fontSize: 12, flex: 1 }}
                          onClick={() => setInviteModal(true)}
                        >
                          ✉ Invite
                        </button>
                        <button
                          className="btn btn-ghost"
                          style={{ fontSize: 12, flex: 1 }}
                        >
                          ⚙ Manage
                        </button>
                      </div>
                    </div>
                  ))}
                  <div
                    className="org-card org-add-card"
                    onClick={() => createOrgs()}
                  >
                    <div className="org-add-inner">
                      <div className="org-add-icon">＋</div>
                      <div className="org-add-label">New Organization</div>
                      <div className="org-add-sub">Create a workspace</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {![
              "Timeline",
              "Reports",
              "Owner",
              "Organizations",
              "Notifications",
            ].includes(activeNav) && (
              <>
                <div className="section-header" style={{ marginBottom: 16 }}>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        letterSpacing: "-0.6px",
                        color: "var(--text)",
                      }}
                    >
                      {activeNav === "Board"
                        ? "Task Board"
                        : activeNav === "Backlog"
                          ? "Backlog"
                          : "Dashboard"}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: 12 }}
                      onClick={() => setInviteModal(true)}
                    >
                      ✉ Invite
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ fontSize: 12 }}
                      onClick={() => setModal(true)}
                    >
                      ＋ New Task
                    </button>
                  </div>
                </div>

                <div className="metrics">
                  {[
                    {
                      label: "Total Tasks",
                      val: allTasks.length,
                      sub: "+3 this week",
                      color: "#3b82f6",
                      trend: "up",
                      pct: 70,
                    },
                    {
                      label: "In Progress",
                      val: tasks.inprog.length,
                      sub: "2 due today",
                      color: "#f59e0b",
                      trend: "neutral",
                      pct: 45,
                    },
                    {
                      label: "Completed",
                      val: tasks.done.length,
                      sub: "↑ 2 vs yesterday",
                      color: "#22c55e",
                      trend: "up",
                      pct: 100,
                    },
                    {
                      label: "Overdue",
                      val: 1,
                      sub: "↓ from 2",
                      color: "#ef4444",
                      trend: "down",
                      pct: 20,
                    },
                  ].map((m) => (
                    <div key={m.label} className="metric-card">
                      <div className="metric-label">{m.label}</div>
                      <div className="metric-val" style={{ color: m.color }}>
                        {m.val}
                      </div>
                      <div className={`metric-sub ${m.trend}`}>{m.sub}</div>
                      <div className="metric-bar">
                        <div
                          className="metric-bar-fill"
                          style={{ width: `${m.pct}%`, background: m.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="filter-row">
                  {["all", "high", "mine", "backend", "frontend"].map((f) => (
                    <button
                      key={f}
                      className={`filter-chip ${activeFilter === f ? "active" : ""}`}
                      onClick={() => setActiveFilter(f)}
                    >
                      {f === "all"
                        ? "All"
                        : f === "high"
                          ? "High Priority"
                          : f === "mine"
                            ? "My Tasks"
                            : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                  <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                    {["board", "list"].map((v) => (
                      <button
                        key={v}
                        className={`view-btn ${view === v ? "active" : ""}`}
                        onClick={() => setView(v)}
                      >
                        {v === "board" ? "Board" : "List"}
                      </button>
                    ))}
                  </div>
                </div>

                {view === "board" && (
                  <div className="board">
                    {colMeta.map((col) => (
                      <div
                        key={col.key}
                        className="column"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(col.key)}
                      >
                        <div className="col-header">
                          <div
                            className="col-dot"
                            style={{ background: col.color }}
                          />
                          <div
                            className="col-label"
                            style={{ color: col.labelColor }}
                          >
                            {col.label}
                          </div>
                          <div className="col-count">
                            {tasks[col.key].filter(filterTask).length}
                          </div>
                          <button
                            className="col-add-btn"
                            onClick={() => setModal(true)}
                          >
                            ＋
                          </button>
                        </div>
                        <div className="cards">
                          {tasks[col.key]
                            .filter(filterTask)
                            .map((task, idx) => (
                              <TaskCard
                                key={task.id}
                                task={task}
                                onDragStart={() =>
                                  handleDragStart(col.key, idx)
                                }
                                onClick={() => setSelectedTask(task)}
                              />
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {view === "list" && (
                  <div
                    className="chart-card fade-up"
                    style={{ marginBottom: 24, overflowX: "auto" }}
                  >
                    <table className="list-table">
                      <thead>
                        <tr>
                          <th>Task</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th>Assignee</th>
                          <th>Due</th>
                          <th>Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allTasks.filter(filterTask).map((task) => (
                          <tr
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            style={{ cursor: "pointer" }}
                          >
                            <td>
                              <div style={{ fontWeight: 600, fontSize: 12 }}>
                                {task.title}
                              </div>
                              <div
                                style={{
                                  fontSize: 10,
                                  color: "var(--text3)",
                                  fontFamily: "var(--mono)",
                                }}
                              >
                                {task.id}
                              </div>
                            </td>
                            <td>
                              <span
                                className={`priority-pill p-${task.priority}`}
                              >
                                {task.priority}
                              </span>
                            </td>
                            <td>
                              <span
                                style={{ fontSize: 11, color: "var(--text2)" }}
                              >
                                {statusLabel[getTaskStatus(task)]}
                              </span>
                            </td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                }}
                              >
                                <div
                                  className="task-av"
                                  style={{
                                    background: `linear-gradient(135deg,${task.color},${task.color}99)`,
                                    width: 20,
                                    height: 20,
                                    fontSize: 8,
                                  }}
                                >
                                  {task.assignee}
                                </div>
                                <span style={{ fontSize: 11 }}>
                                  {task.assigneeName}
                                </span>
                              </div>
                            </td>
                            <td style={{ fontSize: 11, color: "var(--text2)" }}>
                              {task.due}
                            </td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                }}
                              >
                                <div className="tp-bar" style={{ flex: 1 }}>
                                  <div
                                    className="tp-fill"
                                    style={{ width: `${task.progress}%` }}
                                  />
                                </div>
                                <span
                                  style={{
                                    fontSize: 10,
                                    color: "var(--text3)",
                                    minWidth: 28,
                                  }}
                                >
                                  {task.progress}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeNav === "Dashboard" && (
                  <>
                    <div className="charts-row fade-up">
                      <div className="chart-card">
                        <div className="chart-title">Burndown Chart</div>
                        <div className="chart-sub">
                          Ideal vs Actual velocity
                        </div>
                        <ResponsiveContainer width="100%" height={180}>
                          <LineChart data={BURNDOWN}>
                            <XAxis
                              dataKey="day"
                              tick={{ fontSize: 10, fill: "var(--text3)" }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              tick={{ fontSize: 10, fill: "var(--text3)" }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                              dataKey="ideal"
                              stroke="var(--border-strong)"
                              strokeDasharray="5 5"
                              dot={false}
                              strokeWidth={1.5}
                              name="Ideal"
                            />
                            <Line
                              dataKey="actual"
                              stroke="#3b82f6"
                              dot={{ fill: "#3b82f6", r: 3 }}
                              strokeWidth={2}
                              name="Actual"
                              connectNulls={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="chart-card">
                        <div className="chart-title">Task Split</div>
                        <div className="chart-sub">By type this sprint</div>
                        <div className="legend">
                          {TASK_SPLIT.map((s) => (
                            <div key={s.name} className="legend-item">
                              <div
                                className="legend-dot"
                                style={{ background: s.color }}
                              />
                              {s.name} {s.value}%
                            </div>
                          ))}
                        </div>
                        <ResponsiveContainer width="100%" height={130}>
                          <PieChart>
                            <Pie
                              data={TASK_SPLIT}
                              dataKey="value"
                              innerRadius="55%"
                              outerRadius="80%"
                              paddingAngle={2}
                            >
                              {TASK_SPLIT.map((s) => (
                                <Cell key={s.name} fill={s.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="chart-card">
                        <div className="chart-title">Daily Completions</div>
                        <div className="chart-sub">Tasks created vs closed</div>
                        <ResponsiveContainer width="100%" height={160}>
                          <BarChart data={DAILY} barSize={10}>
                            <XAxis
                              dataKey="day"
                              tick={{ fontSize: 10, fill: "var(--text3)" }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              tick={{ fontSize: 10, fill: "var(--text3)" }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                              dataKey="created"
                              fill="#555c6e"
                              radius={[3, 3, 0, 0]}
                              name="Created"
                            />
                            <Bar
                              dataKey="done"
                              fill="#3b82f6"
                              radius={[3, 3, 0, 0]}
                              name="Completed"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bottom-row fade-up">
                      <div className="panel">
                        <div className="panel-title">
                          Upcoming Deadlines{" "}
                          <span className="panel-action">View all →</span>
                        </div>
                        {DEADLINES.map((d) => (
                          <div key={d.id} className="dl-item">
                            <div
                              className="dl-dot"
                              style={{ background: d.dot }}
                            />
                            <div className="dl-info">
                              <div className="dl-name">{d.name}</div>
                              <div className="dl-id">{d.id}</div>
                            </div>
                            <div className="dl-date">{d.date}</div>
                            <span
                              className="dl-badge"
                              style={{
                                background: d.statusBg,
                                color: d.statusColor,
                              }}
                            >
                              {d.status}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="panel">
                        <div className="panel-title">
                          Team Activity{" "}
                          <span className="panel-action">View all →</span>
                        </div>
                        {TEAM_ACTIVITY.map((m, i) => (
                          <div key={i} className="team-item">
                            <div className="team-av-wrap">
                              <div
                                className="team-av"
                                style={{ background: m.color }}
                              >
                                {m.av}
                              </div>
                              {m.online && <div className="online-dot" />}
                            </div>
                            <div className="team-info">
                              <div className="team-name">{m.name}</div>
                              <div className="team-sub">{m.sub}</div>
                            </div>
                            <div className="team-time">{m.time}</div>
                          </div>
                        ))}
                      </div>
                      <div className="panel">
                        <div className="panel-title">
                          Team Velocity{" "}
                          <span className="panel-action">This sprint</span>
                        </div>
                        {VELOCITY.map((v) => (
                          <div key={v.label} className="vel-item">
                            <div className="vel-label">{v.label}</div>
                            <div className="vel-track">
                              <div
                                className="vel-fill"
                                style={{
                                  width: `${v.pct}%`,
                                  background: v.color,
                                }}
                              />
                            </div>
                            <div className="vel-count">{v.count}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="activity-row fade-up">
                      <div className="panel">
                        <div className="panel-title">
                          Activity Feed{" "}
                          <span className="panel-action">Mark all read →</span>
                        </div>
                        {ACTIVITY_FEED.map((a, i) => (
                          <div key={i} className="activity-item">
                            <div
                              className="activity-icon"
                              style={{ background: a.bg }}
                            >
                              {a.icon}
                            </div>
                            <div>
                              <div className="activity-text">{a.text}</div>
                              <div className="activity-time">{a.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="panel">
                        <div className="panel-title">
                          Trend Analysis{" "}
                          <span className="panel-action">Weekly</span>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={TREND}>
                            <XAxis
                              dataKey="day"
                              tick={{ fontSize: 10, fill: "var(--text3)" }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis
                              tick={{ fontSize: 10, fill: "var(--text3)" }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                              dataKey="created"
                              stroke="#a855f7"
                              dot={false}
                              strokeWidth={2}
                              name="Created"
                            />
                            <Line
                              dataKey="completed"
                              stroke="#22c55e"
                              dot={false}
                              strokeWidth={2}
                              name="Completed"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* CREATE TASK MODAL */}
      {modal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModal(false);
              setModalStep(0);
            }
          }}
        >
          <div className="modal modal-animated">
            <div className="modal-glow" />
            <div className="modal-title-row">
              <div>
                <div className="modal-title">
                  {modalStep === 0
                    ? "✨ Create New Task"
                    : modalStep === 1
                      ? "🏷️ Tags & Details"
                      : "🚀 Ready to Launch"}
                </div>
                <div className="modal-steps">
                  {[0, 1, 2].map((s) => (
                    <div
                      key={s}
                      className={`modal-step-dot ${modalStep >= s ? "active" : ""}`}
                    />
                  ))}
                </div>
              </div>
              <button
                className="modal-close"
                onClick={() => {
                  setModal(false);
                  setModalStep(0);
                }}
              >
                ✕
              </button>
            </div>
            {modalStep === 0 && (
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Task Title *</label>
                  <input
                    className="form-input form-input-xl"
                    placeholder="What needs to be done?"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    placeholder="Add more context..."
                    rows={3}
                    value={newTask.desc}
                    onChange={(e) =>
                      setNewTask({ ...newTask, desc: e.target.value })
                    }
                    style={{ resize: "none" }}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <div className="priority-select">
                      {["high", "medium", "low"].map((p) => (
                        <div
                          key={p}
                          className={`priority-opt ${newTask.priority === p ? "selected" : ""} p-${p}`}
                          onClick={() =>
                            setNewTask({ ...newTask, priority: p })
                          }
                        >
                          <span className="priority-dot" />
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-input"
                      value={newTask.status}
                      onChange={(e) =>
                        setNewTask({ ...newTask, status: e.target.value })
                      }
                    >
                      <option value="todo">To Do</option>
                      <option value="inprog">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      setModal(false);
                      setModalStep(0);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => setModalStep(1)}
                  >
                    Next: Details →
                  </button>
                </div>
              </div>
            )}
            {modalStep === 1 && (
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    className="form-input"
                    placeholder="e.g. bug, frontend, api"
                    value={newTask.tags}
                    onChange={(e) =>
                      setNewTask({ ...newTask, tags: e.target.value })
                    }
                  />
                  {newTask.tags && (
                    <div className="tag-preview">
                      {newTask.tags
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .map((t) => (
                          <span key={t} className={`tag ${tagColor(t)}`}>
                            {t}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={newTask.due}
                    onChange={(e) =>
                      setNewTask({ ...newTask, due: e.target.value })
                    }
                  />
                </div>
                <div className="modal-actions">
                  <button
                    className="btn btn-ghost"
                    onClick={() => setModalStep(0)}
                  >
                    ← Back
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => setModalStep(2)}
                  >
                    Review →
                  </button>
                </div>
              </div>
            )}
            {modalStep === 2 && (
              <div className="modal-body">
                <div className="confirm-task">
                  {[
                    ["Title", newTask.title || "—"],
                    ["Due", newTask.due || "TBD"],
                    ["Status", statusLabel[newTask.status]],
                  ].map(([k, v]) => (
                    <div key={k} className="confirm-row">
                      <span className="confirm-label">{k}</span>
                      <span className="confirm-val">{v}</span>
                    </div>
                  ))}
                  <div className="confirm-row">
                    <span className="confirm-label">Priority</span>
                    <span className={`priority-pill p-${newTask.priority}`}>
                      {newTask.priority.charAt(0).toUpperCase() +
                        newTask.priority.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="modal-actions">
                  <button
                    className="btn btn-ghost"
                    onClick={() => setModalStep(1)}
                  >
                    ← Back
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={createTask}
                  >
                    🚀 Create Task
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INVITE MODAL */}
      {inviteModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setInviteModal(false);
          }}
        >
          <div className="modal modal-animated" style={{ maxWidth: 420 }}>
            <div className="modal-glow" />
            <div className="modal-title-row">
              <div className="modal-title">✉️ Invite Team Member</div>
              <button
                className="modal-close"
                onClick={() => setInviteModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && sendInvite()}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-input"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                >
                  <option value="viewer">Viewer</option>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  className="btn btn-ghost"
                  onClick={() => setInviteModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary btn-lg" onClick={sendInvite}>
                  Send Invite →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORG MODAL */}
      {orgModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOrgModal(false);
          }}
        >
          <div className="modal modal-animated" style={{ maxWidth: 420 }}>
            <div className="modal-glow" />
            <div className="modal-title-row">
              <div className="modal-title">🏢 New Organization</div>
              <button
                className="modal-close"
                onClick={() => setOrgModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Organization Name *</label>
                <input
                  className="form-input form-input-xl"
                  placeholder="e.g. Acme Engineering"
                  value={newOrg.name}
                  onChange={(e) =>
                    setNewOrg({ ...newOrg, name: e.target.value })
                  }
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && createOrg()}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  placeholder="What does this organization do?"
                  rows={3}
                  value={newOrg.description}
                  onChange={(e) =>
                    setNewOrg({ ...newOrg, description: e.target.value })
                  }
                  style={{ resize: "none" }}
                />
              </div>
              <div className="modal-actions">
                <button
                  className="btn btn-ghost"
                  onClick={() => setOrgModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary btn-lg" onClick={createOrg}>
                  Create Organization
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOASTS */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon">{t.icon}</span>
            {t.msg}
          </div>
        ))}
      </div>

      <UnderConstructionToast />
    </>
  );
}
