import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  User,
  Users,
  ClipboardList,
  Calendar,
  LogOut,
  Menu,
  Plus,
  X,
} from "lucide-react";

import styles from "./Dashboard.module.css";
import { useAuth } from "../../auth/useAuth";

const API_BASE = "http://127.0.0.1:5000";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logoutUser, accessToken } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [coursemateCount, setCoursemateCount] = useState(0);

  /* ================= RESPONSIVENESS ================= */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= FETCH COURSE MATES COUNT ================= */
  useEffect(() => {
    const fetchCoursemates = async () => {
      try {
        const res = await fetch(`${API_BASE}/coursemates/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch coursemates");

        const data = await res.json();
        setCoursemateCount(data.courseMates?.length || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCoursemates();
  }, [accessToken]);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await logoutUser();
    navigate("/", { replace: true });
  };

  /* ================= SAMPLE ACTIVITY DATA (UNCHANGED) ================= */
  const recentActivities = [
    {
      id: 1,
      title: "Morning Attendance",
      type: "attendance",
      date: "2026-01-17",
      present: 42,
      absent: 3,
    },
    {
      id: 2,
      title: "Assignment 3 Submission",
      type: "assignment",
      date: "2026-01-16",
      submitted: 38,
      pending: 7,
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          sidebarOpen ? styles.open : styles.closed
        }`}
      >
        <div className={styles.sidebarHeader}>
          <h2 className={styles.logo}>RepTrack</h2>
          {isMobile && (
            <button
              className={styles.closeButton}
              onClick={() => setSidebarOpen(false)}
            >
              <X size={22} />
            </button>
          )}
        </div>

        <nav className={styles.nav}>
          <NavLink to="/dashboard" className={styles.navItem}>
            <Calendar size={20} />
            <span>Overview</span>
          </NavLink>

          <NavLink to="/coursemates" className={styles.navItem}>
            <Users size={20} />
            <span>Coursemates</span>
          </NavLink>

          <NavLink to="/activities" className={styles.navItem}>
            <ClipboardList size={20} />
            <span>Activities</span>
          </NavLink>
        </nav>

        <button className={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main content */}
      <main className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            {isMobile && (
              <button
                className={styles.menuButton}
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
            )}
            <h1>Dashboard</h1>
          </div>

          <div className={styles.userProfile}>
            <User size={22} />
            <span className={styles.userName}>
              {user?.firstName} {user?.lastName}
            </span>
          </div>
        </header>

        {/* Stats cards */}
        <section className={styles.cards}>
          <StatCard title="Total Coursemates" value={coursemateCount} />
          <StatCard title="Total Activities" value={12} />
          <StatCard title="This Week" value={5} />
        </section>

        {/* Quick actions */}
        <section className={styles.quickActions}>
          <button className={styles.actionButton}>
            <Plus size={18} />
            <span>New Activity</span>
          </button>

          <button
            className={`${styles.actionButton} ${styles.secondary}`}
            onClick={() => navigate("/coursemates")}
          >
            <Users size={18} />
            <span>Add Coursemate</span>
          </button>
        </section>

        {/* Recent activities table */}
        <section className={styles.tableSection}>
          <h2>Recent Activities</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((a) => (
                  <tr key={a.id}>
                    <td>{a.title}</td>
                    <td>
                      <span className={styles.badge}>
                        {a.type === "attendance"
                          ? "Attendance"
                          : "Assignment"}
                      </span>
                    </td>
                    <td>{a.date}</td>
                    <td className={styles.statusText}>
                      {a.type === "attendance"
                        ? `${a.present} Present, ${a.absent} Absent`
                        : `${a.submitted} Submitted, ${a.pending} Pending`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className={styles.card}>
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

export default Dashboard;
