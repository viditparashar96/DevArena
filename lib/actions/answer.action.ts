"use server";

import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export async function createAnswer(params: any) {
  try {
    connectToDatabase();
    const { author, question, content, path } = params;
    const newAnswer = new Answer({
      content,
      author,
      question,
    });
    await newAnswer.save();

    // Add the answer to the question arr
    const questionObj = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO ADD INTERRACTION

    await Interaction.create({
      user: author,
      action: "answer",
      question,
      answer: newAnswer._id,
      tags: questionObj.tags,
    });

    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 10 },
    }).exec();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getAnswers(params: any) {
  try {
    connectToDatabase();
    const { questionId, filter } = params;
    let sortOptions = {};
    switch (filter) {
      case "highestUpvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sortOptions = { upvotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }
    const answers = await Answer.find({ question: JSON.parse(questionId) })
      .populate("author", "_id clerkId picture username name")
      .sort(sortOptions);
    if (!answers) return [];
    return answers;
  } catch (error) {
    console.log(error);
  }
}

export async function upvoteAnswer(params: {
  answerId: string;
  userId: string;
  hasupvoted: boolean;
  hasdownvoted: boolean;
  path: string;
}) {
  try {
    connectToDatabase();
    const { answerId, userId, hasupvoted, hasdownvoted, path } = params;
    let updateQuery = {};
    if (hasupvoted) {
      updateQuery = {
        $pull: {
          upvotes: userId,
        },
      };
    } else if (hasdownvoted) {
      updateQuery = {
        $pull: {
          downvotes: userId,
        },
        $push: {
          upvotes: userId,
        },
      };
    } else {
      updateQuery = {
        $addToSet: {
          upvotes: userId,
        },
      };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    }).exec();
    if (!answer) throw new Error("No Answer found");
    // InCrement authors reputation

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupvoted ? -2 : 2 },
    }).exec();

    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasupvoted ? -10 : 10 },
    }).exec();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function downvoteAnswer(params: {
  answerId: string;
  userId: string;
  hasupvoted: boolean;
  hasdownvoted: boolean;
  path: string;
}) {
  try {
    connectToDatabase();
    const { answerId, userId, hasupvoted, hasdownvoted, path } = params;
    let updateQuery = {};
    if (hasdownvoted) {
      updateQuery = {
        $pull: {
          downvotes: userId,
        },
      };
    } else if (hasupvoted) {
      updateQuery = {
        $pull: {
          upvotes: userId,
        },
        $push: {
          downvotes: userId,
        },
      };
    } else {
      updateQuery = {
        $addToSet: {
          downvotes: userId,
        },
      };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    }).exec();
    if (!answer) throw new Error("No answer found");
    // InCrement authors reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownvoted ? -2 : 2 },
    }).exec();

    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasdownvoted ? -10 : 10 },
    }).exec();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteAnswer(params: { answerId: string; path: string }) {
  try {
    connectToDatabase();
    const { answerId, path } = params;
    const answer = await Answer.findById(answerId).exec();
    if (!answer) throw new Error("No answer found");
    await answer.deleteOne({ _id: answerId }).exec();
    await Question.updateMany(
      {
        _id: answer.question,
      },
      {
        $pull: {
          answers: answerId,
        },
      }
    );
    await Interaction.deleteMany({ answer: answerId }).exec();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
