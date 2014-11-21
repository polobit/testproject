// Before selecting proper type array from map, need to fill map with user's detail.
function startMakingCollection(criteria, pending)
{
	console.log("in startMakingCollection");
	console.log(criteria+" "+ pending);
	
	// Check for list view 
	if(criteria == "LIST")
		{	
		  // Display list view
		  displayListView();
		  return;
		}	
	
	// Hide list view and show column view with loading img
	hideListViewAndShowLoading();
			
	// Get user details and add into GROUPING_MAP's owner array.
	if (criteria == "OWNER" && GROUPING_MAP[criteria].type.length == 0)
		getUserDetails(function(data)
		{
			findArrayForCollection(criteria, pending);
		});
	else
		findArrayForCollection(criteria, pending);
}

// Decide which array to pass for creation of collection.
function findArrayForCollection(criteria, pending)
{
	if (criteria == "CATEGORY")
		// Sort task list on count of task and then create collection
		getArraySortOnCount(criteria, GROUPING_MAP[criteria].type, pending);
	else
		// Creates nested collection
		createNestedCollection(criteria, GROUPING_MAP[criteria].type, pending);
}

// Creates nested collection
function createNestedCollection(criteria, criteriaArray, pending)
{
	console.log("In createNestedCollection");

	// Initialize nested collection
	initTaskListCollection();

	// Url to call DB
	var initialURL = null;

	if (criteria == "DUE")
		initialURL = '/core/api/tasks/fordue' + getParamsNew() + "&pending=" + pending;
	else
		initialURL = '/core/api/tasks/forcategory' + getParamsNew() + "&pending=" + pending;

	// Creates main collection with Task lists
	for ( var i in criteriaArray)
	{
		var newTaskList;

		// Url to call DB
		var url = null;

		// Add heading to task list in main collection
		if (criteria == "OWNER")
		{
			url = initialURL + "&owner=" + criteriaArray[i].id;
			newTaskList = { "heading" : criteriaArray[i].name, "owner_id" : criteriaArray[i].id, "url" : url, "flag" : true };
		}
		else
		{
			url = initialURL + "&type=" + criteriaArray[i];
			newTaskList = { "heading" : criteriaArray[i], "url" : url, "flag" : true };
		}

		if (!newTaskList)
			return;

		// Add task list in main collection
		TASKS_LIST_COLLECTION.collection.add(newTaskList);// main-collection
	}

	// Render it
	$('#new-task-list-based-condition').html(TASKS_LIST_COLLECTION.render(true).el);

	// Fetch tasks from DB for first task list
	fetchForNextTaskList();
}

// Initialize nested collection
function initTaskListCollection()
{
	// Define main collection
	TASKS_LIST_COLLECTION = new Base_Collection_View({ restKey : "task", templateKey : "new-tasks-lists", individual_tag_name : 'div',
		className : "list-area-wrapper", sort_collection : false, postRenderCallback : function(el)
		{
			// Remove loding imgs
			$('.loading-img', el).remove();
			$('.loading', el).remove();

			// Adjust Height Of Task List And Scroll as per window size
			adjustHeightOfTaskListAndScroll();			
		} });

	// Over write append function
	TASKS_LIST_COLLECTION.appendItem = taskAppend;
}

// Append sub collection and model
function taskAppend(base_model)
{
	var tasksListModel = new Base_List_View({ model : base_model, "view" : "inline", template : "new-tasks-lists-model", tagName : 'div',
		className : "task-trello-list", id : base_model.get("heading") });

	// Render model in main collection
	var el = tasksListModel.render().el;

	// Append model from main collection in UI
	$('#new-tasks-lists-model-list', this.el).append(el);
}

/**
 * Create sub collection, ad to model in main collection, fetch tasks from DB
 * for sub collection and update UI.
 */
function taskFetch(index)
{
	console.log("index: " + index);

	// Get model from main collection
	var base_model = TASKS_LIST_COLLECTION.collection.at(index);

	if (!base_model)
		return;

	// Define sub collection
	var taskCollection = new Base_Collection_View({
		url : base_model.get("url"),
		templateKey : 'task',
		individual_tag_name : 'div',
		sort_collection : false,
		cursor : true,
		page_size : 20,
		postRenderCallback : function(el)
		{
			var flag = false;

			if (base_model.has("owner_id"))
				flag = $("div[id='list-tasks-" + base_model.get("heading") + "-" + base_model.get("owner_id") + "']")[0];
			else
				flag = $("div[id='list-tasks-" + base_model.get("heading") + "']")[0];

			// If we have task list then only need to apply following
			if (flag)
			{
				// Remove loading icon from task list header
				removeLoadingIcon(base_model.toJSON());

				// Display task count
				addTaskCount(base_model.toJSON());

				// Apply infi scroll on sub-collection
				if (base_model.has("owner_id"))
					initialize_infinite_scrollbar($("div[id='list-tasks-" + base_model.get("heading") + "-" + base_model.get("owner_id") + "']")[0],
							taskCollection);
				else
					initialize_infinite_scrollbar($("div[id='list-tasks-" + base_model.get("heading") + "']")[0], taskCollection);
			}
		} });

	// Fetch task from DB for sub collection
	taskCollection.collection.fetch({ success : function(data)
	{
		// Add sub collection in model of main collection.
		base_model.set('taskCollection', taskCollection.collection);

		// Update UI
		if (base_model.has("owner_id"))
			$("div[id='list-tasks-" + base_model.get("heading") + "-" + base_model.get("owner_id") + "']").html(taskCollection.render(true).el);
		else
			$("div[id='list-tasks-" + base_model.get("heading") + "']").html(taskCollection.render(true).el);

		// Adjust Height Of Task List And Scroll as per window size
		adjustHeightOfTaskListAndScroll();

		// Maintain changes in UI
		displaySettings();

		// Gives ability of dragging and dropping to tasks in task list.
		setup_sortable_tasks();

		// Counter to fetch next sub collection
		FETCH_COUNTER++;

		// Fetch tasks from DB for next task list
		fetchForNextTaskList();
	} });
}
