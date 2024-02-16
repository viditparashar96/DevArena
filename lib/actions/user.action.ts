"use server";

import Answer from "@/database/answer.model";
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

    // @ts-ignore
    const userQuestionsIds = await Question.find({ author: user._id }).distinct(
      "_id"
    );
    console.log(userQuestionsIds);
    await Question.deleteMany({ author: user._id });

    // TODO: delete answers,comments,etc

    const deltedUser = await User.findByIdAndDelete(user._id);
    return deltedUser;
    // revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getAllUsers(params: any) {
  try {
    connectToDatabase();
    // const { page = 1, pageSize = 10, filter, searchQuery } = params;
    const users = await User.find({}).sort({ createdAt: -1 });

    return users;
  } catch (error) {
    console.log(error);
  }
}
export async function toggleSaveQuestion(params: any) {
  try {
    connectToDatabase();
    const { userId, questionId, path } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
export async function getUserInfo(params: any) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");
    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return { user, totalQuestions, totalAnswers };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserQuestions(params: any) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;
    console.log(page, pageSize);
    const totalQuestions = await Question.countDocuments({ author: userId });
    const questions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    return { questions, totalQuestions };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserAnswers(params: any) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;
    console.log(page, pageSize);
    const totalAnswers = await Answer.countDocuments({ author: userId });
    const answers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture");

    return { answers, totalAnswers };
  } catch (error) {
    console.log(error);
  }
}
