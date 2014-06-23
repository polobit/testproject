

function load_timeline_details1(el, contactId, callback1, noAnimation)
{
	noAnimationBruteForce = true;
	timeline_entity_loader.init(App_Contacts.contactDetailView.model.toJSON());

}


function add_entity_to_timeline(model)
{
	var list = [];
	list.push(model.toJSON())

	// console.log(model.get('id'));

	if (!timeline_collection_view.collection.get(model.get('id')))
	{
		timeline_collection_view.addItems(list);
		return;
	}

	update_entity_template(model);

}

function update_entity_template(model)
{
	$("#" + model.get("id"), $('#timeline', App_Contacts.contactDetailView.el)).html(getTemplate('timeline1', [
		model.toJSON()
	]));
}

/**
 * Removes an element from timeline
 * 
 * @param element
 */
function removeItemFromTimeline(element)
{
	console.log(element);
	$('#timeline').isotope('remove', element, function()
	{
		$("#timeline").isotope('reLayout')
	});
}

function addTagToTimelineDynamically(tags)
{
	timeline_collection_view.addItems(tags);
}

function timline_fetch_data(url, callback)
{
	
}
