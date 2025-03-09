const express =require('express');
const {getProjects}= require('../controllers/project.js');

const projectRouter=express.Router();

projectRouter.get('/',getProjects);

module.exports= projectRouter;