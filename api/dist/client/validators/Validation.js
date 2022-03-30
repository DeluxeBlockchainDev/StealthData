"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate = require("validate.js");
validate.validators.validateArrayOfString = function (arr, options) {
    const invalidValues = arr.filter((item) => typeof item !== 'string');
    return (invalidValues.length) ? 'should be string only' : null;
};
class Validation {
    constructor(constraints) {
        this.constraints = null;
        this.constraints = constraints;
    }
    validate(object) {
        var validation = validate(object, this.constraints);
        return (validation === undefined) ? { isValid: true } : { isValid: false, errors: validation };
    }
}
exports.default = Validation;
//# sourceMappingURL=Validation.js.map