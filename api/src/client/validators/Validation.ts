import * as validate from 'validate.js';

// validate.options = {format: "grouped",cleanAttributes: true};
validate.validators.validateArrayOfString = function(arr, options) {
	const invalidValues = arr.filter((item) => typeof item !== 'string'); 
	return (invalidValues.length) ? 'should be string only' : null;
}

export default class Validation{

    constraints = null;

	constructor(constraints){
		this.constraints = constraints;
    }
    
	validate(object){
		var validation = validate(object, this.constraints);
		return (validation === undefined) ? {isValid:true} : {isValid:false,errors:validation};
	}
}