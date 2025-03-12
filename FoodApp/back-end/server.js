const express = require('express');
const mongoose = require('mongoose');
const router = require('./src/routers/index.js');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Đảm bảo API có thể đọc JSON từ request body

const PORT = process.env.PORT || 9999;
const MONGODB_URI = process.env.MONGODB_URI;

// Kết nối MongoDB và xử lý lỗi
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Gọi Router
app.use('/', router);

// app.listen(PORT, () => {
//     console.log(`🚀 Server is running at http://localhost:${PORT}`);
// });

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server đang chạy tại http://0.0.0.0:${PORT}`);
});
