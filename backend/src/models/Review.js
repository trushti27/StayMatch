const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({ property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true }, author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, rating: { type: Number, required: true, min: 1, max: 5 }, comment: { type: String, required: true, trim: true, maxlength: 1000 }, isVisible: { type: Boolean, default: true } }, { timestamps: true });
reviewSchema.index({ property: 1, author: 1 }, { unique: true });
module.exports = mongoose.model("Review", reviewSchema);
