import UserModel from './model';
import catchAsync from '../../utils/catchAsync';
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
            const error = new Error("Name and email are required fields");
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
//# sourceMappingURL=controller.js.map