jQuery.validator.addMethod("lpdomain", function(value, element) {
	if(value == '')
		return true;
	return /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(value);
	 },"Invalid domain.");
	
jQuery.validator.addMethod("lpsubdomain", function(value, element) {
	if(value == '')
		return true;
	return /^[a-zA-Z0-9-]+$/.test(value);
	},"Invalid sub domain.");

jQuery.validator.addMethod("lpdirectorypath", function(value, element) {
	if(value == '')
		return true;
	return /^(\/\w+)+[a-z0-9-.]+$/.test("/"+value);
	},"Invalid path.");

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

		$('#landingPageSettingForm').validate({
           rules: {
               sub_domain: {
                  required: true,
                  lpsubdomain: true
             	}, 
				domain: {
                  required: true,
                  lpdomain: true
             	},
			 	directory_path: {
				  required: false,
				  lpdirectorypath: true
             	}
           }
       	});
		
		if (!$('#landingPageSettingForm').valid()) {
			return;			
		}
	
		var mainDomain = $("#domain").val();
		var forPageId = $(this).data("pageid");

		$.get("core/api/landingpages/has-rights-to-add-domain?domain="+mainDomain, function(data) {
			if(data.result) {
				var $btn = $("#landingPageSettingBtn").button('loading');
				landingPageSaveCnameSettings(forPageId,"http://"+$("#sub_domain").val()+"."+mainDomain+"/"+$("#directory_path").val());
      			$btn.button('reset');
			} else {
				landingPageShowAlertMessage("You cannot add this ("+mainDomain+") domain. It is used in other agile CRM account.","alert-danger");
			}
		});
	});

	$('#landingpages-listeners').on('keyup', '#sub_domain', function (e) {
		$("#landingPageVerifyBtn").hide();
		if($("#cnameInstructionMessage").is(':hidden')) {
			$("#cnameInstructionMessage").show();
		}
		$("#cnameHostVal").html($(this).val());
	});
	
	$('#landingpages-listeners').on('keyup', '#domain', function (e) {
		$("#landingPageVerifyBtn").hide();
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
		 var cnameEL = document.getElementById("cname");

		 if($("#cname").attr("href") != "") {
		 	$.get("core/api/landingpages/verifycname?domain="+cnameEL.hostname, function(data) {
		 		if(data.result) {
		 			landingPageShowAlertMessage("CNAME is correct. Found " + data.cnames[0],"alert-success");
		 		} else {
		 			if(typeof data.cnames != "undefined" && typeof data.cnames[0] != "undefined") {
		 				landingPageShowAlertMessage("CNAME is incorrect. Found " + data.cnames[0],"alert-danger");
		 			} else {
		 				landingPageShowAlertMessage("CNAME is not found.","alert-danger");
		 			}
		 		}
		 	});
		 }
	});
	
}

function onLandingPageBuilderLoad() {
	$("#landingPageBuilderMenuNav").show();
}

function landingPageShowAlertMessage(message, type) {
	$("#statusMessageHolder").html('<div class="alert '+type+'" role="alert">'
	+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
	+ message + '</div>');
}

function landingPageSaveCnameSettings(modelId,CNAME) {
	var model = App_LandingPageRouter.LandingPageCollectionView.collection.get(modelId);
	model.set("cname",CNAME);
	model.set("requestViaCnameSetup",true);
	
	var landingPageModel = new Backbone.Model();
    landingPageModel.url = 'core/api/landingpages';
    landingPageModel.save(model.toJSON(), { success : function(obj){
	    if(obj.get("isDuplicateCName")) {
			landingPageShowAlertMessage("Custom domain should be unique","alert-danger");
		} else {
			landingPageShowAlertMessage("Custom domain saved successfully","alert-success");
			$("#cname").attr("href",CNAME);
			$("#landingPageVerifyBtn").show();
			App_LandingPageRouter.LandingPageCollectionView.collection.get(modelId).set(obj);
		}
    }});
}