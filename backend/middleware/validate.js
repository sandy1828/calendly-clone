const { check } = require('express-validator');

exports.registerValidation = [
  check('name').notEmpty().withMessage('Name is required'),
  check('username').notEmpty().withMessage('Username is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

exports.loginValidation = [
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').notEmpty().withMessage('Password is required'),
];

exports.updateProfileValidation = [
  check('email').optional().isEmail().withMessage('Valid email is required'),
  check('username').optional().notEmpty().withMessage('Username is required'),
];

exports.availabilityValidation = [
  check('day').notEmpty().withMessage('Day is required'),
  check('slots').isArray({ min: 1 }).withMessage('Slots must be a non-empty array'),
];

exports.bookingValidation = [
  check('userId').isMongoId().withMessage('Valid user ID is required'),
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('slot').notEmpty().withMessage('Slot is required'),
  check('date').isISO8601().withMessage('Valid date is required'),
];