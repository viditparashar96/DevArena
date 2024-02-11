"use server";

import Interaction from "@/database/interaction.model";
import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";

export async function viewQuestion(params: {
  questionId: string;
  userId: string;
}) {
  try {
    connectToDatabase();
    const { questionId, userId } = params;
    // update view count

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (existingInteraction) {
        return console.log("User already viewed this question");
      }
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
      await Question.findByIdAndUpdate(questionId, {
        $inc: { views: 1 },
      });
    }
  } catch (error) {
    console.log(error);
  }
}
