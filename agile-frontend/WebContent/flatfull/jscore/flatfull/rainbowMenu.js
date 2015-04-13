// Magic Menu JavaScript Document

(function(){

// window options funda
$("#menuPosition").die().live("change", function(){
	
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

$("#layout").die().live("change", function(){
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



$("#check-box-layout").die().live('click',function(){
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
	$(".magicMenu input:radio").die().live('click',function(){
		var inputVal = $(this).val();
		var asideClassName = $(this).attr("target-aside-class");
		var logoClassName = $(this).attr("target-logo-class");
		var topBarClassName = $(this).attr("target-topbar-class");
		
		
		$(".app-aside,#navbar,.navbar-header").removeClassPrefix("bg-").removeClass("dk").removeClass("dker");
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




	})();

	