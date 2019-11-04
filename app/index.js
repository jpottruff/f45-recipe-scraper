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

    const weeklyData = await getThisWeeksMeals(page);
    console.log("GOT THIS WEEKS DATA");
    console.log(weeklyData);   

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

async function getThisWeeksMeals(page) {

    const SELECTORS = webdata.pages.MEAL_PLANS.selectors;
    
    let thisWeeksMeals = await page.evaluate( (SELECTORS) => {
        const currentWeeksMeals = document.querySelectorAll(SELECTORS.MEALS_FOR_WEEK_SELECTOR);
        let data = [];
        
        // Iterate through the meals for the week to extract the relevant data
        for (const row of currentWeeksMeals) {

            // Check to see that the row contains a Meal Day (NOTE: at the moment the first row DOES NOT, first row is a header row)
            if (row.querySelector(SELECTORS.MEAL_DAY_SELECTOR)) {

                // MEAL SECTION DATA
                daySectionData = {
                    // sectionHTML: row.querySelector(MEAL_SECTION_SELECTOR).outerHTML,
                    mealDay: row.querySelector(SELECTORS.MEAL_DAY_SELECTOR).innerHTML,
                    mealDate: row.querySelector(SELECTORS.MEAL_DATE_SELECTOR).innerHTML
                }

                // MEALS FOR THE DAY DATA
                // Get all the Meal rows for the day, Iterate over it to extract the meals
                let mealRowsForDay = row.querySelector(SELECTORS.MEAL_ROW_SELECTOR);
                let mealDetails = mealRowsForDay.querySelectorAll(SELECTORS.MEAL_DETAILS_SELECTOR);
                let mealsForTheDay = []
                for (const mealData of mealDetails) {
                    mealsForTheDay.push({
                        mealCategory: mealData.querySelector(SELECTORS.MEAL_CATEGORY_SELECTOR).innerHTML.trim(),
                        mealTitle: mealData.querySelector(SELECTORS.MEAL_TITLE_SELECTOR).innerText,
                        mealLink: mealData.querySelector(SELECTORS.MEAL_LINK_SELECTOR).getAttribute('href')
                    })
                }

                // Put all the meals for the day into a Data Object
                dayMealData = {
                    // mealsForDayHTML: row.querySelector(MEAL_ROW_SELECTOR).outerHTML,
                    meals: mealsForTheDay
                }
                
                // Put the Extracted Data into a Meals for the Day Object and add it to our data
                data.push({
                    // rowHTML: row.outerHTML                
                    mealsForDay : {
                        section: JSON.stringify(daySectionData),
                        meals: JSON.stringify(dayMealData)
                    }
                });
            } 
        };

        // Return the Data
        return data;

    }, SELECTORS);

    return thisWeeksMeals;
}

// TEST STUFF
async function testScrape() {
    //Launching non-headless for visual debugging
    const browser = await puppeteer.launch({
        headless: false
    });

    // BROWSE TO TEST PAGE
    const page = await browser.newPage();
    await page.goto('C:/Users/Jeff/Desktop/scraper/f45-recipe-scraper/test-data/test.html');

    // Get This weeks Data
    const weeklyData = await getThisWeeksMeals(page);
    console.log(weeklyData);
}
// END TEST STUFF



testScrape();
run();
