"use server";

import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import Question from "@/database/question.model";
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
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO ADD INTERRACTION

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getAnswers(params: any) {
  try {
    connectToDatabase();
    const { questionId } = params;
    const answers = await Answer.find({ question: JSON.parse(questionId) })
      .populate("author", "_id clerkId picture username name")
      .sort({ createdAt: -1 });
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
