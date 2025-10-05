const express = require('express');
const Contact = require('../models/Contact');
const router = express.Router();

// Home page route
router.get('/', (req, res) => {
  res.render('home', { 
    title: 'FitZone Gym - Home',
    message: 'Welcome to FitZone Gym!' 
  });
});

// Contact page route (GET)
router.get('/contact', (req, res) => {
  res.render('contact', { 
    title: 'Contact Us - FitZone Gym' 
  });
});

// Contact form submission route (POST)
router.post('/contact', async (req, res) => {
  try {
    const { email, phone, address, message } = req.body;
    
    // Create new contact entry
    const newContact = new Contact({
      email,
      phone,
      address,
      message: message || ''
    });
    
    // Save to database
    await newContact.save();
    
    // Redirect with success message
    res.render('contact', {
      title: 'Contact Us - FitZone Gym',
      success: 'Thank you for your message! We will get back to you soon.'
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.render('contact', {
      title: 'Contact Us - FitZone Gym',
      error: 'Sorry, there was an error sending your message. Please try again.'
    });
  }
});

module.exports = router;

