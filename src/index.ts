import { getQuestions, crawlQuestion } from "./controllers/scrape";

// step 1) get question urls to start crawling
export let seedURLS: string[] = [];

let questionPagePointer = 0;

const start = async () => {
	// populate seed questions
	const popQuestions = async (j: number) => {
		for (let i = j; i < j + 2; i++) {
			questionPagePointer++;
			const url = `https://stackoverflow.com/questions?tab=newest&page=${i}`;
			await getQuestions(url);
		}
		console.log("questions populated...");
	};

	await popQuestions(1);

	const recursiveCrawl = async () => {
		if (seedURLS.length === 0) {
			await popQuestions(questionPagePointer + 1);
			return;
		}
		const que = await crawlQuestion(seedURLS[seedURLS.length - 1]);
		console.log("crawled: ", que);
		seedURLS.pop();
		recursiveCrawl();
	};
	await recursiveCrawl();
};

start();
