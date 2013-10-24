

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
	
