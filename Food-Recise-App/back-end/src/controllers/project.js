const Project=require('../models/project.js');

const formatDate=(date)=> {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");//2 chu so
    const month = String(d.getMonth() + 1).padStart(2, "0");//so co 2 chu so
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const getProjects= async(req, res)=> {
    try {
      // Fetch all projects and populate the department field
      const projects = await Project.find().populate("department"); 

      // Map the response to include formatted output as required
      const formattedProjects = projects.map((project) => ({
        _id: project._id,
        name: project.name,
        description: project.description,
        startDate: formatDate(project.startDate),
        type: project.type,
        departmentId: project.department?._id || null,
        departmentName: project.department?.name || "No Department",
      }));
  
      // Return the formatted response
      return res.status(200).json(formattedProjects);
    } catch (error) {
      return res.status(500).json({message:error.toString()});
    }
  }
  module.exports={
    getProjects,
  }