const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// Display members page with registration form
router.get('/', async (req, res) => {
  try {
    const members = await Member.find({ isActive: true }).sort({ joinDate: -1 });
    
    // Convert Mongoose documents to plain objects for Handlebars
    const plainMembers = members.map(member => ({
      _id: member._id.toString(),
      name: member.name,
      email: member.email,
      phone: member.phone,
      membershipType: member.membershipType,
      joinDate: member.joinDate,
      isActive: member.isActive
    }));
    
    const success = req.query.success;
    const error = req.query.error;
    
    res.render('members', { 
      title: 'Members',
      members: plainMembers,
      success: success,
      error: error
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.render('members', { 
      title: 'Members',
      members: [],
      error: 'Failed to load members'
    });
  }
});

// Handle member registration
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, membershipType } = req.body;
    
    // Check if member already exists
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.render('members', {
        title: 'Members',
        members: await Member.find({ isActive: true }).sort({ joinDate: -1 }),
        error: 'A member with this email already exists!'
      });
    }
    
    // Create new member
    const newMember = new Member({
      name,
      email,
      phone,
      membershipType
    });
    
    await newMember.save();
    
    // Redirect to members page with success message
    res.redirect('/members?success=Member registered successfully!');
  } catch (error) {
    console.error('Error creating member:', error);
    res.render('members', {
      title: 'Members',
      members: await Member.find({ isActive: true }).sort({ joinDate: -1 }),
      error: 'Failed to register member. Please try again.'
    });
  }
});

module.exports = router;
