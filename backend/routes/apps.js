const express = require('express');
const router = express.Router();
const App = require('../models/App');

// GET /apps - Get all apps with filtering and search
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      department, 
      search, 
      sortBy = 'name', 
      order = 'asc',
      limit = 50,
      skip = 0 
    } = req.query;

    // Build filter object
    let filter = { status: 'Active' };

    // Category filter
    if (category && category !== '') {
      filter.category = category;
    }

    // Department filter
    if (department && department !== '') {
      filter.department = { $in: [department] };
    }

    // Search filter (text search across name, description, and features)
    if (search && search.trim() !== '') {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { features: { $elemMatch: { $regex: search.trim(), $options: 'i' } } }
      ];
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'popularity':
        sort.users = order === 'desc' ? -1 : 1;
        break;
      case 'rating':
        sort.rating = order === 'desc' ? -1 : 1;
        break;
      case 'recent':
        sort.createdAt = order === 'desc' ? -1 : 1;
        break;
      case 'name':
      default:
        sort.name = order === 'desc' ? -1 : 1;
        break;
    }

    const apps = await App.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Get total count for pagination
    const total = await App.countDocuments(filter);

    res.json({
      apps,
      total,
      hasMore: (parseInt(skip) + apps.length) < total
    });
  } catch (error) {
    console.error('Error fetching apps:', error);
    res.status(500).json({ message: 'Error fetching apps', error: error.message });
  }
});

// GET /apps/categories - Get unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await App.distinct('category', { status: 'Active' });
    res.json(categories.sort());
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// GET /apps/departments - Get unique departments
router.get('/departments', async (req, res) => {
  try {
    const departments = await App.distinct('department', { status: 'Active' });
    // Flatten array since department is an array field
    const uniqueDepartments = [...new Set(departments.flat())];
    res.json(uniqueDepartments.sort());
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Error fetching departments', error: error.message });
  }
});

// GET /apps/recommendations/:userId - Get personalized recommendations
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { userDepartment = 'Engineering', limit = 5 } = req.query;

    // Get apps recommended for user's department, sorted by rating
    const recommendations = await App.find({
      status: 'Active',
      department: { $in: [userDepartment] }
    })
    .sort({ rating: -1, users: -1 })
    .limit(parseInt(limit));

    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
  }
});

// GET /apps/stats - Get app catalog statistics
router.get('/stats', async (req, res) => {
  try {
    const totalApps = await App.countDocuments({ status: 'Active' });
    const totalUsers = await App.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: null, totalUsers: { $sum: '$users' } } }
    ]);
    
    const categoriesCount = await App.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalApps,
      totalUsers: totalUsers[0]?.totalUsers || 0,
      categoriesCount
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// GET /apps/:id - Get single app by ID
router.get('/:id', async (req, res) => {
  try {
    const app = await App.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }
    res.json(app);
  } catch (error) {
    console.error('Error fetching app:', error);
    res.status(500).json({ message: 'Error fetching app', error: error.message });
  }
});

// POST /apps - Create new app (admin only)
router.post('/', async (req, res) => {
  try {
    const app = new App(req.body);
    await app.save();
    res.status(201).json(app);
  } catch (error) {
    console.error('Error creating app:', error);
    res.status(500).json({ message: 'Error creating app', error: error.message });
  }
});

// PUT /apps/:id - Update app (admin only)
router.put('/:id', async (req, res) => {
  try {
    const app = await App.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: Date.now() }, 
      { new: true, runValidators: true }
    );
    if (!app) {
      return res.status(404).json({ message: 'App not found' });
    }
    res.json(app);
  } catch (error) {
    console.error('Error updating app:', error);
    res.status(500).json({ message: 'Error updating app', error: error.message });
  }
});

module.exports = router;
