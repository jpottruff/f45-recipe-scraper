const SCRAPER = require('./utils/scraper');

async function run() {
    const browserArgs = {isHeadless: false}

    SCRAPER.scrapeChallengeMeals(browserArgs);
}

run();