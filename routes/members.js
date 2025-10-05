const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Member = require('../models/Member');

// Test route to check database connection and Member model
router.get('/test', async (req, res) => {
  try {
    console.log('Testing database connection...');
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: false,
        message: 'MongoDB not connected',
        connectionState: mongoose.connection.readyState
      });
    }
    
    // Try to count members
    const memberCount = await Member.countDocuments();
    
    res.json({
      success: true,
      message: 'Database connection working',
      connectionState: mongoose.connection.readyState,
      memberCount: memberCount,
      databaseName: mongoose.connection.db.databaseName
    });
  } catch (error) {
    console.error('Test route error:', error);
    res.json({
      success: false,
      message: 'Database test failed',
      error: error.message
    });
  }
});

// Display members page with registration form
router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected, showing form without members list');
      return res.render('members', { 
        title: 'Join FitZone Gym',
        members: [],
        success: req.query.success,
        error: req.query.error || 'Database connection not available. You can still register!'
      });
    }

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
      title: 'Join FitZone Gym',
      members: plainMembers,
      success: success,
      error: error
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.render('members', { 
      title: 'Join FitZone Gym',
      members: [],
      error: 'Failed to load members list, but you can still register!'
    });
  }
});

// Handle member registration
router.post('/', async (req, res) => {
  try {
    console.log('Registration attempt started');
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected, returning error');
      return res.render('members', {
        title: 'Join FitZone Gym',
        members: [],
        error: 'Database connection not available. Please try again later or contact support.'
      });
    }

    const { name, email, phone, membershipType } = req.body;
    console.log('Registration data:', { name, email, phone, membershipType });
    
    // Validate required fields
    if (!name || !email || !phone || !membershipType) {
      console.log('Missing required fields');
      return res.render('members', {
        title: 'Join FitZone Gym',
        members: [],
        error: 'All fields are required. Please fill in all information.'
      });
    }
    
    // Check if member already exists
    console.log('Checking for existing member with email:', email);
    const existingMember = await Member.findOne({ email: email.toLowerCase().trim() });
    if (existingMember) {
      console.log('Member already exists');
      const members = await Member.find({ isActive: true }).sort({ joinDate: -1 });
      const plainMembers = members.map(member => ({
        _id: member._id.toString(),
        name: member.name,
        email: member.email,
        phone: member.phone,
        membershipType: member.membershipType,
        joinDate: member.joinDate,
        isActive: member.isActive
      }));
      
      return res.render('members', {
        title: 'Join FitZone Gym',
        members: plainMembers,
        error: 'A member with this email already exists!'
      });
    }
    
    // Create new member
    console.log('Creating new member');
    const newMember = new Member({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      membershipType: membershipType.trim()
    });
    
    console.log('Saving member to database');
    await newMember.save();
    console.log('Member saved successfully');
    
    // Redirect to members page with success message
    res.redirect('/members?success=Member registered successfully!');
  } catch (error) {
    console.error('Error creating member:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      errors: error.errors
    });
    
    // Provide more specific error messages
    let errorMessage = 'Failed to register member. Please try again.';
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      errorMessage = `Validation error: ${errors.join(', ')}`;
    } else if (error.code === 11000) {
      errorMessage = 'A member with this email already exists!';
    } else if (error.name === 'CastError') {
      errorMessage = 'Invalid data format. Please check your input.';
    }
    
    try {
      const members = await Member.find({ isActive: true }).sort({ joinDate: -1 });
      const plainMembers = members.map(member => ({
        _id: member._id.toString(),
        name: member.name,
        email: member.email,
        phone: member.phone,
        membershipType: member.membershipType,
        joinDate: member.joinDate,
        isActive: member.isActive
      }));
      
      res.render('members', {
        title: 'Join FitZone Gym',
        members: plainMembers,
        error: errorMessage
      });
    } catch (fetchError) {
      console.error('Error fetching members for error page:', fetchError);
      res.render('members', {
        title: 'Join FitZone Gym',
        members: [],
        error: errorMessage
      });
    }
  }
});

module.exports = router;

