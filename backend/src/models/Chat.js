const mongoose = require("mongoose");
const schema = new mongoose.Schema({ participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }], property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" }, lastMessage: { type: String, default: "" }, lastMessageAt: Date }, { timestamps: true });
schema.index({ participants: 1 });
module.exports = mongoose.model("Chat", schema);
