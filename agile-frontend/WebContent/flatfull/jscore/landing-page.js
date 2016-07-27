jQuery.validator.addMethod("lpdomain", function(value, element) {
	if(value == '')
		return true;
	return /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(value);
	 },"{{agile_lng_translate 'landingpages' 'invalid-domain'}}");
	
jQuery.validator.addMethod("lpsubdomain", function(value, element) {
	if(value == '')
		return true;
	return /^[a-zA-Z0-9-]+$/.test(value);
	},"{{agile_lng_translate 'landingpages' 'invalid-sub-domain'}}");

jQuery.validator.addMethod("lpdirectorypath", function(value, element) {
	if(value == '')
		return true;
	return /^(\/\w+)+[a-z0-9-.]+$/.test("/"+value);
	},"{{agile_lng_translate 'landingpages' 'invalid-path'}}");


var LandingPages_Top_Header_Modal_Events = Base_Model_View.extend
({
	events: {
        'click #sort_menu > li': 'LandingpageSort',    
    },
    LandingpageSort : function(e){
    	
		e.preventDefault();
        var targetEl = $(e.currentTarget);
        var sortkey = "", 
        $sort_menu = $("#sort_menu");
        if($(targetEl).find("a").hasClass("sort-field"))
        {
            $sort_menu.find("li").not(targetEl).find("a.sort-field i").addClass("display-none");
            $(targetEl).find("a.sort-field i").removeClass("display-none");
        } else {
            $sort_menu.find("li").not(targetEl).find("a.order-by i").addClass("display-none");
            $(targetEl).find("a.order-by i").removeClass("display-none");
        }
         sortkey = $sort_menu.find(".order-by i:not(.display-none)").closest(".order-by").attr("data");
        sortkey += $sort_menu.find(".sort-field i:not(.display-none)").closest(".sort-field").attr("data");
        _agile_set_prefs("landingpage_sort_menu", sortkey);
        this.model.set({"sortKey" : sortkey});
        
}
});

var landingpage_collection_events = Base_Collection_View.extend({
	events : {},
})
 /**making an function  for the reusable the code for the save 
 landing page and here one LandingPageId we are defining with empty  
 **/
function saveLandingPageToDataStore(isAutoSaved,pageId) {

	if (isValidForm('#landingPageBuilderForm')) {
		$(".saveLandingPageButton").prop("disabled",true);
		
		$(".saveLandingPageButtonText").html("{{agile_lng_translate 'others' 'saving'}}");
		    		
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
				landingPageShowAlertMessage("{{agile_lng_translate 'landingpages' 'not-add'}} ("+mainDomain+") {{agile_lng_translate 'prefs-settings' 'domain'}}. {{agile_lng_translate 'landingpages' 'duplicate-error'}}","alert-danger");
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
		 				landingPageShowAlertMessage("{{agile_lng_translate 'landingpages' 'cname-error'}} {{agile_lng_translate 'landingpages' 'cname-exists'}} " + data.cnames[0],"alert-danger");
		 			} else {
		 				landingPageShowAlertMessage("{{agile_lng_translate 'landingpages' 'cname-not-found'}}","alert-danger");
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
    var message = "{{agile_lng_translate 'others' 'saved'}}";

    var cnameId = $("#cname_id").val();
    if(cnameId) {
        var requestType = "put";
        cnameSettings["id"] = cnameId;
        message = "{{agile_lng_translate 'others' 'updated'}}";
    }
      

    $.ajax({
        type: requestType, 
        url: 'core/api/landingpages/custom-domain',       
        data: JSON.stringify(cnameSettings),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (obj) {
	       	if(obj["isDuplicateCName"]) {
				landingPageShowAlertMessage("{{agile_lng_translate 'landingpages' 'custom-domain-unique'}}","alert-danger");
			} else {
				landingPageShowAlertMessage("{{agile_lng_translate 'landingpages' 'custom-domain'}} "+message+" {{agile_lng_translate 'others' 'successfully'}}","alert-success");
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

function landingpagesCollection(sortKey)
{
	this.LandingPageCollectionView = new landingpage_collection_events({ 
            url : 'core/api/landingpages',
            sort_collection : false,
            templateKey : "landingpages",
            cursor : true,
            page_size : 20,  
            individual_tag_name : 'tr',
            global_sort_key : sortKey,
            postRenderCallback : function(el)
            {
                includeTimeAgo(el);
               // updateSortKeyTemplate(sortKey, el);
                $("#landingpages-list").html(collectiondata);
                $(".active").removeClass("active");
                $("#landing-pages-menu").addClass("active");
                
            },
            appendItemCallback : function(el)
            { 
                // To show time ago for models appended by infinite scroll
                includeTimeAgo(el);
            }});
        this.LandingPageCollectionView.collection.fetch();
        var collectiondata = this.LandingPageCollectionView.render().el;
}