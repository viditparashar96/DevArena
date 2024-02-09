import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  // @ts-ignore
  if (process.env.MONGODB_URI) console.log("no mongo uri");
  if (isConnected) {
    return console.log("using existing database connection");
  }
  try {
    // @ts-ignore
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "devarena",
    });
    isConnected = true;
    console.log("mongodb connected successfully");
  } catch (error) {
    console.log(error);
  }
};
