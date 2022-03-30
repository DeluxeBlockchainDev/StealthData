"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validation_1 = require("./Validation");
const schema = {
    "email": {
        type: "string",
        presence: {
            allowEmpty: false,
        },
    },
};
class CrmUploadValidator extends Validation_1.default {
    constructor() {
        super(schema);
    }
    validate(object) {
        return super.validate(object);
    }
}
exports.default = CrmUploadValidator;
//# sourceMappingURL=CrmValidator.js.map