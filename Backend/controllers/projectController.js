const prisma = require("../utils/prisma");

// CREATE PROJECT
const createProject = async (req, res) => {
  try {

    const {
      title,
      description,
      priority,
      dueDate,
      memberIds,
    } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        priority,

        dueDate: dueDate
          ? new Date(dueDate)
          : null,

        createdById: req.user.id,

        members: {
          create: (memberIds || []).map((userId) => ({
            userId,
          })),
        },
      },

      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// GET PROJECTS
const getProjects = async (req, res) => {
  try {

    let projects;

    // ADMIN
    if (req.user.role === "ADMIN") {

      projects = await prisma.project.findMany({
        include: {
          members: {
            include: {
              user: true,
            },
          },

          tasks: {
            include: {
              assignedUsers: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

    }

    // MEMBER
    else {

      projects = await prisma.project.findMany({
        where: {
          members: {
            some: {
              userId: req.user.id,
            },
          },
        },

        include: {
          members: {
            include: {
              user: true,
            },
          },

          tasks: {
            where: {
              assignedUsers: {
                some: {
                  userId: req.user.id,
                },
              },
            },

            include: {
              assignedUsers: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

    }

    res.status(200).json(projects);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// UPDATE PROJECT
const updateProject = async (req, res) => {
  try {

    const { projectId } = req.params;

    const {
      title,
      description,
      priority,
      dueDate,
      memberIds,
    } = req.body;

    // Delete old members
    await prisma.projectMember.deleteMany({
      where: {
        projectId,
      },
    });

    // Update project
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },

      data: {
        title,
        description,
        priority,

        dueDate: dueDate
          ? new Date(dueDate)
          : null,

        members: {
          create: (memberIds || []).map((userId) => ({
            userId,
          })),
        },
      },

      include: {
        members: {
          include: {
            user: true,
          },
        },

        tasks: {
          include: {
            assignedUsers: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// DELETE PROJECT
const deleteProject = async (req, res) => {
  try {

    const { projectId } = req.params;

    // Get all tasks under this project
    const tasks = await prisma.task.findMany({
      where: {
        projectId,
      },
    });

    const taskIds = tasks.map((task) => task.id);

    // Delete task members
    await prisma.taskMember.deleteMany({
      where: {
        taskId: {
          in: taskIds,
        },
      },
    });

    // Delete tasks
    await prisma.task.deleteMany({
      where: {
        projectId,
      },
    });

    // Delete project members
    await prisma.projectMember.deleteMany({
      where: {
        projectId,
      },
    });

    // Delete project
    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    res.status(200).json({
      message: "Project deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
};