"use server";

import User from "@/database/user.model";
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
