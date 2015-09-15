function initializeLandingPageListeners() {
	$('#landingpages-listeners').off();
	$('#landingpages-listeners').on('click', '.saveLandingPageButton', function(e){
		e.preventDefault();
		// Check if the form is valid
    	if (isValidForm('#landingPageBuilderForm')) {
    		document.getElementById('landingPageBuilder').contentWindow.$('.icon-floppy-1:last').trigger("click");
    	}
	});
}