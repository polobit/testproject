
var itemCollection;
var itemCollection1;
var tasksCollection;
function organize_portlets(base_model){

	var itemView = new Base_List_View({ model : base_model, template : this.options.templateKey + "-model", tagName : 'div', });

	// Get portlet type from model (portlet object)
	var portlet_type = base_model.get('portlet_type');
	
	/*
	 * Appends the model (portlet) to its specific div, based on the portlet_type
	 * as div id (div defined in portlet-add.html)
	 */
	var container_id = "";

	if (portlet_type == "CONTACTS")
		   container_id = "contacts";
	if (portlet_type == "DEALS")
		   container_id = "deals";
	if (portlet_type == "TASKSANDEVENTS")
		   container_id = "taksAndEvents";
	if (portlet_type == "USERACTIVITY")
		   container_id = "userActivity";
	if (portlet_type == "RSS")
		   container_id = "rssFeed";
	if (portlet_type == "ACCOUNT")
		   container_id = "accountInfo";

	// Append Item View 
	$('#' + container_id, this.el).append($(itemView.render().el).addClass('col-md-3 col-sm-6 col-xs-12'));
}

function set_p_portlets(base_model){

	portlet_utility.getOuterViewOfPortlet(base_model, this.el);

	portlet_utility.getInnerViewOfPortlet(base_model, this.el);
	
}

function setPortletContentHeight(base_model){
	if(base_model.get("name")=="Stats Report"){

		var $resize_ele = $('#' + base_model.get("id")).parent().find('.stats_report_portlet');
		var size_y = base_model.get("size_y"), resized_val =0;

		switch(size_y){
			case "1" : {
				resized_val = (size_y * 200);	
				break;
			}		
			case "2" : {
				resized_val = (size_y*200) + 10;	
				break;
			}
			case "3" : {
				resized_val = (size_y*200) + 20;	
				break;
			}
		}

		var css = {
			 "overflow-x": "hidden", "overflow-y": "hidden", 
			 "height": resized_val + "px", "max-height": resized_val + "px"
		}

		$resize_ele.css(css);

	}
	if(base_model.get("name")=="Mini Calendar"){
		if(base_model.get("size_y")==1){
			$('#'+base_model.get("id")).parent().find('.portlet_body_calendar').css("height",(base_model.get("size_y")*200)+"px");
			$('#'+base_model.get("id")).parent().find('.portlet_body_calendar').css("max-height",(base_model.get("size_y")*200)+"px");
		}else if(base_model.get("size_y")==2){
			$('#'+base_model.get("id")).parent().find('.portlet_body_calendar').css("height",(base_model.get("size_y")*200)+25+"px");
			$('#'+base_model.get("id")).parent().find('.portlet_body_calendar').css("max-height",(base_model.get("size_y")*200)+25+"px");
		}else if(base_model.get("size_y")==3){
			$('#'+base_model.get("id")).parent().find('.portlet_body_calendar').css("height",(base_model.get("size_y")*200)+50+"px");
			$('#'+base_model.get("id")).parent().find('.portlet_body_calendar').css("max-height",(base_model.get("size_y")*200)+50+"px");
		}
	}
	else{
		if(base_model.get("size_y")==1){
			$('#'+base_model.get("id")).parent().find('.portlet_body').css("height",(base_model.get("size_y")*200)-45+"px");
			$('#'+base_model.get("id")).parent().find('.portlet_body').css("max-height",(base_model.get("size_y")*200)-45+"px");
		}else if(base_model.get("size_y")==2){
			$('#'+base_model.get("id")).parent().find('.portlet_body').css("height",(base_model.get("size_y")*200)+25-45+"px");
			$('#'+base_model.get("id")).parent().find('.portlet_body').css("max-height",(base_model.get("size_y")*200)+25-45+"px");
		}else if(base_model.get("size_y")==3){
			$('#'+base_model.get("id")).parent().find('.portlet_body').css("height",(base_model.get("size_y")*200)+50-45+"px");
			$('#'+base_model.get("id")).parent().find('.portlet_body').css("max-height",(base_model.get("size_y")*200)+50-45+"px");
		}
		
		$('#'+base_model.get("id")).parent().find('.portlet_body').css("overflow-x","hidden");
		$('#'+base_model.get("id")).parent().find('.portlet_body').css("overflow-y","auto");
	}
}

function getPortletsCurrencySymbol(){
	var value = ((CURRENT_USER_PREFS.currency != null) ? CURRENT_USER_PREFS.currency : "USD-$");
	var symbol = ((value.length < 4) ? "$" : value.substring(4, value.length));
	return symbol;
}

function getNumberWithCommasForPortlets(value){
	value = parseFloat(value);
	value = Math.round(value);
	if(value==0)
		return value;

	if (value)
		return value.toFixed(2).toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",").replace('.00', '');
}

function getPortletsTimeConversion(diffInSeconds){
	if(!diffInSeconds)
		return;

	var duration='';
	 
	var days = Math.floor(diffInSeconds/(24*60*60));
	var hrs = Math.floor((diffInSeconds % (24*60*60))/(60*60));
	var mins = Math.floor(((diffInSeconds % (24*60*60)) % (60*60))/60);
	var secs = Math.floor(((diffInSeconds % (24*60*60)) % (60*60))%60);
	
	if(hrs!=0)
		duration += ''+((days*24)+hrs)+'h';
	if(mins!=0)
		duration += ' '+mins+'m';
	if(secs!=0)
		duration += ' '+secs+'s';

	return duration;
}

function getPortletNormalName(name){

	if (!name)
		return;
	
	var name_json = { "HIGH" : "High", "LOW" : "Low", "NORMAL" : "Normal", "EMAIL" : "Email", "CALL" : "Call", "SEND" : "Send", "TWEET" : "Tweet",
			"FOLLOW_UP" : "Follow Up", "MEETING" : "Meeting", "MILESTONE" : "Milestone", "OTHER" : "Other", "YET_TO_START" : "Yet To Start",
			"IN_PROGRESS" : "In Progress", "COMPLETED" : "Completed", "TODAY" : "Today", "TOMORROW" : "Tomorrow", "OVERDUE" : "Overdue", "LATER" : "Later" };

	name = name.trim();
	
	return (name_json[name] ? name_json[name] : name);
	
}

function append_activity(base_model)
{

	var itemView = new Base_List_View({ model : base_model, "view" : "inline", template : this.options.templateKey + "-model"});

	// add to the right box - overdue, today, tomorrow etc.
	var createdtime = get_activity_created_time(base_model.get('time'));

	// Today
	if (createdtime == 0)
	{
		$('#earllier',this.el).show();
		$('#next-week-heading', this.el).show();
		var heading = $('#today-heading', this.el);

		$('#today-activity', this.el).append(itemView.render().el);
		$('#today-activity', this.el).parent('table').css("display", "block");
		$('#today-activity', this.el).show();

		$('#today-heading', this.el).show();
	}

	if (createdtime == -1)
	{
		$('#earllier',this.el).show();
		$('#next-week-heading', this.el).show();
		var heading = $('#tomorrow-heading', this.el);

		$('#tomorrow-activity', this.el).append(itemView.render().el);
		$('#tomorrow-activity', this.el).parent('table').css("display", "block");
		$('#tomorrow-activity', this.el).show();

		heading.show();
	}
	if (createdtime < -1)
	{

		$('#next-week-activity', this.el).append(itemView.render().el);
		$('#next-week-activity', this.el).parent('table').css("display", "block");
		$('#next-week-activity', this.el).show();
		
	}
}