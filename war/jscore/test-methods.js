function findURL(criteria,owner)
{
	console.log(criteria+"  "+owner);
	console.log(urlMap[criteria].type);
	console.log(urlMap[criteria].searchKey);
		
	var initialURL = '/core/api/tasks/based' + getParams()+ "&type=";
	
	createNestedCollection(urlMap[criteria].type,initialURL,urlMap[criteria].searchKey);	
}

function createNestedCollection(criteriaArray,initialURL,searchKey)
{
	// Shows loading image untill data gets ready for displaying
	$('#task-list-based-condition').html(LOADING_HTML);	

	initTaskListCollection();
	
	for ( var i in criteriaArray)
	{
		var newTaskList = { "heading" : criteriaArray[i] };

		tasksListCollection.collection.add(newTaskList);// main-collection				
	}
	
	$('#task-list-based-condition').html(tasksListCollection.render(true).el);

	for ( var i in criteriaArray)
	{
		console.log(i);
		console.log(criteriaArray[i]);
		console.log(initialURL);

		var url =  initialURL + criteriaArray[i];
		console.log(url);

		queueGetRequest("task_queue", url, 'json', 
		function success(tasks)
		{
			console.log(tasks);
			
			if (tasks.length != 0)
			{
				console.log(tasks[0][searchKey]);
								
				var modelTaskList = tasksListCollection.collection.where({ heading : tasks[0][searchKey] });

				console.log(modelTaskList[0]);

				modelTaskList[0].get('taskCollection').add(tasks);// sub-collection
									
				console.log("tasksListCollection");
				console.log(tasksListCollection);	
		   };				
		}, function error(data)
		{
			console.log("In tasksList error");
			console.log(data);
		});
	}
	
	// Creates normal time.
	displayTimeAgo($(".list"));
}

function initTaskListCollection()
{
	tasksListCollection = new Base_Collection_View({ restKey : "task", templateKey : "new-tasks-lists", individual_tag_name : 'div',
		className : "list-area-wrapper fancy-scrollbar container ", sortKey : 'heading', sort_collection : true, descending : false,
		postRenderCallback : function(el)
		{
			// Creates normal time.
			displayTimeAgo($(".list"));
		} });

	tasksListCollection.appendItem = taskAppend;

	$('#task-list-based-condition').html(tasksListCollection.render().el);
}

function taskAppend(base_model)
{
	var tasksListModel = new Base_List_View({ model : base_model, "view" : "inline", template : "new-tasks-lists-model", tagName : 'div', className : "list" });

	var taskCollection = new Base_Collection_View({ url : '/core/api/tasks', templateKey : 'task', individual_tag_name : 'div', sortKey : 'due',
		sort_collection : true, descending : false });

	base_model.set('taskCollection', taskCollection.collection);

	var el = tasksListModel.render().el;
	$('#list-tasks', el).html(taskCollection.render(true).el);
	$('#new-tasks-lists-model-list', this.el).append(el);
}

function deleteTask(taskId, taskListId)
{
	var modelTaskList = tasksListCollection.collection.where({ heading : taskListId });

	modelTaskList[0].get('taskCollection').get(taskId).destroy();
	
	// Creates normal time.
	displayTimeAgo($(".list"));
}

function editTask(taskId, taskListId)
{
	console.log(taskId, taskListId);

	var modelTaskList = tasksListCollection.collection.where({ heading : taskListId });

	var modelTsk = modelTaskList[0].get('taskCollection').get(taskId);

	var taskJson = modelTsk.toJSON();

	deserializeForm(taskJson, $("#editTaskForm"));

	$("#editTaskModal").modal('show');

	// Fills owner select element
	populateUsers("owners-list",$("#editTaskForm"),taskJson,'taskOwner',
			function(data)
			{
				$("#editTaskForm").find("#owners-list").html(data);
				if (taskJson.taskOwner)
				{
					$("#owners-list", $("#editTaskForm")).find('option[value=' + taskJson['taskOwner'].id + ']').attr("selected", "selected");
				}

				if (taskJson.ownerPic)
				{
					$("#owner-pic", $("#editTaskForm"))
							.html(
									'<img class="thumbnail" src="' + taskJson.ownerPic + '" width="40px" height="40px" style="float: right;margin-right: -23px;margin-top: -59px;" />');
				}
				else
				{
					var imgSrc = 'https://secure.gravatar.com/avatar/' + Agile_MD5("") + '.jpg?s=50&d=' + escape(DEFAULT_GRAVATAR_url);
					$("#owner-pic", $("#editTaskForm"))
							.html(
									'<img class="thumbnail" src="' + imgSrc + '" width="40px" height="40px" style="float: right;margin-right: -23px;margin-top: -59px;"/>');
				}

				$("#owners-list", $("#editTaskForm")).closest('div').find('.loading-img').hide();
			});

	// Creates normal time.
	displayTimeAgo($(".list"));
}

function updateTask(isUpdate, data, json)
{
	console.log("farah");

	var modelTaskList = tasksListCollection.collection.where({ heading : json.type });
	
	console.log(data+"  "+ json);
	console.log(modelTaskList);
	console.log(modelTaskList[0]);
	console.log(modelTaskList[0].get('taskCollection'));

	if (isUpdate)
	{
		modelTaskList[0].get('taskCollection').get(json.id).set(data);
		return;
	}
	modelTaskList[0].get('taskCollection').add(data);

	// Creates normal time.
	displayTimeAgo($(".list"));
}

function completeTask(taskId, taskListId)
{
	var modelTaskList = tasksListCollection.collection.where({ heading : taskListId });

	var modelTsk = modelTaskList[0].get('taskCollection').get(taskId);

	var taskJson = modelTsk.toJSON();

	// Replace contacts object with contact ids
	var contacts = [];
	$.each(taskJson.contacts, function(index, contact)
	{
		contacts.push(contact.id);
	});

	taskJson.contacts = contacts;
	taskJson.is_complete = true;
	taskJson.due = new Date(taskJson.due).getTime();
	taskJson.owner_id = taskJson.taskOwner.id;

	var newTask = new Backbone.Model();
	newTask.url = 'core/api/tasks';
	newTask.save(taskJson, { success : function(data)
	{
		updateTask(true, data, taskJson);

		// Creates normal time.
		displayTimeAgo($(".list"));
	} });
}

function viewTask(taskId, taskListId)
{
	console.log(taskId, taskListId);

	var modelTaskList = tasksListCollection.collection.where({ heading : taskListId });

	var modelTsk = modelTaskList[0].get('taskCollection').get(taskId);

	var taskJson = modelTsk.toJSON();

	console.log(taskJson);

	// If modal already exists remove to show a new one
	$('#viewTaskModal').remove();

	// Display Modal
	$("#content").append(getTemplate("viewTask", taskJson));

	$('#viewTaskModal').modal('show');

	// Creates normal time.
	displayTimeAgo($("#viewTaskModal"));
}
