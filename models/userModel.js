// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   id: Number,
//   name: String,
//   email: {type: String, required:true},
//   role: String,
// });

// module.exports = mongoose.model('User', userSchema);



// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema(
//   {
//     id: {
//       type: Number,
//     },
//     name: {
//       type: String,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true, 
//     },
//     role: {
//       type: String,
//       default: 'user',
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true } 
// );

// module.exports = mongoose.model('User', userSchema);






const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);






// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema(
//   {
//     name: String,
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       default: 'user',
//     },

//     // ✅ Added for Google Login (non-breaking additions)
//     googleId: String,
//     picture: String,
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('User', userSchema);
