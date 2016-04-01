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
	
	$('.action-add-email-note').die().live('click', function(e)
			{
				// ------ Prevent default functionality. ------
				e.preventDefault();
				var email = getSubBody();
				// ------ Set context (HTML container where event is triggered). ------
				var el = $(this).closest("div.gadget-contact-details-tab").find("div.show-form");
				$('.gadget-notes-tab-list', el).hide();
				// ------ Build notes tab UI to add note. ------
				agile_build_form_template($(this), "gadget-note", ".gadget-notes-tab-list", function()
				{
					$('#subject',el).val(email.subject);
					$('#description',el).val(email.body);
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
			var str = agile_id.getURL();
			var phpurl = str.split("/core/js/api");
			var agile_url = phpurl[0] + "/core/php/api/users?callback=?&id=" + agile_id.get();
			//var agile_url = agile_id.getURL() + "/users?callback=?&id=" + agile_id.get();
			agile_json(agile_url, function(usersList){
				
				if(usersList != null && usersList.length != 0){
					var html = '';
					$.each(usersList,function(index,value){
						html += '<option value="'+value.id+'">'+value.name+'</option>';
					});
					//console.log(html);
					$('#ownerId',el).html(html);
				}
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
				var domain = agile_id.getNamespace();
				var owner_url = agile_id.getNamespace()+'';
				
				var str = agile_id.getURL();
				var phpurl = str.split("/core/js/api");
				var agile_url = phpurl[0] + "/core/php/api/users?callback=?&id=" + agile_id.get();
				agile_json(agile_url, function(usersList){
					// ------ Take contact data from global object variable. ------
					var Json = Contacts_Json[el.closest(".show-form").data("content")];
					
					// ------ Compile template and generate UI. ------
					var Handlebars_Template = getTemplate("gadget-deal", Json, 'no');
					
					var elAll = $(Handlebars_Template);
					
					if(usersList != null && usersList.length != 0){
						Json.ownersList = usersList;
						var html = '';
						$.each(usersList,function(index,value){
							html += '<option value="'+value.id+'">'+value.name+'</option>';
						});
						//console.log(html);
						$('#ownerId',elAll).html(html);
					}
				
				// ------ Get campaign work-flow data. ------
				_agile.get_pipelines({ success : function(Response)
				{
					/*Milestone_Array = Response.milestones.split(",");
					for ( var Loop in Milestone_Array)
						Milestone_Array.splice(Loop, 1, Milestone_Array[Loop].trim());*/

					Json.pipelines = Response;
					console.log('-----------',Json);
					html = '';
					// If there is only one pipeline, select the option by default and hide the field.
					if(Response.length==1){
						var mile = Response[0];
						$.each(mile.milestones.split(","), function(index,milestone){
								html+='<option value="'+mile.id+'_'+milestone+'">'+milestone+'</option>';
						});
						$('#pipeline_milestone',elAll).closest('.control-group').find('label b').text('Milestone');
					}
					else {
						$.each(Response,function(index,mile){
							console.log(mile.milestones);
							var array = [];
							html+='<optgroup label="'+mile.name+'">';
							$.each(mile.milestones.split(","), function(index,milestone){
								array.push($.trim(this));
									html+='<option value="'+mile.id+'_'+milestone+'">'+mile.name+' - '+milestone+'</option>';
							});
							html+='</optgroup>';
							
						});
						$('#pipeline_milestone',elAll).closest('.control-group').find('label b').text('Track & Milestone');
					}
					$('#pipeline_milestone',elAll).html(html);
					console.log('adding');

					
					// ------ Insert template to container in HTML. ------
					That.closest(".gadget-contact-details-tab").find(".gadget-deals-tab-list").html(elAll);
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
					
					console.log(Response);
						console.log('auto select track');
						$('#milestone',el).val(Response[0].milestones.split(',')[0]);
						$('#pipeline').val(Response[0].id);
						$('#pipeline_milestone').trigger('change');

				}, error : function(Response)
				{

				} });
			});

			});
			
			$('#pipeline_milestone').die().live('change',function(e){
				var temp = $(this).val();
				var track = temp.substring(0,temp.indexOf('_'));
				var milestone = temp.substring(temp.indexOf('_')+1,temp.length+1);
				$(this).closest('form').find('#pipeline').val(track);
				$(this).closest('form').find('#milestone').val(milestone);
				console.log(track,'-----------',milestone);
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