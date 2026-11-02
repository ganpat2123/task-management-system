
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

const emptyForm = {
  title: "",
  description: "",
  status: "Todo"
};

const statuses = ["Todo", "In Progress", "Completed"];

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  let user = {};
  try {
    user = JSON.parse(
      localStorage.getItem("taskUser") || "{}"
    );
  } catch {
    user = {};
  }

  const handleApiError = useCallback(
    (err, fallback) => {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("taskUser");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message || fallback
      );
    },
    [navigate]
  );

  const fetchTasks = useCallback(async () => {
    setLoading(true);

    try {
      const res = await API.get("/tasks");
      setTasks(
        Array.isArray(res.data.tasks)
          ? res.data.tasks
          : []
      );
      setError("");
    } catch (err) {
      handleApiError(err, "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const clearForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim() || !form.description.trim()) {
      return setError(
        "Please enter title and description."
      );
    }

    setSaving(true);

    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status
    };

    try {
      if (editId !== null) {
        await API.put(`/tasks/${editId}`, data);
        setSuccess("Task updated successfully.");
      } else {
        await API.post("/tasks", data);
        setSuccess("Task added successfully.");
      }

      clearForm();
      await fetchTasks();
    } catch (err) {
      handleApiError(err, "Unable to save task.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      status: task.status
    });
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await API.delete(`/tasks/${id}`);
      setSuccess("Task deleted successfully.");
      await fetchTasks();
    } catch (err) {
      handleApiError(err, "Unable to delete task.");
    }
  };

  const updateStatus = async (task, status) => {
    setError("");
    setSuccess("");

    try {
      await API.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        status
      });

      setTasks((previous) =>
        previous.map((item) =>
          item.id === task.id
            ? { ...item, status }
            : item
        )
      );

      setSuccess("Task status updated.");
    } catch (err) {
      handleApiError(err, "Unable to update status.");
    }
  };

  const total = tasks.length;
  const todo = tasks.filter(
    (task) => task.status === "Todo"
  ).length;
  const inProgress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;
  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const visibleTasks =
    filter === "All"
      ? tasks
      : tasks.filter((task) => task.status === filter);

  return (
    <div className="app-shell">
      <Navbar />

      <main className="dashboard container">
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">MY WORKSPACE</span>
            <h1>
              Welcome back
              {user.username ? `, ${user.username}` : ""}!
            </h1>
            <p>
              Stay organized and keep your tasks on track.
            </p>
          </div>

          <button
            className="btn-soft"
            onClick={fetchTasks}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>

        <div className="stats-grid">
          {[
            { label: "Total Tasks", count: total, icon: "▦", color: "purple" },
            { label: "To Do", count: todo, icon: "○", color: "blue" },
            { label: "In Progress", count: inProgress, icon: "◷", color: "orange" },
            { label: "Completed", count: completed, icon: "✓", color: "green" }
          ].map((stat) => (
            <div className="stat-card" key={stat.label}>
              <div className={`stat-icon ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="stat-number">
                {stat.count}
              </div>
              <div className="stat-label">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <div className="dashboard-grid">
          <section className="panel task-form-panel">
            <div className="panel-heading">
              <h2>
                {editId !== null
                  ? "Edit Task"
                  : "Create New Task"}
              </h2>
              <p>
                {editId !== null
                  ? "Update your task details."
                  : "Add something to your to-do list."}
              </p>
            </div>

            <form onSubmit={submit}>
              <div className="form-group">
                <label htmlFor="taskTitle">
                  Task Title
                </label>

                <input
                  id="taskTitle"
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g. Complete React project"
                  value={form.title}
                  onChange={change}
                  maxLength={255}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="taskDescription">
                  Description
                </label>

                <textarea
                  id="taskDescription"
                  name="description"
                  className="form-control"
                  placeholder="Write task details..."
                  value={form.description}
                  onChange={change}
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="taskStatus">
                  Status
                </label>

                <select
                  id="taskStatus"
                  name="status"
                  className="form-select"
                  value={form.status}
                  onChange={change}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn-main w-100"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editId !== null
                    ? "Save Changes"
                    : "+ Add Task"}
              </button>

              {editId !== null && (
                <button
                  type="button"
                  className="btn-soft w-100 mt-2"
                  onClick={clearForm}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </section>

          <section className="panel task-list-panel">
            <div className="task-list-header">
              <div>
                <h2>My Tasks</h2>
                <p>
                  Manage everything in one place.
                </p>
              </div>

              <select
                className="form-select task-filter"
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value)
                }
                aria-label="Filter tasks"
              >
                <option value="All">All Tasks</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="empty-state">
                Loading your tasks...
              </div>
            ) : visibleTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">▤</div>
                <h3>No tasks found</h3>
                <p>
                  {filter === "All"
                    ? "Create your first task to get started."
                    : "No tasks match this status."}
                </p>
              </div>
            ) : (
              <div className="tasks-list">
                {visibleTasks.map((task) => (
                  <article
                    className="task-item"
                    key={task.id}
                  >
                    <div className="task-top">
                      <h3>{task.title}</h3>
                      <span
                        className={`status-badge ${
                          task.status === "Todo"
                            ? "status-todo"
                            : task.status === "In Progress"
                              ? "status-progress"
                              : "status-completed"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <p className="task-description">
                      {task.description}
                    </p>

                    <div className="task-actions">
                      <select
                        className="form-select task-status-select"
                        aria-label={`Status for ${task.title}`}
                        value={task.status}
                        onChange={(e) =>
                          updateStatus(
                            task,
                            e.target.value
                          )
                        }
                      >
                        {statuses.map((status) => (
                          <option
                            value={status}
                            key={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>

                      <div className="action-buttons">
                        <button
                          type="button"
                          className="btn-edit"
                          onClick={() => startEdit(task)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() =>
                            deleteTask(task.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
