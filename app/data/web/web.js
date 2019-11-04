module.exports = {
    pages: {
        LOGIN: {
            url: 'https://f45challenge.com/login/',
            selectors: {
                COOKIES_SELECTOR: '#inline-popup > div > p.non-eu > button',
                EMAIL_SELECTOR: '#user_login',
                PASSWORD_SELECTOR: '#user_pass',
                LOGIN_BUTTON_SELECTOR: '#wp-submit'
            }
        },

        MEAL_PLANS: {
            url: 'https://f45challenge.com/meals-plans/',
            selectors: {
                MEALS_FOR_WEEK_SELECTOR : 'div.meal > div',
        
                MEAL_SECTION_SELECTOR : '.meal_section',
                MEAL_ROW_SELECTOR : '#meal-row',

                // Section Selectors
                MEAL_DAY_SELECTOR : '.meal-day',
                MEAL_DATE_SELECTOR : '.meal-date',

                //Meals Selectors
                MEAL_DETAILS_SELECTOR : '.meal_details',
                MEAL_CATEGORY_SELECTOR : '.meal_category',
                MEAL_TITLE_SELECTOR : '.meal_title',
                MEAL_LINK_SELECTOR : '.meal_title a',
            },
        }
    }
}