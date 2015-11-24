function initializeLandingPageListeners() {

	$('#landingpages-listeners').off();
	
	$('#landingpages-listeners').on('click', '.saveLandingPageButton', function(e){
		e.preventDefault();
		// Check if the form is valid
    	if (isValidForm('#landingPageBuilderForm')) {
    		$(".saveLandingPageButton").prop("disabled",true);
			$(".saveLandingPageButton").html("Saving...");
    		document.getElementById('landingPageBuilder').contentWindow.$('.icon-floppy-1:last').trigger("click");
    		if(App_LandingPageRouter.LandingPageCollectionView) {
    			App_LandingPageRouter.LandingPageCollectionView.collection.fetch();
    		}
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
		$("#statusMessageHolder").removeClass("text-success text-danger");
		if (!isValidForm('#landingPageSettingForm')) {
			return;
		}
		var $btn = $(this).button('loading');
 
		var CNAME = "http://"+$("#sub_domain").val()+"."+$("#domain").val()+"/"+$("#directory_path").val();

		var modelId = $(this).data("pageid");
		var model = App_LandingPageRouter.LandingPageCollectionView.collection.get(modelId);
		model.set("cname",CNAME);
		model.set("requestViaCnameSetup",true);
		
		var landingPageModel = new Backbone.Model();
      	landingPageModel.url = 'core/api/landingpages';
      	landingPageModel.save(model.toJSON(), { success : function(obj){
      		if(obj.get("isDuplicateCName")) {
      			$("#statusMessageHolder").addClass("text-danger");
				$("#statusMessageHolder").html("Custom domain should be unique").show().fadeOut(3000);
			} else {
				$("#statusMessageHolder").addClass("text-success");
				$("#statusMessageHolder").html("Custom domain saved successfully").show().fadeOut(3000);
				$("#cname").attr("href",CNAME);
				$("#landingPageVerifyBtn").show();
				App_LandingPageRouter.LandingPageCollectionView.collection.get(modelId).set(obj);
			}
      	}});
      	$btn.button('reset');
	});

	$('#landingpages-listeners').on('keyup', '#sub_domain', function (e) {
		if($("#cnameInstructionMessage").is(':hidden')) {
			$("#cnameInstructionMessage").show();
		}
		$("#cnameHostVal").html($(this).val());
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

	$('#landingpages-listeners').on('click', '#landingPageVerifyBtn', function (e) {
		 e.preventDefault();
		 $("#statusMessageHolder").removeClass("text-success text-danger");
		 var cnameEL = document.getElementById("cname");

		 if($("#cname").attr("href") != "") {
		 	$.get("core/api/landingpages/verifycname?domain="+cnameEL.hostname, function(data) {
		 		if(data.result) {
		 			$("#statusMessageHolder").addClass("text-success");
		 			$("#statusMessageHolder").html("CNAME is correct. Found " + data.cnames[0]).show();
		 		} else {
		 			$("#statusMessageHolder").addClass("text-danger");
		 			if(typeof data.cnames[0] != "undefined") {
		 				$("#statusMessageHolder").html("CNAME is incorrect. Found " + data.cnames[0]).show();
		 			} else {
		 				$("#statusMessageHolder").html("CNAME is not found.").show();
		 			}
		 		}
		 	});
		 }
	});
	
}

function onLandingPageBuilderLoad() {
	$("#landingPageBuilderMenuNav").show();
}