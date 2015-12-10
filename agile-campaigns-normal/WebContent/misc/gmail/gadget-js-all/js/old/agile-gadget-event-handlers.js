

// ------------------------------------------------- agile-action-event.js --------------------------------------------- START --

/**
 * Action Drop Down option events. Opens corresponding form.
 * Add Note/Task/Deal/To Campaign forms. 
 * 
 * @author Dheeraj
 */


//  ------------------------------------------------- Click event for Action Menu (add note) ----------------------------------- 

	$('.action-add-note').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find("div.show-form");
		$('.gadget-notes-tab-list', el).hide();
		//  ------ Build notes tab UI to add note. ------ 
		agile_build_form_template($(this), "gadget-note",
				".gadget-notes-tab-list", function() {
			//  ------ Show notes tab. ------ 
			$('.gadget-notes-tab a', el).tab('show');
			$('.gadget-notes-tab-list', el).show();
			//  ------ Adjust gadget height. ------ 
			agile_gadget_adjust_height();
		});
	});
	
	
//  ------------------------------------------------- Click event for Action Menu (add task) ----------------------------------- 

	$('.action-add-task').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find("div.show-form");
		$('.gadget-tasks-tab-list', el).hide();
		//  ------ Build tasks tab UI to add task. ------ 
		agile_build_form_template($(this), "gadget-task",
				".gadget-tasks-tab-list", function() {
			/* ------ Load and apply Bootstrap date picker on text
			 * box in Task form. ------ 
			 */
			agile_load_datepicker($('.task-calender', el), function() {
				$('.gadget-tasks-tab a', el).tab('show');
				$('.gadget-tasks-tab-list', el).show();
				//  ------ Adjust gadget height. ------ 
				agile_gadget_adjust_height();
			});
		});
	});
	

//  ------------------------------------------------- Click event for Action Menu (add deal) ----------------------------------- 

	$('.action-add-deal').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find("div.show-form");
		var That = $(this);
		$('.gadget-deals-tab-list', el).hide();
		
		//  ------ Send request for template. ------ 
		agile_get_gadget_template("gadget-deal-template", function(Data) {

			//  ------ Get campaign work-flow data. ------ 
			_agile.get_milestones(
					{success: function(Response){
								Milestone_Array = Response.milestones.split(",");
								for(var Loop in Milestone_Array)
									Milestone_Array.splice(Loop, 1, Milestone_Array[Loop].trim());
								
								//  ------ Take contact data from global object variable. ------ 
								var Json = Contacts_Json[el.closest(".show-form").data("content")];
								Json.milestones = Milestone_Array;
								
								//  ------ Compile template and generate UI. ------ 
								var Handlebars_Template = getTemplate("gadget-deal", Json, 'no');
								//  ------ Insert template to container in HTML. ------ 
								That.closest(".gadget-contact-details-tab").find(".gadget-deals-tab-list")
									.html($(Handlebars_Template));
								$('.gadget-deals-tab a', el).tab('show');
								$('.gadget-deals-tab-list', el).show();
								/*
								 *  ------ Load and apply Bootstrap date picker on text
								 * box in Deal form. ------ 
								 */
								agile_load_datepicker($('.deal-calender', el), function() {
									$('.gadget-deals-tab a', el).tab('show');
									$('.gadget-deals-tab-list', el).show();
									//  ------ Adjust gadget height. ------ 
									agile_gadget_adjust_height();
								});
								//  ------ Adjust gadget height. ------ 
								agile_gadget_adjust_height();		
						
					}, error: function(Response){
										
												
					}});
		});
	});
	

//  ------------------------------------------------- Click event for Action Menu (add to campaign) ---------------------------- 

	$('.action-add-campaign').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find("div.show-form");
		var That = $(this);
		$('.gadget-campaigns-tab-list', el).hide();
		//  ------ Send request for template. ------ 
		agile_get_gadget_template("gadget-campaign-template", function(Data) {

			//  ------ Get campaign work-flow data. ------ 
			_agile.get_workflows(
					{success: function(Response){
								//  ------ Compile template and generate UI. ------ 
								var Handlebars_Template = getTemplate("gadget-campaign", Response, 'no');
								//  ------ Insert template to container in HTML. ------ 
								That.closest(".gadget-contact-details-tab").find(".gadget-campaigns-tab-list")
										.html($(Handlebars_Template));
								$('.gadget-campaigns-tab a', el).tab('show');
								$('.gadget-campaigns-tab-list', el).show();
								//  ------ Adjust gadget height. ------ 
								agile_gadget_adjust_height();		
						
					}, error: function(Response){
										
												
					}});
		});
	});
	
	
// ------------------------------------------------- agile-action-event.js ----------------------------------------------- END --
	



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
		var That = $(this);
		var Json = [];
		var Data = {};
		//  ------ Form serialization and validation. ------ 
		Json = agile_serialize_form(el.find(".gadget-contact-form"));

		$.each(Json, function(index, Val) {
			Data[Val.name] = Val.value;
		});
		//  ------ Show saving image. ------ 
		$('.contact-add-waiting', el).show();
		//  ------ Add contact ------ 
		_agile.create_contact(Data, 
				{success: function(Response){
							//  ------ Hide saving image. ------ 
							$('.contact-add-waiting', el).hide(1);
							//  ------ Generate UI. ------ 
							agile_create_contact_ui(el, That, Data.email, Response);
							
				}, error: function(Response){
					
							$('.contact-add-waiting', el).hide(1);
							//  ------ Show duplicate contact message. ------ 
							$('.contact-add-status', el).text(Response.error).show().delay(5000).hide(1);
				}});
	});


//  ------------------------------------------------- Click event for add Note ------------------------------------------------- 
	
	$('.gadget-note-validate').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
				.find("div.show-form");
		var Json = [];
		var Data = {};
		var Email = {};
		//  ------ Form serialization and validation. ------ 
		Json = agile_serialize_form($(el).find(".gadget-note-form"));
		$.each(Json, function(Index, Val) {
			if (Val.name == "email")
				Email[Val.name] = Val.value;
			else
				Data[Val.name] = Val.value;
		});

		$('.note-add-waiting', el).show();
		//  ------ Add Note ------ 
		_agile.add_note(Data,
				{success: function(Response){
							$('.note-add-waiting', el).hide(1);
							//  ------ Show notes list, after adding note. ------ 
							$('.gadget-notes-tab', el).trigger('click');
					
				}, error: function(Response){
									
											
				}}, Email.email);
	});

	
//  ------------------------------------------------- Click event for add Task ------------------------------------------------- 

	$('.gadget-task-validate').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find("div.show-form");
		var Json = [];
		var Data = {};
		var Email = {};
		//  ------ Form serialization and validation. ------ 
		Json = agile_serialize_form($(el).find(".gadget-task-form"));
		$.each(Json, function(Index, Val) {
			if (Val.name == "email")
				Email[Val.name] = Val.value;
			else
				Data[Val.name] = Val.value;
		});
		//  ------ Format date. ------ 
		Data.due = new Date(Data.due).getTime() / 1000.0;

		$('.task-add-waiting', el).show();
		//  ------ Add Task ------ 
		_agile.add_task(Data,
				{success: function(Response){
							$('.task-add-waiting', el).hide(1);
							//  ------ Show tasks list, after adding task. ------ 
							$('.gadget-tasks-tab', el).trigger('click');
			
				}, error: function(Response){
									
											
				}}, Email.email);
	});

	
//  ------------------------------------------------- Click event for add Deal ------------------------------------------------- 
	
	$('.gadget-deal-validate').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find("div.show-form");
		var Json = [];
		var Data = {};
		var Email = {};
		//  ------ Form serialization and validation. ------ 
		Json = agile_serialize_form($(el).find(".gadget-deal-form"));
		$.each(Json, function(Index, Val) {
			if (Val.name == "email")
				Email[Val.name] = Val.value;
			else
				Data[Val.name] = Val.value;
		});
		//  ------ Format date. ------ 
		Data.close_date = new Date(Data.close_date).getTime() / 1000.0;

		$('.deal-add-waiting', el).show();
		//  ------ Add Deal ------ 
		_agile.add_deal(Data,
				{success: function(Response){
							$('.deal-add-waiting', el).hide(1);
							//  ------ Show deals list, after adding deal. ------ 
							$('.gadget-deals-tab', el).trigger('click');
			
				}, error: function(Response){
									
											
				}}, Email.email);
	});
	
	
//  ------------------------------------------------- Click event for add to Campaign ------------------------------------------ 
	
	$('.gadget-campaign-validate').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find("div.show-form");
		var Json = [];
		var Data = {};
		var Email = $(el).data("content");
		//  ------ Form serialization and validation. ------ 
		Json = agile_serialize_form($(el).find(".gadget-campaign-form"));
		$.each(Json, function(Index, Val) {
			if (Val.name == "email")
				Email[Val.name] = Val.value;
			else
				Data[Val.name] = Val.value;
		});
		
		$('.campaign-add-waiting', el).show();
		//  ------ Add Campaign ------ 
		_agile.add_campaign(Data,
				{success: function(Response){
							$('.campaign-add-waiting', el).hide(1);
							//  ------ Show deals list, after adding deal. ------ 
							$('.gadget-campaigns-tab', el).trigger('click');
					
				}, error: function(Response){
									
											
				}}, Email);
	});

	
//  ------------------------------------------------- Click event for cancel button -------------------------------------------- 
	
	$(".cancel").die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		
		var That = $(this).data('tab-identity');
		//  ------ Show tabs default list. ------ 
		$('.gadget-' + That + '-tab').trigger('click');
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab");
		//  ------ Toggle add contact UI. ------ 
		$(".show-add-contact-form", el).toggle();
		agile_gadget_adjust_height();
	});
	
	

// ------------------------------------------------- agile-button-event.js --------------------------------------------- END --
	


// ------------------------------------------------- agile-link-event.js --------------------------------------------- START --

/**
 * All link related events.
 * Search Contact/ Show Contact/ Add Contact/ Hide Contact. 
 * 
 * @author Dheeraj
 */


//  ------------------------------------------------- Click event for search contact ------------------------------------------- 
	$(".gadget-search-contact").die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find('.show-form');
		var That = $(this);
		var Email = "";
		
		//  ------ Check whether it is Search panel or single email. ------ 
		if(!That.hasClass("search-mail-button")){
			
			Email = $(el).data("content");
			//  ------ Adjust width of mail list for Process icon. ------ 
			agile_gadget_adjust_width(el, $(".contact-search-waiting", el), true);
			//  ------ Show searching icon. ------ 
			$('.contact-search-waiting', el).css('visibility','visible');
		}
		else {
			
			Email = $(".agile-mail-dropdown").data("email");
			//  ------ Chaeck if requested mail already present in list. ------ 
			if(Contacts_Json[Email].mail_exist == true){
				//  ------ Show if contact is present otherwise do nothing. ------ 
				$('#agile_content .show-form').each(function(){
					if($(this).data('content') == Email){
						$(this).find(".gadget-show-contact").trigger('click');
						return false;
					}
				});
				console.log("Email is already in list");
				return;
			}
			$('.contact-search-waiting', el).show();
		}
				
		//  ------ Get contact status based on email. ------ 
		_agile.get_contact(Email, 
				{success: function(Response){
							
							$('.contact-search-waiting', el).hide();
							//  ------ Generate UI. ------ 
							if(That.hasClass("search-mail-button")){
								
								agile_add_mail_to_list(Response, Email, el);
							}
							else{
								agile_create_contact_ui(el, That, Email, Response);
							}							
				
				}, error: function(Response){
					
							Response.id = null;
							$('.contact-search-waiting', el).hide();
							//  ------ Generate UI. ------ 
							if(That.hasClass("search-mail-button")){
								$(".contact-search-status", el).fadeIn().delay(4000).fadeOut();
								agile_add_mail_to_list(Response, Email, el);
							}
							else{
								agile_create_contact_ui(el, That, Email, Response);
							}
		}});
	});


//  ------------------------------------------------- Click event for toggle add contact ---------------------------------------

	$(".gadget-add-contact").die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
				.find("div.show-form");
		//  ------ Build contact add template. ------ 
		agile_build_form_template($(this), "gadget-add-contact", ".show-add-contact-form", function() {

			$(".show-add-contact-form", el).toggle();
			agile_gadget_adjust_height();
		});
	});
	
	
//  ------------------------------------------------- Click event for toggle show contact -------------------------------------- 

	$(".gadget-show-contact").die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find('.show-form');
		var That = $(this);
		//  ------ Build show contact form template. ------ 
		agile_build_form_template(That, "gadget-contact-summary", ".show-contact-summary", function() {

			var Json = Contacts_Json[$(el).data("content")];
			//  ------ Build tags list. ------ 
			agile_build_tag_ui($("#added_tags_ul", el), Json);

			//  ------ Hide list view of contact. ------ 
			$(".display-toggle", el).addClass("hide-contact-summery").removeClass("gadget-show-contact");
			$(".display-toggle i", el).addClass("icon-collapse-alt").removeClass("icon-expand-alt");
			$(".display-toggle span", el).text("Hide Details");
			$(".display-toggle", el).next().hide();
			
			agile_gadget_adjust_height();
			//  ------ Show contact summary. ------ 
			$(".show-contact-summary", el).toggle();
			agile_gadget_adjust_height();
			//  ------ Build tabs. ------ 
			agile_build_form_template(That, "gadget-tabs", ".option-tabs", function() {
				
				//  ------ Enables Tab. ------ 
				$('.gadget_tabs', el).tab();
				//  ------ Show Tabs. ------ 
				$(".option-tabs", el).toggle();
				agile_gadget_adjust_height();
				//  ------ Show notes tab by default. ------ 
				$('.gadget-notes-tab', el).trigger('click');
				
				//  ------ Enables Drop down. ------ 
				$('.dropdown-toggle').dropdown();
			});
		});
	});
	

//  ------------------------------------------------- Click event for hide contact info summary -------------------------------- 

	$(".hide-contact-summery").die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
				.find("div.show-form");

		//  ------ Show list view of contact. ------ 
		$(".display-toggle", el).removeClass("hide-contact-summery").addClass("gadget-show-contact");
		$(".display-toggle i", el).removeClass("icon-collapse-alt").addClass("icon-expand-alt");
		$(".display-toggle span", el).text("Show");
		$(".display-toggle", el).next().show();
		
		agile_gadget_adjust_height();
		//  ------ hide contact summary. ------ 
		$(".show-contact-summary", el).toggle();
		agile_gadget_adjust_height();
		//  ------ Show tabs. ------ 
		$(".option-tabs", el).toggle();
		agile_gadget_adjust_height();
	});
	

/**
 * Calculates total width of mail list and adjusts max-width of e-mail and/or name.
 * 
 * @method agile_gadget_adjust_width
 * @param {Object} el Jquery object gives the current object.
 * @param {Object} Text_Width Jquery object of text to be shown.
 * @param {Boolean} Boolean Boolean variable.
 * */
function agile_gadget_adjust_width(el, Text_Width, Boolean){
	if(Boolean){
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
 * Mail search callback, when only one mail in the mail list.
 * 
 * @method agile_create_contact_ui
 * @param {Object} el It is a jquery object which refers to the current contact container in DOM.
 * @param {Object} that It is jquery object which refer to current event object.
 * @param {String} email Email of the current contact.
 * @param {JSON} Val Response JSON object/array/string.
 * 
 * */
function agile_create_contact_ui(el, That, Email, Val){
	
	//  ------ Set library path for campaign link, check for local host. ------ 
	if(Is_Localhost)
		Val.ac_path = Lib_Path;
	else
		Val.ac_path = "https://"+ agile_id.namespace +".agilecrm.com/";
	
	//  ------ Merge Server response object with Contact_Json object. ------ 
	$.extend(Contacts_Json[Email], Val);

	//  ------ Build show contact form template. ------ 
	agile_build_form_template(That, "gadget-contact-list", ".contact-list", function() {
		
		//  ------ Contact not found for requested mail, show add contact in mail list. ------ 
		if (Val.id == null) {
			agile_gadget_adjust_width(el, $(".contact-search-status", el), true);
			$('.contact-search-status', el).show().delay(4000).hide(1,function(){
				agile_gadget_adjust_width(el, $(".contact-search-status", el), false);
			});
		}	
		//  ------ Contact found, show contact summary. ------  
		else {
			$('.gadget-show-contact', el).trigger('click');
		}
	});
}



/**
 * Mail search callback, when more then one mail in the mail list.
 * And add mail to list below search box.
 * 
 * @method agile_add_mail_to_list
 * 
 */
function agile_add_mail_to_list(Val, Email, el){

	//  ------ Set library path for campaign link, check for local host. ------ 
	if(Is_Localhost)
		Val.ac_path = Lib_Path;
	else
		Val.ac_path = "https://"+ agile_id.namespace +".agilecrm.com/";
	
	var Contact_Data = {};
	Contact_Data[Email] = Contacts_Json[Email];
	//  ------ Merge Server response object with Contact_Json object. ------ 
	$.extend(Contacts_Json[Email], Val);
	Contacts_Json[Email].mail_exist = true;
	
	//  ------ Compile template and generate UI. ------ 
	var Individual_Template = getTemplate('gadget', Contact_Data, 'no');
	//  ------ Append contact to container in HTML. ------ 
	$("#agile_content").prepend($(Individual_Template));
	//  ------ Temporarily hide the list. ------ 
	$("#agile_content").children().eq(0).find(".contact-list").hide();
	
	//  ------ Send request for template. ------ 
	agile_get_gadget_template("gadget-contact-list-template", function(data) {

		//  ------ Take contact data from global object variable. ------ 
		var Json = Contacts_Json[Email];
		//  ------ Compile template and generate UI. ------ 
		var Handlebars_Template = getTemplate("gadget-contact-list", Json, 'no');
		//  ------ Insert template to container in HTML. ------ 
		$("#agile_content").children().eq(0).find(".contact-list").html($(Handlebars_Template));
		//  ------ Show temporarily hidden list element. ------ 
		$("#agile_content").children().eq(0).find(".contact-list").show();
		//  ------ Adjust gadget window height. ------ 
		if (!Is_Localhost)
			gadgets.window.adjustHeight();
		
		//  ------ Contact found, show contact summary. ------ 		
		if (Json.id != null) {
			$("#agile_content").children().eq(0).find('.gadget-show-contact').trigger('click');
		}	
		else{
			$("#agile_content").children().eq(0).find('.contact-search-status').hide();
			$("#agile_content").children().eq(0).find(".contact-list-width").css("max-width", "95%");
		}
 	});
	
}



//------------------------------------------------- agile-link-event.js ------------------------------------------------ END --



// ------------------------------------------------- agile-score-event.js --------------------------------------------- START --

/**
 * All events related to score board UI block.
 * Add Score/ Subtract Score.
 * 
 * @author Dheeraj
 */


//  ------------------------------------------------- Click event for add Score ------------------------------------------------- 

	$('.add-score').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.score-scope");
		var Email = $('input[name="email"]', el).val();
		//  ------ Parse score text into integer. ------ 
		var Old_Score = parseInt($.trim($('.score-value', el).text()), 10);
		$('.score-value', el).text(Old_Score + 1);
		//  ------ Add Score ------ 
		_agile.add_score(1,
				{success: function(Response){
							//  ------ Merge Server response object with Contact_Json object. ------ 
							$.extend(Contacts_Json[Email], Response);
					
				}, error: function(Response){
									
											
				}}, Email);
	});

	
//  ------------------------------------------------- Click event for subtract Score --------------------------------------------- 
	
	$('.subtract-score').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.score-scope");
		var Email = $('input[name="email"]', el).val();
		//  ------ Parse score text into integer. ------ 
		var Old_Score = parseInt($.trim($('.score-value', el).text()), 10);

		if (Old_Score > 0) {
			$('.score-value', el).text(Old_Score - 1);
			//  ------ Subtract Score ------ 
			_agile.add_score(-1,
					{success: function(Response){
								//  ------ Merge Server response object with Contact_Json object. ------ 
								$.extend(Contacts_Json[Email], Response);
						
					}, error: function(Response){
										
												
					}}, Email);
		}
	});
	

// ------------------------------------------------- agile-score-event.js ------------------------------------------------ END --
	


// ------------------------------------------------- agile-tab-event.js ----------------------------------------------- START --

/**
 * Tab related events.
 * Click event for all four tabs (note/task/deal/campaign).
 * 
 * @author Dheeraj
 */


//  ------------------------------------------------- Click event for notes tab ------------------------------------------------- 

	$('.gadget-notes-tab').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find('.show-form');
		//  ------ Clear notes tab data. ------ 
		$('.gadget-notes-tab-list', el).html("");
		var Email = $(el).data("content");

		$(".tab-waiting", el).show();
		//  ------ Get Notes. ------ 
		_agile.get_notes(
				{success: function(Response){
							//  ------ Load Date formatter libraries. ------ 
							head.js(Lib_Path + 'lib/date-formatter.js', Lib_Path + 'lib/jquery.timeago.js', function() {
								agile_get_gadget_template("gadget-notes-list-template", function(Data) {
									$(".tab-waiting", el).hide();
									//  ------ Fill notes list in tab. ------ 
									$('.gadget-notes-tab-list', el).html(getTemplate('gadget-notes-list', Response, 'no'));
									//  ------ Adjust gadget height. ------ 
									agile_gadget_adjust_height();
								});
								//  ------ Apply date formatter on date/time field. ------ 
								$("time", el).timeago();
							});		
					
				}, error: function(Response){
									
											
				}}, Email);
	});
	

//  ------------------------------------------------- Click event for tasks tab ------------------------------------------------ 

	$('.gadget-tasks-tab').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find('.show-form');
		//  ------ Clear tasks tab data. ------ 
		$('.gadget-tasks-tab-list', el).html("");
		var Email = $(el).data("content");
		
		$(".tab-waiting", el).show();
		//  ------ Get Tasks. ------ 
		_agile.get_tasks(
				{success: function(Response){
							agile_get_gadget_template("gadget-tasks-list-template", function(Data) {
								$(".tab-waiting", el).hide();
								//  ------ Fill tasks list in tab. ------ 	
								$('.gadget-tasks-tab-list', el).html(getTemplate('gadget-tasks-list', Response, 'no'));
								$('.gadget-tasks-tab-list', el).show();
								agile_gadget_adjust_height();
							});
							//  ------ Apply date formatter on date/time field. ------ 
							$("time", el).timeago();		
					
				}, error: function(Response){
									
											
				}}, Email);
	});
	

//  ------------------------------------------------- Click event for deals tab ------------------------------------------------- 

	$('.gadget-deals-tab').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find('.show-form');
		//  ------ Clear deals tab data. ------ 
		$('.gadget-deals-tab-list', el).html("");
		var Email = $(el).data("content");
		
		$(".tab-waiting", el).show();
		//  ------ Get Deals. ------ 
		_agile.get_deals(
				{success: function(Response){
							agile_get_gadget_template("gadget-deals-list-template", function(Data) {
								$(".tab-waiting", el).hide();
								//  ------ Fill deals list in tab. ------ 	
								$('.gadget-deals-tab-list', el).html(getTemplate('gadget-deals-list', Response, 'no'));
								$('.gadget-deals-tab-list', el).show();
								agile_gadget_adjust_height();
							});
							//  ------ Apply date formatter on date/time field. ------ 
							$("time", el).timeago();
					
				}, error: function(Response){
									
											
				}}, Email);
	});
	
	
//  ------------------------------------------------- Click event for campaigns tab --------------------------------------------- 

	$('.gadget-campaigns-tab').die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
		.find('.show-form');
		//  ------ Clear campaigns tab data. ------ 
		$('.gadget-campaigns-tab-list', el).html("");
		var Email = $(el).data("content");
		
		$(".tab-waiting", el).show();
		//  ------ Get Campaigns. ------ 
		_agile.get_campaign_logs(
				{success: function(Response){
							agile_get_gadget_template("gadget-campaigns-list-template", function(Data) {
								$(".tab-waiting", el).hide();
								var Lib_Json = {};
								//  ------ Set library path for campaign link, check for local host. ------ 
								if(Is_Localhost)
									Lib_Json["ac_path"] = Lib_Path;
								else{
									Lib_Json["ac_path"] = "https://"+ agile_id.namespace +".agilecrm.com/";
								}
								Lib_Json["lib_path"] = Lib_Path;
								Lib_Json["response"] = Response; 
								
								//  ------ Fill campaigns list in tab. ------ 
								$('.gadget-campaigns-tab-list', el).html(getTemplate('gadget-campaigns-list', Lib_Json, 'no'));
								$('.gadget-campaigns-tab-list', el).show();
								agile_gadget_adjust_height();
							});
							//  ------ Apply date formatter on date/time field. ------ 
							$("time", el).timeago();		
					
				}, error: function(Response){
									
											
				}}, Email);
	});
	
	
// ------------------------------------------------- agile-tab-event.js --------------------------------------------------- END --
	


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
	
