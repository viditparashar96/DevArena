"use client";
import { useTheme } from "@/context/ThemeProvider";
import { AnswerSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BsStars } from "react-icons/bs";
import * as z from "zod";
import { Button } from "../ui/button";

import { createAnswer } from "@/lib/actions/answer.action";
import { run } from "@/lib/genai";
import { usePathname } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
interface AnswerProps {
  question: string;
  questionId: string;
  authorId: string;
}
const Answer = ({ question, questionId, authorId }: AnswerProps) => {
  const pathname = usePathname();
  const { mode } = useTheme();
  const editorRef: any = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingAI, setIsSubmittingAI] = useState(false);
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });

  const handleCreateAnswer = async (value: any) => {
    setIsSubmitting(true);
    console.log(value);
    try {
      await createAnswer({
        content: value.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname,
      });
      form.reset();

      if (editorRef.current) {
        editorRef.current.setContent("");
      }
    } catch (error) {
      console.log("err===>", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClick = async () => {
    try {
      if (!authorId) return;
      setIsSubmittingAI(true);
      const questionToSend = JSON.stringify(question);
      const response = await run(questionToSend);
      setIsSubmittingAI(false);
      if (editorRef.current) {
        const aiAnswer = response.replace(/(?:\r\n|\r|\n)/g, "<br>");

        editorRef.current.setContent(aiAnswer);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="primary-gradient flex w-fit gap-2 text-white"
          onClick={handleClick}
          disabled={isSubmittingAI}
        >
          <BsStars height={12} width={12} />
          {isSubmittingAI ? "Generating..." : "Generate AI Answer"}
        </Button>
      </div>
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Detail explaination of your problem{" "}
                  <span className=" text-primary-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    initialValue=""
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "code",
                        "help",
                        "wordcount",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "codesample | bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist  ",
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>

                <FormMessage className=" text-red-500" />
              </FormItem>
            )}
          />
          <div className=" flex justify-end ">
            <Button
              type="submit"
              className="primary-gradient w-fit text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Answer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
