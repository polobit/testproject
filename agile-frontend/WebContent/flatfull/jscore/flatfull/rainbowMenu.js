// Magic Menu JavaScript Document

function initializeThemeSettingsListeners(){
	$('#theme-and-layout').on('click', '#saveTheme', function(e)
	{
		e.preventDefault();
		$(".theme-save-status").css("display","none");
		var saveBtn = $(this);

		// Returns, if the save button has disabled
		// attribute
		if ($(saveBtn).attr('disabled'))
			return;

		// Disables save button to prevent multiple click
		// event issues
		disable_save_button($(saveBtn));
		var form_id = $(this).closest('form').attr("id");

		if (!isValidForm('#' + form_id)) {
			// Removes disabled attribute of save button
			enable_save_button($(saveBtn));
			return false;
		}
		var json = serializeForm(form_id);
		console.log("theme_info" + json);
		$.ajax({
			url : '/core/api/user-prefs/saveTheme',
			type : 'PUT',
			data : json,
			success : function() {
				/*if(true)
				{
					window.location.reload(true);
					return;
				}*/
				enable_save_button($(saveBtn));
			},
			error : function() {
				enable_save_button($(saveBtn));
			}
		});
	});

	$('#theme-and-layout').on('change', '#menuPosition', function(e){
	CURRENT_USER_PREFS.menuPosition = $(this).val();
	$(".theme-save-status").css("display","inline");
	if($(this).val() == 'top')
	{
		$(".app").removeClass("app-aside-folded");
		$(".app").addClass("app-aside-dock");
		$(".fixedicons#planView,.fixedicons#helpView").removeClass('fixedicons').addClass('dockedicons');
		
	}
	else
	{
		$(".app").removeClass("app-aside-dock");
		$(".dockedicons#planView,.dockedicons#helpView").removeClass('dockedicons').addClass('fixedicons');
		var pos = $("#aside").offset();
		$(".fixedicons#planView,.fixedicons#helpView").css("left",pos.left);
		if($(this).val() == 'left')
			$("#wrap").removeClass("app-aside-folded");
		else if($(this).val() == 'leftcol')
			$("#wrap").addClass("app-aside-folded");
	}
});

$('#theme-and-layout').on('change', '#layout', function(e){
	CURRENT_USER_PREFS.layout = $(this).val();
	$(".theme-save-status").css("display","inline");
	if($(this).val() == 'fluid')
	{
		$(".app").removeClass("container");
		var pos = $("#aside").offset();
		$(".fixedicons#planView,.fixedicons#helpView").css("left",pos.left);
	}
	else if($(this).val() == 'fixed')
	{
		$(".app").addClass("container");
		var pos = $("#aside").offset();
		$(".fixedicons#planView,.fixedicons#helpView").css("left",pos.left);
	}
});

$('#theme-and-layout').on('change', '#animations', function(e){
	CURRENT_USER_PREFS.animations = $(this).is(':checked');
	$(".theme-save-status").css("display","inline");
	if($(this).is(':checked'))
	{
		$("body").removeClass("disable-anim");
		$("#theme-and-layout").removeClass("custom-animated");
	}
	else
	{
		$("body").addClass("disable-anim");

	}
});

$('#theme-and-layout').on('change', '#page_size', function(e){
	CURRENT_USER_PREFS.page_size = $(this).val();
});

//retrieve the current radio button value	
$('#theme-and-layout').on('change', '.magicMenu input:radio', function(e){
		CURRENT_USER_PREFS.theme = $(this).val();

		// Handle agile new theme settings
		handleNewThemeSettings();
		
		$(".theme-save-status").css("display","inline");
		var asideClassName = $(this).attr("target-aside-class");
		var logoClassName = $(this).attr("target-logo-class");
		var topBarClassName = $(this).attr("target-topbar-class");
		
		
		$(".app-aside,#navbar,.navbar-header, .grid_icon_center").removeClassPrefix("bg-").removeClass("dk").removeClass("dker").removeClass("b-r");
		$(".app-aside").addClass(asideClassName);
		$(".navbar-header").addClass(logoClassName);
		$("#navbar").addClass(topBarClassName);
		$(".grid_icon_center").addClass(topBarClassName);
	});

	
}

$(function(){

// window options funda

	
/*	
$("#check-fix-head").on('click',function(){
	if( ($("#check-fix-aside").is(":checked"))  &&  ($("#check-dock-aside").is(":checked")) ) {
		$("#check-fix-head").attr("checked",true);
		return false;
	}
	if ( $(this).is(":checked") ) {
	$(".app").addClass("app-header-fixed");
	}
	else {
	$(".app").removeClass("app-header-fixed");
    }
	
	});

$("#check-fix-aside").on('click',function(){
	if ( $(this).is(":checked") ) {
	$(".app").addClass("app-aside-fixed");
	}
	else {
	$(".app").removeClass("app-aside-fixed");
    }
	if( ($(this).is(":checked"))  &&  ($("#check-dock-aside").is(":checked")) ) {
		$("#check-fix-aside").attr("checked",true);
		$("#check-fix-head").attr("checked",true);
		$(".app").addClass("app-header-fixed");
	}
	});

$("#check-dock-aside").on('click',function(){
	if ( $("#check-fix-aside").is(":checked")) {
		$("#check-fix-head").attr("checked",true);
		$(".app").addClass("app-header-fixed");
	}
	if ( $(this).is(":checked") ) {
	$(".app").addClass("app-aside-dock");
	$(".fixedicons#planView,.fixedicons#helpView").removeClass('fixedicons').addClass('dockedicons');
	}
    else {
    $(".app").removeClass("app-aside-dock");
	$(".dockedicons#planView,.dockedicons#helpView").removeClass('dockedicons').addClass('fixedicons');
	var pos = $("#aside").offset();
	$(".fixedicons#planView,.fixedicons#helpView").css("left",pos.left);
    }
});



$("#check-box-layout").live('click',function(){
	if ( $(this).is(":checked") ) {
	$(".app").addClass("container");
	var pos = $("#aside").offset();
	$(".fixedicons#planView,.fixedicons#helpView").css("left",pos.left);
	

	}
	else {
	$(".app").removeClass("container");
	var pos = $("#aside").offset();
	$(".fixedicons#planView,.fixedicons#helpView").css("left",pos.left);
	
	}
    });

// Rainbow menu funda
	
	$(".toggle-inactive").on('click',function(){
		$(this).toggleClass("active");
		$(this).parent().toggleClass("active");
		$(".magicMenu span.text-center").addClass("active");
	});
	
	*/



$.fn.removeClassPrefix = function(prefix) {
    this.each(function(i, el) {
        var classes = el.className.split(" ").filter(function(c) {
            return c.trim().lastIndexOf(prefix, 0) !== 0;
        });
        el.className = $.trim(classes.join(" "));
    });
    return this;
};

});
	 


$("#mobile-menu").on("click",function(){
	$("#aside").toggleClass("off-screen");
});

$("#mobile-menu-settings").on("click",function(){
	$("#navbar").toggleClass("show");
});
	

function handleNewThemeSettings() {
	var newThemeURL = "flatfull/css/material-theme/min/agile-theme-15.css?_=" + _AGILE_VERSION;
	$("html").removeClass (function (index, css) {
    	return (css.match (/(^|\s)agile-theme-\S+/g) || []).join(' ');
	});

	// Show top menu option
	$("#menuPosition option[value='top']").show();
	$("#menuPosition option[value='left']").show();
	
	if(CURRENT_USER_PREFS.theme == "15")
	{
		// Hide top menu option
		// if($("#menuPosition").val() == "top")
		$("#menuPosition").val('leftcol').trigger("change");			
		
		$("#menuPosition option[value='left']").hide();
		$("#menuPosition option[value='top']").hide();

		$('link[data-agile-theme="15"]').removeAttr('disabled');
		$('head').append('<link href="' + newThemeURL + '" rel="stylesheet" data-agile-theme="15" />');
		$("html").addClass("agile-theme-15 agile-theme-" + CURRENT_DOMAIN_USER.role);
	}
	else 
	{
		$('link[data-agile-theme="15"]').attr('disabled', 'disabled');
		$('link[data-agile-theme="15"]').remove();
	}
}
