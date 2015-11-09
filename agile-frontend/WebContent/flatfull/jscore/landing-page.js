function initializeLandingPageListeners() {

	$('#landingpages-listeners').off();
	
	$('#landingpages-listeners').on('click', '.saveLandingPageButton', function(e){
		e.preventDefault();
		// Check if the form is valid
    	if (isValidForm('#landingPageBuilderForm')) {
    		document.getElementById('landingPageBuilder').contentWindow.$('.icon-floppy-1:last').trigger("click");
    		App_LandingPageRouter.LandingPageCollectionView.collection.fetch();
    	} else {
    		if(!$("#landingpagename").val().trim()) {
    			$('html, body').animate({scrollTop: $('body').offset().top}, 500);
    		}
    	}
	});

	$('#landingpages-listeners').on('click', '#builderPageOptionsLink', function (e) {
		e.preventDefault();
		$(this).find('i').toggleClass('icon-plus').toggleClass('icon-minus');
		$("#builderPageOptions").slideToggle('fast');
	});

	$('#landingpages-listeners').on('click', '#landingPageSettingBtn', function (e) {
		e.preventDefault();
		if (!isValidForm('#landingPageSettingForm')) {
			return;
		}

		var modelId = $(this).data("pageid");
		var model = App_LandingPageRouter.LandingPageCollectionView.collection.get(modelId);
		model.set("cname",$("#cname").val());
		model.set("requestViaCnameSetup",true);
		
		var landingPageModel = new Backbone.Model();
      	landingPageModel.url = 'core/api/landingpages';
      	landingPageModel.save(model.toJSON(), { success : function(obj){
      		if(obj.get("isDuplicateCName")) {
				$("#cnameMessage").html('CNAME field should be unique.').show();
			} else {
				showNotyPopUp("information", "Saved successfully", "top");
				App_LandingPageRouter.LandingPageCollectionView.collection.get(modelId).set(obj);
			}
      	}});
	});

	$('#landingpages-listeners').on('click', '.lpBuilderMenuItem', function(e){
		e.preventDefault();
		var builderIFrame = document.getElementById('landingPageBuilder').contentWindow;
		var selector = '#'+$(this).data("id")+'AgileId';

		if($(this).hasClass("active")) {
			builderIFrame.$('#elements-container').hide();
			$(this).removeClass("active");
		} else {
			builderIFrame.$('#elements-container').show();
			$('.lpBuilderMenuItem').removeClass("active");
			$(this).addClass("active");
		}
		
		builderIFrame.$(selector).trigger("click");

	});

	$('#landingpages-listeners').on('click', '.lpCodeEditorMenuItem', function(e){
		e.preventDefault();
		document.getElementById('landingPageBuilder').contentWindow.$('#codeEditorAgileId').trigger("click");
	});
	
}