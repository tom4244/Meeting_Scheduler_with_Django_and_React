import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateInput(data) {
	let errors = {};

  if (Validator.isEmpty(data.username)) {
		errors.username= 'Please enter a user name.';
	}
  if (Validator.isEmpty(data.email)) {
		errors.email = 'Please provide an email address.';
	}
  if (!Validator.isEmail(data.email)) {
		errors.email = 'The email address is invalid.';
	}
  if (Validator.isEmpty(data.password)) {
		errors.password= 'Please enter a password.';
	}
  if (Validator.isEmpty(data.confirmpass)) {
		errors.confirmpass= 'Please enter the same password again.';
	}
	if (!Validator.equals(data.password, data.confirmpass)) {
		errors.confirmpass = 'Passwords did not match.';
	}
  if (Validator.isEmpty(data.first_name)) {
		errors.first_name= 'Please enter a firstname.';
	}
  if (Validator.isEmpty(data.last_name)) {
		errors.last_name= 'Please enter a lastname.';
	}
	
	return {
		errors,
		isValid: isEmpty(errors)
	}
}

