// *********** IMPORTS *********** //


// Import Puppeteer
const puppeteer = require('puppeteer');

//Import Data files
const CREDENTIALS = require('../data/credentials/credentials');
const PAGE_DATA = require('../data/web/page.data');


// *********** END IMPORTS *********** //





const scrapeChallengeMeals = async (browserArgs) => {
    //Launching non-headless for visual debugging
    const browser = await puppeteer.launch({
        headless: browserArgs.isHeadless     
    });
    
    
    const page = await browser.newPage();

    //Login
    await loginToChallengeSite(page);

    // Go to Meal Plans Page
    await page.goto(PAGE_DATA.MEAL_PLANS.URL);
    console.log('ON MEAL PLANS PAGE');          //TODO - turn into logger

    // FIXME LEFT HERE - TODO - add a week limit
    // Detmerine which Weeks are available by parsing the menu
    // const availableWeeks = await getAvailableWeeksFromMenu(page, PAGE_DATA.MEAL_PLANS.SELECTORS);

}




// *********** HELPER FUNCTIONS FOR SCRAPER *********** //


async function loginToChallengeSite(page) {
    console.log('LOGGING IN...');

    // Go to Page
    await page.goto(PAGE_DATA.LOGIN.URL);

    // Click ACCEPT on Cookies Pop-up
    await page.click(PAGE_DATA.LOGIN.SELECTORS.COOKIES_SELECTOR);
    console.log('ACCEPTED COOKIES');

    // Enter in Email and Password
    await page.click(PAGE_DATA.LOGIN.SELECTORS.EMAIL_SELECTOR);
    await page.keyboard.type(CREDENTIALS.EMAIL);
    await page.click(PAGE_DATA.LOGIN.SELECTORS.PASSWORD_SELECTOR);
    await page.keyboard.type(CREDENTIALS.PASSWORD);
    
    // Click Login Button
    await page.click(PAGE_DATA.LOGIN.SELECTORS.LOGIN_BUTTON_SELECTOR);
    console.log('LOGGED IN');
}


// *********** END HELPER FUNCTIONS FOR SCRAPER *********** //




// *********** EXPORTS *********** //
module.exports.scrapeChallengeMeals = scrapeChallengeMeals;
