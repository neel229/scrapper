import axios from "axios";
import { load } from "cheerio";

import { Question } from "../types/question";
import { getQueId } from "../utils/getQueID";
import { seedURLS } from "../index";

// getQuestions fetches the questions
// present on a stackoverflow question page
export const getQuestions = async (url: string) => {
	try {
		const { data } = await axios.get(url);
		const $ = load(data);
		const questions = $("a.s-link", "#questions");
		questions.each((_, el) => {
			seedURLS.push($(el).prop("href"));
		});
	} catch (err) {
		console.error(err);
	}
};

// crawlQuestion crawls data from a given
// stackoverflow question's page
export const crawlQuestion = async (url: string): Promise<Question | null> => {
	url = "https://stackoverflow.com" + url;
	try {
		const { data } = await axios.get(url);
		const $ = load(data, {
			xml: {
				normalizeWhitespace: true
			}
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

		// linked questions links
		const linkedQue = $(".question-hyperlink", ".module.sidebar-linked");
		linkedQue.each((_i, el) => {
			const link = $(el).prop("href");
			seedURLS.push(link);
		});

		// related questions links
		const relatedQue = $(".question-hyperlink", ".module.sidebar-related");
		relatedQue.each((_i, el) => {
			const link = $(el).prop("href");
			seedURLS.push(link);
		});

		// TODO: Update reference count
		return question;
	} catch (err) {
		console.error(err);
		return null;
	}
};
