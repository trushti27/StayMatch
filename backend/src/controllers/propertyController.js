const Property = require("../models/Property");

// =====================================
// CREATE PROPERTY
// POST /api/v1/properties
// =====================================

const createProperty = async (req, res, next) => {
    try {
        const propertyData = {
            ...req.body,
            owner: req.user._id
        };

        const property = await Property.create(propertyData);

        res.status(201).json({
            success: true,
            message: "Property created successfully",
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

        res.status(200).json({
            success: true,
            message: "Property fetched successfully",
            data: {
                property
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
            "rules"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                property[field] = req.body[field];
            }
        });

        await property.save();

        res.status(200).json({
            success: true,
            message: "Property updated successfully",
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
    createProperty,
    getMyProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
};