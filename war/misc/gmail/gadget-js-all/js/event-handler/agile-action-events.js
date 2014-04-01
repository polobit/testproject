$(function()
{

	// ------------------------------------------------- agile-action-event.js
	// --------------------------------------------- START --

	/**
	 * Action Drop Down option events. Opens corresponding form. Add
	 * Note/Task/Deal/To Campaign forms.
	 * 
	 * @author Dheeraj
	 */

	// ------------------------------------------------- Click event for Action
	// Menu (add note) -----------------------------------
	$('.action-add-note').die().live('click', function(e)
	{
		// ------ Prevent default functionality. ------
		e.preventDefault();
		// ------ Set context (HTML container where event is triggered). ------
		var el = $(this).closest("div.gadget-contact-details-tab").find("div.show-form");
		$('.gadget-notes-tab-list', el).hide();
		// ------ Build notes tab UI to add note. ------
		agile_build_form_template($(this), "gadget-note", ".gadget-notes-tab-list", function()
		{
			// ------ Show notes tab. ------
			$('.gadget-notes-tab a', el).tab('show');
			$('.gadget-notes-tab-list', el).show();
			// ------ Adjust gadget height. ------
			agile_gadget_adjust_height();
		});
	});

	// ------------------------------------------------- Click event for Action
	// Menu (add task) -----------------------------------

	$('.action-add-task').die().live('click', function(e)
	{
		// ------ Prevent default functionality. ------
		e.preventDefault();
		// ------ Set context (HTML container where event is triggered). ------
		var el = $(this).closest("div.gadget-contact-details-tab").find("div.show-form");
		$('.gadget-tasks-tab-list', el).hide();
		// ------ Build tasks tab UI to add task. ------
		agile_build_form_template($(this), "gadget-task", ".gadget-tasks-tab-list", function()
		{
			/*
			 * ------ Load and apply Bootstrap date picker on text box in Task
			 * form. ------
			 */
			agile_load_datepicker($('.task-calender', el), function()
			{
				$('.gadget-tasks-tab a', el).tab('show');
				$('.gadget-tasks-tab-list', el).show();
				// ------ Adjust gadget height. ------
				agile_gadget_adjust_height();
			});
		});
	});

	// ------------------------------------------------- Click event for Action
	// Menu (add deal) -----------------------------------

	$('.action-add-deal').die().live('click', function(e)
	{
		// ------ Prevent default functionality. ------
		e.preventDefault();
		// ------ Set context (HTML container where event is triggered). ------
		var el = $(this).closest("div.gadget-contact-details-tab").find("div.show-form");
		var That = $(this);
		$('.gadget-deals-tab-list', el).hide();

		// ------ Get campaign work-flow data. ------
		_agile.get_milestones({ success : function(Response)
		{
			Milestone_Array = Response.milestones.split(",");
			for ( var Loop in Milestone_Array)
				Milestone_Array.splice(Loop, 1, Milestone_Array[Loop].trim());

			// ------ Take contact data from global object variable. ------
			var Json = Contacts_Json[el.closest(".show-form").data("content")];
			Json.milestones = Milestone_Array;

			// ------ Compile template and generate UI. ------
			var Handlebars_Template = getTemplate("gadget-deal", Json, 'no');
			// ------ Insert template to container in HTML. ------
			That.closest(".gadget-contact-details-tab").find(".gadget-deals-tab-list").html($(Handlebars_Template));
			$('.gadget-deals-tab a', el).tab('show');
			$('.gadget-deals-tab-list', el).show();
			/*
			 * ------ Load and apply Bootstrap date picker on text box in Deal
			 * form. ------
			 */
			agile_load_datepicker($('.deal-calender', el), function()
			{
				$('.gadget-deals-tab a', el).tab('show');
				$('.gadget-deals-tab-list', el).show();
				// ------ Adjust gadget height. ------
				agile_gadget_adjust_height();
			});
			// ------ Adjust gadget height. ------
			agile_gadget_adjust_height();

		}, error : function(Response)
		{

		} });

	});

	// ------------------------------------------------- Click event for Action
	// Menu (add to campaign) ----------------------------

	$('.action-add-campaign').die().live('click', function(e)
	{
		// ------ Prevent default functionality. ------
		e.preventDefault();
		// ------ Set context (HTML container where event is triggered). ------
		var el = $(this).closest("div.gadget-contact-details-tab").find("div.show-form");
		var That = $(this);
		$('.gadget-campaigns-tab-list', el).hide();

		// ------ Get campaign work-flow data. ------
		_agile.get_workflows({ success : function(Response)
		{
			// ------ Compile template and generate UI. ------
			var Handlebars_Template = getTemplate("gadget-campaign", Response, 'no');
			// ------ Insert template to container in HTML. ------
			That.closest(".gadget-contact-details-tab").find(".gadget-campaigns-tab-list").html($(Handlebars_Template));
			$('.gadget-campaigns-tab a', el).tab('show');
			$('.gadget-campaigns-tab-list', el).show();
			// ------ Adjust gadget height. ------
			agile_gadget_adjust_height();

		}, error : function(Response)
		{

		} });

	});

	// ------------------------------------------------- agile-action-event.js
	// ----------------------------------------------- END --

});
