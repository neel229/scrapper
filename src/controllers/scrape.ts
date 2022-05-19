import axios from "axios";
import { load } from "cheerio";

import { Question } from "../types/question";
import { checkURL } from "../utils/checkURL";
import {getQueId} from "../utils/getQueID";

// getQuestions fetches the questions
// present on a stackoverflow question page
export const getQuestions = async (url: string): Promise<string[] | null> => {
  try {
    const { data } = await axios.get(url);
    const $ = load(data);

    let links: string[] = [];
    const questions = $("a.s-link", "#questions");
    questions.each((_, el) => {
      links.push($(el).prop("href"));
    });

    return links;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// crawlQuestion crawls data from a given
// stackoverflow question's page
export const crawlQuestion = async (url: string): Promise<Question | null> => {
  try {
    const { data } = await axios.get(url);
    const $ = load(data, {
      xml: {
        normalizeWhitespace: true,
      },
    });

    // question metadata
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
      queId: getQueId(url)
    };

    let map = new Map<number, number>();
    // linked questions links
    const linkedQue = $(".question-hyperlink", ".module.sidebar-linked");
    linkedQue.each((_i, el) => {
        const link = $(el).prop("href");
        const queId = getQueId(link)
        map.set(queId, map.get(queId) + 1 || 1);
    })

    // related questions links
    const relatedQue = $(".question-hyperlink", ".module.sidebar-related");
    relatedQue.each((_i, el) => {
        const link = $(el).prop("href");
        const queId = getQueId(link)
        map.set(queId, map.get(queId) + 1 || 1);
    })

    // links shared in answers and comments
    const links = $("a");
    links.each((_i, el) => {
        // check if the link is a valid
        // question url
        const link = $(el).prop("href");
        if (checkURL(link) === true) {
            const queId = getQueId(link)
            map.set(queId, map.get(queId) + 1 || 1);
        }
    })

    // TODO: Update reference count

    return question;
  } catch (err) {
    console.error(err);
    return null;
  }
};
