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
				.find("div.show-form");
		var that = $(this);
		var json = [];
		var data = {};
		// Form serialization and validation.
		json = agile_serialize_form(el.find(".gadget-contact-form"));

		$.each(json, function(index, val) {
			data[val.name] = val.value;
		});
		// Show saving image.
		$('.contact-add-waiting', el).show();
		// Add contact
		_agile.create_contact(data, function(response) {
			// Hide saving image.
			$('.contact-add-waiting', el).hide(1);
			
			// Generate UI.
			agile_create_contact_ui(el, that, data.email, response);
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
			
			$("#add_tags_form", el).hide();
			$('.tag-waiting', el).show("fast");
			
			// Add Tags
			_agile.add_tag(tags.tags, function(response) {

				$('.tag-waiting', el).hide();
				// Merge Server response object with Contact_Json
				// object.
				$.extend(Contacts_Json[email.email], response);
				// Add tag to list.
				agile_build_tag_ui($("#added_tags_ul", el), response);
				$(".toggle-tag", el).show("medium");
				agile_gadget_adjust_height();
			}, email.email);
		}
		// If tags are not entered, hide form.
		else {
			$("#add_tags_form", el).hide();
			$(".toggle-tag", el).show("medium");
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
		
		$('.toggle-tag', el).hide("fast",function(){
			$('.tag-waiting', el).show();
		});
		
		// Remove Tag
		_agile.remove_tag(tag, function(response) {

			$('.tag-waiting', el).hide();
			// Merge Server response object with Contact_Json
			// object.
			$.extend(Contacts_Json[email], response);
			// Removing tag from list.
			agile_build_tag_ui($("#added_tags_ul", el), response);
			$('.toggle-tag', el).show("medium");
			agile_gadget_adjust_height();
		}, email);
	});

	// Click event for show add tag.
	$('.toggle-tag').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.add-tag");
		$(".toggle-tag", el).hide("fast", function(){
			$("#add_tags_form", el).show();
			// Focus on text box and clear value.
			$('form input[name="tags"]', el).val("").focus();
			agile_gadget_adjust_height();
		});
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
		$('.gadget-notes-tab-list', el).hide();
		// Build notes tab UI to add note.
		agile_build_form_template($(this), "gadget-note",
				".gadget-notes-tab-list", function() {
			// Show notes tab.
			$('.gadget-notes-tab a', el).tab('show');
			$('.gadget-notes-tab-list', el).show();
			// Adjust gadget height.
			agile_gadget_adjust_height();
		});
	});
	
	// Click event for Action Menu (add task).
	$('.action-add-task').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		// Set context (HTML container where event is triggered).
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find("div.show-form");
		$('.gadget-tasks-tab-list', el).hide();
		// Build tasks tab UI to add task.
		agile_build_form_template($(this), "gadget-task",
				".gadget-tasks-tab-list", function() {
			/*
			 * Load and apply Bootstrap date picker on text
			 * box in Task form.
			 */
			agile_load_datepicker($('.task-calender', el), function() {
				$('.gadget-tasks-tab a', el).tab('show');
				$('.gadget-tasks-tab-list', el).show();
				// Adjust gadget height.
				agile_gadget_adjust_height();
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
		$('.gadget-deals-tab-list', el).hide();
		// Build deals tab UI to add deal.
		agile_build_form_template($(this), "gadget-deal",
				".gadget-deals-tab-list", function() {
			/*
			 * Load and apply Bootstrap date picker on text
			 * box in Deal form.
			 */
			agile_load_datepicker($('.deal-calender', el), function() {
				$('.gadget-deals-tab a', el).tab('show');
				$('.gadget-deals-tab-list', el).show();
				// Adjust gadget height.
				agile_gadget_adjust_height();
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
		$('.gadget-campaigns-tab-list', el).hide();
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
				$('.gadget-campaigns-tab-list', el).show();
				// Adjust gadget height.
				agile_gadget_adjust_height();
			});
		});
	});

	// Click event for Action Menu (Disassociate Gadget).
	$('.action-disassocite-gadget').die().live('click', function(e) {
		// Prevent default functionality.
		e.preventDefault();
		
		var Ac_Holder_Email = "";
		if (!Is_Localhost){
			
			// Get user preferences.
		    var prefs = new gadgets.Prefs();
		    Ac_Holder_Email = prefs.getString("agile_user_email");
		}
		else{
			Ac_Holder_Email = Ac_Email;
		}
		
		// Hide whole mail list.
		$(".gadget-contact-details-tab").hide();
			
		// Generate UI for warning message.
		$('#agile_content').append('<div class="well well-small disassociate-ui" style="margin:0 0 5px 0px;">'
				+'<p>Do you want to unlink the gadget from Agile CRM account - '+Ac_Holder_Email+' ?</p>'
				+'<P style="margin:0px;"><input type="button" value="Yes" onclick=agile_disassociate_gadget("'+Ac_Holder_Email+'",true) class="btn btn-primary" style="padding:2px 6px 2px;">'
				+'<input type="button" value="No" onclick=agile_disassociate_gadget("'+Ac_Holder_Email+'",false) class="btn btn-primary" style="padding:2px 6px 2px; margin-left:10px;">'
				+'<img class="disassociate-waiting" style="display:none;width:16px; margin-left:10px;" src="https://googleapps.agilecrm.com/img/ajax-loader-cursor.gif"></img>'
				+'</P>'
				+'</div>');
		
		// Adjust gadget height.
		gadgets.window.adjustHeight();
		
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
		
		// Adjust width of mail list for Process icon.
		agile_gadget_adjust_width(el, $(".contact-search-waiting", el), true);
		$('.contact-search-waiting', el).show();
		// Get contact status based on email.
		agile_getContact(email, function(val) {
			
			// Generate UI.
			agile_create_contact_ui(el, that, email, val);
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
			agile_gadget_adjust_height();
			// Show contact summary.
			$(".show-contact-summary", el).toggle();
			agile_gadget_adjust_height();
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
					agile_gadget_adjust_height();
					// Show notes tab by default.
					$('.gadget-notes-tab', el).trigger('click');
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
		agile_gadget_adjust_height();
		// hide contact summary.
		$(".show-contact-summary", el).toggle();
		agile_gadget_adjust_height();
		// Show tabs.
		$(".option-tabs", el).toggle();
		agile_gadget_adjust_height();
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
					// Adjust gadget height.
					agile_gadget_adjust_height();
				});
				// Apply date formatter on date/time field.
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
				$('.gadget-tasks-tab-list', el).show();
				agile_gadget_adjust_height();
			});
			// Apply date formatter on date/time field.
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
				$('.gadget-deals-tab-list', el).show();
				agile_gadget_adjust_height();
			});
			// Apply date formatter on date/time field.
			$("time", el).timeago();
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
					lib_json["ac_path"] = Lib_Path;
				else{
					lib_json["ac_path"] = "https://"+ agile_id.namespace +".agilecrm.com/";
				}
				lib_json["lib_path"] = Lib_Path;
				lib_json["response"] = response; 
				
				// Fill campaigns list in tab.
				$('.gadget-campaigns-tab-list', el).html(getTemplate('gadget-campaigns-list', lib_json, 'no'));
				$('.gadget-campaigns-tab-list', el).show();
				agile_gadget_adjust_height();
			});
			// Apply date formatter on date/time field.
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

			$(".show-add-contact-form", el).toggle();
			agile_gadget_adjust_height();
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
		$(".show-add-contact-form", el).toggle();
		agile_gadget_adjust_height();
	});
}
/**
 * Calculates total width of mail list and adjusts max-width of e-mail and/or name.
 * 
 * @method agile_gadget_adjust_width
 * @param {Object} el Jquery object gives the current object.
 * @param {Object} Text_Width Jquery object of text to be shown.
 * @param {Boolean} bool Boolean variable.
 * */
function agile_gadget_adjust_width(el, Text_Width, bool){
	if(bool){
		var Total_Width = $(".agile-no-contact", el).width();
		var Total_Text_width = parseInt(Text_Width.width(), 10) + parseInt(Text_Width.css("margin-left"), 10) + 10;
		var Rest_Width = (((Total_Width - Total_Text_width)/Total_Width)*100) + "%";
		$(".contact-list-width", el).css("max-width", Rest_Width);
	}
	else{
		$(".contact-list-width", el).css("max-width", "95%");
	}
}

/**
 * Adjust height of gadget window.
 * 
 * @method agile_gadget_adjust_height
 * 
 * */
function agile_gadget_adjust_height(){
	if (!Is_Localhost)
		gadgets.window.adjustHeight();
}

/**
 * Disassociate Gadget.
 * 
 * @method agile_disassociate_gadget
 * @param {String} email Contains account holders email id.
 * @param {boolean} bool Flag for yes and no.
 */
function agile_disassociate_gadget(email, bool){
	
	if(bool){
		
		// Waiting image.
		$(".disassociate-waiting").show();
		// Request to disassociate gadget.
		
//		var Url = "https://"+ agile_id.namespace +".agilecrm.com/gmail?callback=?&disassociate_gadget=true&email=" + email;
		var url = Lib_Path + "gmail?disassociate_gadget=true&email=" + email;
		
		agile_send_auth(url, function(response) {
			
			// Clear UI.
			$("#agile_content").html('<img id="loading" style="padding-right:5px;" src="https://googleapps.agilecrm.com/img/21-0.gif"></img>');
			if(!Is_Localhost){
				// Reset user preferences
			    var prefs = new gadgets.Prefs();
			    prefs.set("agile_user_expire_at", "0");
				prefs.set("agile_user_exists", "");
				prefs.set("agile_user_domain", "");
				prefs.set("agile_user_key", "");
				
				// Re-login.
				agile_login();
			}	
		});
	}
	
	else{
		$(".gadget-contact-details-tab").show();
		$(".disassociate-ui").remove();
		agile_gadget_adjust_height();
	}
}

function agile_create_contact_ui(el, that, email, val){
	
	// Set library path for campaign link, check for local host.
	if(Is_Localhost)
		val.ac_path = Lib_Path;
	else
		val.ac_path = "https://"+ agile_id.namespace +".agilecrm.com/";
	
	// Merge Server response object with Contact_Json object.
	$.extend(Contacts_Json[email], val);

	// Build show contact form template.
	agile_build_form_template(that, "gadget-contact-list", ".contact-list", function() {
		
		// Contact not found for requested mail, show add contact in mail list.
		if (val.id == null) {
			agile_gadget_adjust_width(el, $(".contact-search-status", el), true);
			$('.contact-search-status', el).show().delay(4000).hide(1,function(){
				agile_gadget_adjust_width(el, $(".contact-search-status", el), false);
			});
		}	
		// Contact found, show contact summary. 
		else {
			$('.gadget-show-contact', el).trigger('click');
		}
	});
}