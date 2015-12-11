var Ticket_Custom_Filters = {

	customFilters: new Array(),
	assignees: [],
	groups: [],
	filters: [],

	reset: function(){
		this.customFilters = new Array();
	},
	init: function(callback){

		if(this.assignees.length == 0 && this.groups.length == 0){

			var Assignees = Backbone.Collection.extend({url : '/core/api/users'});
			new Assignees().fetch({success: function(model, response, options){
				
				Ticket_Custom_Filters.assignees = model.toJSON();

				var Groups = Backbone.Collection.extend({url: '/core/api/tickets/groups?only_groups=true'});
				new Groups().fetch({success: function(model, response, options){

					Ticket_Custom_Filters.groups = model.toJSON();

					if(callback)
						callback();
				}});
			}});
		}
		else{
			if(callback)
				callback();
		}	
	},

	renderLayout: function(){

		Ticket_Custom_Filters.prepareConditions(function(dataJSON){

			getTemplate("ticket-custom-filters", dataJSON, undefined, function(template_ui){

				if(!template_ui)
			  		return;

			  	var $container = $('#custom-filters-container');

			  	$container.html($(template_ui));
			  	Tickets.initDateTimePicker($('#datetimepicker'), function(){});

			  	//Initializing Priority, Labels, Status, Ticket type multi select
				//$(".chosen-select").chosen();

				var tempAssignees = {all_assignees: Ticket_Custom_Filters.assignees, selected_assignees: dataJSON.assignees};
				var tempGroups = {all_groups: Ticket_Custom_Filters.groups, selected_groups: dataJSON.groups};

				$('.assignee-select').html(getTemplate('ticket-filter-assignee', tempAssignees));
				$('.group-select').html(getTemplate('ticket-filter-group', tempGroups));

				//Initializing on change events on all select dropdowns in custom filters
				$('[type="checkbox"]', $container).off('change');
				$('[type="checkbox"]', $container).on('change', function(evt) {

					var isSelected = $(this).is(':checked');
					var attributeName = $(this).attr('name');
					
					//Remove value from custom json if value is deselected
					if (isSelected) {
						var condition = {};
						condition.LHS = attributeName;
						condition.RHS = $(this).val();

						switch(condition.LHS){
							case 'status':
								condition.CONDITION = 'TICKET_STATUS_IS';
								break;
							case 'priority':
								condition.CONDITION = 'TICKET_PRIORITY_IS';
								break;
							case 'ticket_type':
								condition.CONDITION = 'TICKET_TYPE_IS';
								break;
							case 'assignee_id':
							case 'group_id':
								condition.CONDITION = 'EQUALS';
								break;
						}

						Ticket_Custom_Filters.customFilters.push(condition);
					}else{
						for(var i=0; i< Ticket_Custom_Filters.customFilters.length; i++){

							var condition = Ticket_Custom_Filters.customFilters[i];

							if(condition.LHS == attributeName && condition.RHS == $(this).val()){

								Ticket_Custom_Filters.customFilters.splice(i, 1);
								break;
							}
						}
					}

					//Re-render collection with customized filters
					Tickets.fetchTicketsCollection();
				});
			});
		});	
	},

	prepareConditions: function(callback){

		var statusArray = ['NEW', 'OPEN', 'PENDING', 'CLOSED'], 
			priorityArray = ['LOW', 'MEDIUM','HIGH'], 
			typeArray = ['PROBLEM','INCIDENT','TASK','QUESTION'], assigneesArray = [], groupsArray = [];
		
		for(var i=0; i<this.assignees.length; i++)
			assigneesArray.push(this.assignees[i].id);
		
		for(var i=0; i<this.groups.length; i++)
			groupsArray.push(this.groups[i].id);

		var filterJSON = {}, dataJSON = {}, _status=[], _priority=[], _type=[], _assignees=[], _groups=[];

		if(Ticket_Filter_ID)
			filterJSON = App_Ticket_Module.ticketFiltersList.collection.get(Ticket_Filter_ID).toJSON();

		for(var i=0; i<filterJSON.conditions.length; i++){

			var condition = filterJSON.conditions[i];

			Ticket_Custom_Filters.customFilters.push(condition);

			switch(condition.LHS){
				case 'status':{

					if(condition.CONDITION == 'TICKET_STATUS_IS'){

						if(_status.indexOf(condition.RHS) == -1)
							_status.push(condition.RHS);
					}else{
						for(var j=0; j<statusArray.length; j++){

							var status = statusArray[j];

							if(condition.RHS == status)
								continue;

							if(_status.indexOf(status) == -1)
								_status.push(status);
						}
					}

					break;
				}	
				case 'priority':
					
					if(condition.CONDITION == 'TICKET_PRIORITY_IS'){

						if(_priority.indexOf(condition.RHS) == -1)
							_priority.push(condition.RHS);
					}else{
						for(var j=0; j<priorityArray.length; j++){

							var priority = priorityArray[j];

							if(condition.RHS == priority)
								continue;

							if(_priority.indexOf(priority) == -1)
								_priority.push(priority);
						}
					}

					break;
				case 'ticket_type':
					
					if(condition.CONDITION == 'TICKET_TYPE_IS'){

						if(_type.indexOf(condition.RHS) == -1)
							_type.push(condition.RHS);
					}else{
						for(var j=0; j<typeArray.length; j++){

							var type = typeArray[j];

							if(condition.RHS == type)
								continue;

							if(_type.indexOf(type) == -1)
								_type.push(type);
						}
					}

					break;
				case 'assignee_id':
					
					if(condition.CONDITION == 'EQUALS'){

						if(_assignees.indexOf(condition.RHS) == -1)
							_assignees.push(condition.RHS);
					}else{
						for(var j=0; j<assigneesArray.length; j++){

							var assignee = assigneesArray[j];

							if(condition.RHS == assignee)
								continue;

							if(_assignees.indexOf(assignee) == -1)
								_assignees.push(assignee);
						}
					}

					break;	
				case 'group_id':
					
					if(condition.CONDITION == 'EQUALS'){

						if(_groups.indexOf(condition.RHS) == -1)
							_groups.push(condition.RHS);
					}else{
						for(var j=0; j<groupsArray.length; j++){

							var group = groupsArray[j];

							if(condition.RHS == group)
								continue;

							if(_groups.indexOf(group) == -1)
								_groups.push(group);
						}
					}
			}
		}

		dataJSON.status = _status.toString();
		dataJSON.priority = _priority.toString();
		dataJSON.type = _type.toString();
		dataJSON.assignees = _assignees.toString();
		dataJSON.groups = _groups.toString();

		if(callback)
			callback(dataJSON);
	}
};