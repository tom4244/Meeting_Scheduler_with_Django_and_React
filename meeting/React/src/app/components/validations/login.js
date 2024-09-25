import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateInput(data) {
	let errors = {};

  if (Validator.isEmpty(data.identifier)) {
  	errors.identifier = 'Please enter your username or email address above.';
  }
  
  if (Validator.isEmpty(data.password)) {
  	errors.password= 'Please enter your password above.';
  }

	return {
		errors,
		isValid: isEmpty(errors)
	};
}

