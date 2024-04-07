"use server";

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";

const SearchableTypes = ["question", "user", "answer", "tag"];
export async function globalSearch(params: any) {
  try {
    connectToDatabase();
    const { query, type } = params;

    const regexQuery = { $regex: query, $options: "i" };
    let result: any = [];
    const modelsAndTypes = [
      {
        model: Question,
        searchField: "title",
        type: "question",
      },
      {
        model: User,
        searchField: "name",
        type: "user",
      },
      {
        model: Answer,
        searchField: "content",
        type: "answer",
      },
      {
        model: Tag,
        searchField: "name",
        type: "tag",
      },
    ];
    const typeLower = type?.toLowerCase();
    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // Seach all types
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResult = await model
          .find({ [searchField]: regexQuery })
          .limit(2);
        result.push(
          ...queryResult.map((item) => {
            return {
              title:
                type === "answer"
                  ? `Answer containing ${query}`
                  : item[searchField],
              type,
              id:
                type === "user"
                  ? item.clerkId
                  : type === "answer"
                    ? item.questionId
                    : item._id,
            };
          })
        );
      }
    } else {
      const modelInfo = modelsAndTypes.find((item) => item.type === type);
      if (!modelInfo) {
        throw new Error("Model not found");
      }

      const queryResult = await modelInfo.model
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(8);

      result = queryResult.map((item) => {
        return {
          title:
            type === "answer"
              ? `Answer containing ${query}`
              : item[modelInfo.searchField],
          type,
          id:
            type === "user"
              ? item.clerkId
              : type === "answer"
                ? item.questionId
                : item._id,
        };
      });
    }
    return JSON.stringify(result);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
