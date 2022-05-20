import mongoose from "mongoose";
import { config } from "dotenv";

config();

import { onExit } from "./controllers/onExit";
import { getQuestions, crawlQuestion } from "./controllers/scrape";
import { Question } from "./types/question";
import { Semaphore } from "async-mutex";

export let seedURLS: string[] = [];
export let map = new Map<number, number>();
export let scrapedQue: Question[] = [];

const start = async () => {
	// step 1) get question urls to start crawling
	for (let i = 0; i < 3; i++) {
		const url = `https://stackoverflow.com/questions?tab=newest&page=${i}`;
		await getQuestions(url);
	}
	console.log("questions populated...");

	// step 2) start recursively crawling the populated
	// seed questions array
	const s = new Semaphore(5);
	await Promise.all(
		seedURLS.map((question) => {
			s.runExclusive(() => crawlQuestion(question));
		})
	);
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

// when the script is killed, call the onExit
// handler function
process.on("SIGINT", onExit.bind(null));
