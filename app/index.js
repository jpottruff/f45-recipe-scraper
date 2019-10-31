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
    // const weeklyData = await getThisWeeksMeals(page);
    // console.log(weeklyData);

    
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


// TEST STUFF


async function testScrape() {
    //Launching non-headless for visual debugging
    const browser = await puppeteer.launch({
        headless: false
    });

    // BROWSE TO TEST PAGE
    const page = await browser.newPage();
    await page.goto('C:/Users/Jeff/Desktop/eat-shit/f45-recipe-scraper/test-data/test.html');

    // WORKING - GO FROM HERE
    const weeklyData = await getThisWeeksMeals(page);
    console.log(weeklyData);
}


async function getThisWeeksMeals(page) {
    
    let thisWeeksMeals = await page.evaluate( () => {
        const MEALS_FOR_WEEK_SELECTOR = 'div.meal > div';
        
        const MEAL_SECTION_SELECTOR = '.meal_section';
        const MEAL_ROW_SELECTOR = '#meal-row';
    
        const currentWeeksMeals = document.querySelectorAll(MEALS_FOR_WEEK_SELECTOR);
        let data = [];
    
        for (const row of currentWeeksMeals) {
    
            //TODO check to see if it exists to avoid errors
    
            sectionData = {
                sectionHTML: row.querySelector(MEAL_SECTION_SELECTOR).outerHTML
            }
            mealsData = {
                mealsForDayHTML: row.querySelector(MEAL_ROW_SELECTOR).outerHTML
            }
    
            data.push({
                // rowHTML: row.outerHTML
                section: sectionData,
                meals: mealsData
            })
        };
        return data;
    });

    return thisWeeksMeals;
}

// END TEST STUFF



testScrape();
// run();
