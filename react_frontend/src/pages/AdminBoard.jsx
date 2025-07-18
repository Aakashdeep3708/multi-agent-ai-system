import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // assuming you have this component

export default function AdminBoard() {
  const [userCount, setUserCount] = useState(0);
  const [logs, setLogs] = useState([]);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
    fetchFeedbackCount();
  }, []);

  const fetchLogs = () => {
    axios
      .get("http://localhost:5000/admin/summary", { withCredentials: true })
      .then((res) => {
        setUserCount(res.data.user_count);
        setLogs(res.data.logs);
      })
      .catch((err) => console.error("Error fetching logs:", err));
  };

  const fetchFeedbackCount = () => {
    axios
      .get("http://localhost:5000/api/feedback")
      .then((res) => {
        setFeedbackCount(res.data.length);
      })
      .catch((err) => console.error("Error fetching feedback count:", err));
  };

  const filteredLogs = logs.filter((log) =>
    filter === "all" ? true : log.method === filter
  );

  const exportCSV = () => {
    const headers = "ID,Name,Email,Action,Method,Timestamp\n";
    const rows = filteredLogs.map(
      (log) =>
        `${log.id},"${log.name}",${log.email},${log.action},${log.method},${log.timestamp}`
    );
    const csv = headers + rows.join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "admin_logs.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-8 text-blue-900">Admin Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            onClick={() => navigate("/admin/users")}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:bg-blue-100 transition"
            title="Click to view all registered users"
          >
            <p className="text-xl font-semibold text-gray-800">👤 Total Users</p>
            <p className="text-4xl mt-2 text-blue-700 font-bold">{userCount}</p>
          </div>

          <div
            onClick={() => navigate("/admin/activities")}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:bg-green-100 transition"
            title="Click to view recent activities"
          >
            <p className="text-xl font-semibold text-gray-800">📋 Total Activities</p>
            <p className="text-4xl mt-2 text-green-700 font-bold">{logs.length}</p>
          </div>

          <div
            onClick={() => navigate("/Feedback")}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:bg-purple-100 transition"
            title="Click to view feedback entries"
          >
            <p className="text-xl font-semibold text-gray-800">💬 Feedback</p>
            <p className="text-4xl mt-2 text-purple-700 font-bold">{feedbackCount}</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
