import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import ConfirmModal from "../components/ConfirmModal";

function Dashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const shortId = user?.id?.slice(-3).toUpperCase();

  const jobId =
    user?.role === "ADMIN"
      ? `ETH-ADMIN-${shortId}`
      : `ETH-MEMBER-${shortId}`;

  // Theme
  const [darkMode, setDarkMode] = useState(true);

  // Profile
  const [showProfile, setShowProfile] = useState(false);

  // Users
  const [users, setUsers] = useState([]);

  // Projects
  const [projects, setProjects] = useState([]);

  // Expand Project
  const [expandedProject, setExpandedProject] = useState(null);

  // Project Form
  const [showForm, setShowForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectPriority, setProjectPriority] = useState("MEDIUM");
  const [projectDueDate, setProjectDueDate] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Task Form
  const [showTaskForm, setShowTaskForm] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("MEDIUM");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [selectedTaskMembers, setSelectedTaskMembers] = useState([]);

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  // Fetch Users
  const fetchUsers = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/auth/users`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
console.log(res.data);

      const members = res.data.filter(
        (u) => u.role === "MEMBER"
      );

      setUsers(members);

    } catch (error) {

      console.log(error);

    }
  };
// Fetch Projects
const fetchProjects = async () => {

  try {

    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/projects`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(res.data);

    setProjects(res.data);

  } catch (error) {

    console.log(error);

  }
};

  // Delete Project
  const handleDeleteProject = async (projectId) => {

    try {

      const token = localStorage.getItem("token");

   await axios.delete(
  `${import.meta.env.VITE_API_URL}/api/projects/${projectId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      fetchProjects();

    } catch (error) {

      console.log(error);

    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {

    try {

      const token = localStorage.getItem("token");

     await axios.delete(
  `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      fetchProjects();

    } catch (error) {

      console.log(error);

    }
  };

  // Create / Update Project
  const handleCreateProject = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

     // EDIT PROJECT
if (editingProjectId) {

  await axios.put(
    `${import.meta.env.VITE_API_URL}/api/projects/${editingProjectId}`,
    {
      title,
      description,
      priority: projectPriority,
      dueDate: projectDueDate,
      memberIds: selectedMembers,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

}

      // CREATE PROJECT
      // CREATE PROJECT
else {

  await axios.post(
    `${import.meta.env.VITE_API_URL}/api/projects`,
    {
      title,
      description,
      priority: projectPriority,
      dueDate: projectDueDate,
      memberIds: selectedMembers,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

}

      // RESET
      setTitle("");
      setDescription("");
      setProjectPriority("MEDIUM");
      setProjectDueDate("");
      setSelectedMembers([]);

      setEditingProjectId(null);

      setShowForm(false);

      fetchProjects();

    } catch (error) {

      console.log(error);

    }
  };

  // Create / Update Task
const handleCreateTask = async (e) => {

  e.preventDefault();

  try {

    const token = localStorage.getItem("token");

    // UPDATE TASK
    if (editingTaskId) {

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tasks/${editingTaskId}`,
        {
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority,
          dueDate: taskDueDate,
          assignedUserIds: selectedTaskMembers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    }

   // CREATE TASK
else {

  await axios.post(
    `${import.meta.env.VITE_API_URL}/api/tasks`,
    {
      title: taskTitle,
      description: taskDescription,
      priority: taskPriority,
      dueDate: taskDueDate,
      projectId: selectedProjectId,
      assignedUserIds: selectedTaskMembers,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

}

    // RESET
    setEditingTaskId(null);

    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("MEDIUM");
    setTaskDueDate("");
    setSelectedTaskMembers([]);

    setShowTaskForm(false);

    fetchProjects();

  } catch (error) {

    console.log(error);

  }

};

// UPDATE TASK STATUS
const updateTaskStatus = async (taskId, status) => {

  try {

    const token = localStorage.getItem("token");

    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchProjects();

  } catch (error) {

    console.log(error);

  }

};

  // Logout
  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const openProjectDeleteModal = (projectId) => {

    setDeleteProjectId(projectId);

    setDeleteTaskId(null);

    setIsModalOpen(true);
  };

  const openTaskDeleteModal = (taskId) => {

    setDeleteTaskId(taskId);

    setDeleteProjectId(null);

    setIsModalOpen(true);
  };

  const confirmDelete = async () => {

    try {

      if (deleteProjectId) {
        await handleDeleteProject(deleteProjectId);
      }

      if (deleteTaskId) {
        await handleDeleteTask(deleteTaskId);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setDeleteProjectId(null);
      setDeleteTaskId(null);
      setIsModalOpen(false);

    }
  };

  useEffect(() => {

    fetchProjects();

    if (user?.role === "ADMIN") {
      fetchUsers();
    }

  }, []);
// Analytics
const allTasks = (projects || []).flatMap(
  (project) => project.tasks || []
);

const totalProjects = (projects || []).length;

const totalTasks = (allTasks || []).length;

const completedTasks = (allTasks || []).filter(
  (task) => task.status === "DONE"
).length;

const inProgressTasks = (allTasks || []).filter(
  (task) => task.status === "IN_PROGRESS"
).length;

const todoTasks = (allTasks || []).filter(
  (task) => task.status === "TODO"
).length;

const overdueTasks = (allTasks || []).filter(
  (task) =>
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "DONE"
).length;

  // ── Analytics card definitions with semantic tints ──────────────────────────
  const analyticsCards = [
    {
      label: "Projects",
      value: totalProjects,
      // blue-gray tint
      darkBorder: "border-[#2a3a4a]",
      darkBg: "bg-[#161e26]",
      darkShadow: "shadow-[0_0_18px_0_rgba(56,100,160,0.13)]",
      darkLabel: "text-[#6b8aaa]",
      darkValue: "text-[#a8c4e0]",
      lightBorder: "border-blue-200",
      lightBg: "bg-blue-50",
      lightShadow: "shadow-blue-100",
      lightLabel: "text-blue-400",
      lightValue: "text-blue-700",
    },
    {
      label: "Tasks",
      value: totalTasks,
      // cyan tint
      darkBorder: "border-[#1a3a3a]",
      darkBg: "bg-[#131e1e]",
      darkShadow: "shadow-[0_0_18px_0_rgba(0,180,180,0.10)]",
      darkLabel: "text-[#4a9a9a]",
      darkValue: "text-[#7dd4d4]",
      lightBorder: "border-cyan-200",
      lightBg: "bg-cyan-50",
      lightShadow: "shadow-cyan-100",
      lightLabel: "text-cyan-500",
      lightValue: "text-cyan-700",
    },
    {
      label: "TODO",
      value: todoTasks,
      // amber tint
      darkBorder: "border-[#3a2e10]",
      darkBg: "bg-[#1c1808]",
      darkShadow: "shadow-[0_0_18px_0_rgba(200,160,0,0.10)]",
      darkLabel: "text-[#9a7a20]",
      darkValue: "text-[#d4aa50]",
      lightBorder: "border-amber-200",
      lightBg: "bg-amber-50",
      lightShadow: "shadow-amber-100",
      lightLabel: "text-amber-500",
      lightValue: "text-amber-700",
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      // blue tint
      darkBorder: "border-[#1a2a4a]",
      darkBg: "bg-[#10182a]",
      darkShadow: "shadow-[0_0_18px_0_rgba(50,100,220,0.12)]",
      darkLabel: "text-[#4a6aaa]",
      darkValue: "text-[#7a9ade]",
      lightBorder: "border-blue-300",
      lightBg: "bg-blue-50",
      lightShadow: "shadow-blue-100",
      lightLabel: "text-blue-500",
      lightValue: "text-blue-800",
    },
    {
      label: "Completed",
      value: completedTasks,
      // green tint
      darkBorder: "border-[#1a3a20]",
      darkBg: "bg-[#0e1e10]",
      darkShadow: "shadow-[0_0_18px_0_rgba(30,160,60,0.12)]",
      darkLabel: "text-[#3a8a4a]",
      darkValue: "text-[#6ac47a]",
      lightBorder: "border-green-200",
      lightBg: "bg-green-50",
      lightShadow: "shadow-green-100",
      lightLabel: "text-green-500",
      lightValue: "text-green-700",
    },
    {
      label: "Overdue",
      value: overdueTasks,
      // red tint
      darkBorder: "border-[#3a1a1a]",
      darkBg: "bg-[#1e0e0e]",
      darkShadow: "shadow-[0_0_18px_0_rgba(200,40,40,0.12)]",
      darkLabel: "text-[#9a3a3a]",
      darkValue: "text-[#e07070]",
      lightBorder: "border-red-200",
      lightBg: "bg-red-50",
      lightShadow: "shadow-red-100",
      lightLabel: "text-red-400",
      lightValue: "text-red-600",
    },
  ];

  return (
    <div
      className={`${
        darkMode ? "bg-[#0e0e0e] text-white" : "bg-gray-100 text-black"
      } min-h-screen transition duration-300`}
    >

      {/* ── Navbar ── */}
      <div
        className={`${
          darkMode
            ? "bg-[#0a0a0a] border-gray-800/60"
            : "bg-white border-gray-200"
        } border-b px-8 py-5 flex justify-between items-center`}
      >

        {/* Left */}
        <div
          onClick={() => window.open("https://www.ethara.ai/", "_blank")}
          className="cursor-pointer hover:opacity-80 transition"
        >
          <h1 className="text-5xl font-black tracking-tight leading-tight">
            Ethara AI
          </h1>
          <p className="text-lg text-gray-400 mt-1">
            RLaaS for Intelligent Systems
          </p>
        </div>

        {/* Center */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">Team Task Manager</h2>
          <p className="text-lg text-gray-400 mt-1">
            {user?.role === "ADMIN"
              ? "Administrative Workspace"
              : "Member Dashboard"}
          </p>
        </div>

        {/* Profile */}
        <div className="relative">

          <div
            onClick={() => setShowProfile(!showProfile)}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold cursor-pointer hover:scale-105 transition duration-200 ${
              darkMode
                ? "bg-[#1f1f1f] border border-gray-700 hover:bg-[#2a2a2a] text-white"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {showProfile && (
            <div
              className={`${
                darkMode
                  ? "bg-[#141414] border-gray-700/60"
                  : "bg-white border-gray-200"
              } absolute right-0 top-[4.5rem] w-80 rounded-3xl shadow-2xl border p-6 z-50 backdrop-blur-sm`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-2xl">{user?.name}</h2>
                  <p className="text-gray-500 text-sm">{jobId}</p>
                </div>
              </div>

              <div
                className={`${
                  darkMode ? "border-gray-700/50" : "border-gray-100"
                } border-t pt-5 space-y-4 mb-6`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Role</span>
                  <span className="font-semibold text-sm">{user?.role}</span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-gray-500 text-sm">Email</span>
                  <span className="font-medium text-sm break-all">
                    {user?.email}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`${
                  darkMode
                    ? "bg-[#1f1f1f] border-gray-700 text-white hover:bg-[#2a2a2a]"
                    : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                } w-full border rounded-2xl py-3 flex justify-center items-center gap-2 transition`}
              >
                {darkMode ? (
                  <>
                    <Sun size={18} />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon size={18} />
                    Dark Mode
                  </>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="w-full mt-4 bg-red-500 text-white py-3 rounded-2xl hover:bg-red-600 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ── Main ── */}
      <div className="p-8">

        {/* ── Analytics Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5 mb-12">
          {analyticsCards.map((card, index) => (
            <div
              key={index}
              className={`
                border rounded-3xl p-6 shadow-sm transition-all duration-300
                hover:-translate-y-1
                ${
                  darkMode
                    ? `${card.darkBg} ${card.darkBorder} ${card.darkShadow} hover:shadow-lg`
                    : `${card.lightBg} ${card.lightBorder} shadow-sm hover:shadow-md ${card.lightShadow}`
                }
              `}
            >
              <h3
                className={`text-sm font-semibold uppercase tracking-widest mb-4 ${
                  darkMode ? card.darkLabel : card.lightLabel
                }`}
              >
                {card.label}
              </h3>
              <p
                className={`text-5xl font-bold ${
                  darkMode ? card.darkValue : card.lightValue
                }`}
              >
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Team Members (Admin only) ── */}
        {user?.role === "ADMIN" && (
          <div
            className={`${
              darkMode
                ? "bg-[#141414] border-gray-700/60"
                : "bg-white border-gray-200"
            } border rounded-3xl p-8 mb-10 hover:-translate-y-1 hover:shadow-2xl transition duration-300`}
          >
            <h2
              className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Team
            </h2>
            <h3 className="text-3xl font-bold mb-6">Members</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {users.map((member) => (
                <div
                  key={member.id}
                  className={`${
                    darkMode
                      ? "bg-[#0e0e0e] border-gray-700/60"
                      : "bg-gray-50 border-gray-200"
                  } border rounded-2xl p-5 hover:shadow-md transition duration-200`}
                >
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p
                    className={`text-sm mt-1 ${
                      darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {member.email}
                  </p>
                  <span
                    className={`inline-block mt-3 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-lg ${
                      darkMode
                        ? "bg-[#1f1f1f] text-gray-400"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    Member
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Projects Header ── */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Workspace
            </p>
            <h2 className="text-5xl font-bold">Projects</h2>
          </div>

          {user?.role === "ADMIN" && (
            <button
              onClick={() => {
                setEditingProjectId(null);
                setTitle("");
                setDescription("");
                setProjectPriority("MEDIUM");
                setProjectDueDate("");
                setSelectedMembers([]);
                setShowForm(true);
              }}
              className="bg-black text-white px-6 py-3 rounded-2xl hover:opacity-90 transition cursor-pointer"
            >
              + Create Project
            </button>
          )}
        </div>

        {/* ── Create / Edit Project Form ── */}
        {showForm && (
          <form
            onSubmit={handleCreateProject}
            className={`${
              darkMode
                ? "bg-[#141414] border-gray-700/60"
                : "bg-white border-gray-200"
            } border rounded-3xl p-6 mb-10`}
          >
            <input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${
                darkMode
                  ? "bg-[#0e0e0e] border-gray-700 text-white"
                  : "bg-white border-gray-200"
              } w-full border rounded-xl p-4 mb-4`}
              required
            />

            <textarea
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${
                darkMode
                  ? "bg-[#0e0e0e] border-gray-700 text-white"
                  : "bg-white border-gray-200"
              } w-full border rounded-xl p-4 mb-4`}
              rows="4"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select
                value={projectPriority}
                onChange={(e) => setProjectPriority(e.target.value)}
                className={`${
                  darkMode
                    ? "bg-[#0e0e0e] border-gray-700 text-white"
                    : "bg-white border-gray-200"
                } border rounded-xl p-4`}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>

              <input
                type="date"
                value={projectDueDate}
                onChange={(e) => setProjectDueDate(e.target.value)}
                className={`${
                  darkMode
                    ? "bg-[#0e0e0e] border-gray-700 text-white"
                    : "bg-white border-gray-200"
                } border rounded-xl p-4`}
              />
            </div>

            {/* Members */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Assign Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {users.map((member) => (
                  <label
                    key={member.id}
                    className={`${
                      darkMode
                        ? "bg-[#0e0e0e] border-gray-700"
                        : "bg-gray-50 border-gray-200"
                    } border rounded-xl p-4 flex items-center gap-3 cursor-pointer`}
                  >
                    <input
                      type="checkbox"
                      value={member.id}
                      checked={selectedMembers.includes(member.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMembers([...selectedMembers, member.id]);
                        } else {
                          setSelectedMembers(
                            selectedMembers.filter((id) => id !== member.id)
                          );
                        }
                      }}
                    />
                    {member.name}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-xl cursor-pointer"
            >
              {editingProjectId ? "Save Changes" : "Create Project"}
            </button>
          </form>
        )}

        {/* ── Empty State ── */}
       {(projects || []).length === 0 ? (
          <div
            className={`${
              darkMode
                ? "bg-[#141414] border-gray-700/60"
                : "bg-white border-gray-200"
            } border rounded-3xl p-24 text-center`}
          >
            <div
              className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl ${
                darkMode ? "bg-[#1f1f1f] text-gray-500" : "bg-gray-100 text-gray-400"
              }`}
            >
              📋
            </div>
            <h3
              className={`text-4xl font-bold mb-3 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              No Projects Assigned
            </h3>
            <p
              className={`text-lg ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              You currently don't have any assigned projects.
            </p>
          </div>
        ) : (

          <div className="space-y-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`${
                  darkMode
                    ? "bg-[#141414] border-gray-700/60 hover:border-gray-600/80 hover:shadow-[0_8px_40px_0_rgba(0,0,0,0.5)]"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-xl"
                } border rounded-3xl p-8 shadow-sm transition-all duration-300 hover:-translate-y-1`}
              >

                {/* Project Card Header */}
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-6">

                    {/* Title */}
                    <h3
                      className={`text-4xl font-bold mb-2 leading-tight ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`text-base mb-5 leading-relaxed ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {project.description}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-3">
                      <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl text-sm font-semibold">
                        Priority: {project.priority}
                      </span>
                      <span
                        className={`px-4 py-2 rounded-xl text-sm font-medium ${
                          darkMode
                            ? "bg-[#1f1f1f] text-gray-400"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        Assigned:{" "}
                        {project.assignedDate
                          ? new Date(project.assignedDate).toLocaleDateString()
                          : "Today"}
                      </span>
                      <span className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold">
                        Due:{" "}
                        {project.dueDate
                          ? new Date(project.dueDate).toLocaleDateString()
                          : "No Due Date"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 flex-shrink-0">

                    {user?.role === "ADMIN" && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setEditingProjectId(project.id);
                            setTitle(project.title);
                            setDescription(project.description || "");
                            setProjectPriority(project.priority || "MEDIUM");
                            setProjectDueDate(
                              project.dueDate
                                ? project.dueDate.split("T")[0]
                                : ""
                            );
                            setSelectedMembers(
                              project.members.map((member) => member.user.id)
                            );
                            setShowForm(true);
                          }}
                          className="bg-blue-600 text-white px-5 py-3 rounded-2xl hover:bg-blue-700 transition cursor-pointer text-sm font-medium"
                        >
                          Edit Project
                        </button>

                        <button
                          onClick={() => openProjectDeleteModal(project.id)}
                          className="bg-red-500 text-white px-5 py-3 rounded-2xl hover:bg-red-600 transition cursor-pointer text-sm font-medium"
                        >
                          Delete Project
                        </button>

                        <button
                          onClick={() => {
                            setEditingTaskId(null);
                            setTaskTitle("");
                            setTaskDescription("");
                            setTaskPriority("MEDIUM");
                            setTaskDueDate("");
                            setSelectedTaskMembers([]);
                            setExpandedProject(project.id);
                            setShowTaskForm(true);
                            setSelectedProjectId(project.id);
                          }}
                          className="bg-black text-white px-5 py-3 rounded-2xl cursor-pointer text-sm font-medium hover:opacity-90 transition"
                        >
                          + Create Task
                        </button>
                      </div>
                    )}

                    {/* Expand toggle */}
                    <button
                      onClick={() =>
                        setExpandedProject(
                          expandedProject === project.id ? null : project.id
                        )
                      }
                      className={`${
                        darkMode
                          ? "bg-[#1f1f1f] border border-gray-700 hover:bg-[#2a2a2a] text-gray-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                      } px-4 py-3 rounded-2xl cursor-pointer transition`}
                    >
                      {expandedProject === project.id ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </button>
                  </div>
                </div>

                {/* ── Expanded Section ── */}
                {expandedProject === project.id && (
                  <div
                    className={`mt-8 pt-8 ${
                      darkMode ? "border-t border-gray-700/50" : "border-t border-gray-100"
                    }`}
                  >

                    {/* Assigned Members */}
                    <div className="mb-8">
                      <p
                        className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                          darkMode ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        Project
                      </p>
                      <h3 className="text-2xl font-bold mb-5">
                        Assigned Members
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {project.members && project.members.length > 0 ? (
                          project.members.map((member) => (
                            <div
                              key={member.id}
                              className={`${
                                darkMode
                                  ? "bg-[#0e0e0e] border-gray-700/60"
                                  : "bg-gray-50 border-gray-200"
                              } border rounded-2xl p-4 hover:shadow-md transition duration-200`}
                            >
                              <h4 className="text-lg font-semibold">
                                {member.user.name}
                              </h4>
                              <p
                                className={`text-sm mt-1 ${
                                  darkMode ? "text-gray-500" : "text-gray-400"
                                }`}
                              >
                                {member.user.email}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            No members assigned yet
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Create Task Form */}
                    {showTaskForm && selectedProjectId === project.id && (
                      <form
                        onSubmit={handleCreateTask}
                        className={`${
                          darkMode
                            ? "bg-[#0e0e0e] border-gray-700/60"
                            : "bg-gray-50 border-gray-200"
                        } border rounded-2xl p-6 mb-8 hover:-translate-y-1 hover:shadow-2xl transition duration-300`}
                      >
                        <input
                          type="text"
                          placeholder="Task Title"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          className={`${
                            darkMode
                              ? "bg-[#141414] border-gray-700 text-white"
                              : "bg-white border-gray-200"
                          } w-full border rounded-xl p-4 mb-4`}
                          required
                        />

                        <textarea
                          placeholder="Task Description"
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                          className={`${
                            darkMode
                              ? "bg-[#141414] border-gray-700 text-white"
                              : "bg-white border-gray-200"
                          } w-full border rounded-xl p-4 mb-4`}
                          rows="3"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <select
                            value={taskPriority}
                            onChange={(e) => setTaskPriority(e.target.value)}
                            className={`${
                              darkMode
                                ? "bg-[#141414] border-gray-700 text-white"
                                : "bg-white border-gray-200"
                            } border rounded-xl p-4`}
                          >
                            <option value="LOW">LOW</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HIGH">HIGH</option>
                          </select>

                          <input
                            type="date"
                            value={taskDueDate}
                            onChange={(e) => setTaskDueDate(e.target.value)}
                            className={`${
                              darkMode
                                ? "bg-[#141414] border-gray-700 text-white"
                                : "bg-white border-gray-200"
                            } border rounded-xl p-4`}
                          />
                        </div>

                        {/* Assign Task Members */}
                        <div className="mb-6">
                          <h3 className="text-xl font-semibold mb-4">
                            Assign Members
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {(project.members || []).map((member) => (
                              <label
                                key={member.user.id}
                                className={`${
                                  darkMode
                                    ? "bg-[#141414] border-gray-700"
                                    : "bg-white border-gray-200"
                                } border rounded-xl p-4 flex items-center gap-3 cursor-pointer`}
                              >
                                <input
                                  type="checkbox"
                                  value={member.user.id}
                                  checked={selectedTaskMembers.includes(
                                    member.user.id
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedTaskMembers([
                                        ...selectedTaskMembers,
                                        member.user.id,
                                      ]);
                                    } else {
                                      setSelectedTaskMembers(
                                        selectedTaskMembers.filter(
                                          (id) => id !== member.user.id
                                        )
                                      );
                                    }
                                  }}
                                />
                                {member.user.name}
                              </label>
                            ))}
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="bg-black text-white px-6 py-3 rounded-xl cursor-pointer"
                        >
                          {editingTaskId ? "Update Task" : "Create Task"}
                        </button>
                      </form>
                    )}

                    {/* ── Tasks List ── */}
                    <div>
                      <p
                        className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                          darkMode ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        Project
                      </p>
                      <h3 className="text-2xl font-bold mb-5">Tasks</h3>

                      <div className="space-y-5">

                        {/* Tasks Empty State */}
{(!project.tasks || project.tasks.length === 0) && (                          <div
                            className={`${
                              darkMode
                                ? "bg-[#0e0e0e] border-gray-700/60"
                                : "bg-gray-50 border-gray-200"
                            } border rounded-2xl p-14 text-center`}
                          >
                            <div
                              className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center text-2xl ${
                                darkMode
                                  ? "bg-[#1a1a1a] text-gray-600"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              ✓
                            </div>
                            <h3
                              className={`text-2xl font-bold mb-2 ${
                                darkMode ? "text-white" : "text-gray-800"
                              }`}
                            >
                              No Tasks Yet
                            </h3>
                            <p
                              className={`${
                                darkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              Tasks created under this project will appear here.
                            </p>
                          </div>
                        )}

                        {(project.tasks || []).map((task) => (
                          <div
                            key={task.id}
                            className={`${
                              darkMode
                                ? "bg-[#0e0e0e] border-gray-700/60 hover:border-gray-600/80 hover:shadow-[0_4px_24px_0_rgba(0,0,0,0.4)]"
                                : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md"
                            } border rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5`}
                          >
                            <div className="flex justify-between items-start">

                              <div className="flex-1 pr-4">

                                {/* Task Title */}
                                <h4
                                  className={`text-2xl font-semibold mb-1 ${
                                    darkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {task.title}
                                </h4>

                                {/* Task Description */}
                                <p
                                  className={`text-sm mb-4 leading-relaxed ${
                                    darkMode ? "text-gray-500" : "text-gray-400"
                                  }`}
                                >
                                  {task.description}
                                </p>

                                {/* Assigned users */}
                                <div className="flex flex-wrap gap-2 mb-4">
{(task.assignedUsers || []).map((assigned) => (                                    <span
                                      key={assigned.id}
                                      className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl text-sm font-medium"
                                    >
                                      {assigned.user.name}
                                    </span>
                                  ))}
                                </div>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-3">
                                  <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl text-sm font-semibold">
                                    Priority: {task.priority || "MEDIUM"}
                                  </span>
                                  <span
                                    className={`px-4 py-2 rounded-xl text-sm font-medium ${
                                      darkMode
                                        ? "bg-[#1f1f1f] text-gray-400"
                                        : "bg-gray-200 text-gray-600"
                                    }`}
                                  >
                                    Due:{" "}
                                    {task.dueDate
                                      ? new Date(
                                          task.dueDate
                                        ).toLocaleDateString()
                                      : "No Date"}
                                  </span>
                                </div>
                              </div>

                              {/* Task Actions */}
                              <div className="flex flex-col items-end gap-3 flex-shrink-0">

                                {user?.role === "ADMIN" && (
                                  <div className="flex gap-2">
                                    <button
                                    type="button"
                                     onClick={() => {

  // VERY IMPORTANT
  setEditingTaskId(task.id);

  setSelectedProjectId(project.id);

  setTaskTitle(task.title);
  setTaskDescription(task.description);
  setTaskPriority(task.priority);
  setTaskDueDate(task.dueDate?.split("T")[0]);

  setSelectedTaskMembers(
  (task.assignedUsers || []).map(
    (assigned) => assigned.user.id
  )
);

  

  setShowTaskForm(true);

}}
                                      className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition cursor-pointer text-sm font-medium"
                                    >
                                      Edit
                                    </button>

                                    <button
                                    type="button"
                                      onClick={() =>
                                        openTaskDeleteModal(task.id)
                                      }
                                      className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition cursor-pointer text-sm font-medium"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}

                                {/* Status Dropdown */}
                                <select
                                  value={task.status}
                                  onChange={(e) =>
                                    updateTaskStatus(task.id, e.target.value)
                                  }
                                  className={`${
                                    darkMode
                                      ? "bg-[#1a1a1a] border-gray-700 text-white"
                                      : "bg-yellow-50 border-yellow-200 text-yellow-800"
                                  } border px-4 py-2 rounded-xl font-medium cursor-pointer text-sm`}
                                >
                                  <option value="TODO">TODO</option>
                                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                                  <option value="DONE">DONE</option>
                                </select>
                              </div>

                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this item?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsModalOpen(false);
          setDeleteProjectId(null);
          setDeleteTaskId(null);
        }}
      />

    </div>
  );
}

export default Dashboard;