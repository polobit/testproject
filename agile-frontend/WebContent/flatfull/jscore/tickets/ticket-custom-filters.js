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

			  	//Initializaing due date picker
			  	Tickets.initDateTimePicker($('.due-date-input'), true, function(start){
			  		
			  		//Show clear button
					$('#clear-due-date').show();

			  		//Calculate date differences between them
			  		var duration = moment.duration((moment(start).diff(moment(new Date()))));

			  		Ticket_Custom_Filters.changeDueDate(duration.asHours());
			  	});

			  	//Initializaing created date filter picker
			  	Tickets.initDateTimePicker($('.created-date-input'), false, function(start, end){
			  		
			  		//Show clear button
					$('#clear-created-date').show();

			  		Ticket_Custom_Filters.changeCreatedDate(start, end);
			  	});

			  	var options = [];

			  	//Initializing click event due date dropdown
			  	$container.off('click','ul.due-date-dropdown li a');
			  	$container.on('click','ul.due-date-dropdown li a', function(event){

			  		var $target = $(event.currentTarget);
			  		$(event.target).blur();

			  		if($target.hasClass("due-date-custom")){

			  			$('input.due-date-input').trigger('click');
			  			return false;
			  		}else if($target.hasClass("clear-due-dates")){

			  			options = [];
			  			$('input.due-date-input').val('');
			  			$('.due-date-chbx').prop('checked', false);

			  			return false;
			  		}

			  		var val = $target.attr('data-value'),
       					$chbx = $target.find('input[type="checkbox"]'), idx;

       				if((idx = options.indexOf(val)) > -1){
				      options.splice(idx, 1);
				      setTimeout(function(){$chbx.prop('checked', false)}, 0);
				   	}else{
				      options.push(val);
				      setTimeout(function(){$chbx.prop('checked', true)}, 0);
				   	}
					
					$('input.due-date-input').val(options);
					return false;
			  	});

			  	//Initializing click event on clear due date button
			  	$container.off('click','a#clear-created-date');
			  	$container.on('click','a#clear-due-date', function(event){

			  		$(this).hide();

			  		var $input = $('input.due-date-input');
			  		
			  		//Set date in daterange picker
			  		$input.data('daterangepicker').setStartDate(new Date());

			  		//Set date in daterange picker
			  		$input.data('daterangepicker').setEndDate(new Date());

			  		$input.val('');
			  		
			  		//Re-render collection with updated filter conditions
			  		Ticket_Custom_Filters.changeDueDate();
			  	});

			  	//Initializing click event on clear create date button
			  	$container.off('click','a#clear-created-date');
			  	$container.on('click','a#clear-created-date', function(event){

			  		$(this).hide();

			  		var $input = $('input.created-date-input');

			  		//Set date in daterange picker
			  		$input.data('daterangepicker').setStartDate(new Date());

			  		//Set date in daterange picker
			  		$input.data('daterangepicker').setEndDate(new Date());

			  		$input.val('');
			  		
			  		//Re-render collection with updated filter conditions
			  		Ticket_Custom_Filters.changeDueDate();
			  	});

			  	//Initializing click event on due date button
			  	$container.off('click','a.choose-due-date');
			  	$container.on('click','a.choose-due-date', function(event){

			  		var value = $(this).data('value'), current_date = new Date();

			  		//Show clear button
			  		$('#clear-due-date').show();

			  		switch(value){
			  			case 'overdue':
			  				current_date.setDate(current_date.getDate());
			  				break;
			  			case 'tomorrow':
			  				current_date.setDate(current_date.getDate() + 1);
			  				break;
			  			case 'next_two_days':
			  				current_date.setDate(current_date.getDate() + 2);
			  				break;
			  			case 'next_three_days':
			  				current_date.setDate(current_date.getDate() + 3);
			  				break;
			  			case 'next_five_days':
			  				current_date.setDate(current_date.getDate() + 5);
			  				break;
			  		}

			  		//Set date in daterange picker
			  		$('input.due-date-input').data('daterangepicker').setStartDate(current_date);

			  		//Set date in daterange picker
			  		$('input.due-date-input').data('daterangepicker').setEndDate(current_date);

			  		//Set selected date in input field
			  		$('input.due-date-input').val(moment(current_date).format('MM/DD/YYYY'));

			  		//Calculate date differences between them
			  		var duration = moment.duration((moment(current_date).diff(moment(new Date()))));

			  		//Re-render collection with updated filter conditions
			  		Ticket_Custom_Filters.changeDueDate(duration.asHours());
			  	});

			  	//Initializes chosen dropdown, fetches labels collection and renders selected labels
			  	Ticket_Labels.fetchCollection(function(labelsCollection){

			  		head.js('/lib/chosen.jquery.min.js', function() {
				  		var optionList = "";
						$.each(labelsCollection.toJSON(), function(index, label) {
							optionList += "<option value='" + label.id + "'>"
										+ label.label + "</option>";
						});

						var $select = $(".chosen-select");

						$select.html(optionList);

						$.each(dataJSON.labels, function(index, label) {
							
							var $option = $select.find('option[value="'+ label.RHS +'"]');
							if($option && $option.length){

								$option.attr('selected', 'selected');

								if(label.CONDITION == 'TICKET_LABEL_IS_NOT')
									$option.html('!' + $option.html());
							}
						});

						// Initliazing multi select drop down
						$select.chosen({no_results_text: "No labels found"});

						$select.off('change');
						$select.on('change', function(evt, params) {

							if (params && params.deselected) {
								
								for(var i=0; i< Ticket_Custom_Filters.customFilters.length; i++){

									var condition = Ticket_Custom_Filters.customFilters[i];

									if(condition.LHS != 'labels' || condition.RHS != params.deselected)
										continue;

									Ticket_Custom_Filters.customFilters.splice(i, 1);
									break;
								}
							}
							else{
								var condition = {};
								condition.LHS = 'labels';
								condition.RHS = params.selected;
								condition.CONDITION = 'TICKET_LABEL_IS';

								Ticket_Custom_Filters.customFilters.push(condition);
							}

							//Re-render collection with customized filters
							Tickets.fetchTicketsCollection();
						});
					});
					
					//Initializing click event on 'Save as' button in LHS filters 
					$container.off('click','.save-new-filter');
					$container.on('click','.save-new-filter', function(e){

						var view = new Ticket_Base_Model({
							isNew : true, 
							template : "ticket-create-filter-modal",
							url : '/core/api/tickets/filters',
							saveCallback: function(model){

								$('#create-filter-modal').modal('hide');
								App_Ticket_Module.ticketFiltersList.collection.add(model);
								App_Ticket_Module.ticketsByFilter(model.id);
							},
							prePersist : function(model)
							{
								var json = {};
								json.conditions = Ticket_Custom_Filters.customFilters;

								var formJSON = model.toJSON();

								if(formJSON['save-type'] == 'replace')
									json.id = $('[name="filter-collection"]').val();

								model.set(json, { silent : true });
							}
						});

						$('#ticket-modals').html(view.render().el);
						$('#create-filter-modal').modal('show');
					});
			  	});

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

		var filterJSON = {}, dataJSON = {}, _status=[], _priority=[], _type=[], _assignees=[], _groups=[], _labels = [];

		if(Ticket_Filter_ID)
			filterJSON = App_Ticket_Module.ticketFiltersList.collection.get(Ticket_Filter_ID).toJSON();

		for(var i=0; i<filterJSON.conditions.length; i++){

			var condition = filterJSON.conditions[i];

			Ticket_Custom_Filters.customFilters.push(condition);

			switch(condition.LHS){
				case 'labels':{
					_labels.push(condition);
					break;
				}
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
		dataJSON.labels = _labels;


		if(callback)
			callback(dataJSON);
	},

	changeDueDate: function(hrs){

		//Removing existing due date conditions from custom filters
  		for(var i=0; i< Ticket_Custom_Filters.customFilters.length; i++){

			var condition = Ticket_Custom_Filters.customFilters[i];

			if(condition.LHS != 'hrs_since_due_date')
				continue;

			Ticket_Custom_Filters.customFilters.splice(i, 1);
			break;
		}

		if(hrs){

			var condition = {};
			condition.LHS = 'hrs_since_due_date';
			condition.CONDITION = 'IS_LESS_THAN';
			condition.RHS = parseInt(hrs);

			Ticket_Custom_Filters.customFilters.push(condition);
		}

		//Re-render collection with customized filters
		Tickets.fetchTicketsCollection();
	},

	changeCreatedDate: function(start, end){

		//Removing existing due date conditions from custom filters
  		for(var i=0; i< Ticket_Custom_Filters.customFilters.length; i++){

			var condition = Ticket_Custom_Filters.customFilters[i];

			if(condition.LHS != 'created_between')
				continue;

			Ticket_Custom_Filters.customFilters.splice(i, 1);
			break;
		}

		if(start && end){

			var condition = {};
			condition.CONDITION = 'BETWEEN';
			condition.LHS = "created_between";
			condition.RHS = Math.floor(new Date(start).getTime()/1000);
			condition.RHS_NEW =  Math.floor(new Date(end).getTime()/1000);

			Ticket_Custom_Filters.customFilters.push(condition);
		}

		//Re-render collection with customized filters
		Tickets.fetchTicketsCollection();
	},

	isFilterChanged: function(){

		var filterJSON = App_Ticket_Module.ticketFiltersList.collection.get(Ticket_Filter_ID).toJSON();
		var conditions = filterJSON.conditions;

		if(conditions.length != Ticket_Custom_Filters.customFilters.length)
			return true;

		for(var i=0; i<conditions.length; i++){

			var condition = conditions[i];
			var new_condition_exists = false;

			for(var j=0; j<Ticket_Custom_Filters.customFilters.length; j++){

				var changedCondition = Ticket_Custom_Filters.customFilters[j];

				if(condition.CONDITION == changedCondition.CONDITION && 
					condition.RHS == changedCondition.RHS)
					new_condition_exists = true;
			}

			if(!new_condition_exists)
				return true;
		}

		return false;
	},

	toggleFields: function(){
		$('div.choose-filter').toggle();
	},

	changViewName: function(){
		var selectedFilterName = $('[name="filter-collection"] option:selected').text()

		$('input[name="name"]', $('form#saveFilterForm')).val(selectedFilterName);
	}
};