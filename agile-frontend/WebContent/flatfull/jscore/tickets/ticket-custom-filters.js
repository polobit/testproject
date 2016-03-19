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
	
	initEvents: function(){

		var $container = $('#custom-filters-container');

		//Initializing date picker
		Ticket_Utils.loadDateChartAndDatePicker(function()
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
			$('#created-date-input').daterangepicker({drops: 'up', locale : { applyLabel : 'Apply', cancelLabel : 'Cancel'}}, function(start, end)
			{
				var range = $('#created-date-input').val();

				if(!range)
					return;
				
				var range_array = range.split('-');

				$('#clear-created-date').show();

				Ticket_Custom_Filters.changeCreatedDate(range_array[0], range_array[1]);
			});
		});

		var options = [];
		
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

					$('#ticketsModal').modal('hide');
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

			$('#ticketsModal').html(view.render().el).modal('show');
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
	},

	initCheckboxEvents: function(){

		var $container = $('#custom-filters-container');

		//Initializing on change events on all checkboxes in LHS
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

		getTemplate("ticket-custom-filters", {}, undefined, function(template_ui){

			if(!template_ui)
		  		return;

		  	Ticket_Custom_Filters.template_ui = template_ui;

		  	var $container = $('#custom-filters-container');

		  	$container.html($(template_ui));

		  	//Loading labels library and initializing click events on all checkboxes
		  	Ticket_Labels.loadChosenLibrary(function() {

		  		//Initializes chosen dropdown, fetches labels collection
			  	Ticket_Labels.fetchCollection(function(labelsCollection){

			  		var optionList = "";
					$.each(labelsCollection.toJSON(), function(index, label) {
						optionList += getTemplate('ticket-label-option', label);
					});

					var $select = $(".chosen-select");

					$select.html(optionList);

					// Initliazing multi select drop down
					$select.chosen({no_results_text: "No labels found"});

					//Initializes click events
		  			Ticket_Custom_Filters.initEvents();
				});
		  	});

		  	Ticket_Utils.fetchAssignees(function(){

		  		var assigneeCollection = new Base_Collection_View({
		  			data: Assingees_Collection.collection.toArray(),
	 				url : '/core/api/users/partial',
	 				templateKey : "ticket-lhs-assignees",
	 				individual_tag_name : 'div'
	 			});

	 			$('.assignee-select', $container).html(assigneeCollection.render(true).el);

	 			Ticket_Utils.fetchGroups(function(){

			  		var groupsCollection = new Base_Collection_View({
			  			data : Groups_Collection.collection.toArray(),
		 				url : '/core/api/tickets/groups',
		 				templateKey : "ticket-lhs-groups",
		 				individual_tag_name : 'div'
		 			});

		 			$('.group-select', $container).html(groupsCollection.render(true).el);

		 			Ticket_Custom_Filters.checkSelectedConditions();
					Ticket_Custom_Filters.initCheckboxEvents();
			  	});
		  	});
		});
	},

	checkSelectedConditions: function(){

		if(Ticket_Custom_Filters.customFilters.length == 0){

			var filterJSON = App_Ticket_Module.ticketFiltersList.collection.get(Ticket_Filter_ID).toJSON();

			//Cloning filter object to avoid changing in collection when LHS changed
			var copiedFilterJSON = $.extend(true, {}, filterJSON)

			Ticket_Custom_Filters.customFilters = copiedFilterJSON.conditions;
		}

		for(var i=0; i<Ticket_Custom_Filters.customFilters.length; i++){

			var condition = Ticket_Custom_Filters.customFilters[i];

			switch(condition.LHS){
				case 'labels':{

					var $select = $(".chosen-select");

					var $option = $select.find('option[value="'+ condition.RHS +'"]');
					$option.attr('selected', 'selected');

					$select.trigger("chosen:updated");
					break;
				}
				case 'status':{

					if(condition.CONDITION == 'TICKET_STATUS_IS')
						$('input[value="' + condition.RHS + '"]').attr('checked', 'checked');
					
					break;
				}	
				case 'priority':
					
					if(condition.CONDITION == 'TICKET_PRIORITY_IS')
						$('input[value="' + condition.RHS + '"]').attr('checked', 'checked');

					break;
				case 'ticket_type':
					
					if(condition.CONDITION == 'TICKET_TYPE_IS')
						$('input[value="' + condition.RHS + '"]').attr('checked', 'checked');

					break;
				case 'assignee_id':
					
					if(condition.CONDITION == 'EQUALS')
						$('input[value="' + condition.RHS + '"]').attr('checked', 'checked');
					
					break;	
				case 'group_id':
					
					if(condition.CONDITION == 'EQUALS')
						$('input[value="' + condition.RHS + '"]').attr('checked', 'checked');
					
					break;	
				case 'ticket_favorite':{

					if(condition.CONDITION == 'TICKET_IS')
						$('input[name="ticket_favorite"]').attr('checked', 'checked');
					
					break;
				}
				case 'ticket_spam':{
					
					if(condition.CONDITION == 'TICKET_IS'){
						$('input[name="ticket_spam"]').attr('checked', 'checked');
					}
				}
				case 'due_date':{
					
					if(condition.CONDITION == 'IS_LESS_THAN'){
						$('input[name="due-date-input"]').val(
							new Date(parseInt(condition.RHS) * 1000).format(CURRENT_USER_PREFS.dateFormat));
						$('#clear-due-date').show();	
					}
				}
				case 'created_between':{
					
					if(condition.CONDITION == 'BETWEEN'){

						var val = new Date(parseInt(condition.RHS) * 1000).format(CURRENT_USER_PREFS.dateFormat) + ' - ' + 
									new Date(parseInt(condition.RHS_NEW) * 1000).format(CURRENT_USER_PREFS.dateFormat);

						$('input[name="created-date-input"]').val(val);
						$('#clear-created-date').show();
					}
				}
			}
		}
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

		var date_applied = false;

		//Removing existing due date conditions from custom filters
  		for(var i=0; i< Ticket_Custom_Filters.customFilters.length; i++){

			var condition = Ticket_Custom_Filters.customFilters[i];

			if(condition.LHS != 'created_between')
				continue;

			dateApplied = true;
			Ticket_Custom_Filters.customFilters.splice(i, 1);
			break;
		}

		if(!date_applied)
			return;

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