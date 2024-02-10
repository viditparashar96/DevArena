"use server";

import Answer from "@/database/answer.model";
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
