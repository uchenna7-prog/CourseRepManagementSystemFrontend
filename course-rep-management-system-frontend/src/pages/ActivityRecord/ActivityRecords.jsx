import React, { useState, useEffect } from "react";
import styles from "./ActivityRecords.module.css";
import { User, Users, ClipboardList, Calendar, LogOut, Menu, Plus, Trash2, Search, FileText, X, Eye } from "lucide-react";

const ActivityRecords = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("activities");
  const [isMobile, setIsMobile] = useState(false);
  
  // Activity Records state
  const [records, setRecords] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    activityId: "",
    title: "",
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

  // Fetch all records and activities
  useEffect(() => {
    fetchRecords();
    fetchActivities();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/activity-records/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch records');
      
      const data = await response.json();
      setRecords(data.records);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
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
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };

  // Create new record
  const handleCreateRecord = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/activity-records/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          activityId: parseInt(formData.activityId),
          title: formData.title,
          description: formData.description
        })
      });

      if (!response.ok) throw new Error('Failed to create record');
      
      const data = await response.json();
      
      setFormData({ activityId: "", title: "", description: "" });
      setShowCreateModal(false);
      fetchRecords();
      alert(data.message);
    } catch (err) {
      setError(err.message);
      console.error('Error creating record:', err);
    }
  };

  // Delete record
  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm(`Are you sure you want to delete this record?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/activity-records/${recordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete record');
      
      const data = await response.json();
      fetchRecords();
      alert(data.message);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting record:', err);
    }
  };

  // View record details
  const handleViewRecord = async (recordId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/activity-records/${recordId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Record not found');
      
      const data = await response.json();
      setSelectedRecord(data.record);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching record:', err);
    }
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Filter records based on search
  const filteredRecords = records.filter(record =>
    record.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get activity name by ID
  const getActivityName = (activityId) => {
    const activity = activities.find(a => a.id === activityId);
    return activity ? activity.activityName : 'Unknown Activity';
  };

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
            <h1>Activity Records</h1>
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
              placeholder="Search records..."
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
            <span>New Record</span>
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
          <div className={styles.loading}>Loading records...</div>
        ) : (
          <>
            {/* Records Table */}
            {filteredRecords.length === 0 ? (
              <div className={styles.emptyState}>
                <FileText size={64} className={styles.emptyIcon} />
                <h3>No records found</h3>
                <p>Create your first activity record to get started</p>
              </div>
            ) : (
              <div className={styles.tableSection}>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Activity</th>
                        <th>Description</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((record) => (
                        <tr key={record.id}>
                          <td className={styles.titleCell}>{record.title}</td>
                          <td>
                            <span className={styles.badge}>
                              {getActivityName(record.activityId)}
                            </span>
                          </td>
                          <td className={styles.descriptionCell}>
                            {record.description}
                          </td>
                          <td className={styles.dateCell}>
                            {new Date(record.createdAt).toLocaleDateString()}
                          </td>
                          <td className={styles.actionsCell}>
                            <button
                              className={styles.viewButton}
                              onClick={() => handleViewRecord(record.id)}
                              title="View details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => handleDeleteRecord(record.id)}
                              title="Delete record"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Create Record Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Create Activity Record</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowCreateModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateRecord} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="activityId">Activity</label>
                <select
                  id="activityId"
                  value={formData.activityId}
                  onChange={(e) => setFormData({...formData, activityId: e.target.value})}
                  required
                >
                  <option value="">Select an activity</option>
                  {activities.map((activity) => (
                    <option key={activity.id} value={activity.id}>
                      {activity.activityName}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Week 1 Attendance"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe this record..."
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
                  Create Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className={styles.modalOverlay} onClick={() => setSelectedRecord(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{selectedRecord.title}</h2>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedRecord(null)}
              >
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailItem}>
                <strong>Activity:</strong>
                <p>{getActivityName(selectedRecord.activityId)}</p>
              </div>
              <div className={styles.detailItem}>
                <strong>Description:</strong>
                <p>{selectedRecord.description}</p>
              </div>
              <div className={styles.detailItem}>
                <strong>Created:</strong>
                <p>{new Date(selectedRecord.createdAt).toLocaleString()}</p>
              </div>
              {selectedRecord.updatedAt && (
                <div className={styles.detailItem}>
                  <strong>Last Updated:</strong>
                  <p>{new Date(selectedRecord.updatedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
            <div className={styles.formActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setSelectedRecord(null)}
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

export default ActivityRecords;