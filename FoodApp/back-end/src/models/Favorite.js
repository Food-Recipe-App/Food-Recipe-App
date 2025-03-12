const mongoose = require('mongoose');
const { Schema } = mongoose;

const favoriteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dish: { type: Schema.Types.ObjectId, ref: 'Dish', required: true }
  },
  {
    timestamps: true
  }
);

const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;
