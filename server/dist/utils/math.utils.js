"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomChance = exports.randomElementNotPrevious = exports.randomElement = exports.randomNumber = void 0;
const object_utils_1 = require("./object.utils");
const randomNumber = (lower, upper) => Math.floor(Math.random() * (upper - lower)) + lower;
exports.randomNumber = randomNumber;
const randomElement = (array) => array[(0, exports.randomNumber)(0, array.length)];
exports.randomElement = randomElement;
const randomElementNotPrevious = (array, previous) => {
    let element = (0, exports.randomElement)(array);
    if (typeof previous !== typeof element)
        return element;
    if (typeof previous !== 'object' && element === previous) {
        element = (0, exports.randomElementNotPrevious)(array, previous);
    }
    if (typeof previous === 'object' && (0, object_utils_1.compare)(element, previous)) {
        element = (0, exports.randomElementNotPrevious)(array, previous);
    }
    return element;
};
exports.randomElementNotPrevious = randomElementNotPrevious;
const randomChance = (probability) => Math.random() < probability;
exports.randomChance = randomChance;
