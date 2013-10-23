

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
		var json = [];
		var tags = {};
		var email = {};
		//  ------ Form serialization. ------ 
		json = agile_serialize_form($("#add_tags_form", el));

		$.each(json, function(index, val) {
			if (val.name == "email")
				email[val.name] = val.value;
			else
				tags[val.name] = val.value;
		});

		//  ------ Send request if tags are entered. ------ 
		if (tags.tags.length != 0) {
			
			$("#add_tags_form", el).hide();
			$('.tag-waiting', el).show("fast");
			
			//  ------ Add Tags ------ 
			_agile.add_tag(tags.tags,
					{success: function(response){
								$('.tag-waiting', el).hide();
								//  ------ Merge Server response object with Contact_Json object. ------ 
								$.extend(Contacts_Json[email.email], response);
								//  ------ Add tag to list. ------ 
								agile_build_tag_ui($("#added_tags_ul", el), response);
								$(".toggle-tag", el).show("medium");
								agile_gadget_adjust_height();		
						
					}, error: function(val){
										
												
					}}, email.email);
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
		var email = $(el).find('#add_tags_form input[name="email"]').val();
		var tag = $(this).prev().text();
		
		$('.toggle-tag', el).hide("fast",function(){
			$('.tag-waiting', el).show();
		});
		
		//  ------ Remove Tag ------ 
		_agile.remove_tag(tag,
				{success: function(response){
							$('.tag-waiting', el).hide();
							//  ------ Merge Server response object with Contact_Json object. ------ 
							$.extend(Contacts_Json[email], response);
							//  ------ Removing tag from list. ------ 
							agile_build_tag_ui($("#added_tags_ul", el), response);
							$('.toggle-tag', el).show("medium");
							agile_gadget_adjust_height();		
					
				}, error: function(val){
									
											
				}}, email);
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

	$('#tags').die().live('keypress', function(evt) {
		//  ------ Select event object, because it is different for IE. ------ 
		var evt = (evt) ? evt : ((event) ? event : null);
		var node = (evt.target) ? evt.target
				: ((evt.srcElement) ? evt.srcElement : null);

		//  ------ Check for enter key code. ------ 
		if (evt.keyCode === 13) {
			//  ------ Prevent default functionality. ------ 
			evt.preventDefault();
			//  ------ Trigger add tag click event. ------ 
			$(this).next().trigger('click');
		}
	});
	

// ------------------------------------------------- agile-tag-event.js -------------------------------------------------- END --
	
