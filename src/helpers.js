/**
 * FIXME Object.keys(myObj).length; заменяет всю эту конструкцию
 */
export const Object_size = function(obj) {
    // FIXME Обращай внимание на ошибки линтера
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};