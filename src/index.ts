import mongoose from "mongoose";
import { config } from "dotenv";

config();

import { onExit } from "./controllers/onExit";
import { getQuestions, crawlQuestion } from "./controllers/scrape";
import { Question } from "./types/question";

// step 1) get question urls to start crawling
export let seedURLS: string[] = [];
export let map = new Map<number, number>();
export let scrapedQue: Question[] = [];

const start = async () => {
	for (let i = 0; i < 3; i++) {
		const url = `https://stackoverflow.com/questions?tab=newest&page=${i}`;
		await getQuestions(url);
	}
	console.log("questions populated...");

	const recursiveCrawl = async () => {
		if (seedURLS.length === 0) {
			return;
		}
		await crawlQuestion(seedURLS[seedURLS.length - 1]);
		seedURLS.pop();
		recursiveCrawl();
	};
	await recursiveCrawl();
};

// start mongodb conn
(async () => {
	const dbURL = process.env.DB_URL;
	if (!dbURL) {
		console.error("DB URL is missing!");
		process.exitCode = 1;
		process.exit();
	}
	try {
		await mongoose.connect(dbURL);
	} catch (err) {
		console.error(err);
	}
})();

start();

process.on("SIGINT", onExit.bind(null));
