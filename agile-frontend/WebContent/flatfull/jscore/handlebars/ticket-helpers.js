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

Handlebars.registerHelper('next_prev_ticket_exists', function(action_type,
		options) {

	if (Tickets.next_prev_ticket_exists(action_type))
		return options.fn(this);

	return options.inverse(this);
});

Handlebars.registerHelper('get_ticket_id', function(action_type, options) {
	return Tickets.get_next_prev_ticket_id(action_type);
});

Handlebars.registerHelper('calculate_due_date', function(due_date, options) {
	var currentEpoch = new Date().getTime();

	if (due_date < currentEpoch) {

		return 'Overdue by '+ Ticket_Utils.dateDiff(currentEpoch, due_date);
	}

	return 'Due in ' + Ticket_Utils.dateDiff(currentEpoch, due_date);
});

Handlebars
		.registerHelper(
				'get_due_date_badge',
				function(due_date, options) {

					var currentEpoch = new Date().getTime();

					if (due_date < currentEpoch) {

						return '<span class="label bg-danger first-letter-cap inline-block" title="Overdue by '
								+ Ticket_Utils.dateDiff(currentEpoch, due_date)
								+ '">Overdue</span>';
					}

					return '<span class="label bg-light first-letter-cap inline-block">Due in '
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

Handlebars.registerHelper('get_allowed_canned_responses_array', function(labels, object, options) {

	console.log("get_allowed_canned_responses_array");
	console.log(labels);

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


Handlebars.registerHelper('get_ticket_headers', function(options) {

	var selected_columns = CURRENT_DOMAIN_USER.helpdeskSettings.selected_columns;
	var template = '<th>{{col_name}}</th>', html = '';

	for(var i=0; i< selected_columns.length; i++){

		var col_name = selected_columns[i].replace(/_/g, ' ').replace(/ /g, '&nbsp;');

		html += template.replace('{{col_name}}', (col_name[0].toUpperCase() + col_name.slice(1).toLowerCase()));
	}

	return html;
});

Handlebars.registerHelper('get_ticket_rows', function(ticket_model, options) {

	var selected_columns = CURRENT_DOMAIN_USER.helpdeskSettings.selected_columns, tr_ele = '';

	for(var i=0; i< selected_columns.length; i++){

		var td_ele = '<td  class="first-letter-cap">';
		switch(selected_columns[i]){

			case 'ID':
				td_ele += '<div class="row m-n text-ellipsis">'+ ticket_model.id +'</div>';
				break;
			case 'SUBJECT':
				td_ele += '<div class="row m-n text-ellipsis width-15em">'+ ticket_model.subject +'</div>';
				break;
			case 'REQUSTER_NAME':
				td_ele += '<div class="row m-n text-ellipsis width-15em">'+ ticket_model.requester_name +'</div>';
				break;
			case 'REQUESTER_EMAIL':
				td_ele += '<div class="row m-n text-ellipsis width-15em">'+ ticket_model.requester_email +'</div>';
				break;
			case 'CREATED_DATE':
				td_ele += '<div class="row m-n">'+ ticket_model.created_date +'</div>';
				break;
			case 'DUE_DATE':{

				var due_date = ticket_model.due_date, due_txt = '-';
				var currentEpoch = new Date().getTime();

				if(due_date && due_date > 0)
					if (due_date < currentEpoch)
						due_txt = 'Overdue by ' + Ticket_Utils.dateDiff(currentEpoch, due_date);
					else
						due_txt = 'Due in ' + Ticket_Utils.dateDiff(currentEpoch, due_date);

				td_ele += '<div class="row m-n">'+ due_txt +'</div>';
				
				break;
			}
			case 'ASSIGNED_DATE':
				td_ele += '<div class="row m-n">'+ ticket_model.assigned_time +'</div>';
				break;
			case 'LAST_UPDATED_DATE':
				td_ele += '<div class="row m-n">'+ ticket_model.last_updated_time +'</div>';
				break;
			case 'CLOSED_DATE':
				td_ele += '<div class="row m-n">'+ ticket_model.closed_time +'</div>';
				break;
			case 'ASSIGNEE':
				td_ele += '<div class="row m-n">'+ ((ticket_model.assignee) ? ticket_model.assignee.name : "-") +'</div>';
				break;
			case 'GROUP':
				td_ele += '<div class="row m-n">'+ ((ticket_model.group) ? ticket_model.group.group_name : "-") +'</div>';
				break;
			case 'LAST_UPDATED_BY':
				td_ele += '<div class="row m-n">'+ ticket_model.last_updated_by +'</div>';
				break;
			case 'ORGANIZATION':
				break;
			case 'CONTACT_DETAILS':
				break;
			case 'PRIORITY':
				td_ele += '<div class="row m-n">'+ ticket_model.priority +'</div>';
				break;
			case 'TYPE':
				td_ele += '<div class="row m-n">'+ ticket_model.type +'</div>';
				break;
			case 'STATUS':
				td_ele += '<div class="row m-n">'+ ticket_model.status +'</div>';
				break;
		}

		td_ele += '</td>';
		tr_ele += td_ele;
	}

	return tr_ele;
});
