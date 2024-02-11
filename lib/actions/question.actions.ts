"use server";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import { CreateQuestionParams, GetQuestionsParams } from "./sharded.types";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();
    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .exec();
    if (!questions) throw new Error("No questions found");
    return questions;
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while fetching questions");
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();
    const { title, explanation, tags, author, path } = params;

    const question = new Question({
      title,
      explanation,
      author,
    });
    await question.save();
    const tagDocuments = [];
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);
    }
    await Question.findByIdAndUpdate(question._id, {
      $push: {
        tags: { $each: tagDocuments },
      },
    });

    // create an interaction record for ther user's ask a question action

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getQuestionById(id: string) {
  try {
    connectToDatabase();
    const question = await Question.findById(id)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture username",
      })
      .exec();
    if (!question) throw new Error("No question found");
    return question;
  } catch (error) {
    console.log(error);
  }
}

export async function upvoteQuestion(params: {
  questionId: string;
  userId: string;
  hasupvoted: boolean;
  hasdownvoted: boolean;
  path: string;
}) {
  try {
    connectToDatabase();
    const { questionId, userId, hasupvoted, hasdownvoted, path } = params;
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
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    }).exec();
    if (!question) throw new Error("No question found");
    // InCrement authors reputation
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
export async function downvoteQuestion(params: {
  questionId: string;
  userId: string;
  hasupvoted: boolean;
  hasdownvoted: boolean;
  path: string;
}) {
  try {
    connectToDatabase();
    const { questionId, userId, hasupvoted, hasdownvoted, path } = params;
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
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    }).exec();
    if (!question) throw new Error("No question found");
    // InCrement authors reputation
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
export async function getSavedQuestion(params: any) {
  try {
    connectToDatabase();
    // @ts-ignore
    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};
    const user = await User.findOne({ clerkId })
      .populate({
        path: "saved",
        match: query,
        options: {
          sort: { createdAt: -1 },
        },
        populate: [
          { path: "tags", model: Tag, select: "_id name" },
          {
            path: "author",
            model: User,
            select: "_id name clerkId picture username",
          },
        ],

        model: Question,
      })
      .exec();
    if (!user) throw new Error("No user found");

    const savedQuestions = user.saved;
    return savedQuestions;
  } catch (error) {
    console.log(error);
  }
}
