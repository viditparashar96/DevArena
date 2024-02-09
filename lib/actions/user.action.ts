"use server";

import Question from "@/database/question.model";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export async function getUserById(params: any) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while fetching user");
  }
}

export async function createUser(UserData: any) {
  try {
    connectToDatabase();
    const user = await User.create(UserData);

    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(params: any) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUser(params: any) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });
    if (!user) throw new Error("User not found");
    // delete user from database
    // and questions,and answers,comments,etc

    // get user questions and delete them
    const userQuestionsIds = await Question.find({ author: user._id }).distinct(
      "_id"
    );
    await Question.deleteMany({ author: user._id });

    // TODO: delete answers,comments,etc

    const deltedUser = await User.findByIdAndDelete(user._id);
    return deltedUser;
    // revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
