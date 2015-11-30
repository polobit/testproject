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

	var newLabelJSON = {};
	$.each(Ticket_Labels.labelsCollection.toJSON(), function(index, eachLabel) {
		newLabelJSON[eachLabel.id] = eachLabel;
	});

	var newLabels = [];
	$.each(labels, function(index, value) {

		if (newLabelJSON[value])
			newLabels.push(newLabelJSON[value]);

	});

	object["labels"] = newLabels;

	return options.fn(object);

});

Handlebars.registerHelper('get_canned_responses_array', function(object, options) {

	object["canned_responses"] = Ticket_Canned_Response.cannedResponseCollection.toJSON();
	return options.fn(object);

});

Handlebars.registerHelper('check_is_allowed_canned_response', function(canned_response_labels, ticket_labels, options) {

	for (var i = 0; ticket_labels.length > 0; i++) {

		if (.inArray( ticket_labels[i], canned_response_labels ) != -1)
		  return options.fn(this);
	};

	return options.inverse(this);

});

/** End of ticketing handlebars* */
