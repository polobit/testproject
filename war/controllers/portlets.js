/**
 * Creates backbone router to access preferences of the user portlets
 */
var PortletsRouter = Backbone.Router
								.extend({

												routes : {
												"portlets" 						: "portlets"
												},
												
												portlets : function(){
													head.js(LIB_PATH + 'jscore/handlebars/handlebars-helpers.js', function(){
														var el = $(getTemplate('portlets', {}));
														$("#content").html(el);
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
	obj.portlet_type=portlet_type;
	obj.column_position=1;
	obj.row_position=$('#col-0').children().length+1;
	if(portlet_type=="CONTACTS" && p_name=="FilterBased")
		json['filter']="contacts";
	else if(portlet_type=="CONTACTS" && p_name=="EmailsOpened")
		json['duration']="2-days";
	else if(portlet_type=="CONTACTS" && p_name=="EmailsSent")
		json['duration']="1-day";
	else if(portlet_type=="CONTACTS" && p_name=="GrowthGraph"){
		json['tags']="";
		json['frequency']='daily';
		json['start-date']=new Date(curDate.getFullYear(),curDate.getMonth(),curDate.getDate()-6,0,0,0).getTime();
		json['end-date']=new Date(curDate.getFullYear(),curDate.getMonth(),curDate.getDate(),0,0,0).getTime();
	}
	else if(portlet_type=="DEALS" && p_name=="PendingDeals"){
		json['deals']="all-deals";
		json['due-date']=Math.round((new Date()).getTime()/1000);
	}
	else if(portlet_type=="DEALS" && (p_name=="DealsByMilestone" || p_name=="DealsFunnel")){
		json['deals']="all-deals";
		json['track']=0;
		json['due-date']=Math.round((new Date()).getTime()/1000);
	}else if(portlet_type=="DEALS" && p_name=="ClosuresPerPerson"){
		json['group-by']="number-of-deals";
		json['due-date']=Math.round((new Date()).getTime()/1000);
	}else if(portlet_type=="DEALS" && p_name=="DealsWon")
		json['duration']="1-week";
	else if(portlet_type=="DEALS" && p_name=="DealsAssigned")
		json['duration']="1-day";
	else if(portlet_type=="CONTACTS" && p_name=="CallsPerPerson"){
		json['group-by']="number-of-calls";
		json['duration']="1-day";
	}
	var portlet = new BaseModel();
	portlet.url = 'core/api/portlets/addPortlet';
	portlet.set({ "prefs" : JSON.stringify(json) }, { silent : true });
	portlet.save(obj, {
        success: function (data) {
        	hidePortletsPopup();
        	var model=data.toJSON();
        	//var el = $(getTemplate('portlets-model', model));
        	if($('#zero-portlets').is(':visible'))
        		$('#zero-portlets').hide();
        	if($('#no-portlets').is(':visible'))
    			$('#no-portlets').hide();
        	Portlets_View.collection.add(model);
        	
        	//move the scroll bar to bottom for showing the newly added portlet
        	window.scrollTo(0,document.body.scrollHeight);
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
        	
        	//move the scroll bar to bottom for showing the newly added portlet
        	window.scrollTo(0,document.body.scrollHeight)
        }});
}
function hidePortletsPopup(){
	$('#portletStreamModal').modal('hide');
	$('.modal-backdrop').hide();
}
function deletePortlet(el){
	if(confirm("Do you want delete this portlet")){
		/*var portlet = {};
		for(var i=0;i<Portlets_View.collection.models.length;i++){
			if(Portlets_View.collection.models[i].id==el.id.split("-close")[0]){
				portlet=Portlets_View.collection.models[i];
			}
		}*/
		var portlet = Portlets_View.collection.get(el.id.split("-close")[0]);
		/*
		 * Sends Delete request with portlet name as path parameter, and on
		 * success fetches the portlets to reflect the changes is_added, to show
		 * add portlet in the view instead of delete option
		 */
		$.ajax({ type : 'DELETE', url : '/core/api/portlets/' + portlet.get("id"), contentType : "application/json; charset=utf-8",

		success : function(data){
			Portlets_View.collection.remove(portlet);
			//$('#'+el.parentNode.parentNode.parentNode.parentNode.parentNode.id).remove();
			$('#'+el.id.split("-close")[0]).parent().remove();
			if($('#col-0').children(':visible').length==0 && $('#col-1').children(':visible').length==0 && $('#col-2').children(':visible').length==0)
				$('#no-portlets').show();
			/*head.js(LIB_PATH + 'jscore/handlebars/handlebars-helpers.js', function(){
				var el = $(getTemplate('portlets', {}));
				$("#content").html(el);
				loadPortlets(el);
			});*/
		}, dataType : 'json' });
	}
}
$("#add-portlet").live("click", function(e){
	this.Catalog_Portlets_View = new Base_Collection_View({ url : '/core/api/portlets/default', restKey : "portlet", templateKey : "portlets-add",
		sort_collection : false, individual_tag_name : 'div', postRenderCallback : function(el){
			
		} });

	this.Catalog_Portlets_View.appendItem = organize_portlets;

	// 
	this.Catalog_Portlets_View.collection.fetch();

	// Add social network types template
	$("#streamDetails").html(this.Catalog_Portlets_View.el);

	// Show form modal
	$('#portletStreamModal').modal('show');
});
$('#portlets-contacts-model-list > tr, #portlets-companies-model-list > tr').live('click', function(e){
	var id = $(this).find(".data").attr("data");
	App_Contacts.navigate("contact/" + id, { trigger : true });
});
$('#portlets-opportunities-model-list > tr').live('click', function(e) {
	//e.preventDefault();
	updateDeal($(this).data());
});
$('#portlets-events-model-list > tr').live('click', function(e){
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
   	
 // Show edit modal for the event
    $("#updateActivityModal").modal('show');
   	return false;
});
$('#portlets-tasks-model-list > tr').live('click', function(e) {

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
	showNoteOnForm("updateTaskForm", value.notes);
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
				complete_task(taskId,tasksCollection.collection,$(this).closest('tr'));
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