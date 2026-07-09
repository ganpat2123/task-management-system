import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {

    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "Todo"
    });

    const [editId, setEditId] = useState(null);
    const [filter, setFilter] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {

        if (!token) {
            navigate("/");
            return;
        }

        fetchTasks();

    }, [filter]);

    const fetchTasks = async () => {

        try {

            let url = "/tasks";

            if (filter) {
                url += `?status=${encodeURIComponent(filter)}`;
            }

            const res = await API.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTasks(res.data.tasks);

        } catch (err) {
            console.log(err);
        }

    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editId) {

                await API.put(`/tasks/${editId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setEditId(null);

            } else {

                await API.post("/tasks", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            }

            setFormData({
                title: "",
                description: "",
                status: "Todo"
            });

            fetchTasks();

        } catch (err) {
            alert(err.response?.data?.message);
        }

    };

    const handleEdit = (task) => {

        setEditId(task.id);

        setFormData({
            title: task.title,
            description: task.description,
            status: task.status
        });

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this task?")) return;

        try {

            await API.delete(`/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            fetchTasks();

        } catch (err) {
            alert(err.response?.data?.message);
        }

    };

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };

    return (
<div className="container py-5">

    {/* Header */}
    <div className="card border-0 shadow-lg rounded-4 mb-4">

        <div className="card-body d-flex justify-content-between align-items-center bg-primary text-white rounded-4 p-4">

            <div>

                <h2 className="fw-bold mb-1">📋 Task Dashboard</h2>

            </div>

            <button
                className="btn btn-light text-danger fw-bold px-4"
                onClick={logout}
            >
                Logout
            </button>

        </div>

    </div>

    {/* Filter */}
    <div className="card border-0 shadow rounded-4 mb-4">

        <div className="card-body d-flex justify-content-between align-items-center">

            <h5 className="fw-bold mb-0">🔍 Filter Tasks</h5>

            <select
                className="form-select w-25 shadow-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            >

                <option value="">All Tasks</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>

            </select>

        </div>

    </div>

    {/* Form */}
    <div className="card border-0 shadow-lg rounded-4 mb-4">

        <div className="card-header bg-success text-white py-3 rounded-top-4">

            <h4 className="fw-bold mb-0">

                {editId ? "✏ Update Task" : "➕ Add New Task"}

            </h4>

        </div>

        <div className="card-body p-4">

            <form onSubmit={handleSubmit}>

                <div className="mb-4">

                    <label className="form-label fw-semibold">
                        Task Title
                    </label>

                    <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter Task Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />

                </div>

                <div className="mb-4">

                    <label className="form-label fw-semibold">
                        Description
                    </label>

                    <textarea
                        rows="4"
                        className="form-control"
                        placeholder="Enter Task Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                </div>

                <div className="mb-4">

                    <label className="form-label fw-semibold">
                        Status
                    </label>

                    <select
                        className="form-select form-select-lg"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >

                        <option>Todo</option>
                        <option>In Progress</option>
                        <option>Completed</option>

                    </select>

                </div>

                <button
                    className={`btn btn-lg w-100 fw-bold ${
                        editId ? "btn-warning text-dark" : "btn-success"
                    }`}
                >
                    {editId ? "Update Task" : "Add Task"}
                </button>

            </form>

        </div>

    </div>

    {/* Table */}
    <div className="card border-0 shadow-lg rounded-4">

        <div className="card-header bg-dark text-white py-3 rounded-top-4">

            <h4 className="fw-bold mb-0">
                📑 Task List
            </h4>

        </div>

        <div className="table-responsive">

            <table className="table table-striped table-hover align-middle mb-0">

                <thead className="table-primary text-center">

                    <tr>

                        <th>Title</th>

                        <th>Description</th>

                        <th>Status</th>

                        <th width="220">Action</th>

                    </tr>

                </thead>

                <tbody>

                    {
                        tasks.length === 0 ?

                            <tr>

                                <td
                                    colSpan="4"
                                    className="text-center py-5 fw-bold text-secondary"
                                >
                                    📭 No Tasks Found
                                </td>

                            </tr>

                            :

                            tasks.map((task) => (

                                <tr key={task.id}>

                                    <td className="fw-semibold text-center">
                                        {task.title}
                                    </td>

                                    <td className="text-center">
                                        {task.description}
                                    </td>

                                    <td className="text-center">

                                        <span
                                            className={`badge rounded-pill px-3 py-2 ${
                                                task.status === "Completed"
                                                    ? "bg-success"
                                                    : task.status === "In Progress"
                                                    ? "bg-warning text-dark"
                                                    : "bg-secondary"
                                            }`}
                                        >
                                            {task.status}
                                        </span>

                                    </td>

                                    <td className="text-center">

                                        <button
                                            className="btn btn-warning btn-sm fw-semibold me-2"
                                            onClick={() => handleEdit(task)}
                                        >
                                            ✏ Edit
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm fw-semibold"
                                            onClick={() => handleDelete(task.id)}
                                        >
                                            🗑 Delete
                                        </button>

                                    </td>

                                </tr>

                            ))

                    }

                </tbody>

            </table>

        </div>

    </div>

</div>

    );

}

export default Dashboard;