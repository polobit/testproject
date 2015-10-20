
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

		console.log(event.currentTarget);

		var $currentTarget = $(event.currentTarget);
		$currentTarget.closest("tr").remove();
	},

	fetch_filters_collection: function(){
		
		App_Ticket_Module.ticketFiltersCollection = new Base_Collection_View({
			url : '/core/api/tickets/filters',
			sortKey:"updated_time",
			descending:true,
			templateKey : "ticket-filters-list",
			individual_tag_name : 'li',
			postRenderCallback : function(el){

				//Fetch ticket collection count
				Tickets_Count.fetch_filter_tickets_count();
			}
		});

		App_Ticket_Module.ticketFiltersCollection.collection.fetch();
		$("#filters-list-container").html(App_Ticket_Module.ticketFiltersCollection.el);
	}
};