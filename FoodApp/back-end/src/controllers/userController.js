const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const Role = require('../models/Role.js');

const SALT_ROUNDS = parseInt(process.env.SALT_JWT) || 10;
const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    try {
        const { username, password, email, phoneNumber } = req.body; 
        if (!username || !password || !email || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        let userRole = await Role.findOne({ role_type: "User" });
        if (!userRole) {
            userRole = new Role({ role_type: "User" });
            await userRole.save();
            console.log(`🆕 Role 'User' created.`);
        }

        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            phoneNumber,
            role: userRole._id 
        });

        await newUser.save();
        return res.status(201).json({ message: '✅ Register successfully', data: newUser });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(500).json({ message: 'user does not exist' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(500).json({ message: 'password incorrect' });
        }
        // create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        const userData = {
            ...user._doc,
            password: 'not show'
        }
        return res.status(200).json({
            token,
            user: userData
        });
    } catch (error) {
        return res.status(500).json({ message: error.toString() });
    }
}


// 📌 Đổi mật khẩu
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Both old and new passwords are required' });
        }

        const user = await User.findById(req.UserID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // Mã hóa mật khẩu mới
        user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await user.save();

        return res.status(200).json({ message: '✅ Password changed successfully' });

    } catch (error) {
        console.error("❌ Change password error:", error);
        return res.status(500).json({ message: error.message });
    }
};

// 📌 Lấy danh sách người dùng (Chỉ Admin mới có quyền)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').populate('role');
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Export tất cả controller
module.exports = { register, login, changePassword, getAllUsers };
