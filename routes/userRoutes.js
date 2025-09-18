const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
  loginUser,
  sendOTP,
  verifyOTP,
  resetPassword,
  uploadAvatar,
  createUserByAdmin,
  updateFirstName,
  createSummary, 
  getUserSummary,
  uploadMultipleImages, 
  
} = require('../controllers/userController');

const { auth, isAdmin } = require('../middleware/auth');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/admin/create-user', auth, createUserByAdmin);
router.put('/update-first-name', auth, updateFirstName);
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/update-password', updatePassword);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/upload-avatar', upload.single('avatar'), uploadAvatar);

router.post('/summaries', auth, createSummary);

router.get('/:userId/summary', auth, getUserSummary);


//5 image can upload
router.post('/upload-multiple-images', upload.array('images', 5), uploadMultipleImages);




module.exports = router;



