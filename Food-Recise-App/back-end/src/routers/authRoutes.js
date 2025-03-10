const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Role = require("../models/role");
const { sendResetEmail } = require("../utils/mailer.js");

const router = express.Router();

// 📌 Đăng ký User
router.post("/register", async (req, res) => {
  const { username, email, password, phoneNumber, role_type } = req.body;

  try {
    console.log("📌 Bắt đầu đăng ký...");
    
    // 1️⃣ Kiểm tra role_type hợp lệ
    if (!["User", "Admin"].includes(role_type)) {
      return res.status(400).json({ error: "Invalid role type" });
    }

    // 2️⃣ Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // 3️⃣ Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Tạo user mới
    const newUser = new User({ username, email, password: hashedPassword, phoneNumber });
    await newUser.save();
    
    console.log("✅ User mới đã được lưu:", newUser);

    // 5️⃣ Tạo role và liên kết với user
    const userRole = new Role({ role_type, user: newUser._id });
    await userRole.save();

    console.log("✅ Role mới đã được gán:", userRole);

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("❌ Lỗi khi đăng ký:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 Đăng nhập User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("📌 Bắt đầu đăng nhập...");
    console.log("📌 Email nhận được:", email);

    // 1️⃣ Kiểm tra email có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User không tìm thấy!");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ User tìm thấy:", user);

    // 2️⃣ Kiểm tra mật khẩu
    console.log("📌 Mật khẩu đã mã hóa từ DB:", user.password);
    console.log("📌 Mật khẩu nhập vào:", password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("📌 Kết quả so sánh mật khẩu:", isMatch);

    if (!isMatch) {
      console.log("❌ Mật khẩu không khớp!");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // 3️⃣ Lấy role từ bảng Role
    const roleData = await Role.findOne({ user: user._id });
    if (!roleData) {
      console.log("❌ Không tìm thấy quyền user!");
      return res.status(400).json({ error: "User role not found" });
    }

    console.log("✅ Role của user:", roleData.role_type);

    // 4️⃣ Tạo JWT token
    const token = jwt.sign(
      { id: user._id, role: roleData.role_type },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Đăng nhập thành công! Trả về token...");
    res.json({
      token,
      user: { id: user._id, username: user.username, role: roleData.role_type },
    });

  } catch (error) {
    console.error("❌ Lỗi Server:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 Đổi mật khẩu
router.post("/change-password", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Old password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save(); // Thêm `await` để đảm bảo lưu thành công

    res.json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("❌ Lỗi đổi mật khẩu:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 Quên mật khẩu (Gửi email)
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    console.log(`📩 Gửi email reset password tới: ${email}`);
    console.log(`📌 Token reset: ${token}`);

    await sendResetEmail(email, token);

    res.json({ message: "Password reset email sent" });

  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
