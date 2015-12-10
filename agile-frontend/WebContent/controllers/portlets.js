/**
 * Creates backbone router to access preferences of the user portlets
 */
var PortletsRouter = Backbone.Router
								.extend({

												routes : {
												//"portlets" 						: "portlets"
												},
												
												portlets : function(){
													head.js(LIB_PATH + 'jscore/handlebars/handlebars-helpers.js',
															LIB_PATH + 'lib/jquery.gridster.js',function(){
														var el = $(getTemplate('portlets', {}));
														$("#content").html(el);
														if (IS_FLUID){
															$('#content').find('div.row').removeClass('row').addClass('row-fluid');
														}
														loadPortlets(el);
													});
												}
								});
//For adding new portlets
function addNewPortlet(portlet_type,p_name){
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
	else if(p_name=="TaskReport")
		obj.name="Task Report";
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
	}
	else if(portlet_type=="RSS" && p_name=="AgileCRMBlog")
		obj.size_y=2;
	var portlet = new BaseModel();
	portlet.url = 'core/api/portlets/addPortlet';
	portlet.set({ "prefs" : JSON.stringify(json) }, { silent : true });
	var model;
	var scrollPosition;
	portlet.save(obj, {
        success: function (data) {
        	hidePortletsPopup();
        	model=data.toJSON();
        	//var el = $(getTemplate('portlets-model', model));
        	if($('#zero-portlets').is(':visible'))
        		$('#zero-portlets').hide();
        	if($('#no-portlets').is(':visible'))
    			$('#no-portlets').hide();
        	Portlets_View.collection.add(model);
        	
        	scrollPosition = ((parseInt($('#ui-id-'+model.column_position+'-'+model.row_position).attr('data-row'))-1)*200)+5;
        	//move the scroll bar for showing the newly added portlet
        	window.scrollTo(0,scrollPosition);
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
        }});
	/*setTimeout(function(){
		gridster.add_widget($('#ui-id-'+model.column_position+'-'+model.row_position),model.size_x,model.size_y,model.column_position,model.row_position);
		gridster.set_dom_grid_height();
		window.scrollTo(0,scrollPosition);
	},1000);*/
}
function hidePortletsPopup(){
	$('#portletStreamModal').modal('hide'); 
	$('.modal-backdrop').hide();
}
function deletePortlet(el){
	var p_id = el.id.split("-close")[0];
	$('#portletDeleteModal').modal('show');
	$('#portletDeleteModal > .modal-footer > .save-modal').attr('id',p_id);
	$('#portletDeleteModal > .modal-body').html("Are you sure you want to delete Dashlet - "+$('#'+p_id).parent().find('.portlet_header > .portlet_header_name').text().trim()+"?");
}
$('.portlet-delete-modal').live("click", function(e){ 
	e.preventDefault(); 
	var portlet = Portlets_View.collection.get($(this).attr('id'));
	/*
	 * Sends Delete request with portlet name as path parameter, and on
	 * success fetches the portlets to reflect the changes is_added, to show
	 * add portlet in the view instead of delete option
	 */
	$.ajax({ type : 'DELETE', url : '/core/api/portlets/' + portlet.get("id"), contentType : "application/json; charset=utf-8",

	success : function(data){
		Portlets_View.collection.remove(portlet);
		//$('#'+el.parentNode.parentNode.parentNode.parentNode.parentNode.id).remove(); $('body').off().on('click', '#import-cancel'
		gridster.remove_widget($('#'+portlet.get("id")).parent(),false);
		setTimeout(function(){
			gridster.$changed.attr('id','ui-id-'+gridster.$changed.attr('data-col')+'-'+gridster.$changed.attr('data-row'));
		},500);
		$('#'+portlet.get("id")).parent().remove();
		
		
		if($('.gridster-portlets > div').length==0)
			$('#no-portlets').show();
		$('#portletDeleteModal').modal('hide');
	}, dataType : 'json' });
});
$("#add-portlet").live("click", function(e){
	e.preventDefault();
	this.Catalog_Portlets_View = new Base_Collection_View({ url : '/core/api/portlets/default', restKey : "portlet", templateKey : "portlets-add",
		sort_collection : false, individual_tag_name : 'div', postRenderCallback : function(el){
			if($('#deals',$('#portletStreamModal')).children().length==0)
				$('#deals',$('#portletStreamModal')).parent().hide();
			if($('#taksAndEvents',$('#portletStreamModal')).children().length==0)
				$('#taksAndEvents',$('#portletStreamModal')).parent().hide();
			if($('#userActivity',$('#portletStreamModal')).children().length==0)
				$('#userActivity',$('#portletStreamModal')).parent().hide();
		} });

	this.Catalog_Portlets_View.appendItem = organize_portlets;

	// 
	this.Catalog_Portlets_View.collection.fetch();
	
	// Show form modal
	$('#portletStreamModal').modal('show');

	// Add social network types template
	$("#portletstreamDetails",$('#portletStreamModal')).html(this.Catalog_Portlets_View.el);
	
});
$('#portlets-contacts-model-list > tr, #portlets-companies-model-list > tr, #portlets-contacts-email-opens-model-list > tr').live('click', function(e){
	var id = $(this).find(".data").attr("data");
	App_Contacts.navigate("contact/" + id, { trigger : true });
});
$('#portlets-opportunities-model-list > tr').live('click', function(e) {
	/*if(e.target.attributes[0].name!="href"){
		e.preventDefault();
		App_Portlets.currentPosition = ''+$(this).parents('.gs-w').find('.column_position').text().trim()+''+$(this).parents('.gs-w').find('.row_position').text().trim();
		updateDeal($(this).data());
	}*/
	if(e.target.attributes[0].name!="href"){
		var id = $(this).find(".data").attr("data");
		App_Deal_Details.navigate("deal/" + id, { trigger : true });
	}
});
$('#portlets-events-model-list > tr').live('click', function(e){
	App_Portlets.currentPosition = ''+$(this).parents('.gs-w').find('.column_position').text().trim()+''+$(this).parents('.gs-w').find('.row_position').text().trim();
	var id = $(this).find(".data").attr("data");
	var model = $(this).data().collection.get(id);
   	if(isNaN(id))
   		return;
   	// Deserialize
   	deserializeForm(model.toJSON(), $("#updateActivityForm"));
   	
   	// Set time for update Event
    $('#update-event-time-1').val((new Date(model.get('start')*1000).getHours() < 10 ? "0" : "") + new Date(model.get('start')*1000).getHours() + ":" + (new Date(model.get('start')*1000).getMinutes() < 10 ? "0" : "") +new Date(model.get('start')*1000).getMinutes());
    $('#update-event-time-2').val((new Date(model.get('end')*1000).getHours() < 10 ? "0" : "") + new Date(model.get('end')*1000).getHours() + ":" + (new Date(model.get('end')*1000).getMinutes() < 10 ? "0" : "") + new Date(model.get('end')*1000).getMinutes());
   
 // Set date for update Event
    var dateFormat = 'mm/dd/yyyy';
    $("#update-event-date-1").val((new Date(model.get('start')*1000)).format(dateFormat));
    $("#update-event-date-2").val((new Date(model.get('end')*1000)).format(dateFormat));
    
   	// hide end date & time for all day events
    if(event.allDay)
    {
    	$("#update-event-date-2").closest('.row').hide();
    	$('#update-event-time-1').closest('.control-group').hide();
    }
    else 
    {
    	$('#update-event-time-1').closest('.control-group').show();
    	$("#update-event-date-2").closest('.row').show();
    }
   	
    // Fills owner select element 
	populateUsersInUpdateActivityModal(model.toJSON());
	
 // Show edit modal for the event
    $("#updateActivityModal").modal('show');
   	return false;
});
$('#portlets-tasks-model-list > tr').live('click', function(e) {
	/*App_Portlets.currentPosition = ''+$(this).parents('.gs-w').find('.column_position').text().trim()+''+$(this).parents('.gs-w').find('.row_position').text().trim();
	var value = $(this).data().toJSON();
	deserializeForm(value, $("#updateTaskForm"));
	$("#updateTaskModal").modal('show');
	// Fills owner select element
	populateUsers("owners-list", $("#updateTaskForm"), value, 'taskOwner',
			function(data) {
				$("#updateTaskForm").find("#owners-list").html(data);
				if (value.taskOwner) {
					$("#owners-list", $("#updateTaskForm")).find(
							'option[value=' + value['taskOwner'].id + ']')
							.attr("selected", "selected");
				}
				$("#owners-list", $("#updateTaskForm")).closest('div').find('.loading-img').hide();
			});
	
	// Add notes in task modal
	showNoteOnForm("updateTaskForm", value.notes);*/
	if(e.target.attributes[0].name!="href"){
		var id = $(this).find(".data").attr("data");
		App_Tasks.navigate("task/" + id, { trigger : true });
	}
});
/**
 * Makes the pending task as completed by calling complete_task function
 */
$('.portlets-tasks-select').live('click', function(e) {
			e.stopPropagation();
			if ($(this).is(':checked')) {
				// Complete
				var taskId = $(this).attr('data');
				//var itemListView = new Base_Collection_View({ data : Portlets_View.collection.get($(this).parents('.portlet_container').find('.portlets').attr('id')).get('tasksList'), templateKey : 'portlets-tasks', individual_tag_name : 'tr' });
				// complete_task(taskId, $(this));
				var column_pos = $(this).parentsUntil('.gs-w').last().parent().find('.column_position').text().trim();
				var row_pos = $(this).parentsUntil('.gs-w').last().parent().find('.row_position').text().trim();
				var pos = column_pos+''+row_pos;
				complete_task(taskId,App_Portlets.tasksCollection[parseInt(pos)].collection,$(this).closest('tr'));
				
				if($(this).parentsUntil('table').last().find('tr:visible').length==1){
					$(this).parentsUntil('table').parent().parent().html('<div class="portlet-error-message">No tasks found.</div>');
				}
			}
});
function hidePortletErrors(ele){
	if($('#'+ele.id).next().is(':visible'))
		$('#'+ele.id).next().hide();
}
$('.portlet-settings').live('click',function(e){
	e.preventDefault();
	showPortletSettings(this.id);
});
function addWidgetToGridster(base_model){
	var add_flag = true;
	if(gridster!=undefined){
		gridster.$widgets.each(function(index,widget){
			if(widget.id=='ui-id-'+base_model.get("column_position")+'-'+base_model.get("row_position")+'')
				add_flag=false;
		});
		if(add_flag){
			gridster.add_widget($('#ui-id-'+base_model.get("column_position")+'-'+base_model.get("row_position")),base_model.get("size_x"),base_model.get("size_y"),base_model.get("column_position"),base_model.get("row_position"));
			gridster.set_dom_grid_height();
			window.scrollTo(0,((parseInt($('#ui-id-'+base_model.get("column_position")+'-'+base_model.get("row_position")).attr('data-row'))-1)*200)+5);
		}
	}
}
function getStartAndEndDatesOnDue(duration){
	var d = new Date();

	// Today
	if (duration == "1-day" || duration == "today")
		console.log(getGMTTimeFromDate(d) / 1000);
	
	// This week
	if (duration == "this-week"){
		if(new Date().getDay()!=0)
			d.setDate(d.getDate() - (new Date().getDay()-1));
		else
			d.setDate(d.getDate() - (new Date().getDay()+6));
	}
	
	// 1 Week ago
	if (duration == "1-week")
		d.setDate(d.getDate() - 6);
	
	// 1 Week ago
	if (duration == "1-month")
		d.setDate(d.getDate() - 29);
	
	// This month
	if (duration == "this-month")
		d.setDate(1);

	// Tomorrow
	if (duration == "TOMORROW")
		d.setDate(d.getDate() + 1);
	
	// Yesterday
	if (duration == "yesterday")
		d.setDate(d.getDate() - 1);
	
	// Last 2 days
	if (duration == "2-days")
		d.setDate(d.getDate() - 1);

	console.log((getGMTTimeFromDate(d) / 1000));

	return (getGMTTimeFromDate(d) / 1000);
}
