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
                
            }
        }
    }
}