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
            role
        } = req.body;

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Security: don't allow client to create admin account
        const allowedRole =
            role === "owner" ? "owner" : "student";

        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            role: allowedRole
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

        const user = await User
            .findOne({ email })
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