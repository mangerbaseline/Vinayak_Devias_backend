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



