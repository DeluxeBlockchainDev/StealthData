import Validation from "./Validation";

const schema = {
    "email": {
		type: "string",
		presence: {
            allowEmpty: false,
		},
	},
}

export default class CrmUploadValidator extends Validation {
	constructor(){
		super(schema);
	}
	validate(object){
		return super.validate(object);
	}
}