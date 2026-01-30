import React, { useEffect, useState } from "react";
import { Plus, Trash2, X, Pencil } from "lucide-react";
import styles from "./Activities.module.css";
import { useAuth } from "../../auth/useAuth";

const API_BASE = "http://localhost:5000";

const Activities = () => {
  const { accessToken } = useAuth();

  const [activities, setActivities] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    activityName: "",
    activityTypeId: "",
    description: "",
  });

  /* ================= FETCH ALL ACTIVITIES ================= */
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/activities/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch activities");
      const data = await res.json();
      setActivities(data.activities || []);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH ACTIVITY TYPES ================= */
  const fetchActivityTypes = async () => {
    try {
      const res = await fetch(`${API_BASE}/activity_types`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch activity types");
      const data = await res.json();
      setActivityTypes(data.activityTypes || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= ADD ACTIVITY ================= */
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/activities/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          courseRepId: 1, // Replace with dynamic courseRepId if needed
          activityName: form.activityName,
          activityTypeId: form.activityTypeId,
          description: form.description,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add activity");
      }

      setShowModal(false);
      setForm({ activityName: "", activityTypeId: "", description: "" });
      fetchActivities();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchActivityTypes();
  }, []);


  return (
    <div className={styles.activities}>
      <div className={styles.header}>
        <h1>Activities</h1>
        <button
          className={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} /> Add Activity
        </button>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : activities.length ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a) => (
              <tr key={a.activityId}>
                <td>{a.activityName}</td>
                <td>{a.activityTypeName}</td>
                <td>{a.description}</td>
                <td>
                  <Pencil className={styles.edit} />
                  <Trash2 className={styles.delete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.empty}>No activities found</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <form className={styles.modal} onSubmit={handleAdd}>
            <div className={styles.modalHeader}>
              <h2>Add Activity</h2>
              <X onClick={() => setShowModal(false)} />
            </div>

            <input
              placeholder="Activity Name"
              required
              value={form.activityName}
              onChange={(e) =>
                setForm({ ...form, activityName: e.target.value })
              }
            />

            <select
              required
              value={form.activityTypeId}
              onChange={(e) =>
                setForm({ ...form, activityTypeId: e.target.value })
              }
            >
              <option value="">Select Activity Type</option>
              {activityTypes.map((t) => (
                <option key={t.activityTypeId} value={t.activityTypeId}>
                  {t.activityTypeName}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <button type="submit">Add</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Activities;
