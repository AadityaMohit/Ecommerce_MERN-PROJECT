const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs'); 
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'thisisacomputer';
const path = require('path');
const fs = require('fs');
const multer = require('multer');

 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/profile-images/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);  
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
  },
});

 
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  },
});
 
router.post('/api/auth/upload-profile-image', upload.single('profileImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please upload a file' });
  }
 
  res.status(200).json({
    message: 'Profile image uploaded successfully',
    filePath: `/uploads/profile-images/${req.file.filename}`,  
  });
});

router.use('/uploads', express.static('uploads'));
 
const fetchUser = (req, res, next) => {
  const token = req.header('auth_token');
  if (!token) {
    return res.status(401).json({ error: 'Please authenticate using a valid token' });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

 
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

 
const defaultImagePath = path.join(__dirname, 'public', 'file.png');

 
router.get('/profile-image', fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (!user.profileImage) {
      console.log('No profile image set, sending default image.');
      return res.sendFile(defaultImagePath);   
    }

    const profileImagePath = path.join(uploadsDir, user.profileImage);
    if (fs.existsSync(profileImagePath)) {
      return res.sendFile(profileImagePath);
    } else {
      console.log('Profile image not found on disk, sending default image.');
      return res.sendFile(defaultImagePath);  
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

 
router.put('/update-profile-image', fetchUser, upload.single('profileImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded.' });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

   
  user.profileImage = req.file.filename;  
  await user.save();

  res.status(200).json({ success: true, message: 'Profile image updated successfully' });
});

 
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
  body('phone', 'Enter a valid phone number').optional().isLength({ min: 10 }),  
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    const { name, email, password, phone } = req.body; 
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User with the same email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({
      name,
      email,
      password: hashedPassword,
      phone  
    });

    await user.save();

    const data = { user: { id: user.id } };
    const authToken = jwt.sign(data, JWT_SECRET);

    success = true;
    res.status(200).json({ success, message: "User saved successfully", authToken }); // Single response
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Internal server error" }); // Return 500 for internal errors
  }
});
 
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const data = { user: { id: user.id } };
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken, name: user.name, useremail: user.email });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email');  
    if (!users.length) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

 
router.put('/updateuser', fetchUser, [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('phone', 'Enter a valid phone number').isMobilePhone(),   
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    const { name, email, phone } = req.body; 
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success, error: 'User not found' });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists.id !== req.user.id) {
      return res.status(400).json({ success, error: 'Email already in use' });
    }

 
    user.name = name;
    user.email = email;
    user.phone = phone;   
    await user.save();   

    success = true;
    res.status(200).json({ success, message: 'User updated successfully', name: user.name, email: user.email, phone: user.phone });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Route to update user password
router.put('/updatepassword', fetchUser, [
  body('currentPassword', 'Current password cannot be blank').exists(),
  body('newPassword', 'New password must be at least 5 characters long').isLength({ min: 5 }),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success, error: 'User not found' });
    }

    const passwordCompare = await bcrypt.compare(currentPassword, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ success, error: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedNewPassword;  
    await user.save();

    success = true;
    res.status(200).json({ success, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

 
router.delete('/deleteuser', fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.remove();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.post('/deactivateuser', fetchUser, async (req, res) => {
  try {
 
    const user = await User.findById(req.user.id);
    
 
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
