import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddAgent = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://cstech-assignment.onrender.com/api/createAgent",
        form,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessage("Agent added successfully");
      setForm({ name: "", email: "", mobile: "", password: "" });
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to add agent");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Agent</h2>
      {message && (
        <div className="mb-4 text-center text-blue-600">{message}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full px-4 py-2 border rounded-xl"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full px-4 py-2 border rounded-xl"
        />
        <input
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          placeholder="Mobile with country code"
          required
          className="w-full px-4 py-2 border rounded-xl"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full px-4 py-2 border rounded-xl"
        />
        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded-xl hover:bg-green-700"
        >
          Add Agent
        </button>
      </form>
    </div>
  );
};

export default AddAgent;
