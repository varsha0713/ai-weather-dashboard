const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("City", citySchema);