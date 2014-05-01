/**
 * Caller : Task controller (route) , event on drop down Details: Creates url to
 * fetch data and finds details from map, calls function to create nested
 * collection Input : criteria, owner
 */
function findDetails(criteria, owner)
{
	console.log(criteria + "  " + owner);
	console.log(urlMap[criteria].type);
	console.log(urlMap[criteria].searchKey);

	/*
	 * Creates nested collection 1. If my task or my pending task with owner
	 * criteria is selected so add only one column of current user. 2. If
	 * selected criteria is not owner so follow normal procedure
	 */
	if (criteria == "OWNER" && ($(".selected_name").html() == "My Tasks" || $(".selected_name").html() == "My Pending Tasks"))
		createNestedCollection(criteria, [
			{ "name" : CURRENT_DOMAIN_USER.name, "id" : CURRENT_DOMAIN_USER.id }
		]); // only current
	else
		createNestedCollection(criteria, urlMap[criteria].type); // all

	if (criteria == "DUE" || criteria == "OWNER")
	{
		// Url to call DB
		var initialURL = null;

		if (owner == "") // all task
			initialURL = '/core/api/tasks/all';
		else if (owner == "all-pending-tasks")
			initialURL = '/core/api/tasks/allpending';
		else if (owner == "my-pending-tasks")
			initialURL = '/core/api/tasks/my/pendingtasks';
		else
			// my task
			initialURL = '/core/api/tasks/my/tasks';

		createSubCollectionForDueAndOwner(urlMap[criteria].type, initialURL, urlMap[criteria].searchKey);
	}
	else
	{
		// Url to call DB
		var initialURL = '/core/api/tasks/based' + getParams() + "&type=";
		createSubCollection(urlMap[criteria].type, initialURL, urlMap[criteria].searchKey);
	}

	// Gives ability of dragging and dropping to tasks in task list.
	setup_sortable_tasks();
}

// Creates nested collection
function createNestedCollection(criteria, criteriaArray)
{
	console.log(criteriaArray);

	// Shows loading image untill data gets ready for displaying
	$('#task-list-based-condition').html(LOADING_HTML);

	// Initialize nested collection
	initTaskListCollection();

	// Creates main collection with Task lists
	for ( var i in criteriaArray)
	{
		// Add heading to task list in main collection
		if (criteria == "OWNER")
			var newTaskList = { "heading" : criteriaArray[i].name, "owner_id" : criteriaArray[i].id };
		else
			var newTaskList = { "heading" : criteriaArray[i] };

		// Add task list in main collection
		tasksListCollection.collection.add(newTaskList);// main-collection
	}

	// Render it
	$('#task-list-based-condition').html(tasksListCollection.render(true).el);
}

// Creates sub collection
function createSubCollectionForDueAndOwner(criteriaArray, initialURL, searchKey)
{
	console.log(criteriaArray);
	console.log(initialURL);
	console.log(searchKey);

	// Add get requests in queue
	queueGetRequest("task_queue", initialURL, 'json', function success(tasks)
	{
		console.log(tasks);

		if (tasks.length != 0)
		{
			for ( var i in tasks)
			{

				console.log(tasks[i]);

				if (searchKey == "due") // Due
				{
					var headingToSearch = getHeadingForDueTask(tasks[i]);

					// Add task to relevant task list (sub collection)
					if (headingToSearch != null)
						addTaskToTaskList(headingToSearch, tasks[i], null);
				}
				else
					// Owner
					addTaskToTaskList(tasks[i].taskOwner.name, tasks[i], "OWNER");
			}

			// Creates normal time.
			displayTimeAgo($(".list"));
		}
	}, function error(data)
	{
		console.log("In tasksList error");
		console.log(data);
	});
}

// Creates sub collection
function createSubCollection(criteriaArray, initialURL, searchKey)
{
	// Creates sub collection with Tasks
	for ( var i in criteriaArray)
	{
		console.log(i);
		console.log(criteriaArray[i]);
		console.log(initialURL);

		// Url to call DB
		var url = initialURL + criteriaArray[i];
		console.log(url);

		// Add get requests in queue
		queueGetRequest("task_queue", url, 'json', function success(tasks)
		{
			console.log(tasks);

			if (tasks.length != 0)
			{
				console.log(tasks[0][searchKey]);

				// Add task to relevant task list (sub collection)
				addTaskToTaskList(tasks[0][searchKey], tasks, null)
			}
			;
		}, function error(data)
		{
			console.log("In tasksList error");
			console.log(data);
		});
	}
}

// Initialize nested collection
function initTaskListCollection()
{
	tasksListCollection = new Base_Collection_View({ restKey : "task", templateKey : "new-tasks-lists", individual_tag_name : 'div',
		className : "list-area-wrapper fancy-scrollbar container ", sortKey : 'heading', sort_collection : true, descending : false,
		postRenderCallback : function(el)
		{
			// Creates normal time.
			displayTimeAgo($(".list"));
		} });

	// Over write append function
	tasksListCollection.appendItem = taskAppend;

	$('#task-list-based-condition').html(tasksListCollection.render().el);
}

// Append sub collection and model
function taskAppend(base_model)
{
	var tasksListModel = new Base_List_View({ model : base_model, "view" : "inline", template : "new-tasks-lists-model", tagName : 'div', className : "list",
		id : base_model.get("heading") });

	var taskCollection = new Base_Collection_View({ url : '/core/api/tasks', templateKey : 'task', individual_tag_name : 'div', sortKey : 'due',
		sort_collection : true, descending : false });

	base_model.set('taskCollection', taskCollection.collection);

	var el = tasksListModel.render().el;

	$('#list-tasks', el).html(taskCollection.render(true).el);
	$('#new-tasks-lists-model-list', this.el).append(el);
}
