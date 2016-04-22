$(function()
{

	// ------------------------------------------------- agile-tab-event.js
	// ----------------------------------------------- START --

	/**
	 * Tab related events. Click event for all four tabs
	 * (note/task/deal/campaign).
	 * 
	 * @author Dheeraj
	 */

	// ------------------------------------------------- Click event for notes
	// tab -------------------------------------------------
	$('.gadget-notes-tab').die().live('click', function(e)
	{
		// ------ Prevent default functionality. ------
		e.preventDefault();
		// ------ Set context (HTML container where event is triggered). ------
		var el = $(this).closest("div.gadget-contact-details-tab").find('.show-form');
		// ------ Clear notes tab data. ------
		$('.gadget-notes-tab-list', el).html("");
		var Email = $(el).data("content");

		$(".tab-waiting", el).show();
		// ------ Get Notes. ------
		// my code
		    var str = agile_id.getURL();
			var phpurl = str.split("/core/js/api");
			var agile_url = phpurl[0] + "/core/php/api/contacts/get-notes?callback=?&id=" + agile_id.get()+"&email="+Email;
			//var agile_url = agile_id.getURL() + "/users?callback=?&id=" + agile_id.get();
			agile_json(agile_url, function(Response){
				
			// ------ Load Date formatter libraries. ------
			head.js(LIB_PATH + 'lib/date-formatter.js', LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".tab-waiting", el).hide();
				// ------ Fill notes list in tab. ------
				$('.gadget-notes-tab-list', el).html(getTemplate('gadget-notes-list', Response, 'no'));
				// ------ Adjust gadget height. ------
				agile_gadget_adjust_height();

				// ------ Apply date formatter on date/time field. ------
				$("time", el).timeago();
			});
			});
		// end of my code
	});

	// ------------------------------------------------- Click event for tasks
	// tab ------------------------------------------------

	$('.gadget-tasks-tab').die().live('click', function(e)
	{
		// ------ Prevent default functionality. ------
		e.preventDefault();
		// ------ Set context (HTML container where event is triggered). ------
		var el = $(this).closest("div.gadget-contact-details-tab").find('.show-form');
		// ------ Clear tasks tab data. ------
		$('.gadget-tasks-tab-list', el).html("");
		var Email = $(el).data("content");

		$(".tab-waiting", el).show();
		// ------ Get Tasks. ------
		// my code
		    var str = agile_id.getURL();
			var phpurl = str.split("/core/js/api");
			var agile_url = phpurl[0] + "/core/php/api/contacts/get-tasks?callback=?&id=" + agile_id.get()+"&email="+Email;
			//var agile_url = agile_id.getURL() + "/users?callback=?&id=" + agile_id.get();
			agile_json(agile_url, function(Response){
				
			$(".tab-waiting", el).hide();
			// ------ Fill tasks list in tab. ------
			$('.gadget-tasks-tab-list', el).html(getTemplate('gadget-tasks-list', Response, 'no'));
			$('.gadget-tasks-tab-list', el).show();
			agile_gadget_adjust_height();
			// ------ Apply date formatter on date/time field. ------
			$("time", el).timeago();
			});
		// end of my code
	});

	// ------------------------------------------------- Click event for deals
	// tab -------------------------------------------------

	$('.gadget-deals-tab').die().live('click', function(e)
	{
		// ------ Prevent default functionality. ------
		e.preventDefault();
		// ------ Set context (HTML container where event is triggered). ------
		var el = $(this).closest("div.gadget-contact-details-tab").find('.show-form');
		// ------ Clear deals tab data. ------
		$('.gadget-deals-tab-list', el).html("");
		var Email = $(el).data("content");

		$(".tab-waiting", el).show();
		// ------ Get Deals. ------
		// my code
	    var str = agile_id.getURL();
		var phpurl = str.split("/core/js/api");
		var agile_url = phpurl[0] + "/core/php/api/contacts/get-deals?callback=?&id=" + agile_id.get()+"&email="+Email;
		//var agile_url = agile_id.getURL() + "/users?callback=?&id=" + agile_id.get();
		agile_json(agile_url, function(Response){
			
		// ------ Load Date formatter libraries. ------
		head.js(LIB_PATH + 'lib/date-formatter.js', LIB_PATH + 'lib/jquery.timeago.js', function()
		{
			$(".tab-waiting", el).hide();
			// ------ Fill deals list in tab. ------
			$('.gadget-deals-tab-list', el).html(getTemplate('gadget-deals-list', Response, 'no'));
			$('.gadget-deals-tab-list', el).show();
			agile_gadget_adjust_height();
			// ------ Apply date formatter on date/time field. ------
			$("time", el).timeago();
		});
		});
	  // end of my code
	});

	// ------------------------------------------------- Click event for
	// campaigns tab ---------------------------------------------

	$('.gadget-campaigns-tab').die().live('click', function(e)
	{
		// ------ Prevent default functionality. ------
		e.preventDefault();
		// ------ Set context (HTML container where event is triggered). ------
		var el = $(this).closest("div.gadget-contact-details-tab").find('.show-form');
		// ------ Clear campaigns tab data. ------
		$('.gadget-campaigns-tab-list', el).html("");
		var Email = $(el).data("content");

		$(".tab-waiting", el).show();
		// ------ Get Campaigns. ------
			
		// my code
		    var str = agile_id.getURL();
			var phpurl = str.split("/core/js/api");
			var agile_url = phpurl[0] + "/core/js/api/contacts/get-campaign-logs?callback=?&id=" + agile_id.get()+"&email="+Email;
			//var agile_url = agile_id.getURL() + "/users?callback=?&id=" + agile_id.get();
			agile_json(agile_url, function(Response){
				
			// ------ Load Date formatter libraries. ------
			head.js(LIB_PATH + 'lib/date-formatter.js', LIB_PATH + 'lib/jquery.timeago.js', function()
			{
				$(".tab-waiting", el).hide();
			var Lib_Json = {};
			// ------ Set library path for campaign link, check for local
			// host. ------
			if (Is_Localhost)
				Lib_Json["ac_path"] = LIB_PATH;
			else
			{
				Lib_Json["ac_path"] = "https://" + agile_id.namespace + ".agilecrm.com/";
			}
			Lib_Json["lib_path"] = LIB_PATH;
			Lib_Json["response"] = Response;

			// ------ Fill campaigns list in tab. ------
			$('.gadget-campaigns-tab-list', el).html(getTemplate('gadget-campaigns-list', Lib_Json, 'no'));
			$('.gadget-campaigns-tab-list', el).show();
			agile_gadget_adjust_height();

			// ------ Apply date formatter on date/time field. ------
			$("time", el).timeago();
			});
			});
		// end of my code
	});

	// ------------------------------------------------- agile-tab-event.js
	// --------------------------------------------------- END --

});