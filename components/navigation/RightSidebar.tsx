import Image from "next/image";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";

import TagCard from "../cards/TagCard";

const hotQuestions = [
  { _id: "1", title: "how to create our react hook?" },
  { _id: "2", title: "how make an API?" },
  { _id: "3", title: "how to initiate our next project?" },
  { _id: "4", title: "how to create admin dashboard in javascript?" },
  { _id: "5", title: "how to create our react component?" },
];
const tags = [
  { _id: "1", name: "react", questions: 100 },
  { _id: "2", name: "react-native", questions: 400 },
  { _id: "3", name: "java query", questions: 300 },
  { _id: "4", name: "next", questions: 10 },
  { _id: "5", name: "python", questions: 123 },
];
const RightSidebar = () => {
  return (
    <section className="pt-36 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
      </div>
      <div className="mt-7 flex w-full flex-col gap-[30px]">
        {hotQuestions.map(({ _id, title }) => (
          <Link
            key={_id}
            href={ROUTES.QUESTION(_id)}
            className="flex cursor-pointer items-center justify-between gap-7"
          >
            <p className="body-medium text-dark500_light700">{title}</p>
            <Image
              src="/icons/chevron-right.svg"
              alt="chevron"
              width={20}
              height={20}
              className="invert-colors"
            />
          </Link>
        ))}
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {tags.map(({ _id, name, questions }) => (
            <TagCard
              key={_id}
              _id={_id}
              name={name}
              questions={questions}
              showCount
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
