import ObjectsToCsv from "objects-to-csv";
import { Question } from "../types/question";

export const parseToCSV = async (questions: Question[]) => {
	if (questions.length === 0) return;
	const csv = new ObjectsToCsv(questions);
	await csv.toDisk("./files/output.csv", {
		append: true
	});
};
