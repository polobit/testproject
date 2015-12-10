$(function()
{

// ------------------------------------------------- agile-tag-event.js ----------------------------------------------- START --

/**
 * All events related to tags.
 * Add Tag/ Remove Tag/ Show Add Tag.
 * 
 * @author Dheeraj
 */


//  ------------------------------------------------- Click event for add tags ------------------------------------------------- 
	
	$('#contact_add_tags').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.add-tag");
		var Json = [];
		var Tags = {};
		var Email = {};
		//  ------ Form serialization. ------ 
		Json = agile_serialize_form($("#add_tags_form", el));

		$.each(Json, function(index, Val) {
			if (Val.name == "email")
				Email[Val.name] = Val.value;
			else
				Tags[Val.name] = Val.value;
		});
		
		$.each(Tags, function(index,tag){
			if(!isValidTag(tag))
				console.warn(tag + '- contains special characters. All special characters will be replaced with "_".');
		});

		//  ------ Send request if tags are entered. ------ 
		if (Tags.tags.length != 0) {
			
			$("#add_tags_form", el).hide();
			$('.tag-waiting', el).show("fast");
			
			//  ------ Add Tags ------ 
			_agile.add_tag(Tags.tags,
					{success: function(Response){
								$('.tag-waiting', el).hide();
								//  ------ Merge Server response object with Contact_Json object. ------ 
								$.extend(Contacts_Json[Email.email], Response);
								//  ------ Add tag to list. ------ 
								agile_build_tag_ui($("#added_tags_ul", el), Response);
								$(".toggle-tag", el).show("medium");
								agile_gadget_adjust_height();		
						
					}, error: function(Response){
										
												
					}}, Email.email);
		}
		//  ------ If tags are not entered, hide form. ------ 
		else {
			$("#add_tags_form", el).hide();
			$(".toggle-tag", el).show("medium");
		}
	});

	
//  ------------------------------------------------- Click event for remove tags ----------------------------------------------- 
	
	$('.remove-tag').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.add-tag");
		var Email = $(el).find('#add_tags_form input[name="email"]').val();
		var Tag = $(this).prev().text();
		
		$('.toggle-tag', el).hide("fast",function(){
			$('.tag-waiting', el).show();
		});
		
		//  ------ Remove Tag ------ 
		_agile.remove_tag(Tag,
				{success: function(Response){
							$('.tag-waiting', el).hide();
							//  ------ Merge Server response object with Contact_Json object. ------ 
							$.extend(Contacts_Json[Email], Response);
							//  ------ Removing tag from list. ------ 
							agile_build_tag_ui($("#added_tags_ul", el), Response);
							$('.toggle-tag', el).show("medium");
							agile_gadget_adjust_height();		
					
				}, error: function(Response){
									
											
				}}, Email);
	});

	
//  ------------------------------------------------- Click event for show add tag ---------------------------------------------- 

	$('.toggle-tag').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.add-tag");
		$(".toggle-tag", el).hide("fast", function(){
			$("#add_tags_form", el).show();
			//  ------ Focus on text box and clear value. ------ 
			$('form input[name="tags"]', el).val("").focus();
			agile_gadget_adjust_height();
		});
	});

	
//  ------------------------------------------------- Enter key press event for tag input box ---------------------------------

	$('#tags').die().live('keypress', function(Evt) {
		//  ------ Select event object, because it is different for IE. ------ 
		var Evt = (Evt) ? Evt : ((Event) ? Event : null);
		var Node = (Evt.target) ? Evt.target
				: ((Evt.srcElement) ? Evt.srcElement : null);

		//  ------ Check for enter key code. ------ 
		if (Evt.keyCode === 13) {
			//  ------ Prevent default functionality. ------ 
			Evt.preventDefault();
			//  ------ Trigger add tag click event. ------ 
			$(this).next().trigger('click');
		}
	});
	

// ------------------------------------------------- agile-tag-event.js -------------------------------------------------- END --
	
});