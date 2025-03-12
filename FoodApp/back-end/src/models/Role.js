const mongoose = require('mongoose');
const { Schema } = mongoose;

const roleSchema = new Schema(
  {
    role_type: { type: String, required: true }
  }
);

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
