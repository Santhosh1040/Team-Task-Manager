const prisma = require("../utils/prisma");

// CREATE TASK
const createTask = async (req, res) => {
  try {

    const {
      title,
      description,
      projectId,
      assignedUserIds,
      priority,
      dueDate,
    } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        priority,

        dueDate: dueDate
          ? new Date(dueDate)
          : null,

        assignedUsers: {
          create: assignedUserIds.map((userId) => ({
            userId,
          })),
        },
      },

      include: {
        assignedUsers: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// ASSIGN TASK
const assignTask = async (req, res) => {
  try {

    const { taskId } = req.params;
    const { userIds } = req.body;

    // Delete old assignments
    await prisma.taskMember.deleteMany({
      where: {
        taskId,
      },
    });

    // Create new assignments
    await prisma.taskMember.createMany({
      data: [...new Set(userIds)].map((userId) => ({
        taskId,
        userId,
      })),

      skipDuplicates: true,
    });

    const updatedTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },

      include: {
        assignedUsers: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Task assigned successfully",
      task: updatedTask,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  try {

    const { taskId } = req.params;

    const {
      title,
      description,
      priority,
      dueDate,
      assignedUserIds,
    } = req.body;

    // Update task details
    await prisma.task.update({
      where: {
        id: taskId,
      },

      data: {
        title,
        description,
        priority,

        dueDate: dueDate
          ? new Date(dueDate)
          : null,
      },
    });

    // Remove old members
    await prisma.taskMember.deleteMany({
      where: {
        taskId,
      },
    });

    // Add updated members
    await prisma.taskMember.createMany({
      data: [...new Set(assignedUserIds)].map((userId) => ({
        taskId,
        userId,
      })),

      skipDuplicates: true,
    });

    // Fetch updated task
    const finalTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },

      include: {
        assignedUsers: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Task updated successfully",
      task: finalTask,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// UPDATE TASK STATUS
const updateTaskStatus = async (req, res) => {
  try {

    const { taskId } = req.params;
    const { status } = req.body;

    const existingTask = await prisma.task.findUnique({
      where: {
        id: taskId,
      },

      include: {
        assignedUsers: true,
      },
    });

    if (!existingTask) {

      return res.status(404).json({
        message: "Task not found",
      });

    }

    // ADMIN can update all tasks
    // MEMBER can update only assigned tasks

    const isAssigned = existingTask.assignedUsers.some(
      (assignment) => assignment.userId === req.user.id
    );

    if (
      req.user.role !== "ADMIN" &&
      !isAssigned
    ) {

      return res.status(403).json({
        message: "Access denied",
      });

    }

    const task = await prisma.task.update({
      where: {
        id: taskId,
      },

      data: {
        status,
      },
    });

    res.status(200).json({
      message: "Task status updated",
      task,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// GET TASKS
const getTasks = async (req, res) => {
  try {

    let tasks;

    // ADMIN
    if (req.user.role === "ADMIN") {

      tasks = await prisma.task.findMany({
        include: {
          project: true,

          assignedUsers: {
            include: {
              user: true,
            },
          },
        },
      });

    }

    // MEMBER
    else {

      tasks = await prisma.task.findMany({
        where: {
          assignedUsers: {
            some: {
              userId: req.user.id,
            },
          },
        },

        include: {
          project: true,

          assignedUsers: {
            include: {
              user: true,
            },
          },
        },
      });

    }

    res.status(200).json(tasks);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// GET MY TASKS
const getMyTasks = async (req, res) => {
  try {

    const tasks = await prisma.task.findMany({
      where: {
        assignedUsers: {
          some: {
            userId: req.user.id,
          },
        },
      },

      include: {
        project: true,

        assignedUsers: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json(tasks);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {

    const { taskId } = req.params;

    await prisma.taskMember.deleteMany({
      where: {
        taskId,
      },
    });

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    res.status(200).json({
      message: "Task deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  createTask,
  assignTask,
  updateTask,
  updateTaskStatus,
  getTasks,
  getMyTasks,
  deleteTask,
};