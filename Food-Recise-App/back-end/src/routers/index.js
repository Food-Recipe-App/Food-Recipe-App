const express= require('express');

const projectRouter=require('./project.js')
const router =express.Router();

router.use('/projects',projectRouter);

module.exports= router;