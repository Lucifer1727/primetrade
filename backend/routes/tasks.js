const express = require('express');
const Task = require('../models/Task');
const { auth } = require('../middleware/auth');
const {
  validateTask,
  validateTaskUpdate,
  handleValidationErrors
} = require('../middleware/validation');

const router = express.Router();

// @desc    Get all tasks for authenticated user
// @route   GET /api/tasks
// @access  Private
router.get('/', auth, async (req, res, next) => {
  try {
    const {
      status,
      priority,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      includeArchived = 'false'
    } = req.query;

    // Build query
    const query = {
      user: req.user.id,
      isArchived: includeArchived === 'true' ? { $in: [true, false] } : false
    };

    // Add filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = new RegExp(category, 'i');
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email');

    // Get total count for pagination
    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: tasks.length,
        totalRecords: total
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
router.get('/:id', auth, async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('user', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
router.post('/', auth, validateTask, handleValidationErrors, async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const task = await Task.create(req.body);
    
    // Populate user data
    await task.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', auth, validateTaskUpdate, handleValidationErrors, async (req, res, next) => {
  try {
    let task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Don't allow updating the user field
    delete req.body.user;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Archive/Unarchive task
// @route   PATCH /api/tasks/:id/archive
// @access  Private
router.patch('/:id/archive', auth, async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.isArchived = !task.isArchived;
    await task.save();

    res.status(200).json({
      success: true,
      message: `Task ${task.isArchived ? 'archived' : 'unarchived'} successfully`,
      data: task
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get task statistics
// @route   GET /api/tasks/stats/overview
// @access  Private
router.get('/stats/overview', auth, async (req, res, next) => {
  try {
    const stats = await Task.getTaskStats(req.user.id);
    
    // Get overdue tasks count
    const overdueCount = await Task.countDocuments({
      user: req.user.id,
      dueDate: { $lt: new Date() },
      status: { $nin: ['completed', 'cancelled'] },
      isArchived: false
    });

    // Get tasks due today
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const dueTodayCount = await Task.countDocuments({
      user: req.user.id,
      dueDate: { $gte: todayStart, $lt: todayEnd },
      status: { $nin: ['completed', 'cancelled'] },
      isArchived: false
    });

    res.status(200).json({
      success: true,
      data: {
        ...stats,
        overdue: overdueCount,
        dueToday: dueTodayCount
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Bulk update tasks
// @route   PATCH /api/tasks/bulk
// @access  Private
router.patch('/bulk', auth, async (req, res, next) => {
  try {
    const { taskIds, updates } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task IDs are required'
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates are required'
      });
    }

    // Don't allow updating the user field
    delete updates.user;

    const result = await Task.updateMany(
      {
        _id: { $in: taskIds },
        user: req.user.id
      },
      updates
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} tasks updated successfully`,
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;