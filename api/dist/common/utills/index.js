"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAnnualPrice = void 0;
const calculateAnnualPrice = (price, discount = 0) => +parseFloat(((price - (price * discount / 100)) * 12).toString()).toFixed(2);
exports.calculateAnnualPrice = calculateAnnualPrice;
//# sourceMappingURL=index.js.map