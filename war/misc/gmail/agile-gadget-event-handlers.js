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
		json = agile_serialize_form($(el));

		$.each(json, function(index, val) {
			data[val.name] = val.value;
		});
		// Show saving image.
		$('.saving', el).show();
		// Add contact
		_agile.create_contact(data, function(response) {
			// Hide saving image.
			$('.saving', el).hide(1);
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

		$('.saving', el).show();
		// Add Note
		_agile.add_note(data, function(response) {

			$('.saving', el).hide(1);
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

		$('.saving', el).show();
		// Add Task
		_agile.add_task(data, function(response) {

			$('.saving', el).hide(1);
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

		$('.saving', el).show();
		// Add Deal
		_agile.add_deal(data, function(response) {

			$('.saving', el).hide(1);
			$('.gadget-deals-tab', el).trigger('click');
		}, email.email);
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
		json = agile_serialize_form($(el).find("#add_tags_form"));

		$.each(json, function(index, val) {
			if (val.name == "email")
				email[val.name] = val.value;
			else
				tags[val.name] = val.value;
		});

		// Send request if tags are entered.
		if (tags.tags.length != 0) {
			$('.saving', el).show();
			$("#add_tags_form", el).toggle();
			// Add Tags
			_agile.add_tag(tags.tags, function(response) {

				$('.saving', el).hide();
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

		$('.saving', el).show();
		$('.toggle-tag', el).hide();
		// Remove Tag
		_agile.remove_tag(tag, function(response) {

			$('.saving', el).hide();
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
		
		agile_build_form_template($(this), "gadget-note",
				".gadget-notes-tab-list", function() {

		});
		$('.gadget-notes-tab a', el).tab('show');
	});
	
	// Click event for Action Menu (add task).
	$('.action-add-task').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find("div.show-form");
		
		agile_build_form_template($(this), "gadget-task",
				".gadget-tasks-tab-list", function() {
			/*
			 * Load and apply Bootstrap date picker on text
			 * box in Task form.
			 */
			agile_load_datepicker($('.task-calender', el), function() {
				$('.gadget-tasks-tab a', el).tab('show');		
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
		
		agile_build_form_template($(this), "gadget-deal",
				".gadget-deals-tab-list", function() {
			/*
			 * Load and apply Bootstrap date picker on text
			 * box in Deal form.
			 */
			agile_load_datepicker($('.deal-calender', el), function() {
				$('.gadget-deals-tab a', el).tab('show');
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

		$('.saving', el).show();
		// Get contact status based on email.
		agile_getContact(email, function(val) {

			// Merge Server response object with Contact_Json object.
			$.extend(Contacts_Json[email], val);

			// Build show contact form template.
			agile_build_form_template(that, "gadget-contact-list", ".contact-list", function() {

				if (val.id == null) {
					$('.saving', el).hide();
					$('.status', el).show().delay(1500).hide(1);
				}	

				else {
					$('.gadget-show-contact', el).trigger('click');
					$('.contact-list', el).css('display', 'inline');
				}
				
				$('.saving', el).hide();
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
			
			// Build tabs.
			agile_build_form_template(that, "gadget-tabs", ".option-tabs", function() {
				
				// Load Bootstrap libraries.
				head.js(Lib_Path + 'lib/bootstrap.min.js', function() {
					
					// Enables Tab.
					$('.dropdown-toggle').dropdown();
					$('.gadget_tabs', el).tab();
					$(".contact-minified", el).toggle();
					$(".show-contact-summary", el).toggle();
					$(".option-tabs", el).toggle();
					$('.gadget-notes-tab', el).trigger('click');
				});
			});
		});
	});
	
	// Click event for hide contact info summery
	$(".hide-contact-summery").die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
				.find("div.show-form");

		$(".contact-minified", el).toggle();
		$(".show-contact-summary", el).toggle();
		$(".option-tabs", el).toggle();
		$(".gadget-note", el).hide();
		$(".gadget-deal", el).hide();
		$(".gadget-task", el).hide();
	});

	// Click event for notes tab.
	$('.gadget-notes-tab').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find('.show-form');
		$('.gadget-notes-tab-list', el).html("");
		var email = $(el).data("content");
		// Get Notes.
		_agile.get_notes(function(response) {
			console.log(response);
			
			head.js(Lib_Path + 'lib/date-formatter.js', Lib_Path + 'lib/jquery.timeago.js', function() {
				agile_get_gadget_template("gadget-notes-list-template", function(data) {
					
					$('.gadget-notes-tab-list', el).html(getTemplate('gadget-notes-list', response, 'no'));
				});
				$("time", el).timeago();
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
		$('.gadget-tasks-tab-list', el).html("");
		var email = $(el).data("content");
		// Get Notes.
		_agile.get_tasks(function(response) {
			console.log(response);
			
			agile_get_gadget_template("gadget-tasks-list-template", function(data) {
					
				$('.gadget-tasks-tab-list', el).html(getTemplate('gadget-tasks-list', response, 'no'));
			});
			$("time", el).timeago();
		}, email);
	});
	
	// Click event for deals tab.
	$('.gadget-deals-tab').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find('.show-form');
		$('.gadget-deals-tab-list', el).html("");
		var email = $(el).data("content");
		// Get Notes.
		_agile.get_deals(function(response) {
			console.log(response);
			
			agile_get_gadget_template("gadget-deals-list-template", function(data) {
					
				$('.gadget-deals-tab-list', el).html(getTemplate('gadget-deals-list', response, 'no'));
			});
			$("time", el).timeago();
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
		});
	});

	// Click event for cancel button.
	$(".cancel").die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab");
		
		// Toggle add contact UI.
		$(".show-add-contact-form", el).hide();
		$(".gadget-no-contact", el).show();
	});
}
