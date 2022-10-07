"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.include = exports.exclude = void 0;
const exclude = (originalObject, excludedKeys) => {
    return Object.keys(originalObject).reduce((filteredObject, key) => {
        if (!excludedKeys.includes(key)) {
            filteredObject[key] = originalObject[key];
        }
        return filteredObject;
    }, {});
};
exports.exclude = exclude;
const include = (originalObject, includedKeys) => {
    return Object.keys(originalObject).reduce((filteredObject, key) => {
        if (includedKeys.includes(key)) {
            filteredObject[key] = originalObject[key];
        }
        return filteredObject;
    }, {});
};
exports.include = include;
const compare = (object1, object2) => {
    if (typeof object1 !== 'object' || typeof object2 !== 'object')
        return false;
    if (Object.keys(object1).length !== Object.keys(object2).length)
        return false;
    return Object.keys(object1).every(key => {
        if (typeof object1[key] !== 'object')
            return object1[key] === object2[key];
        return (0, exports.compare)(object1[key], object2[key]);
    });
};
exports.compare = compare;
