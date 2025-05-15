import React, { useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { useEffect } from "react";
import axios from "axios";

const socket = io("https://cstech-assignment.onrender.com");

const Dashboard = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get(
          "https://cstech-assignment.onrender.com/api/getAgents",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(res.data.allAgents);
        setAgents(res.data.allAgents);
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    };

    fetchAgents();

    // Listen for real-time agent updates
    socket.on("agentAdded", (newAgent) => {
      setAgents((prevAgents) => [...prevAgents, newAgent]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("agentAdded");
    };
  }, []);
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="space-x-4">
        <Link
          to="/agents"
          className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
        >
          Add Agents
        </Link>
        <Link
          to="/upload"
          className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600"
        >
          Upload CSV
        </Link>
        <Link
          to="/logout"
          className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-700"
        >
          Logout
        </Link>
      </div>
      <div className="space-x-4">
        <h2 className="text-3xl font-bold mt-6">All Agents</h2>
        {agents.length === 0 ? (
          <p className="text-gray-500 mt-[10px]">No agents found.</p>
        ) : (
          <div className="overflow-x-auto mt-[10px]">
            <table className="min-w-full table-auto border border-gray-200 rounded-lg shadow">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Phone</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border underline">
                      <Link to={`/agent/${agent._id}`}>{agent.name}</Link>
                    </td>
                    <td className="px-4 py-2 border">{agent.email}</td>
                    <td className="px-4 py-2 border">{agent.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
