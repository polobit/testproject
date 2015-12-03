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

Handlebars
		.registerHelper(
				'calculate_due_date',
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



/** End of ticketing handlebars* */
