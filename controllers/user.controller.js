import userModel from "../models/user.js";
import bcrypt from "bcryptjs";

/** 
 * جلب كل المستخدمين
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password -otp -resetPasswordOTP");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

/** 
 * جلب مستخدم بواسطة id
 */
export const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password -otp -resetPasswordOTP");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

/** 
 * إنشاء مستخدم جديد مع هاش للباسورد
 */
export const createUser = async (req, res) => {
  try {
    // تحقق وجود باسورد
    if (!req.body.password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const existingUser = await userModel.findOne({ email: req.body.email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new userModel(req.body);
    await newUser.save();
    // إخفاء الحقول الحساسة في الرد
    const userToReturn = newUser.toObject();
    delete userToReturn.password;
    delete userToReturn.otp;
    delete userToReturn.resetPasswordOTP;

    res.status(201).json(userToReturn);
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error: error.message });
  }
};

/** 
 * تحديث بيانات المستخدم 
 */
export const updateUser = async (req, res) => {
  try {
    // لو الباسورد موجود في التحديث، هاش تلقائي في الموديل pre-save
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    Object.assign(user, req.body);
    await user.save();

    const userToReturn = user.toObject();
    delete userToReturn.password;
    delete userToReturn.otp;
    delete userToReturn.resetPasswordOTP;

    res.status(200).json(userToReturn);
  } catch (error) {
    res.status(400).json({ message: "Error updating user", error: error.message });
  }
};

/** 
 * حذف المستخدم
 */
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
