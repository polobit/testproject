
var Ticket_Filters = {

	initChaining: function(el, data){

		var el_self = $(el).clone();
		var LHS, condition, RHS;

		// LHS, RHS, condition blocks are read from DOM
		LHS = $("#LHS", el);
		condition = $("#condition", el);
		RHS = $("#RHS", el);
		
		RHS.chained(condition, function(chained_el, self){

			var selected_field = $(chained_el).find('option:selected');
			var placeholder = $(':selected', LHS).attr("placeholder");
			
			// If there are any select fields without option elements they should be removed
			$("select", self).each(function(index, value){
				if($("option", value).length == 0)
					$(this).remove();
			})
			
			
			if(placeholder)
			{
				$("input", self).attr("placeholder", placeholder);
			}
		});

		condition.chained(LHS);
		
		if(data && data.conditions) {
			deserializeChainedSelect(el, data.conditions, el_self);
		} else if(data) {
			deserializeChainedSelect(el, data, el_self);
		}
			
		
		// If LHS selected is tags then typeahead is enabled on rhs field
		if ($(':selected', LHS).val() && ($(':selected', LHS).val()).indexOf('tags') != -1)
		{
			addTagsDefaultTypeahead(RHS)
		}

		// If there is a change in lhs field, and it has tags in it then tags are
		// loaded into its respective RHS block
		$('.lhs', el).on('change', function(e)
		{
			e.preventDefault();
			var value = $(this).val();

			if (value.indexOf('tags') != -1)
			{
				addTagsDefaultTypeahead($(this).closest('td').siblings('td.rhs-block'));
			}
		})
	},

	cloneTicketFiltersRow : function(event){

		// To solve chaining issue when cloned
		getTemplate('ticket-filter-add-edit', {}, undefined, function(template_ui){
			
			if(!template_ui)
				  return;

			var htmlContent = $(template_ui).find('.ticket-filter-conditions-table tr').clone();

			scramble_input_names($(htmlContent));

			Ticket_Filters.initChaining(htmlContent);

			// var htmlContent = $(this).closest("tr").clone();
			$(htmlContent).find("i.remove-filter-ticket-conditions").show();
			$('.ticket-filter-conditions-table').find("tbody").append(htmlContent);

		}, null);
	},

	removeTicketFiltersRow : function(event){

		var $currentTarget = $(event.currentTarget);
		$currentTarget.closest("tr").remove();
	},

	fetchFiltersCollection: function(callback){
		
		var force_render = true;

		App_Ticket_Module.ticketFiltersList = new Base_Collection_View({
			url : '/core/api/tickets/filters',
			sortKey:"updated_time",
			descending:true,
			customLoader: true,
			customLoaderTemplate: 'ticket-notes-loader',
			templateKey : "ticket-filters-loader",
			individual_tag_name : 'li',
			postRenderCallback : function(el){

				//Fetch ticket collection count
				Tickets_Count.fetchFilterTicketsCount();

				Ticket_Filter_ID =  !Ticket_Filter_ID ? App_Ticket_Module.ticketFiltersList.collection.at(0).id : Ticket_Filter_ID;

				//Highlighting choosen li
				$('a[filter-id="' + Ticket_Filter_ID + '"]').closest('li').addClass('active');

				var url = '#tickets/filter/' + Ticket_Filter_ID;
				Backbone.history.navigate(url, {trigger : false});

				if(force_render)
				{
					force_render = false;

					if(callback)
						callback();
				}	
			}
		});

		App_Ticket_Module.ticketFiltersList.collection.fetch();
		$("#filters-list-container").html(App_Ticket_Module.ticketFiltersList.el);
	},

	renderFiltersCollection: function(callback){

		//Rendering existing filter tickets drop down view
		$("#filters-list-container").html(App_Ticket_Module.ticketFiltersList.el);

		if(callback)
			callback();
	}
};