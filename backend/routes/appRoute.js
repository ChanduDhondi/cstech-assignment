const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  registerUser,
  loginUser,
  createAgent,
  getAgents,
  uploadFile,
  agentTasks,
} = require("../controllers/appController");

const { authMiddleware } = require("../middleware.js");

// multer setup
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = [".csv", ".xlsx", ".xls"];
    const ext = path.extname(file.originalname).toLocaleLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV, XLSX, and XLS files are allowed"));
    }
  },
});

router.post("/loginUser", loginUser);
router.post("/registerUser", registerUser);
router.post("/createAgent", authMiddleware, createAgent);
router.get("/getAgents", authMiddleware, getAgents);
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);
router.get("/tasks/:agentId", authMiddleware, agentTasks);

module.exports = router;
