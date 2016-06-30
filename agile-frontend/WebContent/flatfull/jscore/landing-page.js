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

 /**making an function  for the reusable the code for the save 
 landing page and here one LandingPageId we are defining with empty  
 **/

 var LandingPage_Collection_Events = Base_Collection_View.extend({
    events: {
        'click #landingpage_sort_menu > li': 'LandingpageSort',    
    },
    LandingpageSort : function(e){

    	console.log("landing pages click events firing")
		e.preventDefault();
        var targetEl = $(e.currentTarget);
        var ele = $(targetEl).find("a").attr("data");
        if($(targetEl).find("a").hasClass("sort-field")){
            $("#landingpage_sort_menu").find(".sort-field i").addClass("display-none");
        }else{
            $("#landingpage_sort_menu").find(".order-by i").addClass("display-none");
        }
        $(targetEl).find("i").removeClass("display-none");
        var sort_key = $("#landingpage_sort_menu").find(".order-by i:not(.display-none)").closest(".order-by").attr("data");
        sort_key = sort_key + $("#landingpage_sort_menu").find(".sort-field i:not(.display-none)").closest(".sort-field").attr("data");
        var previous_sortKey = _agile_get_prefs("landingpage_sort_menu");
        if(sort_key == previous_sortKey)
            return;
        _agile_set_prefs("landingpage_sort_menu", sort_key);
        printSortByName($(".sort-field[data='"+sort_key+"']").attr("label_name"), $(targetEl).closest("#landingpages-listeners"));
        App_LandingPageRouter.LandingPageCollectionView.collection.reset()
        Backbone.history.loadUrl(Backbone.history.fragment);
	

    }});
   
		



function saveLandingPageToDataStore(isAutoSaved,pageId) {

	if (isValidForm('#landingPageBuilderForm')) {
		$(".saveLandingPageButton").prop("disabled",true);
		
		$(".saveLandingPageButtonText").html("Saving...");
		    		
		document.getElementById('landingPageBuilder').contentWindow.$('.icon-floppy-1:last').trigger("click");
		if(App_LandingPageRouter.LandingPageCollectionView) {
			App_LandingPageRouter.LandingPageCollectionView.collection.fetch();
		}
        /*when autosaved value is true that time it will be work
        * for the */
		if(!isAutoSaved) {	
			if (typeof pageId !== "undefined" && readData("landingpages-save-popup")!=="true" ) {
				getTemplate("landingpages-save-popup-modal",{"id":pageId}, undefined, function(ui){
					$("#landingPagesSavePopup").html(ui).modal("show");
					$("#popup-msg").fadeOut(8000);
				});//function closing
			}//if closed
	 	}//outer if closed
      

 } else {
		if(!$("#landingpagename").val().trim()) {
			$('html, body').animate({scrollTop: $('body').offset().top}, 500);
		}
	}
}

function initializeLandingPageListeners(pageId) {

	$('#landingpages-listeners').off();
	
	$('#landingpages-listeners').on('click', '.saveLandingPageButton', function(e){
		e.preventDefault();
		saveLandingPageToDataStore(false,pageId);
		track_with_save_success_model(e.currentTarget);
	});
   $('#landingpages-listeners').on('click', '.lpDeviceView', function(e){
		e.preventDefault();
		var triggeringElement = $(this).data("trigger");
    	var landingPageIframe = document.getElementById('landingPageBuilder').contentWindow;
    	if($('.lpPreviewView span').text()!=="Close"){
    		landingPageIframe.$(triggeringElement).trigger("click");
    	}    	
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
    
      
	  /*$('#landingpages-listeners').on('click','.saveLandingPageButton',function(e){
		   e.preventDefault();
		   // var flag=false;	    
            var id={"id":pageId};
            if (flag===false && isValidForm('#landingPageBuilderForm') && pageId !== undefined && readData("landingpages-save-popup")!=="true") {
 
		    getTemplate("landingpages-save-popup-modal",id, undefined, function(ui){
		   	// var id={"id":pageId};
             $("#landingPagesSavePopup").html(ui).modal("show");
             $("#popup-msg").fadeOut(8000);
             flag=true;
       
       
      });
    }
    
   });*/
	 
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

}

function formEmbedIFrameLoaded(iFrameEl) {
	if(iFrameEl) {
	    // iFrameEl.height = "";
	    // iFrameEl.height = iFrameEl.contentWindow.document.body.scrollHeight + "px";

	    var formParentEl = iFrameEl.parentElement;
	    if(formParentEl.className.indexOf("ui-draggable-dragging") == -1) {
		    var formIframeDoc = iFrameEl.contentWindow.document;

		    var afh = formIframeDoc.getElementById("agileFormHolder");
		    afh.removeChild(formIframeDoc.getElementsByTagName("style")[0]);
		    afh.removeChild(formIframeDoc.getElementsByTagName("script")[0]);		    

		    var formCode = afh.innerHTML;
		    formCode = formCode.replace('<div class="agile-custom-clear"></div>','');
		    formParentEl.innerHTML = "";
		    formParentEl.innerHTML = formCode;
		}
	}
}