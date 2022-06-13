# Stackoverflow Questions Scrapper

### About
This project includes a web scraper which crawls over stack overflow questions and scrape metadata of each question.
<br/>
<br/>
Following are some the features of the web scraper:
- Get question metadata (title, url, upvotes, answer counts, reference counts)
- Asynchronous in nature
- Modular
- Upon exit saves the data to a MongoDB collection and also dumps the data to a csv file
- Throttled amount of concurrent requests using semaphores

### Steps to run the project
NOTE: Make sure TypeScript is installed

To install dependencies:
```bash
 yarn install
```

To run the script:
```bash
yarn start
```

### Extras
The `.env` file is there in the repo's zip drive link. It is used to pass the MongoDB connection url.
