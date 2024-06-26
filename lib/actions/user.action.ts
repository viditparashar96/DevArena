"use server";

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import { BadgeCriteriaType } from "@/types";
import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import { assignBadge } from "../utils";

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
    const { searchQuery, filter } = params;
    const query: FilterQuery<typeof User> = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { clerkId: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};
    console.log(filter);
    switch (filter) {
      case "new_users":
        sortOptions = { joined: -1 };
        break;
      case "old_users":
        sortOptions = { joined: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;
      default:
        break;
    }
    // const { page = 1, pageSize = 10, filter, searchQuery } = params;
    const users = await User.find(query).sort(sortOptions);

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
    const [questionUpVotes] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [AnswerUpVotes] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);
    const [questionViews] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$upvotes" },
        },
      },
    ]);

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpVotes?.totalUpvotes || 0,
      },

      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: AnswerUpVotes?.totalViews || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];

    const badgeCounts = assignBadge({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation,
    };
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
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
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
