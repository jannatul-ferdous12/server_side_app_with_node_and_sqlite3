import { Router } from "express";
import { createUser, createUsersTable, deleteUser, getAllUsers, getUserById, insertUser, updateUser } from "./controller.js";

const userRouter = Router();

userRouter.get('/:id', createUsersTable, insertUser, getUserById); 
userRouter.post('/', createUsersTable, createUser); // create
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);
userRouter.get('/', createUsersTable, insertUser, getAllUsers); // watch all user

export default userRouter;