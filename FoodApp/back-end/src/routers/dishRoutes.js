const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');

// API lấy danh sách món ăn
router.get('/', dishController.getAllDishes);

// API lấy chi tiết món ăn theo ID
router.get('/:id', dishController.getDishById);

module.exports = router;
