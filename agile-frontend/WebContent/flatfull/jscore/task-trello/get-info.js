/*Get user's name and id to add in GROUPING_MAP for owner of task, 
 * user name can be redundant so we need user's id too.*/
function getUserDetails(callback)
{
	$.getJSON('/core/api/users', function(users)
	{
		for ( var i in users)
		{
			GROUPING_MAP.OWNER.type[i] = { "name" : users[i].name, "id" : users[i].id };
		}

		if (callback && typeof (callback) === "function")
			callback();

	}).error(function(data)
	{
		console.log("get user err");
		console.log(data);
	});
}

// Gives heading of task list from due of task
function getHeadingForDueTask(task)
{
	var headingToSearch = null;

	// add to the right task list - overdue, today, tomorrow etc.
	var due = get_due(task.due);

	// OVERDUE
	if (due < 0)
		return headingToSearch = "OVERDUE";

	// Today
	if (due == 0)
		return headingToSearch = "TODAY";

	// Tomorrow
	if (due == 1)
		return headingToSearch = "TOMORROW";

	// Next Week
	if (due > 1)
		return headingToSearch = "LATER";
}

// As per new task list get new due date for task, after task drop
function getNewDueDate(newTaskListId)
{
	var d = new Date();

	// OVERDUE (yesterday)
	if (newTaskListId == "OVERDUE")
		d.setDate(d.getDate() - 1);

	// Today
	if (newTaskListId == "TODAY"){
		(getGMTTimeFromDate(d) / 1000);
	}
		

	// Tomorrow
	if (newTaskListId == "TOMORROW")
		d.setDate(d.getDate() + 1);

	// Later Day after tomorrow
	if (newTaskListId == "LATER")
		d.setDate(d.getDate() + 2);

	return (getGMTTimeFromDate(d) / 1000);
}



//As per new task list get new due date for task, after task drop
function getNewDueDateBasedOnTime(newTaskListId,duedate)
{
	var d = new Date();
	var d1 = new Date(duedate*1000);
	var secs = d1.getSeconds() + (60 * d1.getMinutes()) + (60 * 60 * d1.getHours());
	console.log(secs);

	// OVERDUE (yesterday)
	if (newTaskListId == "OVERDUE")
		d.setDate(d.getDate() - 1);

	// Today
	if (newTaskListId == "TODAY")
		(getGMTTimeFromDate(d) / 1000);

	// Tomorrow
	if (newTaskListId == "TOMORROW")
		d.setDate(d.getDate() + 1);

	// Later Day after tomorrow
	if (newTaskListId == "LATER")
		d.setDate(d.getDate() + 2);

	return (getGMTTimeFromDate(d) / 1000)+secs;
}



// On basis of status return progress value, when criteria is status and task is
// dragged in task lists.
function getProgressValue(status)
{
	if (status == YET_TO_START)
		return 0;
	else if (status == COMPLETED)
		return 100;
	else if (status == IN_PROGRESS)
		return 1;
}

// Get Task id from UI
function getTaskId(element)
{
	if ($(element).hasClass('task-body'))
		return $(element).parent().attr('id');
	else
		return $(element).attr('data');
}

// Get heading of task list
function getTaskListId(element)
{
	return $(element).closest('.task-trello-list').attr('id');
}

/*
 * Get owner's id when heading of task list is Owner's name, name can be
 * duplicate so get owner's Id.
 */
function getTaskListOwnerId(element)
{
	return $(element).closest('.task-trello-list').find('.list-header').attr('ownerID');
}

// Get Criteria from dropdown
function getCriteria()
{
	// Get selection from criteria dropdown
	var criteria = $('#new-type-tasks').data("selected_item");

	// If criteria is not selected then make it default one
	if (!criteria)
		criteria = "DUE";

	return criteria;
}

// Get task list from main-collection by ID
function getTaskList(criteria, taskListId, owner_id)
{
	// Get task list
	if (criteria == "OWNER")
		return TASKS_LIST_COLLECTION.collection.where({ heading : taskListId, owner_id : parseInt(owner_id) });
	else
		return TASKS_LIST_COLLECTION.collection.where({ heading : taskListId });
}

// Get form ID for notes in task
function getTaskFormId(element)
{
	// Get form Id
	var formId = $(element).closest('form').attr('id');
	console.log(formId);
	return formId;

}

// Get task count of all task list and call function to sort array and create
// collection.
function getArraySortOnCount(criteria, criteriaArray, pending)
{
	var initialURL = '/core/api/tasks/countoftype' + getParamsNew() + "&pending=" + pending;

	var countTypeArray = {};

	$.each(criteriaArray, function(index, type)
	{
		var url = initialURL + "&type=" + criteriaArray[index];

		$.getJSON(url, function(data)
		{
			countTypeArray[data.type] = data.count;

			if (_.size(countTypeArray) == criteriaArray.length)
				sortArray(criteria, countTypeArray, pending);

		}).error(function(data)
		{
			console.log("get count err");
			console.log(data);
		});
	});
}

// Sort array on count and call function to create collection.
function sortArray(criteria, countTypeArray, pending)
{
	var array = [];
	var result = [];

	for (a in countTypeArray)
		array.push([
				a, countTypeArray[a]
		]);

	array.sort(function(a, b)
	{
		return a[1] - b[1]
	});

	array.reverse();

	for (a in array)
		result.push(array[a][0]);

	// Creates nested collection
	createNestedCollection(criteria, result, pending);
}

// Get details from dropdown and call function to create collection
function getDetailsForCollection()
{
	FETCH_COUNTER = 0;
	IS_FECHING_DONE = false;

	// Make drop down intelligent and return Pending value task to fetch or not
	var pending = dropdownintelligence();

	// Get selection from criteria dropdown
	var criteria = getCriteria();

	// Get selection from owner's dropdown
	var owner = $('#new-owner-tasks').data("selected_item");

	// Creates nested collection
	startMakingCollection(criteria, pending);
}

/**
 * getParams() method returns a string(used as query param string) contains user
 * selected type and owners
 * 
 * @returns {String} query string
 */
function getParamsNew()
{
	var params = "?";

	// Get task type and append it to params
	var criteria = getCriteria();
	if (criteria)
		params += ("&criteria=" + criteria);

	if (criteria == "DUE")
	{
		params += ("&start_time=" + getNewDueDate("TODAY"));
		params += ("&end_time=" + getNewDueDate("TOMORROW"));
	}

	// Get owner name and append it to params
	var owner = $('#new-owner-tasks').data("selected_item");
	if (owner == 'my-pending-tasks')
	{
		params += ("&pending=" + true);
		params += ("&owner=" + CURRENT_DOMAIN_USER.id);
		return params;
	}
	if (owner == 'all-pending-tasks')
	{
		params += ("&pending=" + true);
		owner = "";
	}
	if (owner)
		params += ("&owner=" + owner);
	else if (owner == undefined)		
		params += ("&owner=" + CURRENT_DOMAIN_USER.id);	
		
	return params;
}