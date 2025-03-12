const mongoose = require('mongoose');
const { Schema } = mongoose;

const ingredientSchema = new Schema(
  {
    name: [{ type: String, required: true }] // Cột name có thể chứa nhiều tên nguyên liệu
  },
  { timestamps: true }
);

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient;
