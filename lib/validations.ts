import { z } from "zod";

export const QusetionsSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(20),
  tags: z.array(z.string().min(1).max(15)).min(1).max(5),
});

export const AnswerSchema = z.object({
  answer: z.string().min(20),
});
export const EditProfileSchema = z.object({
  name: z.string().min(2).max(50),
  username: z.string().min(2).max(50),
  portfolioWebsite: z.string().url(),
  Location: z.string().min(3).max(100),
  Bio: z.string().min(3).max(100),
});
