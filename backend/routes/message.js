const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const fetchUser = require('../middleware/fetchUser'); 

 
router.post('/send', fetchUser, [
  body('message', 'Message cannot be empty').isLength({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { message } = req.body;

    const newMessage = new Message({
      user: req.user.id,
      message
    });

    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
 
 
router.get('/', fetchUser, async (req, res) => {
  try {
    const messages = await Message.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
