const mongoose = require('mongoose');
const { Schema } = mongoose;

const dishSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    category: {
      country: { type: String },
      mealTime: [{ type: String }],
      foodType: [{ type: String }]
    },
    isDeleted: { type: Boolean, default: false },
    recipe: { type: Schema.Types.ObjectId, ref: 'Recipe' } // Liên kết với Recipe
  },
  { timestamps: true }
);

const Dish = mongoose.model('Dish', dishSchema);
module.exports = Dish;
