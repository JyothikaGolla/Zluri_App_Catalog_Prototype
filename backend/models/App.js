const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  department: [{ type: String }], // Array of departments that can use this app
  rating: { type: Number, default: 4.0, min: 1, max: 5 },
  users: { type: Number, default: 0 }, // Number of users currently using this app
  features: [{ type: String }], // Array of key features
  accessRequirements: { type: String, default: 'Manager approval required' },
  icon: { type: String, default: '🔧' }, // Emoji or icon identifier
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Add text index for search functionality
appSchema.index({ 
  name: 'text', 
  description: 'text', 
  features: 'text' 
});

module.exports = mongoose.model('App', appSchema);
