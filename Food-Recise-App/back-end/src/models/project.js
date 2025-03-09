const Department =require('./department.js');
const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    startDate: { type: Date },
    type: { type: String },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
  },
  {
    timestamps: true,
  }
);
const Project = mongoose.model("Project", projectSchema);
module.exports= Project;
