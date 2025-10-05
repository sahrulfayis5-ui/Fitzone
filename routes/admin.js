const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Admin page - View all contact enquiries
router.get('/', async (req, res) => {
  try {
    const enquiries = await Contact.find().sort({ submittedAt: -1 });
    console.log('Found enquiries:', enquiries.length);
    console.log('Enquiries data:', enquiries);
    
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
    
    res.render('admin', {
      title: 'Admin Panel',
      enquiries: plainEnquiries
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.render('admin', {
      title: 'Admin Panel',
      enquiries: [],
      error: 'Failed to load enquiries'
    });
  }
});

// Mark enquiry as read
router.post('/mark-read/:id', async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
    res.redirect('/admin');
  } catch (error) {
    console.error('Error marking enquiry as read:', error);
    res.redirect('/admin');
  }
});

// Delete enquiry
router.post('/delete/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.redirect('/admin');
  }
});

module.exports = router;
