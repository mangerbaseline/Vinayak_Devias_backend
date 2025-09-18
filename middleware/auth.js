// const jwt = require('jsonwebtoken');

// function auth(req, res, next) {
//   const authHeader = req.headers.authorization || req.headers.Authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token provided, authorization denied' });
//   }

//   const token = authHeader.split(' ')[1]; 

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
//     console.log('🔐 Decoded JWT payload:', decoded);
//     req.user = decoded; 
//     next();
//   } catch (err) {
//     console.error('JWT verification failed:', err.message);
    
//     if (err.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: 'Token expired' });
//     }
    
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// }

// module.exports = {
//   auth,
// };



const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log('🔐 Decoded JWT payload:', decoded);
    req.user = decoded; 
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired'});
    }
    
    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = {
  auth,
};
