import axios from "axios";
import { load } from "cheerio";

import { Question } from "../types/question";

// getQuestions fetches the questions
// present on a stackoverflow question page
export const getQuestions = async (url: string): Promise<string[]> => {
  const { data } = await axios.get(url);
  const $ = load(data);

  let links: string[] = [];
  const questions = $("a.s-link", "#questions");
  questions.each((_, el) => {
    links.push($(el).prop("href"));
  });

  return links;
};

// crawlQuestion crawls data from a given
// stackoverflow question's page
export const crawlQuestion = async (url: string): Promise<Question> => {
  const { data } = await axios.get(url);
  const $ = load(data, {
    xml: {
      normalizeWhitespace: true,
    },
  });

  const title = $("#question-header > h1").text();
  const upvotes = $(
    ".js-vote-count.flex--item.d-flex.fd-column.ai-center.fc-black-500.fs-title"
  )
    .first()
    .text()
    .trim();
  const answerCount = $("h2.mb0", "#answers").prop("data-answercount");
  const question: Question = {
    title: title,
    upvotes: upvotes,
    answerCount: answerCount,
    url: url,
  };

  // TODO: Update reference count

  return question;
};
