$(function(){
	
	$("#track_visitors").die().live("click", function(e){
		e.preventDefault();
		$("#setupContent").html('<p><iframe width="560" height="390" src="//www.youtube.com/embed/CWMelsl70H4" frameborder="0" allowfullscreen></iframe></p>');
	});
	$("#sync_new_signups").die().live("click", function(e){
		e.preventDefault();
		$("#setupContent").html('<p><iframe width="560" height="390" src="//www.youtube.com/embed/CWMelsl70H4" frameborder="0" allowfullscreen></iframe></p>');
	});
	$("#automate_email").die().live("click", function(e){
		e.preventDefault();
		$("#setupContent").html('<p><iframe width="560" height="390" src="//www.youtube.com/embed/RXOqougExkM" frameborder="0" allowfullscreen></iframe></p>');
	});
	$("#app_messages_popups").die().live("click", function(e){
		e.preventDefault();
		$("#setupContent").html('<p><iframe width="560" height="390" src="//www.youtube.com/embed/XGouq0B_7G8" frameborder="0" allowfullscreen></iframe></p>');
	});
	
});