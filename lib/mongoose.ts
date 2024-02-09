import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  // @ts-ignore
  if (!"mongodb://127.0.0.1:27017/devarena") console.log("no mongo uri");
  if (isConnected) {
    return console.log("using existing database connection");
  }
  try {
    // @ts-ignore
    await mongoose.connect("mongodb://127.0.0.1:27017/devarena", {
      dbName: "devarena",
    });
    isConnected = true;
    console.log("mongodb connected successfully");
  } catch (error) {
    console.log(error);
  }
};
