// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');

// const {
//   getUsers,
//   createUser,
//   updateUser,
//   deleteUser,
//   updatePassword,
//   loginUser,
//   sendOTP,
//   verifyOTP,
//   resetPassword,
//   uploadAvatar,
//   createUserByAdmin ,
//   updateFirstName,
//   addSummary,
//   getSummaries
// } = require('../controllers/userController');

// const { auth, isAdmin } = require('../middleware/auth'); 


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });
// const upload = multer({ storage: storage });



// router.post('/admin/create-user',auth, createUserByAdmin);

// router.put('/update-first-name', auth, updateFirstName);

// router.post('/register', createUser);
// router.post('/login', loginUser);
// router.get('/', getUsers);




// router.put('/:id', updateUser);
// router.delete('/:id', deleteUser);
// router.put('/update-password', updatePassword);
// router.post('/send-otp', sendOTP);
// router.post('/verify-otp', verifyOTP);
// router.post('/reset-password', resetPassword);
// router.post('/upload-avatar', upload.single('avatar'), uploadAvatar);

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
  createUserByAdmin,
  updateFirstName,
  createSummary,     // ✅ Added
  getSummaries       // ✅ Added
} = require('../controllers/userController');

const { auth, isAdmin } = require('../middleware/auth');

// ==================== Multer Setup ====================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ==================== User Routes ====================
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


router.post('/summaries', createSummary);   // ✅ Create Summary
router.get('/summaries', getSummaries);     // ✅ Get All Summaries

module.exports = router;
