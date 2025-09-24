const User = require('../models/userModel');
const Summary = require('../models/summaryModel'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const OTP = require('../models/otpModel');
const Request = require('../models/requestModel');
const path = require('path');

//  Create a new summary


const createSummary = async (req, res) => {
  const { summary } = req.body;  
  const userId = req.user.id;  

  if (!summary) {
    return res.status(400).json({ message: 'Summary is required' });
  }

  try {
    const newSummary = await Summary.create({ summary, user: userId });
    res.status(201).json(newSummary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



const getUserSummary = async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    const loggedInUser = req.user; 

   
    if (loggedInUser.role !== 'admin' && loggedInUser.id !== requestedUserId) {
      return res.status(403).json({ message: 'Access denied: Not authorized' });
    }

    const summaries = await Summary.find({ user: requestedUserId });

    if (!summaries || summaries.length === 0) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    res.status(200).json(summaries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// ===================== User APIs =====================

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const userRole = role || 'user';

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'First name, last name, email, and password are required' });
    }

    const name = `${firstName} ${lastName}`;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role: userRole });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Name, email, and role are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newUser = new User({ name, email, password: hashedPassword, role });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const userRole = user.role || 'user';
    const token = jwt.sign(
      { id: user._id, role: userRole },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '3d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: userRole
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateFirstName = async (req, res) => {
  const userId = req.user?.id;
  const { firstName } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID missing' });
  }

  if (!firstName) {
    return res.status(400).json({ message: 'First name is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const nameParts = user.name ? user.name.split(' ') : [''];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    user.name = `${firstName}${lastName ? ' ' + lastName : ''}`;
    await user.save();

    res.status(200).json({ message: 'First name updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: 'Both password fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updated = await User.findByIdAndUpdate(userId, { password: hashedPassword });

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email, otp });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    }, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Failed to send OTP email', error: error.message });
      } else {
        return res.status(200).json({ message: 'OTP sent successfully' });
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await OTP.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

    record.verified = true;
    await record.save();
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const otpRecord = await OTP.findOne({ email, verified: true });
    if (!otpRecord) return res.status(400).json({ message: 'OTP not verified' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    await OTP.deleteMany({ email });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadAvatar = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    return res.status(200).json({ success: true, imageUrl });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// multiple image can upload

const uploadMultipleImages = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const urls = req.files.map(file => {
      return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    });

    return res.status(200).json({ success: true, urls }); 
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

//send request

const sendRequest = async (req, res) => {
  try {
    const { toUserId } = req.body;
    const fromUserId = req.user.id; 

    if (!toUserId) {
      return res.status(400).json({ message: 'Recipient user ID is required' });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({ message: 'You cannot send a request to yourself' });
    }

    
    const existingRequest = await Request.findOne({  senderId:fromUserId, receiverId:toUserId });
    if (existingRequest) {
      return res.status(409).json({ message: 'Request already sent' });
    }

    const newRequest = await Request.create({ senderId:fromUserId, receiverId:toUserId });

    res.status(201).json({ message: 'Request sent successfully', request: newRequest });
  } catch (err) {
    console.error('Error sending request:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

//get request

const getPendingRequests = async (req, res) => {
  let userId = req.query.userId;
console.log("xxxxxxxxxxxxxxx");
  if (!userId) {
    return res.status(400).json({ error: 'userId query parameter is required' });
  }

  userId = userId.trim();

  try {
    const requests = await Request.find({ receiverId: userId, status: 'pending' })
      .populate('senderId', 'name email')
      .exec();

      console.log(requests,"yyyyyyyyyyyyyyyyyyyyyyyy")

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

//accept request

const acceptRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = 'accepted';
    await request.save();

    res.json({ message: 'Request accepted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

//cancel request

const rejectRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Request rejected successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  getUsers,
  createUser,
  createUserByAdmin,
  loginUser,
  updateUser,
  deleteUser,
  updatePassword,
  sendOTP,
  verifyOTP,
  resetPassword,
  uploadAvatar,
  updateFirstName,
  createSummary,
  getUserSummary,
  uploadMultipleImages,
  sendRequest,
  getPendingRequests,
  acceptRequest,
  rejectRequest
};
