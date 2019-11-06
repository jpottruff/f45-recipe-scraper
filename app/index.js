// Import Puppeteer
const puppeteer = require('puppeteer');

//Import Data files
const CREDENTIALS = require('./data/credentials/credentials');
const PAGE_DATA = require('./data/web/page.data');

async function run() {
    //Launching non-headless for visual debugging
    const browser = await puppeteer.launch({
        headless: false
    });

    // Open a new page
    const page = await browser.newPage();

    // Login
    await page.goto(PAGE_DATA.LOGIN.URL);
    await login(page);
    
    // Go to Meal Plans Page
    await page.goto(PAGE_DATA.MEAL_PLANS.URL);
    console.log('ON MEAL PLANS PAGE');

    // Detmerine which Weeks are available by parsing the menu
    const availableWeeks = await getAvailableWeeksFromMenu(page, PAGE_DATA.MEAL_PLANS.SELECTORS);

    // Get the Basic Meal Data for each Week
    const weeklyData = await getWeeklyData(page, availableWeeks, PAGE_DATA.MEAL_PLANS.SELECTORS);


 //Now we have the data we need to go get the recipes
    console.log(weeklyData);
    console.log(weeklyData[1].dayData);
    console.log(' --------------------------------------------------')

//FIXME - make a function
    // Iterate of each week
    for (let week of weeklyData) {
        // console.log(`${week}`);
        // console.log(`${week.week}`);

        //Iterate through the days of that week
        for (let day of week.dayData) {
            // console.log(`${day}`);
            console.log(`----${day.dayInfo.date}--------`);

            //Iterate through that days meals
            for (let meal of day.meals) {
                console.log(`${meal.mealURL}`);
                //Go to Page
                // await page.goto(meal.mealURL)
            }
        }
    }
}


async function login(page) {
    console.log('LOGGING IN...');

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



async function getAvailableWeeksFromMenu(page, SELECTORS) {
    console.log("GETTING AVAILABLE WEEKS...")

    const availableWeeks = await page.evaluate( (SELECTORS) => {
        const menuItems = document.querySelectorAll(SELECTORS.MENU_ITEM_SELECTOR);
        let data = [];

        // Iterate through all the Weeks in the Weeks Navigation Menu 
        for (const item of menuItems){
            // If the Menu Item is not disabled, Add it
            if ( !item.classList.contains('disabled') ){
                data.push({
                    week: item.querySelector(SELECTORS.MENU_ITEM_LINK_SELECTOR).innerText,
                    linkToAppend: item.querySelector(SELECTORS.MENU_ITEM_LINK_SELECTOR).getAttribute('href'),
                    // html: item.outerHTML,
                });
            }
        }

        // Return all the gathered data
        return data; 
    }, SELECTORS );

    console.log("GOT ALL AVAILABLE WEEKS")
    return availableWeeks;
}



async function getWeeklyData(page, availableWeeks, SELECTORS) {
        let weeklyData = availableWeeks;

        for (let week of weeklyData) {
            // Go to the Page
            week.url = PAGE_DATA.MEAL_PLANS.URL + week.linkToAppend;
            await page.goto(week.url);
    
            // Get the Data
            console.log(`GETTING WEEK ${week.week} DATA...`)
            let dayData = await getThisWeeksMeals(page, SELECTORS);
            console.log(`GOT WEEK ${week.week}'s DATA`);
            
            // Add it to the week
            week.dayData = dayData;
        } 

        return weeklyData;
}



async function getThisWeeksMeals(page, SELECTORS) {

    let thisWeeksMeals = await page.evaluate( (SELECTORS) => {
        // Grab the current Weeks Meals from the Page
        const currentWeeksMeals = document.querySelectorAll(SELECTORS.MEALS_FOR_WEEK_SELECTOR);
        let data = [];
        
        // Iterate through the extracted meals for the week; extract the relevant data
        for (const row of currentWeeksMeals) {

            // Check to see that the row contains a Meal Day 
            // (NOTE: first row is currently a header row and will not)
            if (row.querySelector(SELECTORS.MEAL_DAY_SELECTOR)) {

                // DAY DATE INFORMATION
                daySectionData = {
                    day: row.querySelector(SELECTORS.MEAL_DAY_SELECTOR).innerHTML,
                    date: row.querySelector(SELECTORS.MEAL_DATE_SELECTOR).innerHTML
                    // html: row.querySelector(MEAL_SECTION_SELECTOR).outerHTML,
                }

                // DAY MEALS INFORMATION
                // Get all the Meal Rows for the Day, then use it to extract the Meal Detials 
                let mealRowsForDay = row.querySelector(SELECTORS.MEAL_ROW_SELECTOR);
                let mealDetails = mealRowsForDay.querySelectorAll(SELECTORS.MEAL_DETAILS_SELECTOR);
                let mealsForTheDay = []

                // Iterate over the all Meal Data for the Day
                for (const mealData of mealDetails) {
                    // Push the each Meal onto the list of Meals for the Day
                    mealsForTheDay.push({
                        category: mealData.querySelector(SELECTORS.MEAL_CATEGORY_SELECTOR).innerHTML.trim(),
                        title: mealData.querySelector(SELECTORS.MEAL_TITLE_SELECTOR).innerText,
                        mealURL: mealData.querySelector(SELECTORS.MEAL_LINK_SELECTOR).getAttribute('href')
                    })
                }

                // Put all information for the day into a data object, push it to an array to be returned
                data.push({
                        dayInfo: daySectionData,
                        meals: mealsForTheDay
                });
            } 
        };

        // Return the Data
        return data;
    }, SELECTORS);

    return thisWeeksMeals;
}




/**** MAIN PROGRAM FLOW ****/
testScrape();
// run();







// TEST STUFF

async function testScrape() {
    //Launching non-headless for visual debugging
    const browser = await puppeteer.launch({
        headless: false
    });

    // BROWSE TO TEST PAGE
    const page = await browser.newPage();
    // await page.goto('C:/Users/Jeff/Desktop/scraper/f45-recipe-scraper/test-data/test.html');
    // await page.goto('C:/Users/Jeff/Desktop/scraper/f45-recipe-scraper/test-data/sample-weekly-menu.html');
    await page.goto('C:/Users/Jeff/Desktop/scraper/f45-recipe-scraper/test-data/sample-recipe-1.html');

    const mealData = await getMealData();
    console.log(mealData);
}

async function getMealData(page, SELECTORS) {
        // Get Meal Title
        // Get Ingredients
        // Get Method
        // Get Servings per recipe
        // Get Serviing Size
        // Get Nutirition Facts
}

// END TEST STUFF