

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
		var that = $(this);
		$('.gadget-deals-tab-list', el).hide();
		
		//  ------ Send request for template. ------ 
		agile_get_gadget_template("gadget-deal-template", function(data) {

			//  ------ Get campaign work-flow data. ------ 
			_agile.get_milestones(
					{success: function(response){
								Milestone_Array = response.milestones.split(",");
								for(var loop in Milestone_Array)
									Milestone_Array.splice(loop, 1, Milestone_Array[loop].trim());
								
								//  ------ Take contact data from global object variable. ------ 
								var json = Contacts_Json[el.closest(".show-form").data("content")];
								json.milestones = Milestone_Array;
								
								//  ------ Compile template and generate UI. ------ 
								var Handlebars_Template = getTemplate("gadget-deal", json, 'no');
								//  ------ Insert template to container in HTML. ------ 
								that.closest(".gadget-contact-details-tab").find(".gadget-deals-tab-list")
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
						
					}, error: function(val){
										
												
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
		var that = $(this);
		$('.gadget-campaigns-tab-list', el).hide();
		//  ------ Send request for template. ------ 
		agile_get_gadget_template("gadget-campaign-template", function(data) {

			//  ------ Get campaign work-flow data. ------ 
			_agile.get_workflows(
					{success: function(response){
								//  ------ Compile template and generate UI. ------ 
								var Handlebars_Template = getTemplate("gadget-campaign", response, 'no');
								//  ------ Insert template to container in HTML. ------ 
								that.closest(".gadget-contact-details-tab").find(".gadget-campaigns-tab-list")
										.html($(Handlebars_Template));
								$('.gadget-campaigns-tab a', el).tab('show');
								$('.gadget-campaigns-tab-list', el).show();
								//  ------ Adjust gadget height. ------ 
								agile_gadget_adjust_height();		
						
					}, error: function(val){
										
												
					}});
		});
	});
	
	
// ------------------------------------------------- agile-action-event.js ----------------------------------------------- END --
	

