// Magic Menu JavaScript Document

(function(){

// window options funda
$('body').on('change', '#menuPosition', function(e){
	CURRENT_USER_PREFS.menuPosition = $(this).val();
	$(".theme-save-status").css("display","inline");
	if($(this).val() == 'top')
	{
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

$('body').on('change', '#layout', function(e){
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

$('body').on('change', '#animations', function(e){
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

//retrieve the current radio button value	
$('body').on('change', '.magicMenu input:radio', function(e){
		CURRENT_USER_PREFS.theme = $(this).val();
		$(".theme-save-status").css("display","inline");
		var asideClassName = $(this).attr("target-aside-class");
		var logoClassName = $(this).attr("target-logo-class");
		var topBarClassName = $(this).attr("target-topbar-class");
		
		
		$(".app-aside,#navbar,.navbar-header").removeClassPrefix("bg-").removeClass("dk").removeClass("dker").removeClass("b-r");
		$(".app-aside").addClass(asideClassName);
		$(".navbar-header").addClass(logoClassName);
		$("#navbar").addClass(topBarClassName);
	});

$.fn.removeClassPrefix = function(prefix) {
    this.each(function(i, el) {
        var classes = el.className.split(" ").filter(function(c) {
            return c.trim().lastIndexOf(prefix, 0) !== 0;
        });
        el.className = $.trim(classes.join(" "));
    });
    return this;
};



/*funda for contact details*/


  $('body').on('click', '#contacts-inner-tabs #next', function(e){
	  console.log("next clicked");
    var target = $("#contactDetailsTab");
    target.animate({ scrollLeft : (target.scrollLeft() + 270)},1000);
  });
  
  $('body').on('click', '#contacts-inner-tabs #prev', function(e){
	   console.log("prev clicked");
    var target = $("#contactDetailsTab");
    target.animate({ scrollLeft : (target.scrollLeft() - 270)},1000);
  }); 

})();

//funda for contact details

/*function contactInnerTabsInvoke(el) {
	
	
	
	if ( ($("#contacts-inner-tabs .tab-container",el).width()) >= 689 ) {
		    $("#prev,#next",el).css("display","none");
			$("#contactDetailsTab",el).css('width','100%');
			
	  }
	  else 
	  {
		  $("#prev,#next",el).css("display","block");
		  $("#contactDetailsTab",el).removeAttr('style');
	   }
	 }*/
	 


$("#mobile-menu").on("click",function(){
	$("#aside").toggleClass("off-screen");
});

$("#mobile-menu-settings").on("click",function(){
	$("#navbar").toggleClass("show");
});
	

	 
	