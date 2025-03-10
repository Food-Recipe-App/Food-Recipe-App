const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  role_type: { type: String, enum: ["Admin", "User"], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Role", RoleSchema);
