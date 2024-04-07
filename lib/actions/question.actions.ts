"use server";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
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

    const { searchQuery, filter } = params;
    const query: FilterQuery<typeof Question> = {};
    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { explanation: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};
    console.log(filter);
    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;

      default:
        break;
    }
    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort(sortOptions)
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
    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } }).exec();

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

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupvoted ? -1 : 1 },
    }).exec();

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupvoted ? -10 : 10 },
    }).exec();

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

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownvoted ? -1 : 1 },
    }).exec();

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasdownvoted ? -10 : 10 },
    }).exec();

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
    console.log(page, pageSize, filter);
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    let sortOptions = {};
    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: 1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_answered":
        sortOptions = { answers: 1 };
        break;
      default:
        break;
    }
    const user = await User.findOne({ clerkId })
      .populate({
        path: "saved",
        match: query,
        options: {
          sort: sortOptions,
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

export async function deleteQuestion(params: {
  questionId: string;
  path: string;
}) {
  try {
    connectToDatabase();
    const { questionId, path } = params;
    await Question.deleteOne({ _id: questionId }).exec();
    await Answer.deleteMany({ question: questionId }).exec();
    await Interaction.deleteMany({ question: questionId }).exec();
    await Tag.updateMany(
      {
        questions: questionId,
      },
      {
        $pull: {
          questions: questionId,
        },
      }
    );
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function editQuestion(params: {
  questionId: string;
  title: string;
  explanation: string;
  path: string;
}) {
  try {
    connectToDatabase();
    const { questionId, title, explanation, path } = params;
    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag })
      .exec();
    if (!question) {
      throw new Error("No question found");
    }
    question.title = title;
    question.explanation = explanation;
    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getHotQuestions() {
  try {
    connectToDatabase();
    const hotquestion = await Question.find({})
      .sort({ upvotes: -1, views: -1 })
      .limit(5)
      .exec();

    if (!hotquestion) throw new Error("No questions found");
    return hotquestion;
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while fetching questions");
  }
}
