"use server";

import connect from "../db";
import User from "../models/userModel";

export async function createUser(userData: any) {
  try {
    await connect();
    const user = await User.create(userData);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error);
    throw new Error("Error creating user");
  }
}
