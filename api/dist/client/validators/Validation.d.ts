export default class Validation {
    constraints: any;
    constructor(constraints: any);
    validate(object: any): {
        isValid: boolean;
        errors?: undefined;
    } | {
        isValid: boolean;
        errors: any;
    };
}
