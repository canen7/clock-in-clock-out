module.exports = {
	isEmail : function(input){
		return input.match(/[-0-9a-zA-Z.+_]+@[-0-9a-zA-Z.+_]+\.[a-zA-Z]{2,4}/);
	},
	isNumber : function(input){ // only numbers
	 	return input.match(/^[0-9]*$/);
	},
	isString : function(input){ //letters and spaces
	  return input.match(/^[a-zA-Z\s'"()\[\]]*$/);
	},
	isWord : function(input){ //letters no spaces
	  return input.match(/^[a-zA-Z]*$/);
	},
	isAlphaNumeric : function(input){ //letters numbers and spaces
	  return input.match(/^[a-zA-Z0-9\s]*$/);
	},
	isPassword : function(input){ //letters, numbers, underscore, 6, 72 characters
	  return input.match(/^[a-zA-Z0-9_]{6,72}$/);
	},
	isBoolean : function(input){ //true or false
	  return input.match(/^(true|false)$/);
	},
	isDateTime : function(input){ //date time utc
	  return input.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/);
	}
}  