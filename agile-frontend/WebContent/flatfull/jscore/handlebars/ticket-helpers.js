/** Start of ticketing handlebars * */
Handlebars.registerHelper('is_filtered_ticket', function(options) {

	if (Ticket_Filter_ID)
		return options.fn(this);

	return options.inverse(this);
});

Handlebars.registerHelper('get_ticket_filter_id', function(options) {

	return Ticket_Filter_ID;
});

Handlebars.registerHelper('ticket_collection_exists', function(options) {

	if (App_Ticket_Module.ticketsCollection
			&& App_Ticket_Module.ticketsCollection.collection
			&& App_Ticket_Module.ticketsCollection.collection.length > 0)
		return options.fn(this);

	return options.inverse(this);
});

Handlebars.registerHelper('get_ticket_id', function(action_type, options) {
	return Tickets.get_next_prev_ticket_id(action_type);
});

Handlebars.registerHelper('get_feedback', function(feedback_rating,value,options) {
			
			parseInt(feedback_rating);
			if(feedback_rating >= value )
				return "/img/star-on.png";		
			return "/img/star-off.png";	
	
});

Handlebars.registerHelper('is_helpdesk_acl_enabled',function(options){
	
	if(CURRENT_DOMAIN_USER.newMenuScopes.indexOf("HELPDESK") != -1){

		return options.inverse(this);
	}

	return options.fn(this);

});

Handlebars.registerHelper('calculate_due_date', function(due_date, options) {
	var currentEpoch = new Date().getTime();

	if (due_date < currentEpoch) {

		return '{{agile_lng_translate "deals" "overdue-by"}} '+ Ticket_Utils.dateDiff(currentEpoch, due_date);
	}

	return '{{agile_lng_translate "deals" "due-in"}} ' + Ticket_Utils.dateDiff(currentEpoch, due_date);
});

Handlebars.registerHelper('getInitials', function(name, options) {

	return Ticket_Utils.getInitials(name);
});

Handlebars.registerHelper('ticket_contact_exists', function(options) {

	if(Ticket_Utils.Current_Ticket_Contact
		&& !($.isEmptyObject(Ticket_Utils.Current_Ticket_Contact.toJSON())))
		return options.fn(this);

	return options.inverse(this);
});

Handlebars.registerHelper('get_contact_image', function(width)
{ 	
	if(Ticket_Utils.Current_Ticket_Contact
		&& !($.isEmptyObject(Ticket_Utils.Current_Ticket_Contact.toJSON()))){
		
		var contact = Ticket_Utils.Current_Ticket_Contact.toJSON();

		var items = contact.properties;

		var agent_image = getPropertyValue(items, "image");

		if (agent_image)
			return agent_image;

		var email = getPropertyValue(items, "email");

		var img = DEFAULT_GRAVATAR_url;
		var backup_image = "&d=404\" ";
		// backup_image="";
		var initials = '';
		try
		{
			// if(!isIE())
			initials = text_gravatar_initials(items);
		}
		catch (e)
		{
			console.log(e);
		}

		if (initials.length == 0)
			backup_image = "&d=" + DEFAULT_GRAVATAR_url + "\" ";

		var data_name =  '';
		data_name = "onLoad=\"image_load(this)\" onError=\"image_error(this)\"_data-name=\"" + initials;
		
		var email = getPropertyValue(items, "email");

		if (email)
			return new Handlebars.SafeString('https://secure.gravatar.com/avatar/' + Agile_MD5(email) + '.jpg?s=' + width + backup_image + data_name);
	}

	return new Handlebars.SafeString('https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + '' + backup_image + data_name);
});

Handlebars
		.registerHelper(
				'get_due_date_badge',
				function(due_date, options) {

					var currentEpoch = new Date().getTime();

					if (due_date < currentEpoch) {

						return '<span class="label bg-danger first-letter-cap inline-block" title="{{agile_lng_translate "deals" "overdue-by"}} '
								+ Ticket_Utils.dateDiff(currentEpoch, due_date)
								+ '">{{agile_lng_translate "tasks" "Overdue"}}</span>';
					}

					return '<span class="label bg-light first-letter-cap inline-block">{{agile_lng_translate "deals" "due-in"}} '
							+ Ticket_Utils.dateDiff(currentEpoch, due_date)
							+ '</span>';
				});

Handlebars.registerHelper('get_current_ticket_filter', function(options) {
	return Ticket_Filter_ID;
});

Handlebars.registerHelper('contains_string', function(value, target, options) {
	if (target.search(value) != -1)
		return options.fn(this);

	return options.inverse(this);
});

Handlebars.registerHelper('array_contains', function(array, obj, options) {
	if (array.indexOf(obj) != -1)
		return options.fn(this);

	return options.inverse(this);
});

Handlebars.registerHelper('is_labels_collection_empty', function(options) {

	if (!Ticket_Labels.labelsCollection || Ticket_Labels.labelsCollection.toJSON().length == 0 )
		return options.fn(this);

	return options.inverse(this);

});

Handlebars.registerHelper('selected_all_tickets', function(options) {

	if(Ticket_Bulk_Ops.selected_all_filter_tickets)
		return options.fn(this);

	return options.inverse(this);
});


Handlebars.registerHelper('get_ticket_labels_from_ids', function(labels,
		object, options) {

	if(!Ticket_Labels.labelsCollection || !labels)
		return;

	var newLabelJSON = {};
	$.each(Ticket_Labels.labelsCollection.toJSON(), function(index, eachLabel) {
		newLabelJSON[eachLabel.id] = eachLabel;
	});

	var newLabels = [];
	$.each(labels, function(index, value) {

		if (newLabelJSON[value])
			newLabels.push(newLabelJSON[value]);

	});

	object["labelsJSON"] = newLabels;

	return options.fn(object);

});

/**
Handlebars.registerHelper('get_allowed_canned_responses_array', function(labels, object, options) {

	var allowedCannedResponses = [];

	if(!Ticket_Canned_Response.cannedResponseCollection)
		return;

	$.each(Ticket_Canned_Response.cannedResponseCollection.toJSON(), function(index, eachCannedResponse){

		     cannedResponseLabels = eachCannedResponse.labels;

		     var isAllowed = (cannedResponseLabels.length == 0) ? false : true;

		     for (var i = 0; i < cannedResponseLabels.length; i++) {
				if($.inArray(cannedResponseLabels[i], labels) == -1){
		     		isAllowed = false;
		     		break;
		     	}
			}

		     if(isAllowed)
		     	allowedCannedResponses.push(eachCannedResponse);
	});

	object["allowed_canned_responses"] = allowedCannedResponses;
	return options.fn(object);

});
*/

Handlebars.registerHelper('get_label_from_label_id', function(id, options) {

	if(!Ticket_Labels.labelsCollection || !id)
		return;

	for (var i = 0; i < Ticket_Labels.labelsCollection.toJSON().length; i++) {
		var eachLabel = Ticket_Labels.labelsCollection.toJSON()[i];
		if([eachLabel.id] == id)
		  return eachLabel.label;
	};

	 return;
	
});

Handlebars.registerHelper('compile_template', function(source, data, options) {

	var template = Handlebars.compile(source);
			
	return template(data);

});

Handlebars.registerHelper('get_template', function(templateName, context, options) {

	return getTemplate(templateName, context);

});
/*
Handlebars.registerHelper('get_ticket_rows', function(ticket_model, options) {

	var selected_columns = CURRENT_DOMAIN_USER.helpdeskSettings.choosed_columns, tr_ele = '';

	for(var i=0; i< selected_columns.length; i++){

		var td_ele = '<td  class="first-letter-cap open-ticket p-l-none">';
		switch(selected_columns[i]){

			case 'id':
				td_ele += '<div class="text-ellipsis">#'+ ticket_model.id +'</div>';
				break;
			case 'subject':
				td_ele += '<div class="text-ellipsis width-15em">'+ ticket_model.subject +'</div>';
				break;
			case 'requester_name':
				td_ele += '<div class="text-ellipsis width-9em">'+ ticket_model.requester_name +'</div>';
				break;
			case 'requester_email':
				td_ele += '<div class="text-ellipsis width-9em">'+ ticket_model.requester_email +'</div>';
				break;
			case 'created_date':
				td_ele += ticket_model.created_date;
				break;
			case 'due_date':{

				var due_date = ticket_model.due_date, due_txt = '-';
				var currentEpoch = new Date().getTime();

				if(due_date && due_date > 0)
					if (due_date < currentEpoch)
						due_txt = 'Overdue by ' + Ticket_Utils.dateDiff(currentEpoch, due_date);
					else
						due_txt = 'Due in ' + Ticket_Utils.dateDiff(currentEpoch, due_date);

				td_ele += due_txt;
				
				break;
			}
			case 'assigned_date':
				td_ele += ticket_model.assigned_time;
				break;
			case 'last_updated_date':
				td_ele += ticket_model.last_updated_time;
				break;
			case 'closed_date':
				td_ele += ticket_model.closed_time;
				break;
			case 'assignee':
				td_ele += '<div class="text-ellipsis width-9em">' + ((ticket_model.assignee) ? ticket_model.assignee.name : "-") +'</div>';
				break;
			case 'group':
				td_ele += '<div class="text-ellipsis width-9em">'+ ((ticket_model.group) ? ticket_model.group.group_name : "-") +'</div>';
				break;
			case 'LAST_UPDATED_BY':
				td_ele += ticket_model.last_updated_by;
				break;
			case 'organization':
				td_ele += '-';
				break;
			case 'contact_details':
				td_ele += '-';
				break;
			case 'priority':{
				td_ele = '<td class="p-l-none">';

				if(ticket_model.priority == 'HIGH')
					td_ele += '<span class="label bg-danger first-letter-cap inline-block">'+ ticket_model.priority +'</span>';
				else
					td_ele += '<span class="first-letter-cap inline-block">'+ ticket_model.priority +'</span>';

				break;
			}
			case 'ticket_type':
				td_ele += ticket_model.type;
				break;
			case 'status':
				td_ele += ticket_model.status;
				break;
		}

		td_ele += '</td>';
		tr_ele += td_ele;
	}

	return tr_ele;
});*/

Handlebars.registerHelper('is_ticket_reply_activity', function(activityType, options) {

	var replyActivity = ['TICKET_CREATED', 'TICKET_REQUESTER_REPLIED', 'TICKET_ASSIGNEE_REPLIED'];

	if(activityType && $.inArray(activityType, replyActivity) != -1)
		return options.fn(this);

	return options.inverse(this);

});


Handlebars.registerHelper('is_ticket_requester_activity', function(activityType, options) {

	var replyActivity = ['TICKET_CREATED', 'TICKET_REQUESTER_REPLIED'];

	if(activityType && $.inArray(activityType, replyActivity) != -1)
		return options.fn(this);

	return options.inverse(this);

});

Handlebars.registerHelper('is_single_row_view', function(options) {

	if(Tickets.isSingleRowView())
		return options.fn(this);

	return options.inverse(this);
});

Handlebars.registerHelper('get_feedback_status', function(status, options) {

	switch(status[0]){
		case '3':
			return "<div class='feedback_label_width color_ok cus-pad'></span>";
			break;
		case '1':
			return "<div   class='feedback_label_width color_awful cus-pad'></div>";
			break;	
		case '2':
			return "<div   class='color_bad cus-pad feedback_label_width'></div>";
			break;
		case '4':
			return "<div  class='feedback_label_width color_good cus-pad'></div>";
			break;
		case '5':
			return "<div  class='feedback_label_width color_awesome cus-pad'></div>";
			break;
	}
});

Handlebars.registerHelper('timeago_feedback', function(time, options) {
	
	head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
		{	
			if(time){
				time[0] = new Date(time[0]);
				var timeago = $.timeago(time[0]);
				return timeago; 
			}
		});

});				

Handlebars.registerHelper('get_status_label', function(status, options) {

	switch(status){
		case 'NEW':
			return '<span class="label label-warning cus-pad">N</span>';
			break;
		case 'OPEN':
			return '<span class="label label-danger cus-pad">O</span>';
			break;
		case 'PENDING':
			return '<span class="label label-info cus-pad">P</span>';
			break;
		case 'CLOSED':
			return '<span class="label label-success cus-pad">C</span>';
			break;
	}
});

Handlebars.registerHelper('get_palin_text_from_html', function(html, options) {

	var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";

});

Handlebars.registerHelper('get_current_user_prefs', function(object, options) {

	object['current_logged_in_user'] = CURRENT_DOMAIN_USER;
	return options.fn(object);

});

Handlebars.registerHelper('agile_compare_prefs', function(key, value, options) {

	var prefs = _agile_get_prefs(key);
	console.log(prefs == value);
	if(prefs && prefs == value)
		return options.fn(this);

	return options.inverse(this);

});
Handlebars.registerHelper('is_lhs_filter_disabled', function(options) {

	if(_agile_get_prefs('hide_ticket_lhs_filter'))
		return options.fn(this);

	return options.inverse(this);
});

Handlebars.registerHelper('is_column_selected', function(field_name, options) {

	var selected_columns = CURRENT_DOMAIN_USER.helpdeskSettings.choosed_columns;

	if(!selected_columns || !selected_columns.length){
		selected_columns = ['id','subject','requester_name','due_date','priority','status','assignee','group',];
	}

	if(selected_columns.indexOf(field_name) != -1)
		return options.fn(this);

	return options.inverse(this);
});

Handlebars.registerHelper('is_ticket_collection_available', function(options) {

	try{
		if(App_Ticket_Module.ticketsCollection 
			&& App_Ticket_Module.ticketsCollection.collection.toJSON().length > 0
			&& App_Ticket_Module.ticketsCollection.collection.get(Current_Ticket_ID))
		  return options.fn(this);
	}catch(e){}
	
	return options.inverse(this);

});

Handlebars.registerHelper('convert_to_html', function(str, options) {

	if(!str)
		return "";

	str = str.replace(/<script.*?>.*?<\/script>/igm, '');
	str = str.replace(/ action="[^"]*"/igm, '');
	str = str.replace(/value="[^"]*"/igm, '');
	str = str.replace(/ on\w+="[^"]*"/igm, '');
	str = str.trim();

	//str = str.replace(/(?:\r\n)/g, '<br/>');

	// Construct anchor links
	try {
		// var exp = /(\b(http|https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		// str = str.replace(exp,
		// 		"<a href='$1' target='_blank' class='link-color'>$1</a>");

	} catch (err) {
	}

	return str;
});
Handlebars.registerHelper('replace_newline_with_ticket_br', function(str, options) {

	if(!str)
		return "";

	str = str.trim();
	
	str = str.replace(/(?:\r\n|\r|\n)/g, '<br />');
	str = str.replace(/ on\w+="[^"]*"/igm, '');
	str = str.replace(/action="[^"]*"/igm, '');
	str = str.replace(/value="[^"]*"/igm, '');
    str = str.replace(/<script.*?>.*?<\/script>/igm, '')
    return str;
});

Handlebars.registerHelper('replace_newline_with_br_feedback', function(object, options) {

	var str = object.toString();
	if(!str)
		return "";

	str = str.trim();

	str = str.replace(/(?:\r\n|\r|\n)/g, '<br />');
    return str;
});
Handlebars.registerHelper('replace_br_with_space_feedback', function(object, options)
{
	var text = object.toString();

	if(!text)
		return;
	
	var regex = /<br\s*[\/]?>/gi;

	return text.replace(regex, " ");
});

Handlebars.registerHelper('get_ticket_uri', function(str, options) {
	
    	if(Ticket_Filter_ID)
	       return "#tickets/filter/"+Ticket_Filter_ID;

    	return "#tickets";
    });

/**
  * CSS text avatars
  */
 Handlebars.registerHelper('getGravatarFromEmail', function(email, width)
 {

  if (email)
     return 'https://secure.gravatar.com/avatar/' + Agile_MD5(email) + '.jpg?s=' + width + '&d=404';
  
  return 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + '&d=404';

 });

Handlebars.registerHelper('get_current_filter_name', function(options)
{
  return Ticket_Filters.getCurrentFilterName();
});

Handlebars.registerHelper('get_filters_select_options', function(options)
{
  var filtersArray = App_Ticket_Module.ticketFiltersList.collection.toJSON();
  var optionHTML = '<option value="{{id}}">{{name}}</option>', resultHTML = '';

  filtersArray.forEach(function(filter){
  	resultHTML += optionHTML.replace('{{id}}', filter.id).replace('{{name}}', filter.name);
  });

  return resultHTML;
});

Handlebars.registerHelper('is_current_opend_ticket', function(id, options)
{
	if(id == Current_Ticket_ID)
  	return options.fn(this);

	return options.inverse(this);
});

Handlebars.registerHelper('is_helpdesk_enabled', function(options)
{
	if(Helpdesk_Enabled)
  		return options.fn(this);

	return options.inverse(this);
});

Handlebars.registerHelper('is_current_logged_in_user', function(id, options)
{

	if (CURRENT_DOMAIN_USER.id == id)

		return options.fn(this);

	return options.inverse(this);
});

Handlebars.registerHelper('replace_br_with_space', function(text, options)
{
	if(!text)
		return;
	
	var regex = /<br\s*[\/]?>/gi;

	return text.replace(regex, " ");
});
Handlebars.registerHelper('gravatarurl', function(items, width)
	{

		if (items == undefined)
			return;

		// Checks if properties already has an image, to return it
		var agent_image = getPropertyValue(items, "image");
		if (agent_image)
			return agent_image;

		// Default image
		var img = DEFAULT_GRAVATAR_url;
		var backup_image = "&d=404\" ";
		// backup_image="";
		var initials = '';
		try
		{
			// if(!isIE())
			initials = text_gravatar_initials(items);
		}
		catch (e)
		{
			console.log(e);
		}

		if (initials.length == 0)
			backup_image = "&d=" + DEFAULT_GRAVATAR_url + "\" ";

		var data_name =  '';
		// if(!isIE())
			data_name = "onLoad=\"image_load(this)\" onError=\"image_error(this)\"_data-name=\"" + initials;
		
		var email = getPropertyValue(items, "email");
		if (email)
		{
			return new Handlebars.SafeString('https://secure.gravatar.com/avatar/' + Agile_MD5(email) + '.jpg?s=' + width + backup_image + data_name);
		}

		return new Handlebars.SafeString('https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=' + width + '' + backup_image + data_name);

	});

Handlebars.registerHelper('uc_first', function(text, options)
{
	return ucfirst(text);
});

Handlebars.registerHelper('helpcenter_url', function(options)
{
	if(!App_Ticket_Module.sectionsCollection)
		return "";
	var collection = App_Ticket_Module.sectionsCollection.collection;
	console.log(collection);	
	var url = collection.url; 
	var arr = url.split("/");
	var url_id = arr[arr.length-1];

	return "/"+url_id;
});
Handlebars.registerHelper('helpcenter_url_section', function(options)
{
	if(!App_Ticket_Module.articlesCollection)
		return "";
	var collection = App_Ticket_Module.articlesCollection.collection;
	console.log(collection);	
	var url = collection.url; 
	var arr = url.split("/");
	var url_id = arr[arr.length-1];
    var idarr = url_id.split("=");
    var id = idarr[idarr.length-1];
	return "/"+id;
});

Handlebars.registerHelper('get_ticket_translated_text', function(module, key, options)
{
	return get_ticket_translated_text(module, key);
	
});

Handlebars.registerHelper('return_feedback_title', function(feedback,options) {

	var feedback_title= ""
	
	switch (feedback[0]) {
	    case "1":
	        feedback_title = "{{agile_lng_translate 'tickets' 'unacceptable'}}";
	        break;
	    case "2":
	        feedback_title = "{{agile_lng_translate 'tickets' 'can_improve'}}";
	        break;
	    case "3":
	        feedback_title = "{{agile_lng_translate 'tickets' 'acceptable'}}";
	        break;
	    case "4":
	        feedback_title = "{{agile_lng_translate 'tickets' 'meets_expectations'}}";
	        break;
	    case "5":
	        feedback_title = "{{agile_lng_translate 'tickets' 'exceptional'}}";
	}

	return feedback_title;        
	
});

Handlebars.registerHelper('isHelpdeskenabled', function(options) {
	
	if(CURRENT_DOMAIN_USER.restricted_menu_scopes.indexOf('HELPDESK') == -1 ){

		return options.fn(this);
		
	}	
		return options.inverse(this);

});

Handlebars.registerHelper('get_status_label_details', function(status, options) {

	switch(status){
		case 'NEW':
			return '<span class="label status_label label-warning cus-pad" style="margin-right: 5px;padding: 0.0em 0.5em 0.2em!important;">{{agile_lng_translate "tickets" "new_status"}}</span>';
			break;
		case 'OPEN':
			return '<span class="label status_label label-danger cus-pad" style="margin-right: 5px;padding: 0.0em 0.5em 0.2em!important;">{{agile_lng_translate "tickets" "open_status"}}</span>';
			break;
		case 'PENDING':
			return '<span class="label status_label label-info cus-pad" style="margin-right: 5px;padding: 0.0em 0.5em 0.2em!important;">{{agile_lng_translate "tickets" "pending_status"}}</span>';
			break;
		case 'CLOSED':
			return '<span class="label status_label label-success cus-pad" style="margin-right: 5px;padding: 0.0em 0.5em 0.2em!important;">{{agile_lng_translate "tickets" "closed_status"}}</span>';
			break;
	}
});
/** End of ticketing handlebars* */

function get_ticket_translated_text(module, key){
	var items = {
		"priority" : {
			"LOW" : "{{agile_lng_translate 'tasks' 'Low'}}",
			"MEDIUM" : "{{agile_lng_translate 'tickets' 'medium'}}",
			"HIGH" : "{{agile_lng_translate 'tasks' 'High'}}",
		},
		"status" : {
			"OPEN" : "{{agile_lng_translate 'contact-details' 'OPEN'}}",
			"PENDING" : "{{agile_lng_translate 'tickets' 'pending'}}",
			"CLOSED" :"{{agile_lng_translate 'cases' 'closed'}}",
		},
	};
	if(items[module] && items[module][key]){
		return items[module][key];
	}
	
	return key;
}
