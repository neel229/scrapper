import { getQuestions, crawlQuestion } from "./controllers/scrape";

// step 1) get question urls to start crawling
export let seedURLS: string[] = [];

const start = async () => {
	for (let i = 0; i < 5; i++) {
		const url = `https://stackoverflow.com/questions?tab=newest&page=${i}`;
		await getQuestions(url);
	}
	console.log("questions populated...");

	const recursiveCrawl = async () => {
		if (seedURLS.length === 0) {
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
