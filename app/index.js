// Import Puppeteer
const puppeteer = require('puppeteer');

// For Writing Data
const fs = require('fs');

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

    const finishedData = await getRecipes(page, weeklyData);
    console.log('********* FINISHED *********');
    console.log(finishedData[1].dayData[1].meals[1]);

    await browser.close();

    //Write Data
    fs.writeFile(
        './json/f45-recipes.json',
        JSON.stringify(finishedData, null, 2),            // addtional params for nice formatting
        (err) => err ? console.error('Data not written', err) : console.log('********* FINISHED *********')
    );
    
    return;
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



async function getRecipes(page, weeklyData) {

    for (let week of weeklyData) {

        //Iterate through the days of that week
        for (let day of week.dayData) {
            console.log(`--------${day.dayInfo.date}--------`);

            //Iterate through that days meals
            for (let meal of day.meals) {
                console.log(`GETTING ${meal.category}...`)

                //Go to Page and get meal
                await page.goto(meal.mealURL);
                meal.recipe = await getMealData(page, PAGE_DATA.MEAL_PAGE.SELECTORS);
                meal.recipe.isLeftover = await(checkLeftover(meal.mealURL));
                console.log(meal.recipe)
            }
        }
    }

    console.log(weeklyData);
    console.log(weeklyData[1].dayData);
    console.log(weeklyData[1].dayData[1].meals[1]);
    console.log(' --------------------------------------------------')

    return weeklyData;

}






async function getMealData(page, SELECTORS) {
    console.log('GETTING MEAL DATA...');

    let mealData = await page.evaluate( (SELECTORS) => {
        
        // Grab the current Weeks Meals from the Page
        const mealTitle = document.querySelector(SELECTORS.MEAL_TITLE_SELECTOR).innerHTML;
        
        const servings = document.querySelector(SELECTORS.MEAL_SERVINGS_SELECTOR);
        const size = document.querySelector(SELECTORS.MEAL_SERVINGS_SIZE_SELECTOR);
        const avgPerServeHeader = document.querySelector(SELECTORS.MEAL_NUTRITION_HEADER_COL2);
        const avgPer100gHeader = document.querySelector(SELECTORS.MEAL_NUTRITION_HEADER_COL3);
        const dataDescriptions = document.querySelectorAll(SELECTORS.MEAL_NUTRITION_DATA_COL1);
        const perServeData = document.querySelectorAll(SELECTORS.MEAL_NUTRITION_DATA_COL2);
        const per100gData = document.querySelectorAll(SELECTORS.MEAL_NUTRITION_DATA_COL3);
        const ingredientListItems = document.querySelectorAll(SELECTORS.MEAL_INGREDIENT_SELECTOR);
        const methodSteps = document.querySelectorAll(SELECTORS.MEAL_INSTRUCTIONS_SELECTOR);
        
        // Checking for NULL to avoid ERROR
        let servingValue;
        let sizeValue;
        (servings === null) ? servingValue = 'notFound' : servingValue = servings.innerText.trim();
        (size === null) ? sizeValue = 'notFound' : sizeValue = size.innerText.trim();
        // TODO - may need to check for empty nutrition values

        // WIP
        const nutritionFactsAOA = []
        // Create Nutrition Header Row and push it onto the AOA
        let perServeHeader;
        let per100gHeader;
        (avgPerServeHeader === null) ? perServeHeader = 'notFound' : perServeHeader = avgPerServeHeader.innerText.trim();
        (avgPerServeHeader === null) ? per100gHeader = 'notFound' : per100gHeader = avgPer100gHeader.innerText.trim();
        const headerRow = ['', perServeHeader, per100gHeader];
        nutritionFactsAOA.push(headerRow);
       
        // Push the Data Rows onto the AOA
        if (dataDescriptions.length > 1) {
            dataDescriptions.forEach((description, i) => {
                let dataRow = [description.innerText, perServeData[i].innerText, per100gData[i].innerText];
                nutritionFactsAOA.push(dataRow);
            });
        }
        

        // Put the ingredients into an Array
        const mealIngredients = [];
        if (ingredientListItems.length > 1) {
            for (const item of ingredientListItems){
                mealIngredients.push(item.innerText)
            }
        } else {
            mealIngredients.push(ingredientListItems.innerText);
        }


        // Put the steps into an array
        const steps = [];
        if (methodSteps.length > 1){
            for (const step of methodSteps){
                steps.push(step.innerText)
            }
        } else {
            steps.push(methodSteps.innerText);
        }

        
        // Put together the recipe object
        const recipe = {
            title: mealTitle,
            servingsPerRecipe: servingValue,
            servingsSize: sizeValue,
            nutritionalFacts: nutritionFactsAOA,
            ingredients: mealIngredients,
            instructions: steps,
        }

        return recipe;
    }, SELECTORS);

    return mealData;
}

async function checkLeftover(url) {
    let toCheck = url.slice(-9);
    let isLeftover;
    (toCheck === 'leftover/') ? isLeftover = true : isLeftover = false;

    return new Promise(resolve => resolve(isLeftover));
}



// TEST STUFF

// async function testScrape() {
//     //Launching non-headless for visual debugging
//     const browser = await puppeteer.launch({
//         headless: false
//     });

//     // BROWSE TO TEST PAGE
//     const page = await browser.newPage();
//     // await page.goto('C:/Users/Jeff/Desktop/scraper/f45-recipe-scraper/test-data/sample-recipe-1.html');
//     await page.goto('C:/Users/Jeff/Desktop/scraper/f45-recipe-scraper/test-data/sample-recipe-2.html');
//     const url = '/test-data/sample-recipe-2-leftoveRr'
//     let isLeftover = await checkLeftover(url);
//     console.log(isLeftover);

//     const mealData = await getMealData(page, PAGE_DATA.MEAL_PAGE.SELECTORS);
//     console.log('-----------');
//     console.log(mealData);
// }
// END TEST STUFF



/**** MAIN PROGRAM FLOW ****/
// testScrape();
run();







