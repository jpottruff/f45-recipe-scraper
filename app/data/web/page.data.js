module.exports = {
    LOGIN: {
        URL: 'https://f45challenge.com/login/',
        SELECTORS: {
            COOKIES_SELECTOR: '#inline-popup > div > p.non-eu > button',
            EMAIL_SELECTOR: '#user_login',
            PASSWORD_SELECTOR: '#user_pass',
            LOGIN_BUTTON_SELECTOR: '#wp-submit'
        }
    },

    PROFILE: {
        URL: 'https://f45challenge.com/profile/',
        SELECTORS: {
            MALE_BUTTON_SELECTOR: 'ul.list-table li div label[for="_mgm_cf_gender1"]',
            FEMALE_BUTTON_SELECTOR: 'ul.list-table li div label[for="_mgm_cf_gender2"]',
            MAINSTREAM_DIET_SELECTOR: 'div.meal_type label[for="_mgm_cf_meal_1"]',
            VEGETARIAN_DIET_SELECTOR: 'div.meal_type label[for="_mgm_cf_meal_2"]',
            VEGAN_DIET_SELECTOR: 'div.meal_type label[for="_mgm_cf_meal_3"]',
            SUBMIT_BUTTON_SELECTOR: 'p.form_submit input[type="submit"] '
        }
    },

    MEAL_PLANS: {
        URL: 'https://f45challenge.com/meals-plans/',
        SELECTORS: {
            // MENU_SELECTOR: '#menu-weekly-menu',
            MENU_ITEM_SELECTOR: 'ul#menu-weekly-menu > .menu-item',
            MENU_ITEM_LINK_SELECTOR: 'a',

            // All Meals for Week
            MEALS_FOR_WEEK_SELECTOR : 'div.meal > div',
            
            // Section / Meal General Selectors
            MEAL_SECTION_SELECTOR : '.meal_section',
            MEAL_ROW_SELECTOR : '#meal-row',

            // Date Selectors
            MEAL_DAY_SELECTOR : '.meal-day',
            MEAL_DATE_SELECTOR : '.meal-date',

            // Meals Selectors
            MEAL_DETAILS_SELECTOR : '.meal_details',
            MEAL_CATEGORY_SELECTOR : '.meal_category',
            MEAL_TITLE_SELECTOR : '.meal_title',
            MEAL_LINK_SELECTOR : '.meal_title a',
        },
    },

    MEAL_PAGE: {
        SELECTORS: {
            MEAL_TITLE_SELECTOR: 'h1.entry-title',
            MEAL_SERVINGS_SELECTOR: '.servings-per-recipe var',
            MEAL_SERVINGS_SIZE_SELECTOR: '.servings-size var',
            // MEAL_NUTRITION_HEADER_COL1: 'div.nutrients-chart table thead th:nth-child(1)',        // Placeholder; Generally Blank
            MEAL_NUTRITION_HEADER_COL2: 'div.nutrients-chart table thead th:nth-child(2)',           // Quantity per serve
            MEAL_NUTRITION_HEADER_COL3: 'div.nutrients-chart table thead th:nth-child(3)',           // Quantity per 100g
            MEAL_NUTRITION_DATA_COL1: 'div.nutrients-chart table tbody tr td:nth-child(1)',          // Catagory/Type of Data 
            MEAL_NUTRITION_DATA_COL2: 'div.nutrients-chart table tbody tr td:nth-child(2)',          // Data 
            MEAL_NUTRITION_DATA_COL3: 'div.nutrients-chart table tbody tr td:nth-child(3)',          // Data   
            MEAL_INGREDIENT_SELECTOR: 'div.ingredients ul li',
            MEAL_INSTRUCTIONS_SELECTOR: 'div.instructions ol li',

        }
    }
}