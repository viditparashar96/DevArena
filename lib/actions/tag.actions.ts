"use server";

import Question from "@/database/question.model";
import Tag, { ITag } from "@/database/tag.model";
import User from "@/database/user.model";
import { FilterQuery } from "mongoose";
import { connectToDatabase } from "../mongoose";

export async function getTopInteractedTags(params: any) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    // Find interactions for the user and group them by tag....
    // Interaction....

    return [
      { name: "tag1", _id: "1" },
      { name: "tag2", _id: "2" },
    ];
  } catch (error) {
    console.log(error);
  }
}

export async function getAllTags(params: any) {
  try {
    connectToDatabase();
    const { searchQuery, filter } = params;
    const query: FilterQuery<typeof Tag> = {};
    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }
    let sortOptions = {};
    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }
    const tags = await Tag.find(query)
      .populate({ path: "questions", model: Question })
      .sort(sortOptions)
      .exec();
    return tags;
  } catch (error) {
    console.log(error);
  }
}

export async function getQuestionsByTag(params: any) {
  try {
    connectToDatabase();
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;
    console.log(page, pageSize);
    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter)
      .populate({
        path: "questions",
        match: searchQuery
          ? { title: { $regex: new RegExp(searchQuery, "i") } }
          : {},
        options: {
          sort: { createdAt: -1 },
        },
        model: Question,
        populate: [
          { path: "tags", model: Tag, select: "_id name" },
          {
            path: "author",
            model: User,
            select: "_id name clerkId picture username",
          },
        ],
      })
      .exec();
    if (!tag) throw new Error("No Tag found");

    const questions = tag.questions;

    return { tagTitle: tag.name, questions };
  } catch (error) {
    console.log(error);
  }
}

export async function getPopularTags() {
  try {
    connectToDatabase();
    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberofQuestions: { $size: "$questions" } } },
      { $sort: { numberofQuestions: -1 } },
      { $limit: 5 },
    ]);
    return popularTags;
  } catch (error) {
    console.log(error);
  }
}
