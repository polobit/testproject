/**
 * Creates backbone router to access preferences of the user 
 */
var PortletsRouter = Backbone.Router
		.extend({
			routes : {
				// "portlets" : "portlets",
				"add-dashlet" : "adddashlet"
			},
			before : {
				"*any" : function(fragment, args, next)
					{
						head.js( CLOUDFRONT_PATH + "/jscore/min/flatfull/portlets-min.js", function(){ 
							next(); 
						});
					}
			},
			adddashlet : function() {
				if (gridster == undefined) {
					App_Portlets.navigate("dashboard", {
						trigger : true
					});
				} else {
					head
							.js(
									LIB_PATH + 'lib/jquery.gridster.js',
									function() {
										this.Catalog_Portlets_View = new Base_Collection_View(
												{
													url : '/core/api/portlets/default',
													templateKey : "portlets-add",
													sort_collection : false,
													individual_tag_name : 'div',
													postRenderCallback : function(
															el) {
														if($('#deals').children().length==0)
															$('#deals').parents('.wrapper-md').hide();
														if($('#taksAndEvents').children().length==0)
															$('#taksAndEvents').parents('.wrapper-md').hide();
														if($('#userActivity').children().length==0)
															$('#userActivity').parents('.wrapper-md').hide();
														preload([
   																	'flatfull/img/dashboard_images/Mini-Calendar.jpg',
   																	'flatfull/img/dashboard_images/stats.png',
   																	'flatfull/img/dashboard_images/Leaderboard.png',
   																	'flatfull/img/dashboard_images/account-information.png',
   																	'flatfull/img/dashboard_images/Activities.png',
   																	'flatfull/img/dashboard_images/Agile-Blog.png',
   																	'flatfull/img/dashboard_images/Calls.png',
   																	'flatfull/img/dashboard_images/Deals-Funnel.png',
   																	'flatfull/img/dashboard_images/Email-opened.png',
   																	'flatfull/img/dashboard_images/Events.png',
   																	'flatfull/img/dashboard_images/Milestone.png',
																	'flatfull/img/dashboard_images/My-contacts.png',
   																	'flatfull/img/dashboard_images/Pending-Deals.png',
   																	'flatfull/img/dashboard_images/Revenue-graph.png',
																	'flatfull/img/dashboard_images/Tag-Graph.png',
																	'flatfull/img/dashboard_images/Task-report.png',
																	'flatfull/img/dashboard_images/Task.png',
																	'flatfull/img/dashboard_images/User-Activities.png',
																	'flatfull/img/dashboard_images/Campaign-stats.jpg',

																]);
														initializeAddPortletsListeners();
													}
												});

										this.Catalog_Portlets_View.appendItem = organize_portlets;

										// 
										this.Catalog_Portlets_View.collection
												.fetch();
										$('#content').html(
												this.Catalog_Portlets_View
														.render().el);

									});
										
				}
			},
			// Show form modal
			// $('#portletStreamModal').modal('show');

			// Add social network types template
			// $("#portletstreamDetails",$('#portletStreamModal')).html(this.Catalog_Portlets_View.el);},

			portlets : function() {
				head.js(LIB_PATH + 'lib/jquery.gridster.js',
						function() {

							getTemplate('portlets', {}, undefined, function(template_ui){
								if(!template_ui)
									  return;

								var el = $('#content').html($(template_ui));
								if (IS_FLUID) {
									$('#content').find('div.row')
											.removeClass('row').addClass(
													'row-fluid');
								}
								loadPortlets(el);
								
							}, "#content");

						});
			}
		});

function preload(arrayOfImages) {
    $(arrayOfImages).each(function () {
        $('<img />').attr('src',this).appendTo('body').css('display','none');
    });
}
// For adding new portlets
function addNewPortlet(portlet_type, p_name) {
	var obj={};
	var json={};
	var curDate=new Date();
	if(p_name=="FilterBased")
		obj.name="Filter Based";
	else if(p_name=="EmailsOpened")
		obj.name="Emails Opened";
	else if(p_name=="EmailsSent")
		obj.name="Emails Sent";
	else if(p_name=="PendingDeals")
		obj.name="Pending Deals";
	else if(p_name=="Agenda")
		obj.name="Agenda";
	else if(p_name=="TodayTasks")
		obj.name="Today Tasks";
	else if(p_name=="DealsByMilestone")
		obj.name="Deals By Milestone";
	else if(p_name=="ClosuresPerPerson")
		obj.name="Closures Per Person";
	else if(p_name=="DealsWon")
		obj.name="Deals Won";
	else if(p_name=="DealsFunnel")
		obj.name="Deals Funnel";
	else if(p_name=="GrowthGraph")
		obj.name="Growth Graph";
	else if(p_name=="DealsAssigned")
		obj.name="Deals Assigned";
	else if(p_name=="CallsPerPerson")
		obj.name="Calls Per Person";
	else if(p_name=="AgileCRMBlog")
		obj.name="Agile CRM Blog";
	else if(p_name=="AccountDetails")
		obj.name="Account Details";
	else if(p_name=="TaskReport")
		obj.name="Task Report";
	else if(p_name=="StatsReport")
		obj.name="Stats Report";
	else if(p_name=="Leaderboard")
		obj.name="Leaderboard";
	else if(p_name=="RevenueGraph")
		obj.name="Revenue Graph";
	else if(p_name=="UserActivities")
		obj.name="User Activities"
	else if(p_name=="MiniCalendar")
		obj.name="Mini Calendar";
	else if(p_name=="Campaignstats")
		obj.name="Campaign stats";
	obj.portlet_type=portlet_type;
	var max_row_position=0;
	if(gridster!=undefined)
		/*gridster.$widgets.each(function(){
			if(parseInt($(this).attr("data-row"))>max_row_position)
				max_row_position = parseInt($(this).attr("data-row")) * parseInt($(this).attr("data-sizey"));
		});*/
		var next_position = gridster.next_position(1,1);
	obj.column_position=next_position.col;
	obj.row_position=next_position.row;
	obj.size_x=next_position.size_x;
	obj.size_y=next_position.size_y;
	if(portlet_type=="CONTACTS" && p_name=="FilterBased")
		json['filter']="myContacts";
	else if(portlet_type=="CONTACTS" && p_name=="EmailsOpened")
		json['duration']="2-days";
	else if(portlet_type=="USERACTIVITY" && p_name=="EmailsSent")
		json['duration']="1-day";
	else if(portlet_type=="CONTACTS" && p_name=="GrowthGraph"){
		json['tags']="";
		json['frequency']='daily';
		//json['start-date']=new Date(curDate.getFullYear(),curDate.getMonth(),curDate.getDate()-6,0,0,0).getTime();
		//json['end-date']=new Date(curDate.getFullYear(),curDate.getMonth(),curDate.getDate(),0,0,0).getTime();
		json['duration']="1-week";
	}
	else if(portlet_type=="DEALS" && p_name=="PendingDeals"){
		json['deals']="my-deals";
	}
	else if(portlet_type=="DEALS" && (p_name=="DealsByMilestone" || p_name=="DealsFunnel")){
		json['deals']="my-deals";
		json['track']=0;
		//json['due-date']=Math.round((new Date()).getTime()/1000);
	}else if(portlet_type=="DEALS" && p_name=="ClosuresPerPerson"){
		json['group-by']="number-of-deals";
		json['due-date']=Math.round((new Date()).getTime()/1000);
	}else if(portlet_type=="DEALS" && p_name=="DealsWon")
		json['duration']="1-week";
	else if(portlet_type=="DEALS" && p_name=="DealsAssigned")
		json['duration']="1-day";
	else if(portlet_type=="USERACTIVITY" && p_name=="CallsPerPerson"){
		json['group-by']="number-of-calls";
		json['duration']="1-day";
	}else if(portlet_type=="TASKSANDEVENTS" && p_name=="TaskReport"){
		json['group-by']="user";
		json['split-by']="category";
		json['duration']="1-week";
		json['tasks']="all-tasks";
	}else if(portlet_type=="USERACTIVITY" && p_name=="StatsReport"){
		json['duration']="yesterday";
	}else if(portlet_type=="TASKSANDEVENTS" && p_name=="Agenda")
		json['duration']="today-and-tomorrow";
	else if(portlet_type=="TASKSANDEVENTS" && p_name=="TodayTasks")
		json['duration']="today-and-tomorrow";
	else if(portlet_type=="ACCOUNT" && p_name=="AccountDetails"){
      		//json['account']="account";
	}
	else if(portlet_type=="RSS" && p_name=="AgileCRMBlog")
		//else if(portlet_type=="CUSTOMERACTIVITY" && p_name=="CustomerActivities")
		obj.size_y=2;
	else if(portlet_type=="USERACTIVITY" && p_name=="Leaderboard"){
		json['duration']="this-month";
		var categoryJson={};
		categoryJson['revenue']=true;
		categoryJson['dealsWon']=true;
		categoryJson['calls']=true;
		categoryJson['tasks']=true;
		json['category']=categoryJson;
		obj.size_y=2;
		obj.size_x=2;
	}else if(portlet_type=="DEALS" && p_name=="RevenueGraph"){
		json['duration']="this-quarter";
		json['track']="anyTrack";
	}
	else if(portlet_type=="USERACTIVITY" && p_name=="Campaignstats"){
		json['duration']="yesterday";
		json['campaign_type']="All";
	}
	var portlet = new BaseModel();
	portlet.url = 'core/api/portlets/addPortlet';
	portlet.set({ "prefs" : JSON.stringify(json) }, { silent : true });
	var model;
	var scrollPosition;
	portlet.save(obj, {
        success: function (data) {
        	//hidePortletsPopup();
        	model=new BaseModel(data.toJSON());
//        	var el = $(getTemplate('portlets-collection',model));
        	if($('#zero-portlets').is(':visible'))
        		$('#zero-portlets').hide();
        	if($('#no-portlets').is(':visible'))
    			$('#no-portlets').hide();
        	App_Portlets.navigate("dashboard", { trigger : true });	
        	//Portlets_View.collection.add(model);
        	
//        	scrollPosition = ((parseInt($('#ui-id-'+model.column_position+'-'+model.row_position).attr('data-row'))-1)*200)+5;
//        	//move the scroll bar for showing the newly added portlet
//        	window.scrollTo(0,scrollPosition);
//        	//scrollPosition = 0;
        },
        error: function (model, response) {
        	hidePortletsPopup();
        	var model=data.toJSON();
        	//var el = $(getTemplate('portlets-model', model));
        	if($('#zero-portlets').is(':visible'))
        		$('#zero-portlets').hide();
        	if($('#no-portlets').is(':visible'))
    			$('#no-portlets').hide();
        	Portlets_View.collection.add(model);
        	scrollPosition = ((parseInt($('#ui-id-'+model.column_position+'-'+model.row_position).attr('data-row'))-1)*200)+5;
        	//move the scroll bar for showing the newly added portlet
        	window.scrollTo(0,scrollPosition);
        	scrollPosition = 0;
        }});
	

}
function hidePortletsPopup() {
	$('#portletStreamModal').modal('hide');
	$('.modal-backdrop').hide();
}
function deletePortlet(el) {
	var p_id = el.id.split("-close")[0];
	$('#portletDeleteModal').modal('show');
	$(
			'#portletDeleteModal > .modal-dialog > .modal-content > .modal-footer > .save-modal')
			.attr('id', p_id);
	var model = Portlets_View.collection.get(p_id);
	var header_text = $('#' + p_id).parent()
			.find('.portlet_header > h4 > span').text();
	var header_sub_text = $('#' + p_id).parent().find(
			'.portlet_header > h4 > small').text();
	if (header_text != undefined && header_text.trim() != ""
			&& header_text.trim() != "Getting started")
		$('#portletDeleteModal > .modal-dialog > .modal-content > .modal-body')
				.html(
						"Are you sure you want to delete Dashlet - "
								+ header_text.trim() + " "
								+ header_sub_text.trim() + "?");
	else if (header_text != undefined
			&& header_text.trim() == "Getting started")
		$('#portletDeleteModal > .modal-dialog > .modal-content > .modal-body')
				.html(
						"Are you sure you want to delete Dashlet - "
								+ header_text.trim()
								+ "?<br/>This dashlet can't be added back again.");
	else if (model.get("name") == "Leaderboard")
		$('#portletDeleteModal > .modal-dialog > .modal-content > .modal-body')
				.html(
						"Are you sure you want to delete Dashlet - Leaderboard "
								+ getDurationForPortlets(model.get("settings").duration)
								+ "?");
	else if(model.get("name")=="Mini Calendar")
		$('#portletDeleteModal > .modal-dialog > .modal-content > .modal-body')
	.html("Are you sure you want to delete Dashlet - Mini Calendar?");
	
	else
		$('#portletDeleteModal > .modal-dialog > .modal-content > .modal-body')
				.html(
						"Are you sure you want to delete Dashlet - Activity Overview "
								+ getDurationForPortlets(model.get("settings").duration)
								+ "?");
}
function initializePortletsListeners_1(){

	$('#portletDeleteModal').off("click").on(
		"click",'.portlet-delete-modal',
		function(e) { 
			e.preventDefault();
			var portlet = Portlets_View.collection.get($(this).attr('id'));
			/*
			 * Sends Delete request with portlet name as path parameter, and on
			 * success fetches the portlets to reflect the changes is_added, to
			 * show add portlet in the view instead of delete option
			 */
			$.ajax({
				type : 'DELETE',
				url : '/core/api/portlets/' + portlet.get("id"),
				contentType : "application/json; charset=utf-8",

				success : function(data) {
					Portlets_View.collection.remove(portlet);
					// $('#'+el.parentNode.parentNode.parentNode.parentNode.parentNode.id).remove();
					gridster.remove_widget($('#' + portlet.get("id")).parent(),
							false);
					setTimeout(function() {
						gridster.$changed.attr('id', 'ui-id-'
								+ gridster.$changed.attr('data-col') + '-'
								+ gridster.$changed.attr('data-row'));
					}, 500);
					$('#' + portlet.get("id")).parent().remove();

					if ($('.gridster-portlets > div').length == 0)
						$('#no-portlets').show();
					$('#portletDeleteModal').modal('hide');
				},
				dataType : 'json'
			});

	});

	$('#dashlet_heading #tutotial_modal').off('click');
	$('#dashlet_heading').on('click', '#tutotial_modal', function(e){
		e.preventDefault();
		$('#tutorialModal').html(getTemplate("tutorial-modal"));
		$('#tutorialModal').modal("show");

	});

	$('.portlet_body #portlets-contacts-model-list > tr, #portlets-companies-model-list > tr, #portlets-contacts-email-opens-model-list > tr').off();
	$('.portlet_body').on(
		"click",'#portlets-contacts-model-list > tr, #portlets-companies-model-list > tr, #portlets-contacts-email-opens-model-list > tr',
		function(e) {
			var id = $(this).find(".data").attr("data");
			App_Contacts.navigate("contact/" + id, {
				trigger : true
			});
	});
	
	$('.portlet_body .email-details').off();
	$('.portlet_body').on('click', '.email-details', function(e) 
			{
				e.preventDefault();
				var data = $(this).closest('a').attr("data");

				var obj = getActivityObject(data);
				console.log(obj);

				getTemplate("infoModal", JSON.parse(obj), undefined, function(template_ui){
					if(!template_ui)
						  return;
					var emailinfo = $(template_ui);
					emailinfo.modal('show');

				}, null);

			});
	
	$('.portlet_body .activity-event-edit').off();
	$('.portlet_body').on('click', '.activity-event-edit', function(e)
	{
		e.preventDefault();
		var data = $(this).closest('a').attr("data");

		var currentevent = getEventObject(data);

		update_event_activity(currentevent);

	});


	$('.portlet_body').on(
		"click",'#portlets-opportunities-model-list > tr',
		function(e) {

			/*
			 * if(e.target.attributes[0].name!="href"){ e.preventDefault();
			 * App_Portlets.currentPosition =
			 * ''+$(this).parents('.gs-w').find('.column_position').text().trim()+''+$(this).parents('.gs-w').find('.row_position').text().trim();
			 * updateDeal($(this).data()); }
			 */
			var hrefFlag = false;
			if (e.target.attributes != undefined && e.target.attributes != null
					&& e.target.attributes.length == 0)
				hrefFlag = true;
			$.each(e.target.attributes, function() {
				if (this.name == "href")
					hrefFlag = true;
			});
			if (!hrefFlag) {
				// code for navigating deal details page
				var id = $(this).find(".data").attr("data");
				App_Deal_Details.navigate("deal/" + id, {
					trigger : true
				});
			}
	});

	$('.portlet_body').on(
		"click",'#portlets-events-model-list > tr',
		function(e) {
					var hrefFlag = false;
					if (e.target.attributes != undefined
							&& e.target.attributes != null
							&& e.target.attributes.length == 0)
						hrefFlag = true;
					$.each(e.target.attributes, function() {
						if (this.name == "href")
							hrefFlag = true;
					});
					if (!hrefFlag) {
						App_Portlets.currentPosition = ''
								+ $(this).parents('.gs-w').find(
										'.column_position').text().trim()
								+ ''
								+ $(this).parents('.gs-w')
										.find('.row_position').text().trim();
						var id = $(this).find(".data").attr("data");
						var model = $(this).data().collection.get(id);
						if (isNaN(id))
							return;
						// Deserialize
						deserializeForm(model.toJSON(),
								$("#updateActivityForm"));

						// Set time for update Event
						$('#update-event-time-1')
								.val(
										(new Date(model.get('start') * 1000)
												.getHours() < 10 ? "0" : "")
												+ new Date(
														model.get('start') * 1000)
														.getHours()
												+ ":"
												+ (new Date(
														model.get('start') * 1000)
														.getMinutes() < 10 ? "0"
														: "")
												+ new Date(
														model.get('start') * 1000)
														.getMinutes());
						$('#update-event-time-2')
								.val(
										(new Date(model.get('end') * 1000)
												.getHours() < 10 ? "0" : "")
												+ new Date(
														model.get('end') * 1000)
														.getHours()
												+ ":"
												+ (new Date(
														model.get('end') * 1000)
														.getMinutes() < 10 ? "0"
														: "")
												+ new Date(
														model.get('end') * 1000)
														.getMinutes());

						// Set date for update Event
						var dateFormat = CURRENT_USER_PREFS.dateFormat;
						$("#update-event-date-1").val(
								(new Date(model.get('start') * 1000))
										.format(dateFormat));
						$("#update-event-date-2").val(
								(new Date(model.get('end') * 1000))
										.format(dateFormat));

						// hide end date & time for all day events
						if (model.toJSON().allDay) {
							$("#update-event-date-2").closest('.row').hide();
							$('#update-event-time-1').closest('.control-group')
									.hide();
						} else {
							$('#update-event-time-1').closest('.control-group')
									.show();
							$("#update-event-date-2").closest('.row').show();
						}
						if (model.toJSON().type == "WEB_APPOINTMENT"
								&& parseInt(model.toJSON().start) > parseInt(new Date()
										.getTime() / 1000)) {
							$("[id='event_delete']").attr("id",
									"delete_web_event");
							web_event_title = model.toJSON().title;
							if (model.toJSON().contacts.length > 0) {
								var firstname = getPropertyValue(
										model.toJSON().contacts[0].properties,
										"first_name");
								if (firstname == undefined)
									firstname = "";
								var lastname = getPropertyValue(
										model.toJSON().contacts[0].properties,
										"last_name");
								if (lastname == undefined)
									lastname = "";
								web_event_contact_name = firstname + " "
										+ lastname;
							}
						} else {
							$("[id='delete_web_event']").attr("id",
									"event_delete");
						}
						// Fills owner select element
						populateUsersInUpdateActivityModal(model.toJSON());
						if (model.toJSON().description) {
							var description = '<label class="control-label"><b>Description </b></label><div class="controls"><textarea id="description" name="description" rows="3" class="input form-control" placeholder="Add Description"></textarea></div>'
							$("#event_desc").html(description);
							$("textarea#description").val(
									model.toJSON().description);
						} else {
							var desc = '<div class="row-fluid">'
									+ '<div class="control-group form-group m-b-none">'
									+ '<a href="#" id="add_event_desctiption"><i class="icon-plus"></i> Add Description </a>'
									+ '<div class="controls event_discription hide">'
									+ '<textarea id="description" name="description" rows="3" class="input form-control w-full col-md-8" placeholder="Add Description"></textarea>'
									+ '</div></div></div>'
							$("#event_desc").html(desc);
						}
						// Show edit modal for the event
						$("#updateActivityModal").modal('show');
						return false;
					}
	});

	$('.portlet_body').on(
		"click",'#portlets-tasks-model-list > tr',
		function(e) {
			/*
			 * App_Portlets.currentPosition =
			 * ''+$(this).parents('.gs-w').find('.column_position').text().trim()+''+$(this).parents('.gs-w').find('.row_position').text().trim();
			 * var value = $(this).data().toJSON(); deserializeForm(value,
			 * $("#updateTaskForm")); $("#updateTaskModal").modal('show'); //
			 * Fills owner select element populateUsers("owners-list",
			 * $("#updateTaskForm"), value, 'taskOwner', function(data) {
			 * $("#updateTaskForm").find("#owners-list").html(data); if
			 * (value.taskOwner) { $("#owners-list", $("#updateTaskForm")).find(
			 * 'option[value=' + value['taskOwner'].id + ']') .attr("selected",
			 * "selected"); } $("#owners-list",
			 * $("#updateTaskForm")).closest('div').find('.loading-img').hide();
			 * }); // Add notes in task modal showNoteOnForm("updateTaskForm",
			 * value.notes);
			 */
			var hrefFlag = false;
			if (e.target.tagName.toLowerCase() == "a"
					|| e.target.tagName.toLowerCase() == "i" 
					|| e.target.tagName.toLowerCase() == "input")
				hrefFlag = true;
			/*
			 * if(e.target.tagName.toLowerCase()=="a") hrefFlag = true;
			 */
			$.each(e.target.attributes, function() {
				if (this.name == "href")
					hrefFlag = true;
			});
			if (!hrefFlag) {
				var id = $(this).find(".data").attr("data");
				App_Tasks.navigate("task/" + id, {
					trigger : true
				});
			}
	});

	$('.gridster-portlets').on(
		"click",'.portlets-tasks-select',
		function(e) {
			
					e.stopPropagation();
					if ($(this).is(':checked')) {
						// Complete
						var taskId = $(this).attr('data');
						// var itemListView = new Base_Collection_View({ data :
						// Portlets_View.collection.get($(this).parents('.portlet_container').find('.portlets').attr('id')).get('tasksList'),
						// templateKey : 'portlets-tasks', individual_tag_name :
						// 'tr' });
						// complete_task(taskId, $(this));
						var column_pos = $(this).parentsUntil('.gs-w').last()
								.parent().find('.column_position').text()
								.trim();
						var row_pos = $(this).parentsUntil('.gs-w').last()
								.parent().find('.row_position').text().trim();
						var pos = column_pos + '' + row_pos;
						complete_task(
								taskId,
								App_Portlets.tasksCollection[parseInt(pos)].collection,
								$(this).closest('tr'));

						if ($(this).parentsUntil('table').last().find(
								'tr:visible').length == 1) {
							$(this)
									.parentsUntil('table')
									.parent()
									.parent()
									.html(
											'<div class="portlet-error-message">No tasks found.</div>');
						}
					}
	});

    $('.gridster-portlets').on("click",'.portlet-settings',function(e) {
		e.preventDefault();
		showPortletSettings(this.id);
	});
   
}

function initializeAddPortletsListeners(){
 $('.col-md-3').on("mouseenter",'.show_screeshot',function(e){
    	var p_name=$(this).attr('id');
    	var image;
    	var placement="right"
    		if(p_name=="FilterBased")
    			image="flatfull/img/dashboard_images/My-contacts.png";
    		else if(p_name=="EmailsOpened")
    			image="flatfull/img/dashboard_images/Email-opened.png";
    		else if(p_name=="PendingDeals")
    			image="flatfull/img/dashboard_images/Pending-Deals.png";
    		else if(p_name=="Agenda")
    			image="flatfull/img/dashboard_images/Events.png";
    		else if(p_name=="TodayTasks")
    			image="flatfull/img/dashboard_images/Task.png";
    		else if(p_name=="DealsByMilestone")
    				image="flatfull/img/dashboard_images/Milestone.png";
    		else if(p_name=="DealsFunnel")
    		{
    				image="flatfull/img/dashboard_images/Deals-Funnel.png";
    			placement="left";
    		}
    		else if(p_name=="GrowthGraph")
    		{
    			placement="left";
    				image="flatfull/img/dashboard_images/Tag-Graph.png";
    		}
    		else if(p_name=="CallsPerPerson")
    		{
    			placement="left";
    				image="flatfull/img/dashboard_images/Calls.png";
    		}
    		else if(p_name=="AgileCRMBlog")
    			image="flatfull/img/dashboard_images/Agile-Blog.png";
    		else if(p_name=="AccountDetails")
    			image="flatfull/img/dashboard_images/account-information.png";
    		else if(p_name=="TaskReport"){
    				placement="left";
    				image="flatfull/img/dashboard_images/Task-report.png";		
    			}
    		else if(p_name=="StatsReport")
    			image="flatfull/img/dashboard_images/stats.png";
    		else if(p_name=="Leaderboard")
    				image="flatfull/img/dashboard_images/Leaderboard.png";
    		else if(p_name=="RevenueGraph")
    		{
    			placement="left";
    			image="flatfull/img/dashboard_images/Revenue-graph.png";
    		}
    		else if(p_name=="UserActivities")
    		{
    			placement="left";
    			image="flatfull/img/dashboard_images/User-Activities.png";
    		}
    		else if(p_name=="MiniCalendar")
    		{
    			placement="left";
    			image="flatfull/img/dashboard_images/Mini-Calendar.jpg";
    		}
    		else if(p_name=="Campaignstats")
    			image="flatfull/img/dashboard_images/Campaign-stats.jpg";
    	$(this).popover({
    		"rel":"popover",
    		"trigger":"hover",
    		"placement":placement,
    		"html" : "true",
    		"content" : function(){
    			return '<img src='+image+'>';

    		}
    	});
    	$(this).popover('show');
    });

	}
/*
 * $("#add-portlet").live("click", function(e){ e.preventDefault();
 * this.Catalog_Portlets_View = new Base_Collection_View({ url :
 * '/core/api/portlets/default', restKey : "portlet", templateKey :
 * "portlets-add", sort_collection : false, individual_tag_name : 'div',
 * postRenderCallback : function(el){
 * if($('#deals',$('#portletStreamModal')).children().length==0)
 * $('#deals',$('#portletStreamModal')).parent().hide();
 * if($('#taksAndEvents',$('#portletStreamModal')).children().length==0)
 * $('#taksAndEvents',$('#portletStreamModal')).parent().hide();
 * if($('#userActivity',$('#portletStreamModal')).children().length==0)
 * $('#userActivity',$('#portletStreamModal')).parent().hide(); } });
 * 
 * this.Catalog_Portlets_View.appendItem = organize_portlets; //
 * this.Catalog_Portlets_View.collection.fetch(); // Show form modal
 * $('#portletStreamModal').modal('show'); // Add social network types template
 * $("#portletstreamDetails",$('#portletStreamModal')).html(this.Catalog_Portlets_View.el);
 * 
 * });
 */
/**
 * Makes the pending task as completed by calling complete_task function
 */
function hidePortletErrors(ele) {
	if ($('#' + ele.id).next().is(':visible'))
		$('#' + ele.id).next().hide();
}


function addWidgetToGridster(base_model) {
	var add_flag = true;
	if (gridster != undefined) {
		gridster.$widgets.each(function(index, widget) {
			if (widget.id == 'ui-id-' + base_model.get("column_position") + '-'
					+ base_model.get("row_position") + '')
				add_flag = false;
		});
		if (add_flag) {
			gridster.add_widget($('#ui-id-' + base_model.get("column_position")
					+ '-' + base_model.get("row_position")), base_model
					.get("size_x"), base_model.get("size_y"), base_model
					.get("column_position"), base_model.get("row_position"));
			gridster.set_dom_grid_height();
			window.scrollTo(0,
					((parseInt($(
							'#ui-id-' + base_model.get("column_position") + '-'
									+ base_model.get("row_position")).attr(
							'data-row')) - 1) * 200) + 5);
		}
	}
}
function getStartAndEndDatesOnDue(duration){
	var d = new Date();

	//Last 24 Hrs
	if(duration == "24-hours"){
		var hrs = (d.setMilliseconds(0)/1000)-(24*60*60);
		return hrs;
	}
	//Current time
	if(duration == "now")
		return (d.setMilliseconds(0)/1000);
	// Today
	if (duration == "1-day" || duration == "today"){
		getGMTTimeFromDate(d) / 1000;
	}
		
	
	// This week
	if (duration == "this-week" || duration == "this-week-start"){
		if(new Date().getDay()!=0)
			d.setDate(d.getDate() - (new Date().getDay()-1));
		else
			d.setDate(d.getDate() - (new Date().getDay()+6));
	}
	// This week end
	if (duration == "this-week-end"){
		if(new Date().getDay()!=0)
			d.setDate((d.getDate() - (new Date().getDay()-1))+7);
		else
			d.setDate((d.getDate() - (new Date().getDay()+6))+7);
	}
	//Last week start
	if(duration == "last-week" || duration == "last-week-start")
		d.setDate(d.getDate()-d.getDay()-6);
	
	//Lats week end
	if(duration == "last-week-end")
		d.setDate((d.getDate()-d.getDay())+1);
	
	// 1 Week ago
	if (duration == "1-week")
		d.setDate(d.getDate() - 6);
	
	// 1 Month ago
	if (duration == "1-month")
		d.setDate(d.getDate() - 29);
	
	// This month
	if (duration == "this-month" || duration == "this-month-start")
		d.setDate(1);
	
	//Last month start
	if(duration == "last-month" || duration == "last-month-start"){
		d.setDate(1);
		d.setMonth(d.getMonth()-1);
	}
	
	//Lats month end
	if(duration == "last-month-end"){
		d.setDate((d.getDate()-d.getDate())+1);
		d.setMonth(d.getMonth());
	}

	// Tomorrow
	if (duration == "TOMORROW")
		d.setDate(d.getDate() + 1);
	
	// Yesterday
	if (duration == "yesterday")
		d.setDate(d.getDate() - 1);
	
	// Last 2 days
	if (duration == "2-days")
		d.setDate(d.getDate() - 1);
	
	// next 7 days
	if (duration == "next-7-days")
		d.setDate(d.getDate() + 8);

	// next 7 days
	if (duration == "today-and-tomorrow")
		d.setDate(d.getDate() + 2);
	
	//this quarter start
	if(duration=="this-quarter-start" || duration=="this-and-next-quarter-start"){
		var currentMonth = d.getMonth();
		if(currentMonth<3)
			d.setMonth(0);
		else if(currentMonth>=3 && currentMonth<6)
			d.setMonth(3);
		else if(currentMonth>=6 && currentMonth<9)
			d.setMonth(6);
		else if(currentMonth>=9 && currentMonth<12)
			d.setMonth(9);
		d.setDate(1);
	}
	
	//this quarter end
	if(duration=="this-quarter-end"){
		var currentMonth = d.getMonth();
		if(currentMonth<3)
			d.setMonth(3);
		else if(currentMonth>=3 && currentMonth<6)
			d.setMonth(6);
		else if(currentMonth>=6 && currentMonth<9)
			d.setMonth(9);
		else if(currentMonth>=9 && currentMonth<12){
			d.setFullYear(d.getFullYear()+1);
			d.setMonth(0);
		}
		d.setDate(1);
	}
	
	//last quarter start
	if(duration=="last-quarter-start"){
		var currentMonth = d.getMonth();
		if(currentMonth<3){
			d.setFullYear(d.getFullYear()-1);
			d.setMonth(9);
		}
		else if(currentMonth>=3 && currentMonth<6)
			d.setMonth(0);
		else if(currentMonth>=6 && currentMonth<9)
			d.setMonth(3);
		else if(currentMonth>=9 && currentMonth<12)
			d.setMonth(6);
		d.setDate(1);
	}
	
	//last quarter end
	if(duration=="last-quarter-end"){
		var currentMonth = d.getMonth();
		if(currentMonth<3)
			d.setMonth(0);
		else if(currentMonth>=3 && currentMonth<6)
			d.setMonth(3);
		else if(currentMonth>=6 && currentMonth<9)
			d.setMonth(6);
		else if(currentMonth>=9 && currentMonth<12)
			d.setMonth(9);
		d.setDate(1);
	}
	
	// This month end
	if (duration == "this-month-end"){
		d.setDate(1);
		d.setMonth(d.getMonth()+1);
	}

	//next quarter start
	if(duration=="next-quarter-start"){
		var currentMonth = d.getMonth();
		if(currentMonth<3)
			d.setMonth(3);
		else if(currentMonth>=3 && currentMonth<6)
			d.setMonth(6);
		else if(currentMonth>=6 && currentMonth<9)
			d.setMonth(9);
		else if(currentMonth>=9 && currentMonth<12){
			d.setFullYear(d.getFullYear()+1);
			d.setMonth(0);
		}
		d.setDate(1);
	}
	
	//next quarter end
	if(duration=="next-quarter-end" || duration=="this-and-next-quarter-end"){
		var currentMonth = d.getMonth();
		if(currentMonth<3)
			d.setMonth(6);
		else if(currentMonth>=3 && currentMonth<6)
			d.setMonth(9);
		else if(currentMonth>=6 && currentMonth<9){
			d.setFullYear(d.getFullYear()+1);
			d.setMonth(0);
		}
		else if(currentMonth>=9 && currentMonth<12){
			d.setFullYear(d.getFullYear()+1);
			d.setMonth(3);
		}
		d.setDate(1);
	}

	//this year start
	if(duration=="this-year-start"){
		d.setMonth(d.getMonth()-d.getMonth());
		d.setDate(1);
	}
	
	//this year end
	if(duration=="this-year-end"){
		d.setFullYear(d.getFullYear()+1);
		d.setMonth(d.getMonth()-d.getMonth());
		d.setDate(1);
	}

	//next year start
	if(duration=="next-year-start"){
		d.setFullYear(d.getFullYear()+1);
		d.setMonth(d.getMonth()-d.getMonth());
		d.setDate(1);
	}
	
	//next year end
	if(duration=="next-year-end"){
		d.setFullYear(d.getFullYear()+2);
		d.setMonth(d.getMonth()-d.getMonth());
		d.setDate(1);
	}
		

	return (getGMTTimeFromDate(d) / 1000);
}
function getStartAndEndDatesEpochForPortlets(duration)
{
	var d = new Date();

	//Last 24 Hrs
	if(duration == "24-hours"){
		var hrs = (d.setMilliseconds(0)/1000)-(24*60*60);
		return hrs;
	}
	//Current time
	if(duration == "now")
		return (d.setMilliseconds(0)/1000);
	// Today
	if (duration == "1-day" || duration == "today"){
		getGMTTimeFromDate(d) / 1000;
	}
		
	
	// This week
	if (duration == "this-week" || duration == "this-week-start"){
		if(new Date().getDay()!=0)
			d.setDate(d.getDate() - (new Date().getDay()-1));
		else
			d.setDate(d.getDate() - (new Date().getDay()+6));
	}
	// This week end
	if (duration == "this-week-end"){
		if(new Date().getDay()!=0)
			d.setDate((d.getDate() - (new Date().getDay()-1))+7);
		else
			d.setDate((d.getDate() - (new Date().getDay()+6))+7);
	}
	//Last week start
	if(duration == "last-week" || duration == "last-week-start")
		d.setDate(d.getDate()-d.getDay()-6);
	
	//Lats week end
	if(duration == "last-week-end")
		d.setDate((d.getDate()-d.getDay())+1);
	
	// 1 Week ago
	if (duration == "1-week")
		d.setDate(d.getDate() - 6);
	
	// 1 Month ago
	if (duration == "1-month")
		d.setDate(d.getDate() - 29);
	
	// This month
	if (duration == "this-month" || duration == "this-month-start")
		d.setDate(1);
	
	//Last month start
	if(duration == "last-month" || duration == "last-month-start"){
		d.setDate(1);
		d.setMonth(d.getMonth()-1);
	}
	
	//Lats month end
	if(duration == "last-month-end"){
		d.setDate((d.getDate()-d.getDate())+1);
		d.setMonth(d.getMonth());
	}

	// Tomorrow
	if (duration == "TOMORROW")
		d.setDate(d.getDate() + 1);
	
	// Yesterday
	if (duration == "yesterday")
		d.setDate(d.getDate() - 1);
	
	// Last 2 days
	if (duration == "2-days")
		d.setDate(d.getDate() - 1);
	
	// next 7 days
	if (duration == "next-7-days")
		d.setDate(d.getDate() + 8);

	// next 7 days
	if (duration == "today-and-tomorrow")
		d.setDate(d.getDate() + 2);
	
	//this quarter start
	if(duration=="this-quarter-start" || duration=="this-and-next-quarter-start"){
		var currentMonth = d.getMonth();
		if(currentMonth<3)
			d.setMonth(0);
		else if(currentMonth>=3 && currentMonth<6)
			d.setMonth(3);
		else if(currentMonth>=6 && currentMonth<9)
			d.setMonth(6);
		else if(currentMonth>=9 && currentMonth<12)
			d.setMonth(9);
		d.setDate(1);
	}
	
	//this quarter end
	if(duration=="this-quarter-end"){
		var currentMonth = d.getMonth();
		if(currentMonth<3)
			d.setMonth(3);
		else if(currentMonth>=3 && currentMonth<6)
			d.setMonth(6);
		else if(currentMonth>=6 && currentMonth<9)
			d.setMonth(9);
		else if(currentMonth>=9 && currentMonth<12){
			d.setFullYear(d.getFullYear()+1);
			d.setMonth(0);
		}
		d.setDate(1);
	}
	
	//last quarter start
	if(duration=="last-quarter-start"){
		var currentMonth = d.getMonth();
		if(currentMonth<3){
			d.setFullYear(d.getFullYear()-1);
			d.setMonth(9);
		}
		else if(currentMonth>=3 && currentMonth<6)
			d.setMonth(0);
		else if(currentMonth>=6 && currentMonth<9)
			d.setMonth(3);
		else if(currentMonth>=9 && currentMonth<12)
			d.setMonth(6);
		d.setDate(1);
	}
	
	//last quarter end
	if(duration=="last-quarter-end"){
		var currentMonth = d.getMonth();
		if(currentMonth<3)
			d.setMonth(0);
		else if(currentMonth>=3 && currentMonth<6)
			d.setMonth(3);
		else if(currentMonth>=6 && currentMonth<9)
			d.setMonth(6);
		else if(currentMonth>=9 && currentMonth<12)
			d.setMonth(9);
		d.setDate(1);
	}
	
	// This month end
	if (duration == "this-month-end"){
		d.setDate(1);
		d.setMonth(d.getMonth()+1);
	}

	//next quarter start
	if(duration=="next-quarter-start"){
		var currentMonth = d.getMonth();
		if(currentMonth<3)
			d.setMonth(3);
		else if(currentMonth>=3 && currentMonth<6)
			d.setMonth(6);
		else if(currentMonth>=6 && currentMonth<9)
			d.setMonth(9);
		else if(currentMonth>=9 && currentMonth<12){
			d.setFullYear(d.getFullYear()+1);
			d.setMonth(0);
		}
		d.setDate(1);
	}
	
	//next quarter end
	if(duration=="next-quarter-end" || duration=="this-and-next-quarter-end"){
		var currentMonth = d.getMonth();
		if(currentMonth<3)
			d.setMonth(6);
		else if(currentMonth>=3 && currentMonth<6)
			d.setMonth(9);
		else if(currentMonth>=6 && currentMonth<9){
			d.setFullYear(d.getFullYear()+1);
			d.setMonth(0);
		}
		else if(currentMonth>=9 && currentMonth<12){
			d.setFullYear(d.getFullYear()+1);
			d.setMonth(3);
		}
		d.setDate(1);
	}

	//this year start
	if(duration=="this-year-start"){
		d.setMonth(d.getMonth()-d.getMonth());
		d.setDate(1);
	}
	
	//this year end
	if(duration=="this-year-end"){
		d.setFullYear(d.getFullYear()+1);
		d.setMonth(d.getMonth()-d.getMonth());
		d.setDate(1);
	}

	//next year start
	if(duration=="next-year-start"){
		d.setFullYear(d.getFullYear()+1);
		d.setMonth(d.getMonth()-d.getMonth());
		d.setDate(1);
	}
	
	//next year end
	if(duration=="next-year-end"){
		d.setFullYear(d.getFullYear()+2);
		d.setMonth(d.getMonth()-d.getMonth());
		d.setDate(1);
	}

	console.log((getUTCMidNightEpochFromDate(d) / 1000));

	return (getUTCMidNightEpochFromDate(d) / 1000);
}


/**
 * Convert time in human readable format.
 */
function displayTimeAgo(elmnt)
{
	head.js('lib/jquery.timeago.js', function()
	{
		$(".time-ago", elmnt).timeago();
	});
	
	console.log($("article.stream-item").parent());
	
	$("article.stream-item").parent().addClass("social-striped");
}