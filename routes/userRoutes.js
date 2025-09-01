// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth'); 
// const { getUsers, createUser, updateUser, deleteUser ,updatePassword} = require('../controllers/userController');

// router.get('/', getUsers);
// router.post('/', createUser); 
// router.put('/:id',updateUser);
// router.delete('/:id', deleteUser);

// router.put('/update-password', auth, updatePassword);

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth'); 
// const {
//   getUsers,
//   createUser,         // register
//   updateUser,
//   deleteUser,
//   updatePassword,
//   loginUser           // ✅ added login
// } = require('../controllers/userController');

// // Public Routes
// router.post('/register', createUser);  
// router.post('/login', loginUser);      
// router.get('/', getUsers);            

// // Protected Routes
// router.put('/:id', auth, updateUser);
// router.delete('/:id', auth, deleteUser);
// router.put('/update-password', auth, updatePassword);

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const {
//   getUsers,
//   createUser,         // Register
//   updateUser,
//   deleteUser,
//   updatePassword,
//   loginUser           // Login
// } = require('../controllers/userController');

// // Public Routes
// router.post('/register', createUser);
// router.post('/login', loginUser);

// // Protected Routes (Require login)
// router.get('/', auth, getUsers);               // Get all users - protected
// router.get('/me', auth, async (req, res) => {  // Get current logged-in user
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// router.put('/:id', auth, updateUser);
// router.delete('/:id', auth, deleteUser);
// router.put('/update-password', auth, updatePassword);

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
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

// // Make GET /api/users public (no auth middleware)
// router.get('/', getUsers);

// // Protected Routes (require token)
// router.put('/:id', auth, updateUser);
// router.delete('/:id', auth, deleteUser);
// router.put('/update-password', auth, updatePassword);

// module.exports = router;



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
// const auth = require('../middleware/auth'); // removed auth

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
  loginUser
} = require('../controllers/userController');

// Public Routes
router.post('/register', createUser);
router.post('/login', loginUser);

// Public access — no auth required
router.get('/', getUsers);
router.put('/:id', updateUser);       // no auth
router.delete('/:id', deleteUser);    // no auth
router.put('/update-password', updatePassword); // as needed

module.exports = router;
