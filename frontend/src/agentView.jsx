// src/pages/AgentView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AgentView = () => {
  const { agentId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    const fetchAgentTasks = async () => {
      try {
        const response = await axios.get(
          `https://cstech-assignment.onrender.com/api/tasks/${agentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data);
        setTasks(response.data.tasks);
        setAgent(response.data.agent);
      } catch (error) {
        console.error("Error fetching tasks for agent:", error);
      }
    };

    fetchAgentTasks();
  }, [agentId]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Agent Tasks</h1>
      {agent && (
        <div className="mb-4">
          <p>
            <strong>Name:</strong> {agent.name}
          </p>
          <p>
            <strong>Email:</strong> {agent.email}
          </p>
        </div>
      )}

      {tasks.length === 0 ? (
        <p>No tasks found for this agent.</p>
      ) : (
        <table className="min-w-full table-auto border border-gray-300 mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">First Name</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Notes</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{task.firstname}</td>
                <td className="px-4 py-2 border">{task.phone}</td>
                <td className="px-4 py-2 border">{task.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AgentView;
