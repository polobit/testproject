

// ------------------------------------------------- agile-button-event.js --------------------------------------------- START --

/**
 * Contains button events.
 * Add contact/note/task/deal/to campaign buttons event.
 * Cancel button event common for all cancel buttons.
 * 
 * @author Dheeraj
 */


//  ------------------------------------------------- Click event for add contact ----------------------------------------------- 
	
	$('.gadget-contact-validate').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
				.find("div.show-form");
		var that = $(this);
		var json = [];
		var data = {};
		//  ------ Form serialization and validation. ------ 
		json = agile_serialize_form(el.find(".gadget-contact-form"));

		$.each(json, function(index, val) {
			data[val.name] = val.value;
		});
		//  ------ Show saving image. ------ 
		$('.contact-add-waiting', el).show();
		//  ------ Add contact ------ 
		_agile.create_contact(data, 
				{success: function(val){
							//  ------ Hide saving image. ------ 
							$('.contact-add-waiting', el).hide(1);
							//  ------ Generate UI. ------ 
							agile_create_contact_ui(el, that, data.email, val);
							
				}, error: function(val){
					
							$('.contact-add-waiting', el).hide(1);
							//  ------ Show duplicate contact message. ------ 
							$('.contact-add-status', el).text(val.error).show().delay(5000).hide(1);
				}});
	});


//  ------------------------------------------------- Click event for add Note ------------------------------------------------- 
	
	$('.gadget-note-validate').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
				.find("div.show-form");
		var json = [];
		var data = {};
		var email = {};
		//  ------ Form serialization and validation. ------ 
		json = agile_serialize_form($(el).find(".gadget-note-form"));
		$.each(json, function(index, val) {
			if (val.name == "email")
				email[val.name] = val.value;
			else
				data[val.name] = val.value;
		});

		$('.note-add-waiting', el).show();
		//  ------ Add Note ------ 
		_agile.add_note(data,
				{success: function(val){
							$('.note-add-waiting', el).hide(1);
							//  ------ Show notes list, after adding note. ------ 
							$('.gadget-notes-tab', el).trigger('click');
					
				}, error: function(val){
									
											
				}}, email.email);
	});

	
//  ------------------------------------------------- Click event for add Task ------------------------------------------------- 

	$('.gadget-task-validate').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find("div.show-form");
		var json = [];
		var data = {};
		var email = {};
		//  ------ Form serialization and validation. ------ 
		json = agile_serialize_form($(el).find(".gadget-task-form"));
		$.each(json, function(index, val) {
			if (val.name == "email")
				email[val.name] = val.value;
			else
				data[val.name] = val.value;
		});
		//  ------ Format date. ------ 
		data.due = new Date(data.due).getTime() / 1000.0;

		$('.task-add-waiting', el).show();
		//  ------ Add Task ------ 
		_agile.add_task(data,
				{success: function(val){
							$('.task-add-waiting', el).hide(1);
							//  ------ Show tasks list, after adding task. ------ 
							$('.gadget-tasks-tab', el).trigger('click');
			
				}, error: function(val){
									
											
				}}, email.email);
	});

	
//  ------------------------------------------------- Click event for add Deal ------------------------------------------------- 
	
	$('.gadget-deal-validate').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find("div.show-form");
		var json = [];
		var data = {};
		var email = {};
		//  ------ Form serialization and validation. ------ 
		json = agile_serialize_form($(el).find(".gadget-deal-form"));
		$.each(json, function(index, val) {
			if (val.name == "email")
				email[val.name] = val.value;
			else
				data[val.name] = val.value;
		});
		//  ------ Format date. ------ 
		data.close_date = new Date(data.close_date).getTime() / 1000.0;

		$('.deal-add-waiting', el).show();
		//  ------ Add Deal ------ 
		_agile.add_deal(data,
				{success: function(val){
							$('.deal-add-waiting', el).hide(1);
							//  ------ Show deals list, after adding deal. ------ 
							$('.gadget-deals-tab', el).trigger('click');
			
				}, error: function(val){
									
											
				}}, email.email);
	});
	
	
//  ------------------------------------------------- Click event for add to Campaign ------------------------------------------ 
	
	$('.gadget-campaign-validate').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find("div.show-form");
		var json = [];
		var data = {};
		var email = $(el).data("content");
		//  ------ Form serialization and validation. ------ 
		json = agile_serialize_form($(el).find(".gadget-campaign-form"));
		$.each(json, function(index, val) {
			if (val.name == "email")
				email[val.name] = val.value;
			else
				data[val.name] = val.value;
		});
		
		$('.campaign-add-waiting', el).show();
		//  ------ Add Campaign ------ 
		_agile.add_campaign(data,
				{success: function(val){
							$('.campaign-add-waiting', el).hide(1);
							//  ------ Show deals list, after adding deal. ------ 
							$('.gadget-campaigns-tab', el).trigger('click');
					
				}, error: function(val){
									
											
				}}, email);
	});

	
//  ------------------------------------------------- Click event for cancel button -------------------------------------------- 
	
	$(".cancel").die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		
		var $this = $(this).data('tab-identity');
		//  ------ Show tabs default list. ------ 
		$('.gadget-' + $this + '-tab').trigger('click');
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab");
		//  ------ Toggle add contact UI. ------ 
		$(".show-add-contact-form", el).toggle();
		agile_gadget_adjust_height();
	});
	
	

// ------------------------------------------------- agile-button-event.js --------------------------------------------- END --
	
