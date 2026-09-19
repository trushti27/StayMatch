const express=require("express"),{protect,authorize}=require("../middleware/authMiddleware"),c=require("../controllers/featureController");
const favorites=express.Router();favorites.use(protect);favorites.get("/",c.favorites);favorites.post("/:propertyId",authorize("student"),c.favorites);favorites.delete("/:propertyId",authorize("student"),c.favorites);
const reviews=express.Router();reviews.get("/my",protect,authorize("student"),c.myReviews);reviews.get("/:propertyId",c.reviews);reviews.post("/:propertyId",protect,authorize("student"),c.reviews);
const connections=express.Router();connections.use(protect,authorize("student"));connections.get("/",c.connections);connections.post("/:userId",c.connections);connections.patch("/:id",c.respondConnection);
const chats=express.Router();chats.use(protect);chats.get("/",c.chats);chats.get("/:chatId/messages",c.messages);chats.post("/:chatId/messages",c.messages);
const reports=express.Router();reports.use(protect);reports.post("/",c.report);
const admin=express.Router();admin.use(protect,authorize("admin"));admin.get("/stats",c.adminStats);admin.get("/users",c.adminUsers);admin.patch("/users/:id",c.updateUser);admin.get("/properties",c.pendingProperties);admin.patch("/properties/:id",c.verifyProperty);admin.get("/reviews",c.adminReviews);admin.patch("/reviews/:id",c.moderateReview);admin.get("/reports",c.adminReports);admin.patch("/reports/:id",c.resolveReport);
module.exports={favorites,reviews,connections,chats,reports,admin};
