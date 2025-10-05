const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  membershipType: {
    type: String,
    required: true,
    enum: ['basic', 'premium', 'vip']
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Add a method to format the membership type for display
memberSchema.methods.getFormattedMembershipType = function() {
  const types = {
    'basic': 'Basic',
    'premium': 'Premium', 
    'vip': 'VIP'
  };
  return types[this.membershipType] || this.membershipType;
};

module.exports = mongoose.model('Member', memberSchema);

