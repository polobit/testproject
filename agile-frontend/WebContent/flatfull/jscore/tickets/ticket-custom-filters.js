var Ticket_Custom_Filters = {

	customFilters: new Array(),
	assignees: [],
	groups: [],
	filters: [],
	template_ui: '',
	template_data_json: {},

	reset: function(){
		this.customFilters = new Array();
		template_data_json = {};
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

	initEvents: function(){

		var $container = $('#custom-filters-container');

		//Initializing date picker
		head.load(LIB_PATH + 'lib/date-charts.js', 
				  LIB_PATH + 'lib/date-range-picker.js'+'?_=' + _AGILE_VERSION, function()
		{	
			var $input = $('.due-date-input', $container);

			$input.datepicker({ 
				drops: "down", 
				dateFormat : CURRENT_USER_PREFS.dateFormat
			}).on('changeDate', function(ev)
			{
				//Show clear button
				$('#clear-due-date').show();

				$input.blur();

				$input.datepicker("hide");

				Ticket_Custom_Filters.changeDueDate(Date.parse($input.val()).getTime());
			});

			$('.daterangepicker').remove();

			// Bootstrap date range picker.
			$('#created-date-input').daterangepicker({drops: 'up', locale : { applyLabel : 'Apply', cancelLabel : 'Cancel', firstDay : parseInt(CALENDAR_WEEK_START_DAY)}}, function(start, end)
			{
				var range = $('#created-date-input').val();
				var range_array = range.split('-');

				$('#clear-created-date').show();

				Ticket_Custom_Filters.changeCreatedDate(range_array[0], range_array[1]);
			});
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
	  	$container.off('click','a#clear-due-date');
	  	$container.on('click','a#clear-due-date', function(event){

	  		$(this).hide();

	  		$('input.due-date-input').val('');
	  		
	  		//Re-render collection with updated filter conditions
	  		Ticket_Custom_Filters.changeDueDate();
	  	});

	  	//Initializing click event on clear create date button
	  	$container.off('click','a#clear-created-date');
	  	$container.on('click','a#clear-created-date', function(event){

	  		$(this).hide();

	  		$('input.created-date-input').val('');
	  		
	  		//Re-render collection with updated filter conditions
	  		Ticket_Custom_Filters.changeCreatedDate();
	  	});

	  	//Initializing click event on due date button
	  	$container.off('click','a.choose-due-date');
	  	$container.on('click','a.choose-due-date', function(event){

	  		var value = $(this).data('value'), current_date = new Date();

	  		var $input = $('.due-date-input', $container);

	  		//Show clear button
	  		$('#clear-due-date').show();

	  		$input.blur();

			$input.datepicker("hide");

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
	  		$input.val(current_date.format('mm/dd/yyyy'));

	  		//Re-render collection with updated filter conditions
	  		Ticket_Custom_Filters.changeDueDate(current_date.getTime());
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

					$('body').removeClass('modal-open').animate({ scrollTop: 0 }, "slow");
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

		//Initializing click event on 'Save as' button in LHS filters 
		$container.off('click','.clear-custom-filter');
		$container.on('click','.clear-custom-filter', function(e){
			e.preventDefault();

			if(!Ticket_Custom_Filters.isFilterChanged())
				return;

			App_Ticket_Module.ticketsByFilter(Ticket_Filter_ID);

			Ticket_Bulk_Ops.clearSelection();
		});

		var $select = $(".chosen-select");

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
					case 'assignee_id':
					case 'group_id':
						condition.CONDITION = 'EQUALS';
						break;
					case 'ticket_type':
						condition.CONDITION = 'TICKET_TYPE_IS';
						break;
					case 'ticket_favorite':
					case 'ticket_spam':
						condition.CONDITION = 'TICKET_IS';
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
	},

	renderLayout: function(){

		Ticket_Custom_Filters.prepareConditions(function(){

			getTemplate("ticket-custom-filters", Ticket_Custom_Filters.template_data_json, undefined, function(template_ui){

				if(!template_ui)
			  		return;

			  	Ticket_Custom_Filters.template_ui = template_ui;

			  	var $container = $('#custom-filters-container');

			  	$container.html($(template_ui));

			  	var tempAssignees = {all_assignees: Ticket_Custom_Filters.assignees, selected_assignees: Ticket_Custom_Filters.template_data_json.assignees};
				var tempGroups = {all_groups: Ticket_Custom_Filters.groups, selected_groups: Ticket_Custom_Filters.template_data_json.groups};

				$('.assignee-select').html(getTemplate('ticket-filter-assignee', tempAssignees));
				$('.group-select').html(getTemplate('ticket-filter-group', tempGroups));

				//Initializes chosen dropdown, fetches labels collection and renders selected labels
			  	Ticket_Labels.fetchCollection(function(labelsCollection){

			  		head.js('/flatfull/css/misc/chosen.css','/lib/chosen.jquery.min.js', function() {
				  		var optionList = "";
						$.each(labelsCollection.toJSON(), function(index, label) {
							optionList += "<option value='" + label.id + "'>"
										+ label.label + "</option>";
						});

						var $select = $(".chosen-select");

						$select.html(optionList);

						$.each(Ticket_Custom_Filters.template_data_json.labels, function(index, label) {
							
							var $option = $select.find('option[value="'+ label.RHS +'"]');
							if($option && $option.length){

								$option.attr('selected', 'selected');

								if(label.CONDITION == 'TICKET_LABEL_IS_NOT')
									$option.html('!' + $option.html());
							}
						});

						Ticket_Custom_Filters.initEvents();
					});
				});
			});
		});	
	},

	prepareConditions: function(callback){

		var statusArray = ['NEW', 'OPEN', 'PENDING', 'CLOSED'], 
			priorityArray = ['LOW', 'MEDIUM','HIGH'], 
			typeArray = ['PROBLEM','INCIDENT','TASK','QUESTION'], assigneesArray = [], groupsArray = [];
		
		var is_favorite = false, is_spam = false;

		for(var i=0; i<this.assignees.length; i++)
			assigneesArray.push(this.assignees[i].id);
		
		for(var i=0; i<this.groups.length; i++)
			groupsArray.push(this.groups[i].id);

		var _status=[], _priority=[], _type=[], _assignees=[], _groups=[], _labels = [];

		if(Ticket_Custom_Filters.customFilters.length == 0){
			var filterJSON = App_Ticket_Module.ticketFiltersList.collection.get(Ticket_Filter_ID).toJSON();

			//Cloning filter object to avoid changing in collection when custom filter changed
			var copiedFilterJSON = $.extend(true, {}, filterJSON)

			Ticket_Custom_Filters.customFilters = copiedFilterJSON.conditions;
		}

		for(var i=0; i<Ticket_Custom_Filters.customFilters.length; i++){

			var condition = Ticket_Custom_Filters.customFilters[i];

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
					break;	
				case 'ticket_favorite':{

					if(condition.CONDITION == 'TICKET_IS'){
						is_favorite= true;
					}

					break;
				}
				case 'ticket_spam':{
					
					if(condition.CONDITION == 'TICKET_IS'){
						is_spam = true;
					}
				}
			}
		}

		Ticket_Custom_Filters.template_data_json.status = _status.toString();
		Ticket_Custom_Filters.template_data_json.priority = _priority.toString();
		Ticket_Custom_Filters.template_data_json.type = _type.toString();
		Ticket_Custom_Filters.template_data_json.assignees = _assignees.toString();
		Ticket_Custom_Filters.template_data_json.groups = _groups.toString();
		Ticket_Custom_Filters.template_data_json.labels = _labels;
		Ticket_Custom_Filters.template_data_json.is_favorite = is_favorite;
		Ticket_Custom_Filters.template_data_json.is_spam = is_spam;

		if(callback)
			callback();
	},

	changeDueDate: function(epoch_time){

		//Removing existing due date conditions from custom filters
  		for(var i=0; i< Ticket_Custom_Filters.customFilters.length; i++){

			var condition = Ticket_Custom_Filters.customFilters[i];

			if(condition.LHS != 'due_date')
				continue;

			Ticket_Custom_Filters.customFilters.splice(i, 1);
		}

		if(epoch_time){

			var condition = {};
			condition.LHS = 'due_date';
			condition.CONDITION = 'IS_LESS_THAN';
			condition.RHS = Math.floor(epoch_time/1000);

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

			//If selected for one day add secs to end time
			if(condition.RHS == condition.RHS_NEW)
				condition.RHS_NEW += 86400;

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
		
		$('div.update-name').toggle();
	},

	changViewName: function(){
		var selectedFilterName = $('[name="filter-collection"] option:selected').text()

		$('input[name="name"]', $('form#saveFilterForm')).val(selectedFilterName);
	}
};