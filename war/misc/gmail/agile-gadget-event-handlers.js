/**
 * All user generated events (click event) are put here. all event function are
 * kept under init handler, and is called after script is loaded.
 * 
 * @author Dheeraj
 */

/**
 * Event handler initialization.
 * 
 * @method agile_init_handlers
 */
function agile_init_handlers() {

	// Click event for add contact.
	$('.gadget-contact-validate').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
				.find(".gadget-contact-form");
		var json = [];
		var data = {};
		// Form serialization and validation.
		json = agile_serialize_form(el);

		$.each(json, function(index, val) {
			data[val.name] = val.value;
		});
		// Show saving image.
		$('.contact-add-waiting', el).show();
		// Add contact
		_agile.create_contact(data, function(response) {
			// Hide saving image.
			$('.contact-add-waiting', el).hide(1);
			// Re-build GUI
			agile_build_ui();
		});
	});

	// Click event for add Note.
	$('.gadget-note-validate').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
				.find("div.show-form");
		var json = [];
		var data = {};
		var email = {};
		// Form serialization and validation.
		json = agile_serialize_form($(el).find(".gadget-note-form"));
		$.each(json, function(index, val) {
			if (val.name == "email")
				email[val.name] = val.value;
			else
				data[val.name] = val.value;
		});

		$('.note-add-waiting', el).show();
		// Add Note
		_agile.add_note(data, function(response) {

			$('.note-add-waiting', el).hide(1);
			// Show notes list, after adding note.
			$('.gadget-notes-tab', el).trigger('click');
		}, email.email);
	});

	// Click event for add Task.
	$('.gadget-task-validate').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find("div.show-form");
		var json = [];
		var data = {};
		var email = {};
		// Form serialization and validation.
		json = agile_serialize_form($(el).find(".gadget-task-form"));
		$.each(json, function(index, val) {
			if (val.name == "email")
				email[val.name] = val.value;
			else
				data[val.name] = val.value;
		});
		// Format date.
		data.due = new Date(data.due).getTime() / 1000.0;

		$('.task-add-waiting', el).show();
		// Add Task
		_agile.add_task(data, function(response) {

			$('.task-add-waiting', el).hide(1);
			// Show tasks list, after adding task.
			$('.gadget-tasks-tab', el).trigger('click');
		}, email.email);
	});

	// Click event for add Deal.
	$('.gadget-deal-validate').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find("div.show-form");
		var json = [];
		var data = {};
		var email = {};
		// Form serialization and validation.
		json = agile_serialize_form($(el).find(".gadget-deal-form"));
		$.each(json, function(index, val) {
			if (val.name == "email")
				email[val.name] = val.value;
			else
				data[val.name] = val.value;
		});
		// Format date.
		data.close_date = new Date(data.close_date).getTime() / 1000.0;

		$('.deal-add-waiting', el).show();
		// Add Deal
		_agile.add_deal(data, function(response) {

			$('.deal', el).hide(1);
			// Show deals list, after adding deal.
			$('.gadget-deals-tab', el).trigger('click');
		}, email.email);
	});
	
	// Click event for add Campaign.
	$('.gadget-campaign-validate').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find("div.show-form");
		var json = [];
		var data = {};
		var email = $(el).data("content");
		// Form serialization and validation.
		json = agile_serialize_form($(el).find(".gadget-campaign-form"));
		$.each(json, function(index, val) {
			if (val.name == "email")
				email[val.name] = val.value;
			else
				data[val.name] = val.value;
		});
		
		$('.campaign-add-waiting', el).show();
		// Add Campaign
		_agile.add_campaign(data, function(response) {

			$('.campaign-add-waiting', el).hide(1);
			// Show deals list, after adding deal.
			$('.gadget-campaigns-tab', el).trigger('click');
		}, email);
	});

	// Click event for add Score.
	$('.add-score').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.score-scope");
		var email = $('input[name="email"]', el).val();
		// Parse score text into integer.
		var Old_Score = parseInt($.trim($('.score-value', el).text()), 10);
		$('.score-value', el).text(Old_Score + 1);
		// Add Score
		_agile.add_score(1, function(response) {
			// Merge Server response object with Contact_Json
			// object.
			$.extend(Contacts_Json[email], response);
		}, email);
	});

	// Click event for subtract Score.
	$('.subtract-score').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.score-scope");
		var email = $('input[name="email"]', el).val();
		// Parse score text into integer.
		var Old_Score = parseInt($.trim($('.score-value', el).text()), 10);

		if (Old_Score > 0) {
			$('.score-value', el).text(Old_Score - 1);
			// Subtract Score
			_agile.add_score(-1, function(response) {
				// Merge Server response object with Contact_Json
				// object.
				$.extend(Contacts_Json[email], response);
			}, email);
		}
	});

	// Click event for add tags.
	$('#contact_add_tags').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.add-tag");
		var json = [];
		var tags = {};
		var email = {};
		// Form serialization.
		json = agile_serialize_form($("#add_tags_form", el));

		$.each(json, function(index, val) {
			if (val.name == "email")
				email[val.name] = val.value;
			else
				tags[val.name] = val.value;
		});

		// Send request if tags are entered.
		if (tags.tags.length != 0) {
			$('.tag-waiting', el).show();
			$("#add_tags_form", el).toggle();
			// Add Tags
			_agile.add_tag(tags.tags, function(response) {

				$('.tag-waiting', el).hide();
				$(".toggle-tag", el).toggle();
				// Merge Server response object with Contact_Json
				// object.
				$.extend(Contacts_Json[email.email], response);
				// Add tag to list.
				agile_build_tag_ui($("#added_tags_ul", el), response);

				if (!Is_Localhost)
					gadgets.window.adjustHeight();
			}, email.email);
		}
		// If tags are not entered, hide form.
		else {
			$("#add_tags_form", el).toggle();
			$(".toggle-tag", el).show();
		}
	});

	// Click event for remove tags.
	$('.remove-tag').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.add-tag");
		var email = $(el).find('#add_tags_form input[name="email"]').val();
		var tag = $(this).prev().text();

		$('.tag-waiting', el).show();
		$('.toggle-tag', el).hide();
		// Remove Tag
		_agile.remove_tag(tag, function(response) {

			$('.tag-waiting', el).hide();
			$('.toggle-tag', el).show();
			// Merge Server response object with Contact_Json
			// object.
			$.extend(Contacts_Json[email], response);
			// Removing tag from list.
			agile_build_tag_ui($("#added_tags_ul", el), response);

			if (!Is_Localhost)
				gadgets.window.adjustHeight();
		}, email);
	});

	// Click event for show add tag.
	$('.toggle-tag').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.add-tag");
		$("#add_tags_form", el).toggle();
		$(".toggle-tag", el).hide();
		// Focus on text box and clear value.
		$('form input[name="tags"]', el).val("").focus();
		if (!Is_Localhost)
			gadgets.window.adjustHeight();
	});

	// Enter key press event for tag input box.
	$('#tags').die().live('keypress', function(evt) {
		// Select event object, because it is different for IE.
		var evt = (evt) ? evt : ((event) ? event : null);
		var node = (evt.target) ? evt.target
				: ((evt.srcElement) ? evt.srcElement : null);

		// Check for enter key code.
		if (evt.keyCode === 13) {
			// Prevent default functionality.
			evt.preventDefault();
			// Trigger add tag click event.
			$(this).next().trigger('click');
		}
	});
	
	// Click event for Action Menu (add note).
	$('.action-add-note').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find("div.show-form");
		// Build notes tab UI to add note.
		agile_build_form_template($(this), "gadget-note",
				".gadget-notes-tab-list", function() {
			// Show notes tab.
			$('.gadget-notes-tab a', el).tab('show');
			if (!Is_Localhost)
				gadgets.window.adjustHeight();
		});
	});
	
	// Click event for Action Menu (add task).
	$('.action-add-task').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find("div.show-form");
		// Build tasks tab UI to add task.
		agile_build_form_template($(this), "gadget-task",
				".gadget-tasks-tab-list", function() {
			/*
			 * Load and apply Bootstrap date picker on text
			 * box in Task form.
			 */
			agile_load_datepicker($('.task-calender', el), function() {
				$('.gadget-tasks-tab a', el).tab('show');
				if (!Is_Localhost)
					gadgets.window.adjustHeight();
			});
		});
	});
	
	// Click event for Action Menu (add deal).
	$('.action-add-deal').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find("div.show-form");
		// Build deals tab UI to add deal.
		agile_build_form_template($(this), "gadget-deal",
				".gadget-deals-tab-list", function() {
			/*
			 * Load and apply Bootstrap date picker on text
			 * box in Deal form.
			 */
			agile_load_datepicker($('.deal-calender', el), function() {
				$('.gadget-deals-tab a', el).tab('show');
				if (!Is_Localhost)
					gadgets.window.adjustHeight();
			});
		});
	});
	
	// Click event for Action Menu (add to campaign).
	$('.action-add-campaign').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find("div.show-form");
		var that = $(this);
		// Send request for template.
		agile_get_gadget_template("gadget-campaign-template", function(data) {

			// Get campaign work-flow data.
			_agile.get_workflows(function(response){
				console.log(response);
				// Compile template and generate UI.
				var Handlebars_Template = getTemplate("gadget-campaign", response, 'no');
				// Insert template to container in HTML.
				that.closest(".gadget-contact-details-tab").find(".gadget-campaigns-tab-list")
						.html($(Handlebars_Template));
				$('.gadget-campaigns-tab a', el).tab('show');
				if (!Is_Localhost)
					gadgets.window.adjustHeight();
			});
		});
	});

	// Click event for search contact.
	$(".gadget-search-contact").die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find('.show-form');
		var that = $(this);
		var email = $(el).data("content");

		$('.contact-search-waiting', el).show();
		// Get contact status based on email.
		agile_getContact(email, function(val) {
			
			// Set library path for campaign link, check for local host.
			if(Is_Localhost)
				val.lib_path = Lib_Path;
			else
				val.lib_path = "https://"+ val.owner.domain +".agilecrm.com/";
			
			// Merge Server response object with Contact_Json object.
			$.extend(Contacts_Json[email], val);

			// Build show contact form template.
			agile_build_form_template(that, "gadget-contact-list", ".contact-list", function() {
				
				$('.contact-search-waiting', el).hide();
				// Contact not found for requested mail, show add contact in mail list.
				if (val.id == null) {
					$('.contact-search-status', el).show().delay(1500).hide(1);
				}	
				// Contact found, show contact summary. 
				else {
					$('.gadget-show-contact', el).trigger('click');
					$('.contact-list', el).css('display', 'inline');
				}
			});
		});
	});

	// Click event for toggle show contact.
	$(".gadget-show-contact").die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find('.show-form');
		var that = $(this);
		// Build show contact form template.
		agile_build_form_template(that, "gadget-contact-summary", ".show-contact-summary", function() {

			var content = Contacts_Json[$(el).data("content")];
			// Build tags list.
			agile_build_tag_ui($("#added_tags_ul", el), content);
			// Hide list view of contact.
			$(".contact-minified", el).toggle();
			// Show contact summary.
			$(".show-contact-summary", el).toggle();
			// Build tabs.
			agile_build_form_template(that, "gadget-tabs", ".option-tabs", function() {
				
				// Load Bootstrap libraries.
				head.js(Lib_Path + 'lib/bootstrap.min.js', function() {
					
					// Enables Drop down.
					$('.dropdown-toggle').dropdown();
					// Enables Tab.
					$('.gadget_tabs', el).tab();
					// Show Tabs.
					$(".option-tabs", el).toggle();
					// Show notes tab by default.
					$('.gadget-notes-tab', el).trigger('click');
					if (!Is_Localhost)
						gadgets.window.adjustHeight();
				});
			});
		});
	});
	
	// Click event for hide contact info summary
	$(".hide-contact-summery").die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
				.find("div.show-form");
		// Show list view of contact.
		$(".contact-minified", el).toggle();
		// hide contact summary.
		$(".show-contact-summary", el).toggle();
		// Hide Tabs.
		$(".option-tabs", el).toggle();
		if (!Is_Localhost)
			gadgets.window.adjustHeight();
	});

	// Click event for notes tab.
	$('.gadget-notes-tab').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find('.show-form');
		// Clear notes tab data.
		$('.gadget-notes-tab-list', el).html("");
		var email = $(el).data("content");

		$(".tab-waiting", el).show();
		// Get Notes.
		_agile.get_notes(function(response) {
			
			// Load Date formatter libraries.
			head.js(Lib_Path + 'lib/date-formatter.js', Lib_Path + 'lib/jquery.timeago.js', function() {
				agile_get_gadget_template("gadget-notes-list-template", function(data) {
					$(".tab-waiting", el).hide();
					// Fill notes list in tab.
					$('.gadget-notes-tab-list', el).html(getTemplate('gadget-notes-list', response, 'no'));
				});
				// Apply date formatter on date/time field.
				$("time", el).timeago();
				if (!Is_Localhost)
					gadgets.window.adjustHeight();
			});
		}, email);
	});
	
	// Click event for tasks tab.
	$('.gadget-tasks-tab').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find('.show-form');
		// Clear tasks tab data.
		$('.gadget-tasks-tab-list', el).html("");
		var email = $(el).data("content");
		
		$(".tab-waiting", el).show();
		// Get Tasks.
		_agile.get_tasks(function(response) {
			
			agile_get_gadget_template("gadget-tasks-list-template", function(data) {
				$(".tab-waiting", el).hide();
				// Fill tasks list in tab.	
				$('.gadget-tasks-tab-list', el).html(getTemplate('gadget-tasks-list', response, 'no'));
			});
			// Apply date formatter on date/time field.
			$("time", el).timeago();
			if (!Is_Localhost)
				gadgets.window.adjustHeight();
		}, email);
	});
	
	// Click event for deals tab.
	$('.gadget-deals-tab').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find('.show-form');
		// Clear deals tab data.
		$('.gadget-deals-tab-list', el).html("");
		var email = $(el).data("content");
		
		$(".tab-waiting", el).show();
		// Get Deals.
		_agile.get_deals(function(response) {
			
			agile_get_gadget_template("gadget-deals-list-template", function(data) {
				$(".tab-waiting", el).hide();
				// Fill deals list in tab.	
				$('.gadget-deals-tab-list', el).html(getTemplate('gadget-deals-list', response, 'no'));
			});
			// Apply date formatter on date/time field.
			$("time", el).timeago();
			if (!Is_Localhost)
				gadgets.window.adjustHeight();
		}, email);
	});
	
	// Click event for campaigns tab.
	$('.gadget-campaigns-tab').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find('.show-form');
		// Clear campaigns tab data.
		$('.gadget-campaigns-tab-list', el).html("");
		var email = $(el).data("content");
		
		$(".tab-waiting", el).show();
		// Get Campaigns.
		_agile.get_campaign_logs(function(response) {
			
			agile_get_gadget_template("gadget-campaigns-list-template", function(data) {
				$(".tab-waiting", el).hide();
				var lib_json = {};
				// Set library path for campaign link, check for local host.
				if(Is_Localhost)
					lib_json["lib_path"] = Lib_Path;
				else
					lib_json["lib_path"] = "https://"+ response.owner.domain +".agilecrm.com/";
				lib_json["response"] = response; 
				
				// Fill campaigns list in tab.
				$('.gadget-campaigns-tab-list', el).html(getTemplate('gadget-campaigns-list', lib_json, 'no'));
			});
			// Apply date formatter on date/time field.
			$("time", el).timeago();
			if (!Is_Localhost)
				gadgets.window.adjustHeight();
		}, email);
	});
	
	// Click event for toggle add contact.
	$(".gadget-add-contact").die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
				.find("div.show-form");
		// Build contact add template.
		agile_build_form_template($(this), "gadget-add-contact", ".show-add-contact-form", function() {

			$(".gadget-no-contact", el).toggle();
			$(".show-add-contact-form", el).toggle();
			if (!Is_Localhost)
				gadgets.window.adjustHeight();
		});
	});

	// Click event for cancel button.
	$(".cancel").die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		
		var $this = $(this).data('tab-identity');
		// Show tabs default list.
		$('.gadget-' + $this + '-tab').trigger('click');
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab");
		// Toggle add contact UI.
		$(".show-add-contact-form", el).hide();
		$(".gadget-no-contact", el).show();
		if (!Is_Localhost)
			gadgets.window.adjustHeight();
	});
}
