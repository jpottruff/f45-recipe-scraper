// Import Puppeteer
const puppeteer = require('puppeteer');

//Import Data files
const credentials = require('./data/credentials/credentials');
const webdata = require('./data/web/web');

async function run() {
    //Launching non-headless for visual debugging
    const browser = await puppeteer.launch({
        headless: false
    });

    // Open a new page
    const page = await browser.newPage();

    // Login
    await page.goto(webdata.pages.LOGIN.url);
    await login(page);

    // Go to Meal Plans Page
    page.goto(webdata.pages.MEAL_PLANS.url);
    await page.waitFor(10*1000);
    console.log('...Waited 10 seconds');


    //TODO - rest of app
}

async function login(page) {
    // Click ACCEPT on Cookies Pop-up
    await page.click(webdata.pages.LOGIN.selectors.COOKIES_SELECTOR);
    console.log('ACCEPTED COOKIES');

    // Enter in Email and Password
    await page.click(webdata.pages.LOGIN.selectors.EMAIL_SELECTOR);
    await page.keyboard.type(credentials.email);
    await page.click(webdata.pages.LOGIN.selectors.PASSWORD_SELECTOR);
    await page.keyboard.type(credentials.password);
    
    // Click Login Button
    await page.click(webdata.pages.LOGIN.selectors.LOGIN_BUTTON_SELECTOR);

    console.log('LOGGED IN');
}

run();
