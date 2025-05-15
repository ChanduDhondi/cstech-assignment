const bcrypt = require("bcryptjs");
const Agent = require("../models/agent.js");
const Task = require("../models/task.js");
const User = require("../models/user.js");
const xlsx = require("xlsx");
const jwt = require("jsonwebtoken");
const path = require("path");
const { json } = require("stream/consumers");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email: email });
    if (existing)
      return res.status(409).json({ error: "User already exists with Email" });

    const user = new User({
      name: name,
      email: email,
      password: password,
    });
    const response = await user.save();
    res.status(201).json({ message: "User Registered successfully", response });
  } catch (err) {
    console.log("Error while registering User", err.message);
    res.status(500).json({
      error: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(401).json({ message: "Required email password" });

  try {
    const data = await User.findOne({ email: email });
    if (!data)
      return res
        .status(404)
        .json({ error: `User not exists with email: ${email}` });
    const hashed = data.password;
    const response = await bcrypt.compare(password, hashed);
    if (!response)
      return res.status(404).json({ error: "Entered wrong password" });

    const token = jwt.sign(
      { email: email, id: data._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "7 days",
      }
    );
    res.status(200).json({ message: "User login successfully", token });
  } catch (err) {
    console.log("Error while login User", err.message);
    res.status(500).json({
      error: err.message,
    });
  }
};

const createAgent = async (req, res) => {
  const { name, email, mobile, password } = req.body;
  console.log(name, email, mobile, password);
  if (!name || !email || !mobile || !password)
    return res
      .status(401)
      .json({ error: "Required fields: Name, Email, Mobile, Password" });
  try {
    const registered = await Agent.findOne({ email: email });
    if (registered)
      return res.status(409).json({ error: "User exists with email" });

    const newAgent = new Agent({ name, email, mobile, password });
    const savedAgent = await newAgent.save();
    const io = req.app.get("io");
    io.emit("agentAdded", savedAgent);
    res.status(201).json({ message: "Agent Created Successfully" });
  } catch (err) {
    console.log("Error while creating Agent", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getAgents = async (req, res) => {
  try {
    const allAgents = await Agent.find();
    res.status(200).json({ allAgents });
  } catch (err) {
    console.log("Error while fetching Agents");
    res.status(500).json({ error: err.message });
  }
};

const uploadFile = async (req, res) => {
  try {
    const { user } = req.body;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    let jsonData = [];

    if (fileExt === ".csv") {
      // CSV parsing
      const csvStr = req.file.buffer.toString("utf-8");
      const workbook = xlsx.read(csvStr, { type: "string" });
      const sheetName = workbook.SheetNames[0];
      jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else if (fileExt === ".xlsx" || fileExt === ".xls") {
      // Excel parsing
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else {
      return res.status(400).json({ error: "Unsupported file type." });
    }

    const isValid = jsonData.every((row) => row.name && row.phone && row.notes);
    if (!isValid) {
      return res.status(400).json({
        error: "Invalid file format. Required columns: name, phone, notes",
      });
    }
    const agents = await Agent.find();
    const agentCount = agents.length;

    if (agentCount === 0) {
      return res
        .status(400)
        .json({ message: "No agents found to assign tasks." });
    }

    const totalTasks = jsonData.length;
    const baseTaskCount = Math.floor(totalTasks / agentCount); // Minimum number of tasks per agent
    let extraTasks = totalTasks % agentCount; // Remaining tasks to distribute
    let taskIndex = 0;
    const distributedTasks = [];

    for (let i = 0; i < agentCount; i++) {
      const tasksForThisAgent = baseTaskCount + (extraTasks > 0 ? 1 : 0);
      const assignedTasks = [];

      for (let j = 0; j < tasksForThisAgent; j++) {
        const task = jsonData[taskIndex];
        assignedTasks.push({
          firstname: task.name,
          phone: task.phone,
          notes: task.notes,
          agent: agents[i]._id,
          user: user,
        });
        taskIndex++;
      }

      distributedTasks.push(...assignedTasks);
      if (extraTasks > 0) extraTasks--;
    }

    // Save all tasks to MongoDB (assuming you have a Task model)
    await Task.insertMany(distributedTasks);
    res.status(200).json({
      message: "Tasks distributed and saved successfully",
      tasks: distributedTasks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while processing file." });
  }
};

const agentTasks = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.agentId);
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const tasks = await Task.find({ agent: req.params.agentId });
    res.status(200).json({ agent, tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  createAgent,
  getAgents,
  uploadFile,
  agentTasks,
};
