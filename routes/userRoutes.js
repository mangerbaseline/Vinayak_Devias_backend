// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

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
//   createUserByAdmin,
//   updateFirstName,
//   createSummary,
//   getUserSummary,
//   uploadMultipleImages,
  
// } = require('../controllers/userController');

// const { auth, isAdmin } = require('../middleware/auth');


// const uploadPath = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath);
// }


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });


// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed!'), false);
//   }
// };

// const upload = multer({ storage: storage, fileFilter });


// router.post('/admin/create-user', auth, createUserByAdmin);
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
// router.post('/summaries', auth, createSummary);
// router.get('/:userId/summary', auth, getUserSummary);



// router.post('/upload-multiple-images', upload.array('images', 5), uploadMultipleImages);

// module.exports = router;




const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');


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
  sendRequest, 
  getPendingRequests,
  acceptRequest,
  rejectRequest
  
} = require('../controllers/userController');


const { auth, isAdmin } = require('../middleware/auth');



const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter });



// Auth and user routes
router.post('/register', createUser);
router.post('/login', loginUser);
router.put('/update-password', auth, updatePassword);
router.put('/update-first-name', auth, updateFirstName);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Admin create user
router.post('/admin/create-user', auth, createUserByAdmin);

// OTP and password reset
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// Uploads
router.post('/upload-avatar', upload.single('avatar'), uploadAvatar);
router.post('/upload-multiple-images', upload.array('images', 5), uploadMultipleImages);

// Summaries
router.post('/summaries', auth, createSummary);
router.get('/:userId/summary', auth, getUserSummary);

//send request
router.post('/send-request', auth, sendRequest);

router.get('/requests', auth,getPendingRequests);
router.post('/requests/:id/accept', acceptRequest);
router.post('/requests/:id/reject', rejectRequest);


module.exports = router;