const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipeSchema = new Schema(
  {
    instructions: { type: String, required: true },
    cookTimeMinutes: { type: Number, required: true },
    difficulty: { type: String, required: true },
    calories: { type: Number, required: true },
    ingredient: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }] // Liên kết với Ingredient
  },
  { timestamps: true }
);

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
