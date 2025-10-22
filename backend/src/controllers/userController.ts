import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { body, validationResult, ValidationChain } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { BadRequestError } from "../errors/badRequest-error";
import { User } from "../models/userModel";
import { Password } from "../services/password";
import { successResponse, errorResponse } from "../utils/responseHandler";

export interface UserPayload {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

const generateToken = (payload: UserPayload): string => {
  return jwt.sign(payload, process.env.JWT_KEY!, { expiresIn: "30min" });
};

const validateRequest = async (req: Request, chains: ValidationChain[]) => {
  await Promise.all(chains.map((chain) => chain.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new RequestValidationError(errors.array());
};

/* ------------------------------------------------------------------ */
/* ----------------------------- Sign Up ----------------------------- */
/* ------------------------------------------------------------------ */
export const signUp = asyncHandler(async (req: Request, res: Response) => {
  try {
    await validateRequest(req, [
      body("username").notEmpty().withMessage("Username is required"),
      body("firstName").notEmpty().withMessage("First name is required"),
      body("lastName").notEmpty().withMessage("Last name is required"),
      body("password")
        .isLength({ min: 4, max: 24 })
        .withMessage("Password must be between 4–24 characters"),
      body("employeeStartDate").notEmpty().withMessage("Employee start date is required"),
    ]);

    const { username, firstName, lastName, password, employeeStartDate, contactNumber, isAdmin } =
      req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) throw new BadRequestError("User already exists with this username");

    const user = User.build({
      username,
      firstName,
      lastName,
      password,
      employeeStartDate: new Date(employeeStartDate),
      contactNumber,
      status: "active",
      isAdmin: isAdmin ?? false,
    });

    await user.save();

    successResponse(res, 201, "User created successfully", {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    });
  } catch (error: any) {
    errorResponse(res, error, "Failed to create user");
  }
});

/* ------------------------------------------------------------------ */
/* ----------------------------- Sign In ----------------------------- */
/* ------------------------------------------------------------------ */
export const signIn = asyncHandler(async (req: Request, res: Response) => {
  try {
    await validateRequest(req, [
      body("username").notEmpty().withMessage("Username is required"),
      body("password").notEmpty().withMessage("Password is required"),
    ]);

    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) throw new BadRequestError("Invalid username or password");

    const passwordsMatch = await Password.compare(user.password, password);
    if (!passwordsMatch) throw new BadRequestError("Invalid username or password");

    const payload: UserPayload = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin || false,
    };

    const token = generateToken(payload);

    successResponse(res, 200, "Login successful", { token, user: payload });
  } catch (error: any) {
    errorResponse(res, error, "Failed to sign in");
  }
});

/* ------------------------------------------------------------------ */
/* ------------------------ Get Current User ------------------------ */
/* ------------------------------------------------------------------ */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    successResponse(res, 200, "Current user fetched successfully", req.currentUser || null);
  } catch (error: any) {
    errorResponse(res, error, "Failed to fetch current user");
  }
});

/* ------------------------------------------------------------------ */
/* --------------------------- Update User -------------------------- */
/* ------------------------------------------------------------------ */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) throw new BadRequestError("User not found");

    const { firstName, lastName, username, password, employeeStartDate, contactNumber, status, isAdmin } =
      req.body;

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (username !== undefined) user.username = username;
    if (password) user.password = password;
    if (employeeStartDate) user.employeeStartDate = new Date(employeeStartDate);
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    if (status !== undefined) user.status = status;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;

    await user.save();

    successResponse(res, 200, "User updated successfully", user.toJSON());
  } catch (error: any) {
    errorResponse(res, error, "Failed to update user");
  }
});

/* ------------------------------------------------------------------ */
/* -------------------------- Get All Users ------------------------- */
/* ------------------------------------------------------------------ */
export const getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    successResponse(res, 200, "Users fetched successfully", users);
  } catch (error: any) {
    errorResponse(res, error, "Failed to fetch users");
  }
});

/* ------------------------------------------------------------------ */
/* -------------------------- Get User by ID ------------------------ */
/* ------------------------------------------------------------------ */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) throw new BadRequestError("ID is required");

    const user = await User.findById(id).select("-password");
    if (!user) throw new BadRequestError("User not found");

    successResponse(res, 200, "User fetched successfully", user);
  } catch (error: any) {
    errorResponse(res, error, "Failed to fetch user");
  }
});

/* ------------------------------------------------------------------ */
/* -------------------------- Delete User --------------------------- */
/* ------------------------------------------------------------------ */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) throw new BadRequestError("User not found");

    successResponse(res, 200, "User deleted successfully");
  } catch (error: any) {
    errorResponse(res, error, "Failed to delete user");
  }
});
