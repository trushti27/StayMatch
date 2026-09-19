const Property = require("../models/Property");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const contactOwner = async (req, res, next) => { try { const property = await Property.findOne({ _id: req.params.id, verificationStatus: "verified", isActive: true }); if (!property) return res.status(404).json({ success: false, message: "Property not found" }); if (String(property.owner) === String(req.user._id)) return res.status(400).json({ success: false, message: "You cannot contact yourself" }); const participants = [req.user._id, property.owner]; let chat = await Chat.findOne({ participants: { $all: participants } }); if (!chat) chat = await Chat.create({ participants, property: property._id }); else if (!chat.property) { chat.property = property._id; await chat.save(); } const message = await Message.create({ chat: chat._id, sender: req.user._id, body: `Hi, I am interested in your property: ${property.title}` , readBy: [req.user._id] }); chat.lastMessage = message.body; chat.lastMessageAt = message.createdAt; await chat.save(); res.json({ success: true, message: "Owner chat is ready", data: { chat, message } }); } catch (error) { next(error); } };
const Review = require("../models/Review");
const listProperties = async (req, res, next) => { try { const { q, city, minRent, maxRent, propertyType, roomType, amenities, genderPreference } = req.query; const filter = { isActive: true, verificationStatus: "verified" }; if (city) filter["location.city"] = new RegExp(city, "i"); if (q) filter.$or = ["title", "location.area", "location.city"].map(field => ({ [field]: new RegExp(q, "i") })); if (minRent || maxRent) filter["pricing.monthlyRent"] = { ...(minRent && { $gte: Number(minRent) }), ...(maxRent && { $lte: Number(maxRent) }) }; if (propertyType) filter.propertyType = propertyType; if (roomType) filter["accommodation.roomType"] = roomType; if (genderPreference) filter["preferences.genderPreference"] = { $in: [genderPreference, "any"] }; if (amenities) filter.amenities = { $all: amenities.split(",") }; const properties = await Property.find(filter).populate("owner", "firstName lastName profileImage isVerified verificationStatus").sort({ createdAt: -1 }); res.json({ success: true, data: { properties, count: properties.length } }); } catch (error) { next(error); } };

// =====================================
// CREATE PROPERTY
// POST /api/v1/properties
// =====================================

const createProperty = async (req, res, next) => {
    try {
        let verificationDoc = undefined;
        if (req.file) {
            verificationDoc = {
                documentType: req.body.documentType || "Property ownership document",
                documentName: req.file.originalname,
                fileUrl: `/uploads/documents/${req.file.filename}`,
                uploadedAt: new Date()
            };
        } else if (req.body.verificationDocument) {
            verificationDoc = typeof req.body.verificationDocument === "string"
                ? JSON.parse(req.body.verificationDocument)
                : req.body.verificationDocument;
        }

        // Support multipart/form-data with JSON-stringified nested fields
        const parsedBody = { ...req.body };
        ["location", "pricing", "accommodation", "preferences", "amenities", "rules", "images"].forEach((field) => {
            if (typeof parsedBody[field] === "string") {
                try {
                    parsedBody[field] = JSON.parse(parsedBody[field]);
                } catch {
                    // keep unchanged if not json
                }
            }
        });

        const propertyData = {
            ...parsedBody,
            owner: req.user._id,
            verificationStatus: "pending",
            rejectionReason: null,
            ...(verificationDoc && { verificationDocument: verificationDoc })
        };

        const property = await Property.create(propertyData);

        res.status(201).json({
            success: true,
            message: "Property created successfully and submitted for admin verification",
            data: {
                property
            }
        });
    } catch (error) {
        next(error);
    }
};


// =====================================
// GET MY PROPERTIES
// GET /api/v1/properties/my
// =====================================

const getMyProperties = async (req, res, next) => {
    try {
        const properties = await Property.find({
            owner: req.user._id
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            message: "Properties fetched successfully",
            data: {
                properties,
                count: properties.length
            }
        });
    } catch (error) {
        next(error);
    }
};


// =====================================
// GET SINGLE PROPERTY
// GET /api/v1/properties/:id
// =====================================

const getPropertyById = async (req, res, next) => {
    try {
        const property = await Property.findById(
            req.params.id
        ).populate(
            "owner",
            "firstName lastName email phone profileImage"
        );

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        const reviews = await Review.find({ property: property._id, isVisible: true }).populate("author", "firstName lastName profileImage").sort({ createdAt: -1 });
        const averageRating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
        res.status(200).json({
            success: true,
            message: "Property fetched successfully",
            data: {
                property, reviews, averageRating
            }
        });
    } catch (error) {
        next(error);
    }
};


// =====================================
// UPDATE PROPERTY
// PUT /api/v1/properties/:id
// =====================================

const updateProperty = async (req, res, next) => {
    try {
        const property = await Property.findById(
            req.params.id
        );

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        // Ownership check
        if (
            property.owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to modify this property"
            });
        }

        // Fields that owner is allowed to update
        const allowedFields = [
            "title",
            "description",
            "propertyType",
            "location",
            "pricing",
            "accommodation",
            "preferences",
            "amenities",
            "images",
            "rules",
            "verificationDocument"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                if (field === "verificationDocument" && typeof req.body[field] === "string") {
                    try {
                        property[field] = JSON.parse(req.body[field]);
                    } catch {
                        property[field] = req.body[field];
                    }
                } else {
                    property[field] = req.body[field];
                }
            }
        });

        if (req.file) {
            property.verificationDocument = {
                documentType: req.body.documentType || "Property ownership document",
                documentName: req.file.originalname,
                fileUrl: `/uploads/documents/${req.file.filename}`,
                uploadedAt: new Date()
            };
        }

        // Any owner edit must be reviewed again before it appears to students.
        property.verificationStatus = "pending";
        property.rejectionReason = null;

        await property.save();

        res.status(200).json({
            success: true,
            message: "Property updated successfully and set to pending review",
            data: {
                property
            }
        });
    } catch (error) {
        next(error);
    }
};

// =====================================
// UPLOAD VERIFICATION DOCUMENT
// POST /api/v1/properties/:id/verification-document
// =====================================
const uploadVerificationDocument = async (req, res, next) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        // Ownership check
        if (property.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to upload documents for this property"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a verification document"
            });
        }

        property.verificationDocument = {
            documentType: req.body.documentType || "Property ownership document",
            documentName: req.file.originalname,
            fileUrl: `/uploads/documents/${req.file.filename}`,
            uploadedAt: new Date()
        };

        // Reset to pending when new document is uploaded
        property.verificationStatus = "pending";
        property.rejectionReason = null;

        await property.save();

        res.status(200).json({
            success: true,
            message: "Verification document uploaded successfully. Property is now pending review.",
            data: {
                property
            }
        });
    } catch (error) {
        next(error);
    }
};


// =====================================
// DELETE PROPERTY
// DELETE /api/v1/properties/:id
// =====================================

const deleteProperty = async (req, res, next) => {
    try {
        const property = await Property.findById(
            req.params.id
        );

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        // Ownership check
        if (
            property.owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this property"
            });
        }

        await property.deleteOne();

        res.status(200).json({
            success: true,
            message: "Property deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    contactOwner,
    listProperties,
    createProperty,
    getMyProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    uploadVerificationDocument
};
