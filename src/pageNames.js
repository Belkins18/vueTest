/**
 * FIXME Нет смысла совмещать path и route name, выносить имя страниц - еще да, т.к. это позволяет юзать его в компонентах
 * но когда открываешь router.js а там вместо path - константы, то этого страдает читаемость
 */
const PageNames = {
    MAIN_LAYOUT: '/',
    SIGN_IN: 'signIn',
    HOME: 'home',
    PRODUCTS: 'products',
    ORDERS: 'orders'
};

export default PageNames;