const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const verifyToken = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }
        token = token.split(' ')[1];

        const jwtsecret = process.env.JWT_SECRET;
        jwt.verify(token, jwtsecret, async (error, decoded) => {
            if (error) {
                return res.status(401).json({ message: 'Token verification failed' });
            }
            req.UserID = decoded.id;
            
            // 🔍 Lấy thông tin user từ DB và role dưới dạng string
            const user = await User.findById(decoded.id).populate('role');
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            
            req.user = {
                id: user._id,
                role: user.role.role_type // Chuyển role thành string thay vì ObjectId
            };
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: error.toString() });
    }
};

// 📌 Middleware phân quyền: Chỉ cho phép user có role nhất định truy cập
const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: '🚫 Permission denied' });
        }
        next();
    };
};

module.exports = {
    verifyToken,
    verifyRole
};
