import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("user"); // default to show user logs

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    axios
      .get("http://localhost:5000/admin/summary", { withCredentials: true })
      .then((res) => setLogs(res.data.logs))
      .catch((err) => console.error("Failed to fetch logs", err));
  };

  const filteredLogs = logs.filter((log) => {
    const roleMatches =
      roleFilter === "all" || log.role.toLowerCase() === roleFilter.toLowerCase();
    const searchMatches =
      log.name.toLowerCase().includes(search.toLowerCase()) ||
      log.email.toLowerCase().includes(search.toLowerCase());
    return roleMatches && searchMatches;
  });

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-green-900 mb-6">
        All User Activity Logs
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded shadow-sm"
        >
          <option value="user">User Only</option>
          <option value="admin">Admin Only</option>
          <option value="all">All</option>
        </select>

        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded shadow-sm w-full md:w-1/2"
        />
      </div>

      <table className="min-w-full bg-white shadow rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Action</th>
            <th className="px-4 py-2">Method</th>
            <th className="px-4 py-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log, i) => (
            <tr key={log.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">{log.name}</td>
              <td className="px-4 py-2">{log.email}</td>
              <td className="px-4 py-2">{log.action}</td>
              <td className="px-4 py-2 capitalize">{log.method}</td>
              <td className="px-4 py-2">{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredLogs.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No logs found.</p>
      )}
    </div>
  );
}
