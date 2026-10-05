import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

/**
 * Authentication middleware to verify JWT and attach user to req.user
 */
export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  // 1. Read token from Authorization header: Bearer <token>
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. If token is missing, return 401
  if (!token) {
    return res.status(401).json({
      message: 'Not authorized, no token provided'
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    // 3. Verify token
    const decoded = jwt.verify(token, jwtSecret);

    // 4. Find user in MongoDB using the ID from verified token, excluding password
    const user = await User.findById(decoded.id).select('-password');

    // 5. If user does not exist, return 401
    if (!user) {
      return res.status(401).json({
        message: 'Not authorized, user not found'
      });
    }

    // 6. Attach user to req.user and proceed
    req.user = user;
    next();
  } catch (error) {
    // Handle invalid or expired token
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Not authorized, invalid or expired token'
      });
    }

    return res.status(500).json({
      message: 'Server error in authentication middleware',
      error: error.message
    });
  }
};

export const authMiddleware = protect;
export default protect;
