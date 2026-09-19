const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ===============================
// REGISTER
// ===============================
const register = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            role,
            gender
        } = req.body;

        // Required fields validation
        if (!firstName || !lastName || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: first name, last name, email, phone, and password"
            });
        }

        // Security: strictly forbid public admin registration
        if (role === "admin") {
            return res.status(400).json({
                success: false,
                message: "Admin accounts cannot be registered publicly. Only Student and Property Owner accounts are allowed."
            });
        }

        // Only allow student or owner
        const allowedRole = role === "owner" ? "owner" : "student";

        // Check existing user
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            password: hashedPassword,
            role: allowedRole,
            gender: gender || "other"
        });

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    profileImage: user.profileImage
                },
                token
            }
        });

    } catch (error) {
        next(error);
    }
};

// ===============================
// LOGIN
// ===============================
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User
            .findOne({ email: email.toLowerCase().trim() })
            .select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    profileImage: user.profileImage
                },
                token
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login
};
