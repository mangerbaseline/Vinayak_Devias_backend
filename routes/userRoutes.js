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






// const express = require('express');
// const router = express.Router();
// // const auth = require('../middleware/auth'); // removed auth

// const {
//   getUsers,
//   createUser,
//   updateUser,
//   deleteUser,
//   updatePassword,
//   loginUser,
//   sendOTP,
//   verifyOTP,
//   resetPassword
// } = require('../controllers/userController');

// // Public Routes
// router.post('/register', createUser);
// router.post('/login', loginUser);


// router.get('/', getUsers);
// router.put('/:id', updateUser);      
// router.delete('/:id', deleteUser);    
// router.put('/update-password', updatePassword); 


// router.post('/send-otp', sendOTP);
// router.post('/verify-otp', verifyOTP);
// router.post('/reset-password', resetPassword);

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
  uploadAvatar // import the new controller function
} = require('../controllers/userController');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});
const upload = multer({ storage: storage });

// Existing routes
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/update-password', updatePassword);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// New route to upload avatar
router.post('/upload-avatar', upload.single('avatar'), uploadAvatar);

module.exports = router;
