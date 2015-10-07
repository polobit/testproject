

function load_timeline_details(el, contactId, callback1, noAnimation)
{
	noAnimationBruteForce = true;
	timeline_entity_loader.init(App_Contacts.contactDetailView.model.toJSON());

}


function add_entity_to_timeline(model)
{
	var list = [];
	list.push(model.toJSON());

	var contactId = 0;

	if(Current_Route.indexOf("contact/") == 0)
	{
		contactId = Current_Route.split("contact/")[1];
	}

	if(!timeline_collection_view[contactId])
		return;

	if (!timeline_collection_view[contactId].collection.get(model.get('id')))
	{
		timeline_collection_view[contactId].addItems(list);
		return;
	}

	update_entity_template(model);

}

function update_entity_template(model)
{
	getTemplate('timeline1', [model.toJSON()], undefined, function(template_ui){
 		if(!template_ui)
    		return;
		$("#" + model.get("id"), $('#timeline', App_Contacts.contactDetailView.el)).html($(template_ui)); 
	}, "#" + model.get("id"), $('#timeline', App_Contacts.contactDetailView.el));

}

/**
 * Removes an element from timeline
 * 
 * @param element
 */
function removeItemFromTimeline(element)
{
	try
	{
		$('#timeline').isotope('remove', element, function()
				{
					$("#timeline").isotope('reLayout')
				});
	}
	catch(err)
	{
		
	}
}

function addTagToTimelineDynamically(tag, collection)
{
	var contactId = 0;

	if(Current_Route.indexOf("contact/") == 0)
	{
		contactId = Current_Route.split("contact/")[1];
	}

	if(!timeline_collection_view[contactId] || !timeline_collection_view[contactId].collection)
		return;
	
	$.each(collection, function(index, tagObject){
		if(tagObject.tag == tag)
			{
				timeline_collection_view[contactId].collection.add(new BaseModel(tagObject));
			}
	})
	console.log(collection);
	
}

function timline_fetch_data(url, callback)
{
	
}
