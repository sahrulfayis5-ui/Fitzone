const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Contact = require('../models/Contact');

// Test route to check admin functionality
router.get('/test', async (req, res) => {
  try {
    console.log('Testing admin functionality...');
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    console.log('MongoDB URI provided:', !!process.env.MONGODB_URI);
    
    const response = {
      success: false,
      message: 'Admin functionality test',
      connectionState: mongoose.connection.readyState,
      mongoUriProvided: !!process.env.MONGODB_URI,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    };
    
    if (mongoose.connection.readyState !== 1) {
      response.message = 'MongoDB not connected';
      response.diagnosis = 'Check your MONGODB_URI environment variable in Vercel settings';
      return res.json(response);
    }
    
    // Try to count contacts
    const contactCount = await Contact.countDocuments();
    const unreadCount = await Contact.countDocuments({ isRead: false });
    
    response.success = true;
    response.message = 'Admin functionality working';
    response.contactCount = contactCount;
    response.unreadCount = unreadCount;
    response.databaseName = mongoose.connection.db.databaseName;
    
    res.json(response);
  } catch (error) {
    console.error('Admin test route error:', error);
    res.json({
      success: false,
      message: 'Admin test failed',
      error: error.message,
      connectionState: mongoose.connection.readyState,
      mongoUriProvided: !!process.env.MONGODB_URI
    });
  }
});

// Admin page - View all contact enquiries
router.get('/', async (req, res) => {
  try {
    console.log('Admin page accessed');
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected for admin page');
      console.log('Connection state:', mongoose.connection.readyState);
      console.log('MongoDB URI provided:', !!process.env.MONGODB_URI);
      
      return res.render('admin', {
        title: 'Admin Panel',
        enquiries: [],
        error: 'Database connection not available. Please check your MongoDB connection. Visit /admin/test for diagnostics.'
      });
    }
    
    const enquiries = await Contact.find().sort({ submittedAt: -1 });
    console.log('Found enquiries:', enquiries.length);
    
    // Convert Mongoose documents to plain objects for Handlebars
    const plainEnquiries = enquiries.map(enquiry => ({
      _id: enquiry._id.toString(),
      email: enquiry.email,
      phone: enquiry.phone,
      address: enquiry.address,
      message: enquiry.message,
      submittedAt: enquiry.submittedAt,
      isRead: enquiry.isRead
    }));
    
    console.log('Rendering admin page with', plainEnquiries.length, 'enquiries');
    
    const success = req.query.success;
    const error = req.query.error;
    
    res.render('admin', {
      title: 'Admin Panel',
      enquiries: plainEnquiries,
      success: success,
      error: error
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
    res.render('admin', {
      title: 'Admin Panel',
      enquiries: [],
      error: 'Failed to load enquiries. Please check the database connection.'
    });
  }
});

// Mark enquiry as read
router.post('/mark-read/:id', async (req, res) => {
  try {
    console.log('Marking enquiry as read:', req.params.id);
    
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected for mark-read');
      return res.redirect('/admin?error=Database connection not available');
    }
    
    const result = await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
    if (!result) {
      console.log('Enquiry not found:', req.params.id);
      return res.redirect('/admin?error=Enquiry not found');
    }
    
    console.log('Successfully marked enquiry as read');
    res.redirect('/admin?success=Enquiry marked as read');
  } catch (error) {
    console.error('Error marking enquiry as read:', error);
    res.redirect('/admin?error=Failed to mark enquiry as read');
  }
});

// Delete enquiry
router.post('/delete/:id', async (req, res) => {
  try {
    console.log('Deleting enquiry:', req.params.id);
    
    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB not connected for delete');
      return res.redirect('/admin?error=Database connection not available');
    }
    
    const result = await Contact.findByIdAndDelete(req.params.id);
    if (!result) {
      console.log('Enquiry not found for deletion:', req.params.id);
      return res.redirect('/admin?error=Enquiry not found');
    }
    
    console.log('Successfully deleted enquiry');
    res.redirect('/admin?success=Enquiry deleted successfully');
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.redirect('/admin?error=Failed to delete enquiry');
  }
});

module.exports = router;

