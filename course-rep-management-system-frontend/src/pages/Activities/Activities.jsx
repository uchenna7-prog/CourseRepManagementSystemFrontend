import React, { useState, useEffect } from "react";
import styles from "./Activities.module.css";
import { User, Users, ClipboardList, Calendar, LogOut, Menu, Plus, Trash2, Search, FileText, X } from "lucide-react";

const Activities = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("activities");
  const [isMobile, setIsMobile] = useState(false);
  
  // Activities state
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    activityName: "",
    description: ""
  });

  // Sample data
  const courseRepName = "Chukwudi Okafor";

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

  // Fetch all activities
  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/activities/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch activities');
      
      const data = await response.json();
      setActivities(data.activities);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new activity
  const handleCreateActivity = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const courseRepId = localStorage.getItem('courseRepId');
      
      const response = await fetch('/api/activities/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseRepId: courseRepId,
          activityName: formData.activityName,
          description: formData.description
        })
      });

      if (!response.ok) throw new Error('Failed to create activity');
      
      const data = await response.json();
      
      setFormData({ activityName: "", description: "" });
      setShowCreateModal(false);
      fetchActivities();
      alert(data.message);
    } catch (err) {
      setError(err.message);
      console.error('Error creating activity:', err);
    }
  };

  // Delete activity
  const handleDeleteActivity = async (activityName) => {
    if (!window.confirm(`Are you sure you want to delete "${activityName}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/activities/${activityName}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete activity');
      
      const data = await response.json();
      fetchActivities();
      alert(data.message);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting activity:', err);
    }
  };

  // View activity details
  const handleViewActivity = async (activityName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/activities/${activityName}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Activity not found');
      
      const data = await response.json();
      setSelectedActivity(data.activity);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching activity:', err);
    }
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Filter activities based on search
  const filteredActivities = activities.filter(activity =>
    activity.activityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1>Activities</h1>
          </div>
          <div className={styles.userProfile}>
            <User size={24} />
            <span className={styles.userName}>{courseRepName}</span>
          </div>
        </header>

        {/* Search and Create Button */}
        <div className={styles.actionBar}>
          <div className={styles.searchBar}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button 
            className={styles.createButton}
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} />
            <span>Create Activity</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className={styles.loading}>Loading activities...</div>
        ) : (
          <>
            {/* Activities Grid */}
            {filteredActivities.length === 0 ? (
              <div className={styles.emptyState}>
                <Calendar size={64} className={styles.emptyIcon} />
                <h3>No activities found</h3>
                <p>Create your first activity to get started</p>
              </div>
            ) : (
              <div className={styles.activitiesGrid}>
                {filteredActivities.map((activity) => (
                  <div 
                    key={activity.id} 
                    className={styles.activityCard}
                    onClick={() => handleViewActivity(activity.activityName)}
                  >
                    <div className={styles.cardHeader}>
                      <FileText size={24} className={styles.cardIcon} />
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteActivity(activity.activityName);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h3 className={styles.cardTitle}>{activity.activityName}</h3>
                    <p className={styles.cardDescription}>{activity.description}</p>
                    <div className={styles.cardFooter}>
                      <span className={styles.date}>
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Create Activity Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Create New Activity</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowCreateModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateActivity} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="activityName">Activity Name</label>
                <input
                  type="text"
                  id="activityName"
                  value={formData.activityName}
                  onChange={(e) => setFormData({...formData, activityName: e.target.value})}
                  placeholder="e.g., Morning Attendance"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe this activity..."
                  rows="4"
                  required
                />
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Create Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className={styles.modalOverlay} onClick={() => setSelectedActivity(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{selectedActivity.activityName}</h2>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedActivity(null)}
              >
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailItem}>
                <strong>Description:</strong>
                <p>{selectedActivity.description}</p>
              </div>
              <div className={styles.detailItem}>
                <strong>Created:</strong>
                <p>{new Date(selectedActivity.createdAt).toLocaleString()}</p>
              </div>
              {selectedActivity.updatedAt && (
                <div className={styles.detailItem}>
                  <strong>Last Updated:</strong>
                  <p>{new Date(selectedActivity.updatedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
            <div className={styles.formActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setSelectedActivity(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;