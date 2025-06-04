"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useForm } from "react-hook-form";

import { AskQuestionSchema } from "@/lib/validations";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const QuestionForm = () => {
  const editorRef = useRef<MDXEditorMethods>(null);
  const form = useForm({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });
  const Editor = dynamic(() => import("@/components/editor"), {
    ssr: false,
  });
  const handleCreateQuestion = () => {};
  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateQuestion)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title<span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56p] border" />
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Be specific and imagine you are asking a question to another
                person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detiled explanation of your problem
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  editorRef={editorRef}
                  value={field.value}
                  fieldChange={field.onChange}
                />
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Introduce the problem and expand on what you have put in the
                title
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <div>
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Tags<span className="text-primary-500">*</span>
                </FormLabel>
              </div>
              <FormControl>
                <Input
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56p] border"
                  placeholder="Add Tags..."
                />
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Add upto 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <div className="mt-16 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit ! text-light-900"
          >
            {" "}
            Ask a Question
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
