

function load_timeline_details(el, contactId, callback1, noAnimation)
{
	noAnimationBruteForce = true;
	timeline_entity_loader.init(App_Contacts.contactDetailView.model.toJSON());

}


function add_entity_to_timeline(model)
{
	var list = [];
	list.push(model.toJSON())

	if(!timeline_collection_view)
		return;

	if (!timeline_collection_view.collection.get(model.get('id')))
	{
		timeline_collection_view.addItems(list);
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
	if(!timeline_collection_view || !timeline_collection_view.collection)
		return;
	
	$.each(collection, function(index, tagObject){
		if(tagObject.tag == tag)
			{
				timeline_collection_view.collection.add(new BaseModel(tagObject));
			}
	})
	console.log(collection);
	
}

function timline_fetch_data(url, callback)
{
	
}
