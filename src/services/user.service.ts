import { IUser, Users } from "../models/user.schema";
import { hashPassword } from "../utils/hashing";
import { getOwnItemsByPermissionAction } from "./itemSpecificPermissions.service";
import { USER_TABLE } from "../constant/user.constant";
import { PERMISSIONS_ACTIONS } from "../constant/actions.constant";
import fetchPaginatedData from "../utils/pagination";
import { FilterQuery } from "mongoose";
import { generateSignedUrl } from "../config/bucket.config";

//create user
export const createUser = async (
  userName: string,
  email: string,
  password: string,
  ipAddress: string
) => {
  try {
    const existingUserByEmail = await Users.findOne({
      email: email,
    });
    if (existingUserByEmail) throw new Error("Email already exists!");

    const existingUserByUsername = await Users.findOne({
      userName: userName,
    });
    if (existingUserByUsername) throw new Error("Username already exists!");

    const hashedPassword = await hashPassword(password);
    const newUser = await Users.create({
      userName,
      email,
      password: hashedPassword,
      ipRegisteredWith: ipAddress,
      isVerified: true,
    });
    if (!newUser) throw new Error("User not created!");
    return newUser;
  } catch (error: any) {
    throw error;
  }
};

//get all users
export const getAllUsers = async ({
  readOwn = false,
  userId,
  limit,
  skip,
}: {
  readOwn: boolean;
  userId: string;
  skip: number;
  limit: number;
}) => {
  try {
    if (readOwn) {
      const userIds = await getOwnItemsByPermissionAction(
        userId,
        USER_TABLE,
        PERMISSIONS_ACTIONS.READ
      );
      const { data, pagination } = await fetchPaginatedData<IUser>(
        Users,
        skip,
        limit,
        { _id: { $in: userIds }, removed_at: null }
      );
      const dataWithUrls = await Promise.all(
        data.map(async (user) => {
          const userObj = user.toObject();

          if (!userObj.avatar || (userObj.avatar ?? "").startsWith("https://")) {
            return userObj;
          }
          const avatarWithUrl = await generateSignedUrl(userObj.avatar, 60);
          return { ...userObj, avatarWithUrl };
        })
      );
      return { data: dataWithUrls, pagination };
    }
    const { data, pagination } = await fetchPaginatedData<IUser>(
      Users,
      skip,
      limit,
      { removed_at: null }
    );
    const dataWithUrls = await Promise.all(
      data.map(async (user) => {
        const userObj = user.toObject();
        if (!userObj.avatar || (userObj.avatar ?? "").startsWith("https://")) {
          return userObj;
        }
        const avatarWithUrl = await generateSignedUrl(userObj.avatar, 60);
        return { ...userObj, avatarWithUrl };
      })
    );
    return { data: dataWithUrls, pagination };
  } catch (error: any) {
    throw error;
  }
};

//get user by id
export const getUserById = async (id: string) => {
  try {
    const user = await Users.findOne({ _id: id, removed_at: null }).lean();
    if (!user) throw new Error(`User with id ${id} not found!`);
    if (!user.avatar || (user.avatar ?? "").startsWith("https://")) {
      return user;
    }
    const avatarWithUrl = await generateSignedUrl(user.avatar, 60);
    return { ...user, avatar: avatarWithUrl };
  } catch (error: any) {
    throw error;
  }
};

//update user by id
export const updateUserById = async (id: string, userInfo: Partial<IUser>) => {
  try {
    const { userName, email } = userInfo;
    const user = await Users.findById(id);
    if (!user) throw new Error("User not found!");
    if (userName) {
      const existingUserByUsername = await Users.findOne({
        userName: userName,
      });
      if (existingUserByUsername) throw new Error("Username already exists!");
    }
    if (email) {
      const existingUserByEmail = await Users.findOne({
        email: email,
      });
      if (existingUserByEmail) throw new Error("Email already exists!");
    }
    if (userInfo.password) {
      userInfo.password = await hashPassword(userInfo.password);
    }
    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { ...userInfo },
      { new: true }
    ).lean();
    if (!updatedUser) throw new Error("User not updated!");
    if (updatedUser.avatar && updatedUser.avatar.startsWith("https://")) {
      return updatedUser;
    }
    const userWithUrl = updatedUser.avatar ? await generateSignedUrl(updatedUser.avatar, 60) : updatedUser.avatar;
    return {...updatedUser, avatarWithUrl: userWithUrl};
  } catch (error: any) {
    throw error;
  }
};

//delete user by id
export const deleteUserById = async (id: string) => {
  try {
    const user = await Users.findByIdAndUpdate(
      id,
      { removed_at: Date.now(), devices: [] },
      { new: true }
    );
    if (!user) throw new Error("User not found!");
    return user;
  } catch (error: any) {
    throw error;
  }
};

// get searched users
export const getSearchedUsers = async ({
  skip,
  limit,
  filters,
}: {
  skip: number;
  limit: number;
  filters: FilterQuery<IUser>;
}) => {
  try {
    const { data, pagination } = await fetchPaginatedData<IUser>(
      Users,
      skip,
      limit,
      filters
    );
    const dataWithUrls = await Promise.all(
      data.map(async (user) => {
        const userObj = user.toObject();
        if (!userObj.avatar || (userObj.avatar ?? "").startsWith("https://")) {
          return userObj;
        }
        const avatarWithUrl = await generateSignedUrl(userObj.avatar, 60);
        return { ...userObj, avatarWithUrl };
      })
    );
    return { data: dataWithUrls, pagination };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
