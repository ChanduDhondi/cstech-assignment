const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const agentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

agentSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

const Agent = mongoose.model("Agent", agentSchema);

module.exports = Agent;
