import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminBoard() {
  const [userCount, setUserCount] = useState(0);
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    axios.get("http://localhost:5000/admin/summary", { withCredentials: true })
      .then(res => {
        setUserCount(res.data.user_count);
        setLogs(res.data.logs);
      })
      .catch(err => console.error("Error fetching logs:", err));
  };

  const filteredLogs = logs.filter(log => {
    if (filter === "all") return true;
    return log.method === filter;
  });

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Admin Dashboard</h1>

      <div className="mb-6">
        <div className="bg-white p-6 rounded shadow text-xl font-semibold text-gray-800">
          👤 Total Users: <span className="text-blue-700">{userCount}</span>
        </div>
      </div>

      <div className="mb-4 flex gap-4 items-center">
        <label className="font-medium">Filter by Method:</label>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border border-gray-300 px-3 py-1 rounded shadow-sm focus:outline-none"
        >
          <option value="all">All</option>
          <option value="password">Password</option>
          <option value="face">Face</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left px-4 py-2">#</th>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Action</th>
              <th className="text-left px-4 py-2">Method</th>
              <th className="text-left px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={log.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{log.name}</td>
                <td className="px-4 py-2">{log.email}</td>
                <td className="px-4 py-2">{log.action}</td>
                <td className="px-4 py-2">{log.method}</td>
                <td className="px-4 py-2">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No logs found.</p>
        )}
      </div>
    </div>
  );
}
