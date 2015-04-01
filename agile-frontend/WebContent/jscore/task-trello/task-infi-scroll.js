function initialize_infinite_scrollbar(element_id, targetCollection)
{
	console.log("initialize_infinite_scrollbar");

	if (element_id == undefined || element_id == null)
	{
		console.log("no elmnt");
		return;
	}

	targetCollection.infiniScroll = new Backbone.InfiniScroll(targetCollection.collection, {
		target : element_id,
		untilAttr : 'cursor',
		param : 'cursor',
		strict : false,
		pageSize : targetCollection.page_size,
		success : function(colleciton, response)
		{
			console.log('in success');

			if (!colleciton.last().get("cursor"))
			{
				this.strict = true;
				targetCollection.infiniScroll.disableFetch();
			}

			// Maintain changes in UI
			displaySettings();

			// Remove loading icon
			$(targetCollection.infiniScroll.options.target.nextElementSibling).html('');
		},
		onFetch : function()
		{
			console.log('in fetch');

			// Add loading icon
			$(targetCollection.infiniScroll.options.target.nextElementSibling).html(
					'<div class="scroll-loading"> <img src="/img/ajax-loader.gif" style="margin-left: 44%;"> </div>');
		} });
}

/*
 * Copy cursor of last task in targeted task list to new task because newly
 * added task will go to end of collection and we lost cursor, cursor is
 * important for infi-scroll
 */
function setCursor(targetTaskListModel, newTaskToAdd, conditionToCheck)
{
	console.log("In setCursor");

	if (!targetTaskListModel.get('taskCollection') || targetTaskListModel.get('taskCollection').length == 0)
		return newTaskToAdd;

	var len = targetTaskListModel.get('taskCollection').length;
	var crsr = targetTaskListModel.get('taskCollection').at(len - 1).get("cursor");

	if (crsr)
	{
		if (conditionToCheck == "dragged" || conditionToCheck == true)
		{
			newTaskToAdd.set({ cursor : crsr });
		}

		else if (newTaskToAdd.attributes)
		{
			newTaskToAdd.attributes.cursor = crsr;
		}
		else
			newTaskToAdd["cursor"] = crsr;
	}

	return newTaskToAdd;
}
