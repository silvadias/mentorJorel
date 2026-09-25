import type { Request, Response } from 'express';
import { UserModel } from './model'; 
import { catchAsync } from '../../utils/catchAsync';
interface CustomError extends Error {
  statusCode?: number;
}

export class UserController {
  // Sincronizado com o verbo explicativo usado na sua rota http.get
  static getUsers = catchAsync(async (_req: Request, res: Response) => {
    const users = await UserModel.findAll();
    return res.status(200).json({
      success: true,
      data: users
    });
  });

  static storeUser = catchAsync(async (req: Request, res: Response) => {
    const { name, email } = req.body;

    if (!name || !email) {
      const error: CustomError = new Error("Name and email are required fields");
      error.statusCode = 400;
      throw error;
    }

    const newUser = await UserModel.create({ name, email });
    
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser
    });
  });
}
