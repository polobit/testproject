/**
 * All user generated events (click event) are put here. all event function are
 * kept under init handler, and is called after script is loaded.
 * 
 * @author Dheeraj
 */

/**
 * Event handler initialization function.
 * 
 * @method init_handlers
 */
function init_handlers() {

	// Click event for adding contact from gadget
	$('.gadget-contact-validate').die().live(
			'click',
			function(e) {
				// Prevent default functionality.
				e.preventDefault();
				// Setting context (HTML container where event is triggered).
				var el = $(this).closest("div.gadget_contact_details_tab")
						.find(".gadget_contact_form");
				var json = [];
				var data = {};
				// Form serialization and validation.
				json = serializeForm($(el));

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
					build_ui();
				});
			});

	// Click event for adding Note for contact.
	$('.gadget-note-validate').die().live(
			'click',
			function(e) {
				// Prevent default functionality.
				e.preventDefault();
				// Setting context (HTML container where event is triggered).
				var el = $(this).closest("div.gadget_contact_details_tab")
						.find(".gadget_note_form");
				var json = [];
				var data = {};
				var email = {};
				// Form serialization and validation.
				json = serializeForm($(el));
				$.each(json, function(index, val) {
					if (val.name == "email")
						email[val.name] = val.value;
					else
						data[val.name] = val.value;
				});

				$('.saving', el).show();
				// Add Note
				_agile.add_note(data.subject, data.description, function(response) {

					$('.saving', el).hide(1);
					$('.status', el).show().delay(3000).hide(1);
					// Clearing form fields.
					$(el).validate().resetForm();
					$(el).get(0).reset();
				}, email.email);
			});

	// Click event for adding Task for contact
	$('.gadget-task-validate').die().live(
			'click',
			function(e) {
				// Prevent default functionality.
				e.preventDefault();
				// Setting context (HTML container where event is triggered).
				var el = $(this).closest("div.gadget_contact_details_tab")
						.find(".gadget_task_form");
				var json = [];
				var data = {};
				var email = {};
				// Form serialization and validation.
				json = serializeForm($(el));
				$.each(json, function(index, val) {
					if (val.name == "email")
						email[val.name] = val.value;
					else
						data[val.name] = val.value;
				});
				// Formatting date.
				data.due = new Date(data.due).getTime() / 1000.0;

				$('.saving', el).show();
				// Add Task
				_agile.add_task(data, function(response) {

					$('.saving', el).hide(1);
					$('.status', el).show().delay(3000).hide(1);
					// Clearing form fields.
					$(el).validate().resetForm();
					$(el).get(0).reset();
				}, email.email);
			});

	// Click event for adding Deal for contact
	$('.gadget-deal-validate').die().live(
			'click',
			function(e) {
				// Prevent default functionality.
				e.preventDefault();
				// Setting context (HTML container where event is triggered).
				var el = $(this).closest("div.gadget_contact_details_tab")
						.find(".gadget_deal_form");
				var json = [];
				var data = {};
				var email = {};
				// Form serialization and validation.
				json = serializeForm($(el));
				$.each(json, function(index, val) {
					if (val.name == "email")
						email[val.name] = val.value;
					else
						data[val.name] = val.value;
				});
				// Formatting date.
				data.close_date = new Date(data.close_date).getTime() / 1000.0;

				$('.saving', el).show();
				// Add Deal
				_agile.add_deal(data, function(response) {

					$('.saving', el).hide(1);
					$('.status', el).show().delay(3000).hide(1);
					// Clearing form fields.
					$(el).validate().resetForm();
					$(el).get(0).reset();
				}, email.email);
			});

	// Click event for adding Score for contact.
	$('.add-score').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Setting context (HTML container where event is triggered).
		var el = $(this).closest("div.score-scope");
		var email = $('input[name="email"]', el).val();
		// Parsing score text into integer.
		var oldScore = parseInt($.trim($('.score-value', el).text()), 10);
		$('.score-value', el).text(oldScore + 1);
		// Add Score
		_agile.add_score(1, function(response) {

		}, email);
	});

	// Click event for subtracting Score for contact.
	$('.subtract-score').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Setting context (HTML container where event is triggered).
		var el = $(this).closest("div.score-scope");
		var email = $('input[name="email"]', el).val();
		// Parsing score text into integer.
		var oldScore = parseInt($.trim($('.score-value', el).text()), 10);

		if (oldScore > 0) {
			$('.score-value', el).text(oldScore - 1);
			// Subtract Score
			_agile.add_score(-1, function(response) {

			}, email);
		}
	});

	// Click event for adding tags for contact.
	$('#contact-add-tags').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Setting context (HTML container where event is triggered).
		var el = $(this).closest("div.add-tag");
		var json = [];
		var tags = {};
		var email = {};
		// Form serialization.
		json = serializeForm($(el).find("#addTagsForm"));

		$.each(json, function(index, val) {
			if (val.name == "email")
				email[val.name] = val.value;
			else
				tags[val.name] = val.value;
		});

		// Send request if tags are entered.
		if (tags.tags.length != 0) {
			$('.saving', el).show();
			$("#addTagsForm", el).toggle();
			// Add Tags
			_agile.add_tag(tags.tags, function(response) {

				$('.saving', el).hide();
				$(".toggle-tag", el).toggle();
				// Adding tag to list.
				build_tag_ui($("#added-tags-ul", el), response);

				if (!Is_Localhost)
					gadgets.window.adjustHeight();
			}, email.email);
		}
		// If tags are not entered, hide form.
		else {
			$("#addTagsForm", el).toggle();
			$(".toggle-tag", el).show();
		}
	});

	// Click event for removing tags from contact.
	$('.remove-tag').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Setting context (HTML container where event is triggered).
		var el = $(this).closest("div.add-tag");
		var email = $(el).find('#addTagsForm input[name="email"]').val();
		var tag = $(this).prev().text();

		$('.saving', el).show();
		$('.toggle-tag', el).hide();
		// Remove Tag
		_agile.remove_tag(tag, function(response) {

			$('.saving', el).hide();
			$('.toggle-tag', el).show();
			// Removing tag from list.
			build_tag_ui($("#added-tags-ul", el), response);

			if (!Is_Localhost)
				gadgets.window.adjustHeight();
		}, email);
	});

	// Click event for show add tag.
	$('.toggle-tag').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Setting context (HTML container where event is triggered).
		var el = $(this).closest("div.add-tag");
		$("#addTagsForm", el).toggle();
		$(".toggle-tag", el).hide();
		// Focusing on text box and clearing value.
		$('form input[name="tags"]', el).val("").focus();
		if (!Is_Localhost)
			gadgets.window.adjustHeight();
	});

	// Enter key press event for tag input box.
	$('#tags').die().live(
			'keypress',
			function(evt) {
				// Selecting event object, because it is different for IE.
				var evt = (evt) ? evt : ((event) ? event : null);
				var node = (evt.target) ? evt.target
						: ((evt.srcElement) ? evt.srcElement : null);

				// Checking for enter key code.
				if (evt.keyCode === 13) {
					// Prevent default functionality.
					evt.preventDefault();
					// Trigger add tag click function.
					$(this).next().trigger('click');
				}
			});

	// Click event for select option (adding note/task/deal).
	$(".optionDD").die().live(
			'change',
			function(e) {
				// Prevent default functionality.
				e.preventDefault();
				// Setting context (HTML container where event is triggered).
				var el = $(this).closest("div.gadget_contact_details_tab")
						.find("div.show_form");

				// If selected value from drop down is "New".
				if ($(this).val() === 'New') {
					$(".gadget-contact", el).hide();
					$(".gadget-no-contact", el).show();
					$(".gadget-note", el).hide();
					$(".gadget-deal", el).hide();
					$(".gadget-task", el).hide();
				}

				// Toggle event for add note.
				if ($(this).val() === 'Note') {

					// Building Note form template.
					build_form_template($(this), "gadget-note",
							".show_individual_form", function() {

								$(".gadget-task", el).hide();
								$(".gadget-deal", el).hide();
								$(".gadget-note", el).toggle();
							});
				}

				// Toggle event for add Task.
				if ($(this).val() === 'Task') {

					// Building Task form template.
					build_form_template($(this), "gadget-task",
							".show_individual_form", function() {
								/*
								 * Loading and applying Bootstrap date picker on
								 * text box in Task form.
								 */
								load_datepicker($('.task-calender', el),
										function() {
											$(".gadget-deal", el).hide();
											$(".gadget-note", el).hide();
											$(".gadget-task", el).toggle();
										});
							});
				}

				// Toggle event for add deal.
				if ($(this).val() === 'Deal') {

					// Building Deal form template.
					build_form_template($(this), "gadget-deal",
							".show_individual_form", function() {
								/*
								 * Loading and applying Bootstrap date picker on
								 * text box in Deal form.
								 */
								load_datepicker($('.deal-calender', el),
										function() {
											$(".gadget-note", el).hide();
											$(".gadget-task", el).hide();
											$(".gadget-deal", el).toggle();
										});
							});
				}

				if (!Is_Localhost)
					gadgets.window.adjustHeight();
			});

	// Click event for search contact.
	$(".gadget-search-contact").die().live(
			'click',
			function(e) {
				// Prevent default functionality.
				e.preventDefault();
				// Setting context (HTML container where event is triggered).
				var el = $(this).closest("div.gadget_contact_details_tab")
						.find('.show_form');
				var that = $(this);
				// Requesting for contact info.
				var email = $(el).data("content");

				$('.saving', el).show();
				// Get contact status based on email.
				agile_getContact(email,
						function(val) {

							// Merge Server with Contact_Json.
							$.extend(Contacts_Json[email], val);

							// Building show Contact form template.
							build_form_template(that, "gadget-contact-list",
									".contact-list", function() {
										$('.saving', el).hide();
										if (val.id == null)
											$('.status', el).show().delay(1500)
													.hide(1);
										else
											$('.contact-list', el).css('display','inline');
									});
						});

			});

	// Click event for toggling show contact.
	$(".gadget-show-contact").die().live(
			'click',
			function(e) {
				// Prevent default functionality.
				e.preventDefault();
				// Setting context (HTML container where event is triggered).
				var el = $(this).closest("div.gadget_contact_details_tab")
						.find('.show_form');
				// Building show Contact form template.
				build_form_template($(this), "gadget-contact-summary",
						".show-contact-summary", function() {

							// Building tags list.
							var content = Contacts_Json[$(el).data("content")];
							build_tag_ui($("#added-tags-ul", el), content);
							$(".contact-minified", el).toggle();
							$(".show-contact-summary", el).toggle();
						});
			});

	// Click event for toggling add contact.
	$(".gadget-add-contact").die().live(
			'click',
			function(e) {
				// Prevent default functionality.
				e.preventDefault();
				// Setting context (HTML container where event is triggered).
				var el = $(this).closest("div.gadget_contact_details_tab")
						.find("div.show_form");
				// Building Contact add template.
				build_form_template($(this), "gadget-addcontact",
						".show-add-contact-form", function() {

							$(".gadget-no-contact", el).toggle();
							$(".show-add-contact-form", el).toggle();
						});
			});

	// Click event for cancel button.
	$(".cancel").die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Setting context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget_contact_details_tab");
		// Reset option menu (add/task/deal) drop down.
		$('.optionDD', el).val($('.optionDD').prop('defaultSelected'));
		$('.optionDD', el).trigger('change');
		// Reset form feilds.
		// $(this).closest('form').validate().resetForm();
		// $(this).closest('form').get(0).reset();
		// Toggling add contact UI.
		$(".show-add-contact-form", el).hide();
		$(".gadget-no-contact", el).show();
	});
}
