const express = require("express");

const dishRouter = require("./dishRoutes");
const userRouter = require("./userRoutes");

const router = express.Router();

router.use('/dish',dishRouter);
router.use('/users', userRouter);

module.exports = router;