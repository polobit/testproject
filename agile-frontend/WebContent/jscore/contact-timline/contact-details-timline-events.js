/**
 * Handles the events (click and mouseenter) of mail and log entities of 
 * tiemline 
 */
$(function () {
	/*
	 * Shows the mail details in detail on a popup modal, when '+'
	 * symbol is clicked 
	 */  
	$("#tl-mail-popover").live('click',function(e){
		e.preventDefault();
		
		var htmlstring = $(this).closest('div').attr("data");
		// var htmlstring = $(this).closest('div.text').html();
		// htmlstring = htmlstring.replace("icon-plus", "");

		$("#mail-in-detail").html("<div style='background:none;border:none;'>" + htmlstring + "</div>");
		
		$("#timelineMailModal").modal("show");
        
    });
	
	/*
	 * Shows the campaign log details on a popup modal
	 */ 
	$("#tl-log-popover").live('click',function(e){
		e.preventDefault();
		
		var string = $(this).closest('div').attr("data");

		// Add div tag to the string to consider white spaces
		$("#log-in-detail").html("<div style='background:none;border:none;'>" + string + "</div>");
		
		$("#timelineLogModal").modal("show");
    });
	
	/**
	 * Shows analytics popup modal with full details.
	 **/
	$("#tl-analytics-popover").live('click',function(e){
		e.preventDefault();
		
		var string = $(this).closest('div.body').html();
		var pageViews = $(string).find('div.ellipsis-multi-line');

		$("#analytics-in-detail").html("<div'>" + $(pageViews).html() + "</div>");
		
		$("#timelineAnalyticsModal").modal("show");
	});
	
	/*
	 * Shows the list of mails(mail sent to) as popover, when mouse is entered on
	 * to address of the email
	 */  
	$("#tl-mail-to-popover").live('mouseenter',function(e){
		
		$(this).popover({
        	template:'<div class="popover"><div class="arrow"></div><div class="popover-inner" style="padding:1px;width:340px;border-radius:2px"><div class="popover-content"><p></p></div></div></div>'
        });
		
		var string = $(this).text();
		var html = new Handlebars.SafeString(string.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/,/g, ",</br>").replace("To:","To:</br>").replace("read more", ""));
		$(this).attr("data-content", html);
        $(this).popover('show');
    });
	
	// Resizes the item height and open close effect for timeline elements
	$('#timeline .item a.open-close').live("click", function(e){
		$(this).siblings('.body').slideToggle(function(){
			$('#timeline').isotope('reLayout');
		});
		$(this).parents('.post').toggleClass('closed');
		$('#expand-collapse-buttons a').removeClass('active');
		e.preventDefault();
	});
	
});
