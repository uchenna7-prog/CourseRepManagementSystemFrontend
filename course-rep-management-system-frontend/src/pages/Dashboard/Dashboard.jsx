import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { User, Users, ClipboardList, Calendar, LogOut, Menu, Plus, X } from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Sample data
  const courseRepName = "Chukwudi Okafor";
  const totalCoursemates = 45;
  const totalActivities = 12;
  const recentActivities = [
    {
      id: 1,
      title: "Morning Attendance",
      type: "attendance",
      date: "2026-01-17",
      present: 42,
      absent: 3
    },
    {
      id: 2,
      title: "Assignment 3 Submission",
      type: "assignment_submission",
      date: "2026-01-16",
      submitted: 38,
      notSubmitted: 7
    },
    {
      id: 3,
      title: "Lab Session Attendance",
      type: "attendance",
      date: "2026-01-15",
      present: 40,
      absent: 5
    }
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.logo}>CourseRep</h2>
          <button
            className={styles.closeButton}
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li 
              className={activeTab === "overview" ? styles.active : ""}
              onClick={() => handleNavClick("overview")}
            >
              <Calendar size={20} />
              <span>Overview</span>
            </li>
            <li 
              className={activeTab === "coursemates" ? styles.active : ""}
              onClick={() => handleNavClick("coursemates")}
            >
              <Users size={20} />
              <span>Coursemates</span>
            </li>
            <li 
              className={activeTab === "activities" ? styles.active : ""}
              onClick={() => handleNavClick("activities")}
            >
              <ClipboardList size={20} />
              <span>Activities</span>
            </li>
          </ul>
        </nav>
        <button className={styles.logoutButton}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              className={styles.menuButton}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1>Dashboard</h1>
          </div>
          <div className={styles.userProfile}>
            <User size={24} />
            <span className={styles.userName}>{courseRepName}</span>
          </div>
        </header>

        {/* Stats Cards */}
        <section className={styles.cards}>
          <div className={styles.card}>
            <h3>Total Coursemates</h3>
            <p>{totalCoursemates}</p>
          </div>
          <div className={styles.card}>
            <h3>Total Activities</h3>
            <p>{totalActivities}</p>
          </div>
          <div className={styles.card}>
            <h3>This Week</h3>
            <p>5</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className={styles.quickActions}>
          <button className={styles.actionButton}>
            <Plus size={18} />
            <span>New Activity</span>
          </button>
          <button className={`${styles.actionButton} ${styles.secondary}`}>
            <Users size={18} />
            <span>Add Coursemate</span>
          </button>
        </section>

        {/* Recent Activities Table */}
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
                {recentActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td>{activity.title}</td>
                    <td>
                      <span className={styles.badge}>
                        {activity.type === "attendance" ? "Attendance" : "Assignment"}
                      </span>
                    </td>
                    <td>{activity.date}</td>
                    <td>
                      {activity.type === "attendance" ? (
                        <span className={styles.statusText}>
                          {activity.present} Present, {activity.absent} Absent
                        </span>
                      ) : (
                        <span className={styles.statusText}>
                          {activity.submitted} Submitted, {activity.notSubmitted} Pending
                        </span>
                      )}
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

export default Dashboard;