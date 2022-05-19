import { Question } from "../types/question";
import { Question as Que } from "../models/question";
import { parseToCSV } from "../utils/parseCSV";
import { scrapedQue, map } from "../index";

export async function onExit() {
	try {
		// store in the db
		scrapedQue.forEach(async (question) => {
			const que: Question = {
				...question,
				referenceCount: map.get(question.queId)
			};
			await Que.create(que);
		});

		// append to csv file
		await parseToCSV(scrapedQue);

		// exit the script
		process.exit();
	} catch (err) {
		console.error(err);
	}
}
