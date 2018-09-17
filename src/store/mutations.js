export const USER_LS = "user";

/**
 * FIXME Нет смысла делать по три мутации аля REQUEST/SUCCESS/FAILURE, это оверкилл на данном масштабе, просто юзай одну мутацию
 * для сохранения данных, а за статусом экшна просто следи чере then/catch промиса, нет смысла выносить типы мутаций в отдельный
 * файл т.к. мутации скорее всего ты не будешь из вызывать напрямую в компонентах
 */

export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE';

export const USER_LOGOUT = "LOGOUT";

export const DB_GET_USERKEYS_REQUEST = "DB_GET_USERKEYS_REQUEST";
export const DB_GET_USERKEYS_SUCCESS = "DB_GET_USERKEYS_SUCCESS";
export const DB_GET_USERKEYS_FAILURE = "DB_GET_USERKEYS_FAILURE";

export const DB_GET_PRODUCTLIST_REQUEST = "DB_GET_PRODUCTLIST_REQUEST";
export const DB_GET_PRODUCTLIST_SUCCESS = "DB_GET_PRODUCTLIST_SUCCESS";
export const DB_GET_PRODUCTLIST_FAILURE = "DB_GET_PRODUCTLIST_FAILURE";

export const DB_SET_PRODUCT_REQUEST = "DB_SET_PRODUCT_REQUEST";
export const DB_SET_PRODUCT_SUCCESS = "DB_SET_PRODUCT_SUCCESS";
export const DB_SET_PRODUCT_FAILURE = "DB_SET_PRODUCT_FAILURE";

export const DB_REMOVE_PRODUCT_SUCCESS = "DB_REMOVE_PRODUCT_SUCCESS";

