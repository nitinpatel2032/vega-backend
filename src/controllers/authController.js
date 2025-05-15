const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signup = async (req, res) => {
    try {
        const { email, password, image, imageId } = req.body;

        const fetchedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({ fetchedEmail });
        if (existingUser) return res.status(409).json({ message: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email: fetchedEmail,
            password: hashedPassword,
            image,
            imageId
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully", user: user });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ message: "Error occured" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const fetchedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: fetchedEmail });
        if (!user) return res.status(401).json({ message: "Invalid email" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        if (!process.env.JWT_SECRET) return res.status(401).json({ message: "Missing JWT SECRET" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ message: "Login successfully", token, user: { id: user._id, email: user.email, image: user.image } });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Error occured" });
    }
};

exports.logout = async (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
};

exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Profile retrieved", data: user });
    } catch (error) {
        console.error("Error in fetch:", error);
        res.status(500).json({ message: "Error occured" });
    }
};