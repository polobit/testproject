

$('#app-aside-folded').on('click', function(e) {
	
	if(CURRENT_USER_PREFS.theme == "15") {
		return;
	}

	e.preventDefault();
		
	/*$('.app-aside-folded-inactive .hidden-folded ,.app-aside-folded .navi > ul > li > a span').css('display','none');
	
	if ($('#wrap').hasClass("app-aside-folded") ) {
	
		setTimeout(function(){
	$(".app-aside-folded-inactive .hidden-folded,.app-aside-folded .navi > ul > li > a span").fadeIn();
	
		},600);
    
	}*/
	$('#wrap').toggleClass('app-aside-folded');
    if( $('#wrap').hasClass('app-aside-folded')) {
		console.log("folded");
		$("#app-aside-folded i.fa").removeClass("fa-dedent").addClass("fa-indent");
		$("#searchbycharacter").removeClass("searchbycharacterexpanded").addClass("searchbycharacterdiv");		
		// $(".app-aside-folded:not(.app-aside-dock) .navi > ul > li#documentsmenu > a span").text("Docs");
	}
	else {

		$("#app-aside-folded i.fa").removeClass("fa-indent").addClass("fa-dedent");
		$("#searchbycharacter").removeClass("searchbycharacterdiv").addClass("searchbycharacterexpanded");

		// $(".navi > ul > li#documentsmenu > a span").text("Documents");
	}
	
	//contactInnerTabsInvoke();

	$('.highcharts-container').each(function(chart) {
		$(this).parent().highcharts().reflow();
	});

	
	});







function showTrailAlertMessage(){
	if($("#trial_alert_info .trial_message").text().indexOf("today") != -1)
		$("#trial_alert_info").css("width", "300px");
	$("#trial_alert_info").show();
	
}


	
$(document).ready(function(){

// Add agile-menu active class to li element
try{
	/* $("#rolecontainer").text(CURRENT_DOMAIN_USER.role); */
	/*$("aside a[href=" + window.location.hash + "]").closest("li").addClass("agile-menuactive");	*/
}catch(e){}

//helpContentPopover();
$('body').on('click','#speechDectation',function(e){
	e.preventDefault();
    startDictation(this);
    setTimeout(function()
	{
		$("#speechDectation").removeClass("agile-feature-item-blink");
	}, 6000);

});
$("#searchForm").on("submit",function(){

	return false;
})

$(".trial_strip_close").click(function(e){
	$(this).closest("#trial_alert_info").hide();
	_agile_set_prefs("free_trial_time", parseInt(new Date().getTime()/1000));
});

$("#prefsDropdownModal").on('click','#clickdesk_live_chat',function(e){
		e.preventDefault();
		$(this).closest(".modal").modal("hide");
		$(this).closest(".dropdown").removeClass("open");
		CLICKDESK_LIVECHAT.show();
});

$("#prefsDropdownModal").on('click','#showUserVoice',function(e){
		if(typeof UserVoice != undefined){
			if(!agile_is_mobile_browser())
				load_user_voice('lib/user-voice.js', function(){
				$(".uservoice-window")[0].click();
			});
		}		
		/*setTimeout(function(){
		$(".uservoice-window")[0].click();
		},100);*/

});

$("#help-options").click(function(e){
	$("#prefsDropdownModal").html(getTemplate('prefs-dropdown-options', {})).modal('show');
	agile_toggle_chat_option_on_status();

});
$("#prefsDropdownModal").on('click','#affiliate_link',function(e){		
		$("#prefsDropdownModal").modal("hide");
});


if(!agile_is_mobile_browser() && USER_BILLING_PREFS.freeTrialStatus && USER_BILLING_PREFS.freeTrialStatus == "TRIALING" && USER_BILLING_PREFS.freeTrialEnd > parseInt(new Date().getTime()/1000))
{
	var oldTime =  _agile_get_prefs("free_trial_time");
	var time = parseInt(new Date().getTime()/1000);

	if(!oldTime)
		showTrailAlertMessage();
	else if(time-oldTime > 86400)
		showTrailAlertMessage();

}

//addDescriptionInfo();

$(".free_plan_strip_close").click(function(e){
	$(this).closest(".free_plan_alert").hide().removeAttr("id");
});
$(".contact_plan_strip_close").click(function(e){
	$(this).closest(".contacts_plan_alert").hide().removeAttr("id");
});
	
 $("#addDescriptionLink").click(function(e){
 e.preventDefault();
 $(this).hide();
   $("#addDescriptionInfo").toggle();
  });
$("#newDealModal").on('click','#addDescriptionLink',function(e){
 e.preventDefault();
 $(this).hide();
   $("#addDescriptionInfo").toggle();
   });

 $("#activityTaskModal").on("click", "#taskDescriptionLink", function(e){
 e.preventDefault();
 $(this).hide();
   $("#taskDescriptionInfo").toggle();
   });

$("#activityModal").on("click", "#eventDescriptionLink", function(e){
 e.preventDefault();
 $(this).hide();
   $(".eventDescriptionInfo").toggle();
   });
//addDescriptionInfo();
	
	

   $("#contact-results li").click(function(){
   $("#mobile-menu-settings").trigger('click');
   });



   
 




 	 $('.aside-wrap').off('ul li');
	 if(agile_is_mobile_browser()){

	 	$('body').on('click','.add-modal-mobile',function(){
	 		
		if($('#aside').hasClass('off-screen')) {
			$("#mobile-menu").trigger('click');
		}
		
		});


	// search bar in mobile 
		$('#search-menu-mobile').on('click touchstart',function(){
		$('.search-mobile').removeClass('hide');
		$('.add-modal-mobile , #search-menu-mobile').removeClass('visible-xs');
		$('.navbar-brand').addClass('hide');
		}); 	


		$(".aside-wrap").on("touchstart", "ul li", function() {
        	$('.aside-wrap ul li').removeClass('active');
        	$(this).addClass('active');
    	});
    	$(".aside-wrap").on("touchleave touchend", "ul li", function() {
        	setTimeout(function(){
		 		$('.aside-wrap ul li').removeClass('active');
		 	},500);
    	});
 		
		}


	if(( $(window).width() ) < 768 ) {


	// if the tabs are in wide columns on larger viewports
    $('.content-tabs').tabCollapse();

    // initialize tab function
    $('.nav-tabs a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $('#navbar').removeClass('bg-white-only');

	/*$('body').on('click','#mobile-dropdown-click-sort',function(){
			$("#contact-sort-views").css("display","block");
   	return false;
	});

	 $('body').on('click','#view-list .dropdown-toggle' , function(){
         $("#contact-sort-views").css("display","none");
    });
   	
   	$('body').on('click','#contact-sort-views',function(){
        $(this).css('display','none');
    });	*/

	/*$('#recent-menu').off('li');
	$('#recent-menu').on('click', 'li', function(e){
		e.preventDefault();
		$('#mobile-menu-settings').trigger('click');
	});
*/

	
	$('body').on('mousedown','.navi-wrap li a , #navbar li a',function(e){
		e.preventDefault();
		$(this).css('opacity','0.5');
	});

	$('body').on('mouseup','.navi-wrap li a , #navbar li a',function(e){
		e.preventDefault();
		$(this).css('opacity','1');
	});

	$('body').on('touchstart','.magicMenu .i-checks',function(e){
		e.preventDefault();
		$(this).find('input[type="radio"]').trigger('click');
	});

   $('body').on('touchstart','.i-checks',function(e){
   	e.preventDefault();
   $(this).find('input[type="checkbox"]').trigger('click');
   });

   $('body').on('click','#mobile-menu-settings',function(){
    if($('#navbar').hasClass('show')){
    	$('body').css('overflow-y','hidden');
    }
    else {
    	$('body').css('overflow-y','auto');
    }
	});

    $('.agile-menu .fa-history').removeClass('text-md  text-muted');
   
   	$('body').on('click','#navbar li a:not(".dropdown-toggle")',function(){
   		$('body').css('overflow-y','auto');
   	});
   


	$('body').on('click','.navbar-brand',function(){
     $("#navbar").removeClass('show');
     $("#aside").removeClass('off-screen');
     $('body').css('overflow-y','auto');
	});	
	
	$(".navi-wrap").on("click", "li a", function() {
        $("#mobile-menu").delay(2000).trigger("click");
    });

   $("#mobile-menu-settings").on("click",function(){
   if( $("#aside").hasClass("off-screen") ) {
   $("#aside").removeClass("off-screen");
   }
   });

  

   $("#searchText").keyup(function(e){
    if(e.which == 13) {
   	//$("#mobile-menu-settings").trigger('click');
   }
   });

   $('#searchForm').hover(
	function () {
		  $("#advanced-search-filter").removeClass("hide");
		}, 
		function () {
		  $("#advanced-search-filter").addClass("hide");
		}
   );

  
   $("#mobile-menu").on("click",function(){
   if( $("#navbar").hasClass("show")) {
   	$("#navbar").removeClass("show");
   	$('body').css('overflow-y','auto');
   }
   });

   $("#navbar li a:not(.dropdown-menu)").on("click" , function(){
   if($(this).hasClass("dropdown-toggle")) {
	
    }
   else {
   	$("#navbar").removeClass("show");
   }
   });

   $("#documentsmenu span").text("Documents");
   
   }
   
   $("body").on("click",".contactslimitUpgrade",function(e){
		$(".contactlimit-msg-cross").trigger("click");
	});
   $("body").on("click",".contactlimit-msg-cross",function(e){
		createCookie("contactslimit","true",1);
	});

	$(".person").on("click", function(e){
		e.preventDefault();
		addContactBasedOnCustomfields();
		
	});

	$("#lead").on("click", function(e){
		e.preventDefault();
		addLeadBasedOnCustomfields();
		
	});

	$("#referrals_link").on("click", function(e){
		e.preventDefault();
		Agile_GA_Event_Tracker.track_event("Refer");
		load_facebook_lib_for_referrals();
		$.ajax({
			url : 'core/api/refer',
			type : 'GET',
			dataType : 'json',
			success : function(data){
				REFER_DATA = data;
				getTemplate("refer-modal", {}, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#referModal').html($(template_ui));
					getTemplate("refer-modal-body", data, undefined, function(template_ui1){
						if(!template_ui1)
							  return;
						$('#referModal').find(".modal-body").html($(template_ui1));
						$('#referModal').modal("show");
					}, null);
				}, null);
			}
		});
		
	});
	$("body").on("click" , ".betaAccess", function(e){
	  	//$(".BetaAccessForm").removeClass('hide');
	  	$(".model-etensions").addClass("hide");
	  		console.log("inside the sending request for the betarequest");
	 
	  	var json = {};
		json.from=CURRENT_DOMAIN_USER.email;
		json.to = "narmadha@agilecrm.com";
		json.subject = "Request for getting the Beta Access";	
		json.body = "Name: " +CURRENT_DOMAIN_USER.name+"<br>"+"Useremail: "+CURRENT_DOMAIN_USER.email+"<br>Domain: "+CURRENT_DOMAIN_USER.domain;
		sendEmail(json);
		$("#betasuccess").removeClass("hide");
	  });


    $('body').on('click', function (e) {
	    $('.popover').each(function () {
	        //the 'is' for buttons that trigger popups
	        //the 'has' for icons within a button that triggers a popup
	        if ((!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0 && !e.target.closest(".need_help")) || e.target.hasAttribute("rep")) {
	            $(this).popover('hide');
	        }
	    });
	});


	$(".show-search-dropdown").on("click",function(e){
		$("#searchText").val("");
		$("#searchForm").find(".dashboard-search-scroll-bar").css({"display":"none"});
		$(this).parent().toggleClass("open");
		$("#searchText").focus();
		$('body').on("click",clickOutsideSearchDropdownEventHandler);
	});

	$(".search-close").on("click",function(e){
		$('.searchicon-dropdown').removeClass('open');
	});

	$('#searchText').on('keydown', function(e){

		if(e.keyCode == 13){
			var query = $("#searchText").val();
			if ($.trim(query) == ''){
				$(".dashboard-search-scroll-bar").hide();
				return;
			}
			if(!isQueryTextSearchValid(query))
			{	
				setTimeout(function(){
					var txt = '{{agile_lng_translate "specialchar-typeahead" "error-input"}}' ;
					$(".dashboard-search-scroll-bar").empty();
					$(".dashboard-search-scroll-bar").html('<div class="m-t-sm"><p align="center"   class="custom-color">' + txt + '<p></div>');
					$("#searchText").val(query);
					$(".dashboard-search-scroll-bar").show();
				}, 200);
				return false;
			}			
			$("#searchForm").find(".dashboard-search-scroll-bar").css({"display":"none"});
			$('.searchicon-dropdown').removeClass('open');
			//$("#search-results").trigger("click");
			showSearchResults();
			$("#navbar").removeClass("show");
			e.preventDefault();
			//return;
		}

		e.stopPropagation()
	});

	function clickOutsideSearchDropdownEventHandler(e){
	    if (!e.target.closest(".agile-search") 
	        && $('.searchicon-dropdown').has(e.target).length === 0 
	        && $('.open').has(e.target).length === 0 || e.which == 13
	    ) {
	    	closeSearchDropdown();
	        
	    }
	}
	 


	function closeSearchDropdown(){
			$('.searchicon-dropdown').removeClass('open');
	    	$('body').unbind("click",clickOutsideSearchDropdownEventHandler);
	}

	$( '#advanced-search-fields-group a' ).on( 'click', function( event ) {
		if(!isTargetAnInputField(event)){
	   		event.preventDefault();
	   	}

	   event.stopImmediatePropagation();

   	   var $target = $( event.currentTarget ),
       $inp = $target.find( 'input' );
       if(!$inp.closest("li").hasClass("disabled") && !isTargetAnInputField(event)){
       		$inp.prop( 'checked', !$inp.is(":checked") );
       }
       	
       var $allitems = $("#advanced-search-fields-group a input"),
       $inputs = $allitems.not($inp),
       $items = $inputs.closest("li");

       if(!$inp.prop("value")){	 
       	 $inputs.prop("checked", $inp.is(":checked"));
       }
       else{
      	var allChecked = ($allitems.not("[value='']").not(":checked").length  == 0);
		$inputs.filter("[value='']").prop( 'checked', allChecked);
       }

	   //$( event.target ).blur();
	   var checkedlist = $allitems.not("[value='']");
	   var list = $allitems.not("[value='']").filter(':checked').map(function(){return $(this).prop("value");}).get();	
	   // console.log(list);
	   _agile_set_prefs('agile_search_filter_'+CURRENT_DOMAIN_USER.id,JSON.stringify(list));     	   
	   // return false;
	});

	var search_filters = _agile_get_prefs('agile_search_filter_'+CURRENT_DOMAIN_USER.id),
	$inputs = $("#advanced-search-fields-group a input");
	if(!search_filters)
		search_filters = [];
	if(typeof(search_filters)== "string")
		search_filters = JSON.parse(search_filters);
	$.each(search_filters, function(index, data){
           $inputs.filter("[value='" + data + "']").prop("checked", true);
	});

	if(search_filters.length == 0 || $inputs.not(":checked").length == 1){
		var $allitems = $("#advanced-search-fields-group a input");
		/*$.each($allitems, function(index, data){
           $inputs.filter("[value='" + data + "']").prop("checked", true);
		});*/

		$inputs.filter("[value='']").closest("a").click();
	}
	function helpContentPopover()
	{
		if( _agile_get_prefs(CURRENT_DOMAIN_USER.id+"menupopover_close"))
			$("#helpcontent_popover").addClass("hide");
		else 
			$("#helpcontent_popover").removeClass("hide");
	}
	
	function closeHelpPopover() {
		var arr = _agile_set_prefs(CURRENT_DOMAIN_USER.id+"menupopover_close");
		$("#helpcontent_popover").addClass("hide");
	
	}

	/*saving the click event when clicking on the heading on the drop-down navbar */
	/*$(".appaside.dropdownnavbar").on("click",function(e)
	{
		e.stopPropagation();
		if($(this).hasClass("agile-menuactive"))
			{
				$(".appaside.dropdownnavbar").removeClass("agile-menuactive");
				return ;
			}
		$(".appaside.dropdownnavbar").removeClass("agile-menuactive");
		$(this).addClass("agile-menuactive");
		var dashboardName = $(this).attr("data-dashboard");
		var serviceName = $(this).attr("data-service-name");
			if(!dashboardName)
 				 dashboardName = "dashboard";
		_agile_set_prefs("dashboard_" + CURRENT_DOMAIN_USER.id, dashboardName);
		var json = {};
 		json.id = CURRENT_DOMAIN_USER.id;
 		json.role = serviceName;
		var Role = Backbone.Model.extend({url : '/core/api/users/update-role'});
		new Role().save( json, 
					{success :function(model, response){
						console.log("success");
						console.log(model);
						CURRENT_DOMAIN_USER = model.toJSON();
					}, 
					error: function(model, response){
					console.log("error");
					}});
	 		return;
	});*/
	/*click event for toggling the active class when clicked on the li items */
/*	$(".appaside.dropdownnavbar ul li").on("click",function(e)
	{
		e.stopPropagation();
		if(agile_is_mobile_browser())
			{
				$("#mobile-menu").trigger("click",function(e){
				});
			}
		else
			{
				var prevRole = $(".appaside.dropdownnavbar ul li.agile-menuactive").closest(".appaside.dropdownnavbar").attr("data-service-name");
				$(".appaside.dropdownnavbar ul li").removeClass("agile-menuactive")
				$(this).addClass("agile-menuactive");
				$(".active").removeClass("active");
				$(".appaside.dropdownnavbar").removeClass("agile-menuactive");
				$(this).closest(".appaside.dropdownnavbar").addClass("agile-menuactive");
				var currentRole = $(".appaside.dropdownnavbar ul li.agile-menuactive").closest(".appaside.dropdownnavbar").attr("data-service-name");
				$("html").removeClass("agile-theme-"+prevRole).addClass("agile-theme-"+currentRole);
			}
	});*/
	// initializing need help popover for header page
   $(".need_help").popover({ 
   					placement : $(this).attr("data-placement"),
					html:true,
					container: 'body'
				}).on("click", function(){
						initRolehandlers();
						//closeHelpPopover();
    			}).on("show.bs.popover", function(e){ 
    				var $target = $(e.target);
    				$(this).data("bs.popover").tip().addClass($target.data("custom-popover-class"));
    			});
    			
    	initRolehandlers();

    /*$('#searchText').on('focus', function () {
	    $(this).parent().find("label").toggleClass('active');
	});*/

	/*$('#searchText').on('blur', function () {
	    $(this).parent().find("label").toggleClass('active');
	});*/

	// Add blinker
	/*if(!_agile_get_prefs("menu_blinker")){
		_agile_set_prefs("menu_blinker", "shown");
		$(".grid_icon_center a.grid-icon-header").addClass("agile-feature-item-blink");	
	}*/

});

function showNoteModel(json, callback , template)
{	
	
	$("#newNoteModal").html(getTemplate(template , json)).modal('show');

	if(json)
	deserializeForm(json ,$("#noteUpdateForm"));
	
	if (callback && typeof (callback) === "function")
					callback();
	
}

// Click handlers to role menu items
function initRolehandlers(){
	// Remove blink icon from menu group icon
	$(".grid_icon_center a.grid-icon-header").removeClass("agile-feature-item-blink");

	// Reset active state from DomainUser.role
	$(".menu-service-select[data-service-name='" + CURRENT_DOMAIN_USER.role + "']").addClass("active");

	// Menu Items select
 			$(".menu-service-select").unbind("click").click(function(e){
 			e.preventDefault();

 			var serviceName = $(this).attr("data-service-name");

 			if(!serviceName)
 				return;

 			var dashboardName = $(this).attr("data-dashboard");
 			if(!dashboardName)
 				 dashboardName = "dashboard";

 			$(".rolecontainer").text(serviceName);
 			$('html').removeClass("agile-theme-"+CURRENT_DOMAIN_USER.role).addClass("agile-theme-" + serviceName);

 			/*set the role before the call to load the dashboard */
 			CURRENT_DOMAIN_USER.role = serviceName;
 			// Update user with the current service
 			var json = {};
 			json.id = CURRENT_DOMAIN_USER.id;
 			json.role = serviceName;
 			var Role = Backbone.Model.extend({url : '/core/api/users/update-role'});
 			new Role().save( json, 
 						{success :function(model, response){
 							console.log("success");
 							console.log(model);
 							CURRENT_DOMAIN_USER = model.toJSON();
 						}, 
 						error: function(model, response){
							console.log("error");
 						}});

 			// Close popup
 			// $("div.app-content-body div:first-child").click();
 			$(this).parents(".popover").popover('hide');

 			// Update dashboard name here
 			_agile_set_prefs("dashboard_" + CURRENT_DOMAIN_USER.id, dashboardName);

 			var due_tasks_count = $("#due_tasks_count").text();
 			due_tasks_count = due_tasks_count ? due_tasks_count : "";

 			// Update UI
 			$("#agile-menu-navigation-container").html(getTemplate(serviceName.toLowerCase() + "-menu-items", {due_tasks_count : due_tasks_count}));
 			// $('[data-icon-toggle="tooltip"]').tooltip({container : "body", placement : "right"});
 			appendAgileNewThemeSubNavMenu();
 			// Call dashboard route
 			Backbone.history.navigate("#navigate-dashboard", {
                trigger: true
            });
	});
}
/*for naigating to the particular routes from the navbar */
function navbarRoutes(id){
	
	if(id)
	{
		_agile_set_prefs("dashboard_" + CURRENT_DOMAIN_USER.id, id);
	}
		return ; 
}
//checks if there are any custom fields and if if present navigates to contact-add page otherwise opens person-modal
function addContactBasedOnCustomfields(){
 	$.ajax({
				url : 'core/api/custom-fields/required/scope?scope=CONTACT',
				type : 'GET',
				dataType : 'json',
				success : function(data){
					if(data.length > 0)
					{
						Backbone.history.navigate("contact-add" , {trigger: true});
						
					}
					else
						$("#personModal").modal("show");
				}
			});
 }


/**
 * checks if there are any custom fields and if present navigates to lead-add page 
 * otherwise opens new lead modal
 * 
 */
function addLeadBasedOnCustomfields(){
 	$.ajax(
 	{
		url : 'core/api/custom-fields/required/scope?scope=LEAD',
		type : 'GET',
		dataType : 'json',
		success : function(data){
			if(data && data.length > 0)
			{
				Backbone.history.navigate("lead-add" , {trigger: true});
				
			}
			else
			{
				var newLeadModalView = new Leads_Form_Events_View({ data : {}, template : "new-lead-modal", isNew : true,
		            postRenderCallback : function(el)
		            {
		                leadsViewLoader = new LeadsViewLoader();
		                leadsViewLoader.setupSources(el);
		                leadsViewLoader.setupStatuses(el);
		                setup_tags_typeahead(undefined, el);
		                var fxn_display_company = function(data, item)
		                {
		                    $("#new-lead-modal [name='lead_company_id']").html('<li class="inline-block tag btn btn-xs btn-primary m-r-xs m-b-xs" data="' + data + '"><span><a class="text-white m-r-xs" href="#contact/' + data + '">' + item + '</a><a class="close" id="remove_tag">&times</a></span></li>');
		                }
		                agile_type_ahead("lead_company", $("#new-lead-modal"), contacts_typeahead, fxn_display_company, 'type=COMPANY', '<b>'+_agile_get_translated_val("others","no-results")+'</b> <br/> ' + _agile_get_translated_val("others","add-new-one"));
		            }
		        });
				$("#new-lead-modal").html(newLeadModalView.render().el).modal("show");
			}
		}
	});
 }


function renderDashboardOnMenuServiceSelect(role,options_el){
	switch(role){
		case 'SALES':
		    return options_el += getTemplate("js-sales-dashboards-options-newui");
		    break;
		case 'MARKETING':
			return options_el += getTemplate("js-marketing-dashboards-options-newui");
			break;
		case 'SERVICE' :
			return options_el += getTemplate("js-service-dashboards-options-newui");
			break;
	}	
}
function updateDashboardRole(prevrole)
{
	if(!prevrole)
		return;
	if(CURRENT_DOMAIN_USER.role == prevrole)
		return;
	CURRENT_DOMAIN_USER.role = prevrole ;
			var json = {};
 			json.id = CURRENT_DOMAIN_USER.id;
 			json.role = prevrole;
 			var Role = Backbone.Model.extend({url : '/core/api/users/update-role'});
 			new Role().save(json, 
 						{success :function(model, response){
 							console.log("success");
 							console.log(model);
 							CURRENT_DOMAIN_USER = model.toJSON();
 							// Call dashboard route
 						}, 
 						error: function(model, response){
							console.log("error");
 						}});
}

/*$('body').on('click','#firstLi',function(e){
	 $('html, body').animate({
        scrollTop: $("#A").offset().top
    }, 2000);
});*/

$('body').on('click','.searchbychar',function(event){
  	event.preventDefault();
    var target = "#" + this.getAttribute('data-target');
    $(".searchbychar").removeClass("hightlight-select-anchor");
    if($(target).offset() != undefined){
    	$(this).addClass("hightlight-select-anchor");
	    $('html, body').animate({
	        scrollTop: $(target).offset().top - ($('body').find('#navbar').height() + $("#aside").height())
	    }, "fast");
    /*$("body,#content").animate({ scrollTop: $(target).offset().top }, "fast");
    $(target).focus();*/
	}
});

function isTargetAnInputField(e) {
	return ($(e.target).prop("tagName").toLowerCase() == "input");
}


function appendAgileNewThemeSubNavMenu() {
	$("#agile-menu-navigation-container ul li").each(function(i, ele){
		// console.log(ele);
		$(ele).remove("ul");
		var $a = $(ele).find("a").clone();
		if($a.length == 0)
			 return;
		// Delete title
		$(ele).find("[data-icon-toggle='tooltip']").attr("title", "");
		
		var $ul = $("<ul class='nav nav-sub dk agile-theme-nav-sub' style='display: none;'><li></li></ul>");
		$a.find("i").remove();
		$ul.find('li').append($a);
		$(ele).append($ul);
	});
}
    	 


	
