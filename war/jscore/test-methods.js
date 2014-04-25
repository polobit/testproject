/*Creates url to fetch data and finds details from map, calls function to create nested collection*/
function findDetails(criteria, owner)
{
	console.log(criteria + "  " + owner);
	console.log(urlMap[criteria].type);
	console.log(urlMap[criteria].searchKey);

	// Creates nested collection
	createNestedCollection(urlMap[criteria].type, initialURL, urlMap[criteria].searchKey);

	if (criteria == "DUE")
	{
		// Url to call DB
		var initialURL = null;

		if (owner == "") //all task
			initialURL = '/core/api/tasks/all';
		else if (owner == "all-pending-tasks")
			initialURL = '/core/api/tasks/all';
		else if (owner == "my-pending-tasks")
			initialURL = '/core/api/tasks/my/tasks';
		else //my task
			initialURL = '/core/api/tasks/my/tasks';

		createSubCollectionForDue(urlMap[criteria].type, initialURL, urlMap[criteria].searchKey);
	}
	else
	{
		// Url to call DB
		var initialURL = '/core/api/tasks/based' + getParams() + "&type=";
		createSubCollection(urlMap[criteria].type, initialURL, urlMap[criteria].searchKey);
	}
}

// Creates nested collection
function createNestedCollection(criteriaArray, initialURL, searchKey)
{
	// Shows loading image untill data gets ready for displaying
	$('#task-list-based-condition').html(LOADING_HTML);

	// Initialize nested collection
	initTaskListCollection();

	// Creates main collection with Task lists
	for ( var i in criteriaArray)
	{
		// Add heading to task list in main collection
		var newTaskList = { "heading" : criteriaArray[i] };

		// Add task list in main collection
		tasksListCollection.collection.add(newTaskList);// main-collection
	}

	// Render it
	$('#task-list-based-condition').html(tasksListCollection.render(true).el);
}

// Creates sub collection
function createSubCollectionForDue(criteriaArray, initialURL, searchKey)
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
				var headingToSearch = getHeadingForDueTask(tasks[i]);

				// Add task to relevant task list (sub collection)
				if (headingToSearch != null)
					addTaskToTaskList(headingToSearch, tasks[i])
			}

			console.log("tasksListCollection");
			console.log(tasksListCollection);

			// Creates normal time.
			displayTimeAgo($(".list"));
		}
		;
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
				addTaskToTaskList(tasks[0][searchKey], tasks)

				console.log("tasksListCollection");
				console.log(tasksListCollection);
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
