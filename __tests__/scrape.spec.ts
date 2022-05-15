import { getQuestions, crawlQuestion } from "../src/controllers/scrape";
import { Question } from "../src/types/question";

describe("Scraping tests", () => {
  it("Fetch questions from a question page", async () => {
    const url = "https://stackoverflow.com/questions";
    const questions = await getQuestions(url);
    expect(questions.length).toEqual(50);
  });

  // NOTE: The upvote and answer count values may change with time,
  // make sure to verify the hardcoded value before testing
  it("Crawl data from a specific question's page", async () => {
    const url =
      "https://stackoverflow.com/questions/17666249/how-do-i-import-an-sql-file-using-the-command-line-in-mysql?rq=1";
    const expectedValues: Question = {
      title: "How do I import an SQL file using the command line in MySQL?",
      upvotes: "2514",
      answerCount: "54",
      url: url,
    };
    const response = await crawlQuestion(url);
    expect(response.title).toEqual(expectedValues.title);
    expect(response.upvotes).toEqual(expectedValues.upvotes);
    expect(response.answerCount).toEqual(expectedValues.answerCount);
    expect(response.url).toEqual(expectedValues.url);
  });
});
