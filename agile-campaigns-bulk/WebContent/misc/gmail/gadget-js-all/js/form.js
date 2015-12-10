// Is Valid Form
function agile_is_valid_form(form) {
	$(form).validate();
	return $(form).valid();
}

// Serialize Form
function agile_serialize_form(form) {
	
	if (!agile_is_valid_form(form)) {
		return;
	}
	
	return form.serializeArray();
}