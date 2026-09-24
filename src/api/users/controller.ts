import type { Request, Response } from 'express';
import UserModel from './model';
import catchAsync from '../../utils/catchAsync';

interface CustomError extends Error {
  statusCode?: number;
}

class UserController {
  static getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = UserModel.findAll();
    return res.status(200).json({
      success: true,
      data: users
    });
  });

  static createUser = catchAsync(async (req: Request, res: Response) => {
    const { name, email } = req.body;

    if (!name || !email) {
      const error: CustomError = new Error("Name and email are required fields");
      error.statusCode = 400;
      throw error;
    }

    const newUser = UserModel.create({ name, email });
    
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser
    });
  });
}

export default UserController;
