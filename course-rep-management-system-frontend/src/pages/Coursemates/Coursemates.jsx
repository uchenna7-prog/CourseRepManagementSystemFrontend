import React, { useState, useEffect } from "react";
import styles from "./Coursemates.module.css";
import { User, Users, ClipboardList, Calendar, LogOut, Menu, Plus, Trash2, Search, Eye, X, Mail, Hash } from "lucide-react";

const Coursemates = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("coursemates");
  const [isMobile, setIsMobile] = useState(false);
  
  // Coursemates state
  const [coursemates, setCoursemates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCoursemate, setSelectedCoursemate] = useState(null);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    matNumber: ""
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

  // Fetch all coursemates
  useEffect(() => {
    fetchCoursemates();
  }, []);

  const fetchCoursemates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/coursemates/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch coursemates');
      
      const data = await response.json();
      setCoursemates(data.courseMates);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching coursemates:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search coursemates
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      fetchCoursemates();
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/coursemates/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setCoursemates(data.courseMates);
    } catch (err) {
      setError(err.message);
      console.error('Error searching coursemates:', err);
    }
  };

  // Add new coursemate
  const handleAddCoursemate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/coursemates/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          middleName: formData.middleName || null,
          lastName: formData.lastName,
          email: formData.email,
          matNumber: formData.matNumber
        })
      });

      if (!response.ok) throw new Error('Failed to add coursemate');
      
      const data = await response.json();
      
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        matNumber: ""
      });
      setShowAddModal(false);
      fetchCoursemates();
      alert(data.message);
    } catch (err) {
      setError(err.message);
      console.error('Error adding coursemate:', err);
    }
  };

  // Delete coursemate
  const handleDeleteCoursemate = async (coursemateId, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/coursemates/${coursemateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete coursemate');
      
      const data = await response.json();
      fetchCoursemates();
      alert(data.message);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting coursemate:', err);
    }
  };

  // View coursemate details
  const handleViewCoursemate = async (coursemateId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/coursemates/${coursemateId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Coursemate not found');
      
      const data = await response.json();
      setSelectedCoursemate(data.courseMate);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching coursemate:', err);
    }
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setSidebarOpen(false);
    }
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
            <h1>Coursemates</h1>
          </div>
          <div className={styles.userProfile}>
            <User size={24} />
            <span className={styles.userName}>{courseRepName}</span>
          </div>
        </header>

        {/* Stats */}
        <div className={styles.statsCard}>
          <div className={styles.statItem}>
            <Users size={32} className={styles.statIcon} />
            <div>
              <p className={styles.statLabel}>Total Coursemates</p>
              <p className={styles.statValue}>{coursemates.length}</p>
            </div>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className={styles.actionBar}>
          <div className={styles.searchBar}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name, email, or mat number..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button 
            className={styles.addButton}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} />
            <span>Add Coursemate</span>
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
          <div className={styles.loading}>Loading coursemates...</div>
        ) : (
          <>
            {/* Coursemates Table */}
            {coursemates.length === 0 ? (
              <div className={styles.emptyState}>
                <Users size={64} className={styles.emptyIcon} />
                <h3>No coursemates found</h3>
                <p>Add your first coursemate to get started</p>
              </div>
            ) : (
              <div className={styles.tableSection}>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Mat Number</th>
                        <th>Email</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coursemates.map((coursemate) => (
                        <tr key={coursemate.id}>
                          <td className={styles.nameCell}>
                            <div className={styles.nameWrapper}>
                              <div className={styles.avatar}>
                                {coursemate.firstName.charAt(0)}{coursemate.lastName.charAt(0)}
                              </div>
                              <div>
                                <div className={styles.fullName}>
                                  {coursemate.firstName} {coursemate.middleName ? coursemate.middleName + ' ' : ''}{coursemate.lastName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={styles.matNumber}>
                              <Hash size={14} />
                              {coursemate.matNumber}
                            </span>
                          </td>
                          <td className={styles.emailCell}>
                            <Mail size={14} className={styles.emailIcon} />
                            {coursemate.email}
                          </td>
                          <td className={styles.actionsCell}>
                            <button
                              className={styles.viewButton}
                              onClick={() => handleViewCoursemate(coursemate.id)}
                              title="View details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => handleDeleteCoursemate(
                                coursemate.id, 
                                `${coursemate.firstName} ${coursemate.lastName}`
                              )}
                              title="Delete coursemate"
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

      {/* Add Coursemate Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Add Coursemate</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowAddModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddCoursemate} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="e.g., John"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="middleName">Middle Name (Optional)</label>
                  <input
                    type="text"
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                    placeholder="e.g., Paul"
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  placeholder="e.g., Doe"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="e.g., john.doe@example.com"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="matNumber">Matriculation Number</label>
                <input
                  type="text"
                  id="matNumber"
                  value={formData.matNumber}
                  onChange={(e) => setFormData({...formData, matNumber: e.target.value})}
                  placeholder="e.g., 2020/12345"
                  required
                />
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Add Coursemate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coursemate Details Modal */}
      {selectedCoursemate && (
        <div className={styles.modalOverlay} onClick={() => setSelectedCoursemate(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Coursemate Details</h2>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedCoursemate(null)}
              >
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailAvatar}>
                {selectedCoursemate.firstName.charAt(0)}{selectedCoursemate.lastName.charAt(0)}
              </div>
              <div className={styles.detailItem}>
                <strong>Full Name:</strong>
                <p>
                  {selectedCoursemate.firstName} {selectedCoursemate.middleName ? selectedCoursemate.middleName + ' ' : ''}{selectedCoursemate.lastName}
                </p>
              </div>
              <div className={styles.detailItem}>
                <strong>Email:</strong>
                <p>{selectedCoursemate.email}</p>
              </div>
              <div className={styles.detailItem}>
                <strong>Matriculation Number:</strong>
                <p>{selectedCoursemate.matNumber}</p>
              </div>
              {selectedCoursemate.createdAt && (
                <div className={styles.detailItem}>
                  <strong>Added On:</strong>
                  <p>{new Date(selectedCoursemate.createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            <div className={styles.formActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setSelectedCoursemate(null)}
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

export default Coursemates;