const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  appId: { type: mongoose.Schema.Types.ObjectId, ref: 'App', required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
    default: 'Pending' 
  },
  requestedBy: { type: String, required: true }, // User name
  requestedDate: { type: Date, default: Date.now },
  approvedBy: { type: String }, // Approver name
  approvedDate: { type: Date },
  rejectedBy: { type: String }, // Rejector name
  rejectedDate: { type: Date },
  rejectionReason: { type: String },
  justification: { type: String }, // User's reason for requesting access
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium' 
  }
}, {
  timestamps: true
});

// Index for efficient querying
requestSchema.index({ userId: 1, status: 1 });
requestSchema.index({ appId: 1, status: 1 });

module.exports = mongoose.model('Request', requestSchema);
