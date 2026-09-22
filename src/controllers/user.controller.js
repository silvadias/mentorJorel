const UserModel = require('../models/user.model');
const catchAsync = require('../utils/catchAsync.util'); 

class UserController {
  // GET /users
  static getAllUsers = catchAsync(async (req, res) => {
    const users = UserModel.findAll();
    return res.status(200).json({
      success: true,
      data: users
    });
  });

  // POST /users
  static createUser = catchAsync(async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
      // To trigger an error with a custom status for the global middleware:
      const error = new Error("Name and email are required fields");
      error.statusCode = 400;
      throw error;  // catchAsync will automatically catch this throw!
    }

    const newUser = UserModel.create({ name, email });
    
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser
    });
  });
}

module.exports = UserController;
