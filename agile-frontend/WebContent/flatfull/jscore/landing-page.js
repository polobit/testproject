function initializeLandingPageListeners() {
	$('#landingpages-listeners').off();
	$('#landingpages-listeners').on('click', '.saveLandingPageButton', function(e){
		e.preventDefault();
		// Check if the form is valid
    	if (isValidForm('#landingPageBuilderForm')) {
    		document.getElementById('landingPageBuilder').contentWindow.$('.icon-floppy-1:last').trigger("click");
    	}
	});

	$('#landingpages-listeners').on('click', '#builder-page-option', function (e) {
		e.preventDefault();
		if($(this).hasClass('collapsed'))
		{
			$('#builder-page-option').html('<span><i class="icon-plus"></i></span> Page Options');
			return;
		}		
		$('#builder-page-option').html('<span><i class="icon-minus"></i></span> Page Options');		
	});

}