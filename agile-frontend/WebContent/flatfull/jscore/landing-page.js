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

function initializeLandingPageListeners(pageId) {

	$('#landingpages-listeners').off();
	
	$('#landingpages-listeners').on('click', '.saveLandingPageButton', function(e){
		e.preventDefault();
		// Check if the form is valid
    	if (isValidForm('#landingPageBuilderForm')) {
    		$(".saveLandingPageButton").prop("disabled",true);
    		
			$(".saveLandingPageButtonText").html("Saving...");
			    		
    		document.getElementById('landingPageBuilder').contentWindow.$('.icon-floppy-1:last').trigger("click");
    		if(App_LandingPageRouter.LandingPageCollectionView) {
    			App_LandingPageRouter.LandingPageCollectionView.collection.fetch();
    		}
    		track_with_save_success_model(e.currentTarget);
            //craeting an function for the popup
           
    	} else {
    		if(!$("#landingpagename").val().trim()) {
    			$('html, body').animate({scrollTop: $('body').offset().top}, 500);
    		}
    	}
	});


	
	$('#landingpages-listeners').on('click', '.lpDeviceView', function(e){
		e.preventDefault();
		var triggeringElement = $(this).data("trigger");
    	var landingPageIframe = document.getElementById('landingPageBuilder').contentWindow;
    	landingPageIframe.$(triggeringElement).trigger("click");
    	var deviceClass = $(this).data("deviceclass");
    	landingPageIframe.$("#preview-frame").removeClass("xs-width sm-width md-width full-width");
    	landingPageIframe.$("#preview-frame").addClass(deviceClass);

	});

	$('#landingpages-listeners').on('click', '.lpPreviewView', function(e){
		e.preventDefault();
		var triggeringElement = $(this).data("trigger");
    	document.getElementById('landingPageBuilder').contentWindow.$(triggeringElement).trigger("click");
    	$(this).find('i').toggleClass('fa-eye fa-eye-slash');
    	
    	
    	if( $(this).find('i').hasClass('fa-eye')) {
    		//alert("Inside toggle");
    		document.getElementById('landingPageBuilder').contentWindow.$("#preview-closer").trigger("click");
    	}
    	
    	if ($(this).find("span").text() == 'Close'){
        	$(this).find("span").text('Preview');
    	} else {
        	$(this).find("span").text('Close');
    	} 
    	document.getElementById('landingPageBuilder').contentWindow.$("#preview-closer").addClass("hidden");
	});
	//creating an function for the  save
		
	$('#landingpages-listeners').on('click','.saveLandingPageButtonText',function(e){
		   e.preventDefault();
		   	 
            var id={"id":pageId};
            if (isValidForm('#landingPageBuilderForm') && pageId !== undefined && readData("landingpages-save-popup")!=="true") {
 
		    getTemplate("landingpages-save-popup-modal",id, undefined, function(ui){
		   	// var id={"id":pageId};
           $("#landingPagesSavePopup").html(ui).modal("show");
           $("#popup-msg").fadeOut(8000);
       
       
      });
    }//if() block closing 
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

		$.get("core/api/landingpages/has-rights-to-add-domain?domain="+mainDomain.toLowerCase(), function(data) {
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
		var selectorId = $(this).data("id");
		var selector = '#'+selectorId+'AgileId';

		if($(this).hasClass("active")) {
			builderIFrame.$('#elements-container').hide();
			$(this).removeClass("active");
		} else {
			builderIFrame.$('#elements-container').show();
			$('.lpBuilderMenuItem').removeClass("active");
			$(this).addClass("active");
		}

/*		if(selectorId == "inspector") {
			builderIFrame.$('#elementsPanelAgileId').addClass("hidden");
			builderIFrame.$('#elements-container').css("position","fixed");
			builderIFrame.$('#elements-container').css("left","");
			builderIFrame.$('#elements-container').css("right","0");
		} else {
			builderIFrame.$('#elementsPanelAgileId').removeClass("hidden");
			builderIFrame.$('#elements-container').css("position","absolute");
			builderIFrame.$('#elements-container').css("right","");
			builderIFrame.$('#elements-container').css("left","0");
		}*/
		
		builderIFrame.$(selector).trigger("click");
	});
    //adding the function for the click event
   /* $('#landingpages-listeners').on('click',.saveLandingPageButtonText,function(e){
    	e.preventDefault();
    	onAddPopup();

    });
      //creating an function for the onAddingPopup function
      function onAddPopup(){


      }**/

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

//creating an function for the publishih id whn the popup will appers Date 19/4/16
function onLandingPageSaved(landingPage) {
	landingPage.id;
}
  //for hiding the popup
    function hideLandingPopup(){
   	   $("#landingPagesSavePopup").modal("hide");
         }
  //function for the close button 
    function hideLandingpagePopup(){
   
        if($("#landingpages-save-popup").prop("checked"))
            storeData("landingpages-save-popup", true,10);
        else
            storeData("landingpages-save-popup", false,10);
         }
    function onLandingPageBuilderLoad() {
	$("#landingPageBuilderMenuNav").show();
     }

function landingPageShowAlertMessage(message, type) {
	$("#statusMessageHolder").html('<div class="alert '+type+'" role="alert">'
	+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
	+ message + '</div>');
}

function landingPageSaveCnameSettings(pageId,CNAME) {

    var cnameSettings = {
    "landing_page_id": pageId,
    "cname": CNAME.toLowerCase()
    };

    var requestType = "post";
    var message = "saved";

    var cnameId = $("#cname_id").val();
    if(cnameId) {
        var requestType = "put";
        cnameSettings["id"] = cnameId;
        message = "updated";
    }
      

    $.ajax({
        type: requestType, 
        url: 'core/api/landingpages/custom-domain',       
        data: JSON.stringify(cnameSettings),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (obj) {
	       	if(obj["isDuplicateCName"]) {
				landingPageShowAlertMessage("Custom domain should be unique","alert-danger");
			} else {
				landingPageShowAlertMessage("Custom domain "+message+" successfully","alert-success");
				$("#cname_id").val(obj.id);
				$("#cname").attr("href",CNAME);
				$("#landingPageVerifyBtn").show();
			}
        },
    });

    //creating function for the hidlandingpage
    /*function hideLandingpagePopup(){
   
        if($("#landingpages-save-popup").prop("checked"))
            storeData("landingpages-save-popup", true,10);
        else
            storeData("landingpages-save-popup", false,10);
      }*/
}