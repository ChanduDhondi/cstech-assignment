import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  let user = null;
  const token = localStorage.getItem("token");

  if (token) {
    user = jwtDecode(token);
  }

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file.");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user", user.id);
    try {
      const response = await axios.post(
        "https://cstech-assignment.onrender.com/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage("File uploaded and tasks distributed.");
      navigate("/dashboard");
    } catch (error) {
      setMessage(error?.response?.data.error || "Upload failed");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Upload CSV/XLSX</h2>
      {message && (
        <div className="mb-4 text-center text-blue-600">{message}</div>
      )}
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-400"
      />
      <button
        onClick={handleUpload}
        className="bg-purple-600 text-white w-full py-2 rounded-xl hover:bg-purple-700 mt-[10px]"
      >
        Upload & Distribute
      </button>
    </div>
  );
};

export default UploadCSV;
