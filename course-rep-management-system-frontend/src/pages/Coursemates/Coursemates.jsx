import { useEffect, useState } from "react";
import { Plus, Search, Mail, Hash, User, Trash2, X } from "lucide-react";
import styles from "./Coursemates.module.css";
import { useAuth } from "../../auth/useAuth";
import Header from "../../Components/Header/Header";
import { useNavigate, NavLink } from "react-router-dom";
import {Calendar,Users,ClipboardList,LogOut} from "lucide-react";

const API_BASE = "http://127.0.0.1:5000";

const Coursemates = () => {
  const { accessToken } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/", { replace: true });
  };
  const [coursemates, setCoursemates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    matNumber: "",
  });

  /* ================= FETCH ALL ================= */
  const fetchCoursemates = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/coursemates/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch coursemates");

      const data = await res.json();
      setCoursemates(data.courseMates || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load coursemates");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH ================= */
  const handleSearch = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      fetchCoursemates();
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/coursemates/search?q=${value}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      setCoursemates(data.courseMates || []);
    } catch (err) {
      console.error(err);
      alert("Search failed");
    }
  };

  /* ================= ADD ================= */
  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/coursemates/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify(form), 
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add coursemate");
      }

      setShowModal(false);
      setForm({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        matNumber: "",
      });

      fetchCoursemates();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coursemate?")) return;

    try {
      const res = await fetch(`${API_BASE}/coursemates/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete failed");

      fetchCoursemates();
    } catch (err) {
      console.error(err);
      alert("Failed to delete coursemate");
    }
  };

  useEffect(() => {
    fetchCoursemates();
  }, []);

  return (

    <div className={styles.coursematesContainer}>

      <Header sectionName="Coursemates"/>
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


      <main className={styles.coursemates}>
        <div className={styles.header}>
          
          <button className={styles.addButton} onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Add Coursemate
          </button>
        </div>

        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            placeholder="Search by name or matric number..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className={styles.tableWrapper}>
          {loading ? (
            <p className={styles.loading}>Loading...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Matric Number</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {coursemates.length ? (
                  coursemates.map((c) => (
                    <tr key={c.id}>
                      <td className={styles.nameCell}>
                        <User size={16} />
                        {c.firstName} {c.middleName || ""} {c.lastName}
                      </td>
                      <td>
                        {c.matNumber}
                      </td>
                      <td>
                        <Mail size={16} /> {c.email}
                      </td>
                      <td>
                        <Trash2
                          className={styles.delete}
                          onClick={() => handleDelete(c.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className={styles.empty}>
                      No coursemates found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className={styles.modalOverlay}>
            <form className={styles.modal} onSubmit={handleAdd}>
              <div className={styles.modalHeader}>
                <h2>Add Coursemate</h2>
                <X onClick={() => setShowModal(false)} />
              </div>

              <input
                placeholder="First Name"
                required
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
              <input
                placeholder="Middle Name (optional)"
                value={form.middleName}
                onChange={(e) =>
                  setForm({ ...form, middleName: e.target.value })
                }
              />
              <input
                placeholder="Last Name"
                required
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
              />
              <input
                placeholder="Email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                placeholder="Matric Number"
                required
                value={form.matNumber}
                onChange={(e) =>
                  setForm({ ...form, matNumber: e.target.value })
                }
              />

              <button type="submit">Add</button>
            </form>
          </div>
        )}
      </main>
    </div>
    
  );
};

export default Coursemates;
