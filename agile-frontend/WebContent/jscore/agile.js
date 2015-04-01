$(function()
{
	// Collapses the menu on a mobile device
	// Without this, the user has to click the collapsible button to remove the menu
	$('.agile-menu > li').click(function(e){
	    
		console.log("Collapsing before ul");
		$nav_collapse = $(this).closest('.nav-collapse');
		console.log($nav_collapse.attr('class'));
		if($nav_collapse.hasClass('collapse'))
		{
			console.log("Collapsing");
			$nav_collapse.collapse('hide');
		}
	});

	// Scroll to top
	$(window).load(function() {
		$("#top").click(function () {
			$("body, html").animate({
				scrollTop: 0
			}, 300);
			return false;
		}); 
	});
});	

		