import Validation from "./Validation";
export default class CrmUploadValidator extends Validation {
    constructor();
    validate(object: any): {
        isValid: boolean;
        errors?: undefined;
    } | {
        isValid: boolean;
        errors: any;
    };
}
