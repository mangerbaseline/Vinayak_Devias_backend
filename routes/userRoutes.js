// const express = require('express');
// const router = express.Router();
// // const auth = require('../middleware/auth'); // comment or remove auth

// const {
//   getUsers,
//   createUser,
//   updateUser,
//   deleteUser,
//   updatePassword,
//   loginUser
// } = require('../controllers/userController');

// // Public Routes
// router.post('/register', createUser);
// router.post('/login', loginUser);

// // Public - no auth middleware
// router.get('/', getUsers);
// router.put('/:id', updateUser);       // removed auth
// router.delete('/:id', deleteUser);    // removed auth
// router.put('/update-password', updatePassword); // if needed

// module.exports = router;


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
  createUserByAdmin 
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



router.post('/admin/create-user',auth, createUserByAdmin);




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

module.exports = router;
