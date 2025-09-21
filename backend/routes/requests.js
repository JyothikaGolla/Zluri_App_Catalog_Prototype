const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const App = require('../models/App');

// GET /requests - Get requests with filtering and population
router.get('/', async (req, res) => {
  try {
    const { 
      userId, 
      status, 
      appId,
      limit = 50,
      skip = 0,
      sortBy = 'requestedDate',
      order = 'desc'
    } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter" });
    }

    // Build filter object
    let filter = { userId };

    if (status && status !== '') {
      filter.status = status;
    }

    if (appId && appId !== '') {
      filter.appId = appId;
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'status':
        sort.status = order === 'desc' ? -1 : 1;
        break;
      case 'appName':
        // Will be handled after population
        break;
      case 'requestedDate':
      default:
        sort.requestedDate = order === 'desc' ? -1 : 1;
        break;
    }

    const requests = await Request.find(filter)
      .populate('appId', 'name description category icon rating')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Get total count for pagination
    const total = await Request.countDocuments(filter);

    res.json({
      requests,
      total,
      hasMore: (parseInt(skip) + requests.length) < total
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
});

// GET /requests/stats/:userId - Get user's request statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Request.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format stats object
    const formattedStats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id.toLowerCase()] = stat.count;
      formattedStats.total += stat.count;
    });

    res.json(formattedStats);
  } catch (error) {
    console.error('Error fetching request stats:', error);
    res.status(500).json({ message: 'Error fetching request stats', error: error.message });
  }
});

// GET /requests/my-apps/:userId - Get user's approved apps
router.get('/my-apps/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const approvedRequests = await Request.find({ 
      userId, 
      status: 'Approved' 
    }).populate('appId');

    const myApps = approvedRequests
      .filter(req => req.appId) // Filter out any null appIds
      .map(req => req.appId);

    res.json(myApps);
  } catch (error) {
    console.error('Error fetching my apps:', error);
    res.status(500).json({ message: 'Error fetching my apps', error: error.message });
  }
});

// POST /requests - Create a new request
router.post('/', async (req, res) => {
  try {
    const { userId, appId, requestedBy, justification, priority } = req.body;

    if (!userId || !appId || !requestedBy) {
      return res.status(400).json({ 
        message: "Missing required fields: userId, appId, requestedBy" 
      });
    }

    // Check if app exists
    const app = await App.findById(appId);
    if (!app) {
      return res.status(404).json({ message: "App not found" });
    }

    // Check if user already has a pending or approved request for this app
    const existingRequest = await Request.findOne({ 
      userId, 
      appId, 
      status: { $in: ['Pending', 'Approved'] }
    });

    if (existingRequest) {
      return res.status(409).json({ 
        message: `You already have a ${existingRequest.status.toLowerCase()} request for this app!`,
        existingRequest
      });
    }

    const newRequest = new Request({ 
      userId, 
      appId, 
      requestedBy,
      justification: justification || '',
      priority: priority || 'Medium',
      status: 'Pending'
    });

    await newRequest.save();

    // Populate the app details for response
    await newRequest.populate('appId', 'name description category icon');

    res.status(201).json({ 
      message: "Request submitted successfully!",
      request: newRequest
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Error creating request', error: error.message });
  }
});

// PUT /requests/:id/approve - Approve a request (admin only)
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;

    if (!approvedBy) {
      return res.status(400).json({ message: "Missing approvedBy field" });
    }

    const request = await Request.findByIdAndUpdate(
      id,
      {
        status: 'Approved',
        approvedBy,
        approvedDate: new Date()
      },
      { new: true }
    ).populate('appId');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ 
      message: 'Request approved successfully',
      request
    });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ message: 'Error approving request', error: error.message });
  }
});

// PUT /requests/:id/reject - Reject a request (admin only)
router.put('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectedBy, rejectionReason } = req.body;

    if (!rejectedBy) {
      return res.status(400).json({ message: "Missing rejectedBy field" });
    }

    const request = await Request.findByIdAndUpdate(
      id,
      {
        status: 'Rejected',
        rejectedBy,
        rejectedDate: new Date(),
        rejectionReason: rejectionReason || 'No reason provided'
      },
      { new: true }
    ).populate('appId');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ 
      message: 'Request rejected',
      request
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ message: 'Error rejecting request', error: error.message });
  }
});

// DELETE /requests/:id - Cancel a request (user can cancel their own pending requests)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter" });
    }

    const request = await Request.findOne({ _id: id, userId, status: 'Pending' });

    if (!request) {
      return res.status(404).json({ 
        message: 'Request not found or cannot be cancelled' 
      });
    }

    await Request.findByIdAndUpdate(id, { status: 'Cancelled' });

    res.json({ message: 'Request cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling request:', error);
    res.status(500).json({ message: 'Error cancelling request', error: error.message });
  }
});

module.exports = router;
