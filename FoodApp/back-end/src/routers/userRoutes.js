const express = require('express');
const { register, login, getAllUsers, changePassword } = require('../controllers/userController.js');
const { verifyToken, verifyRole } = require('../middleware/authorization.js');

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/change-password', verifyToken, changePassword);
userRouter.get('/', verifyToken, verifyRole(['Admin']), getAllUsers);


module.exports = userRouter;
