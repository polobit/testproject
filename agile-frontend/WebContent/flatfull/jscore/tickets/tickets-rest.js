var Tickets_Rest={

	removeTicketsFromCollection: function(ticketIDCSV){

		var ticketIDArray = ticketIDCSV.split(",");

		if(!ticketIDArray || ticketIDArray.length ==0)
			return;

		for(var i=0; i<ticketIDArray.length; i++){
			$('td#' + ticketIDArray[i]).closest('tr').remove();
			App_Ticket_Module.ticketsCollection.collection.remove(ticketIDArray[i]);
		}
	},
	changeStatus : function(status, callback){
    
		var url = "/core/api/tickets/" + Current_Ticket_ID + "/activity/change-status";
		var json = {status: status};

        var current_time = new Date().getTime();
		Tickets.updateModel(url, json, function(model){

				if(status != "CLOSED")
				{
				    $(".ticket-addnote-close").removeAttr("disabled");
				    $(".ticket-send-reply .btn").removeAttr("disabled");
                	$('#ticket_change_sla').removeAttr("disabled");                    	
                	$(".close-current-ticket").removeAttr("disabled");
                	$(".remove-date").css("display", "block");
				}						
				else
				{
					$(".remove-date").css("display", "none");
				    $(".ticket-addnote_close").attr("disabled","disabled"); 
					$(".ticket-send-reply .btn").attr("disabled","disabled");
					$('#ticket_change_sla').attr("disabled","disabled");
					$(".close-current-ticket").attr("disabled","disabled");
					$(".ticket_status").val("CLOSED");

					json.closed_time = current_time;
				}

                Tickets_Rest.updateDataInModelAndCollection(Current_Ticket_ID, json);
				
				if(callback)
					callback(model.toJSON());

			}, null);
	},

	closeTicket : function(e){

		this.changeStatus("CLOSED", function(){
			showNotyPopUp('information', "Ticket status has been changed to closed", 'bottomRight', 5000);
		});
	},

	deleteTicket: function(e){

		//Rendering root template
		getTemplate("ticket-delete", {}, undefined, function(template_ui){

			if(!template_ui)
		  		return;

			$('#ticketsModal').html($(template_ui)).modal('show').on('shown.bs.modal', function() {
			    
			    $('#ticketsModal').on('click', 'a.delete-ticket', function(){

					disable_save_button($(this));

					App_Ticket_Module.ticketView.model.destroy({
						success : function(model, response) {
							
							showNotyPopUp('information', "Ticket has been deleted",'bottomRight', 5000);
	                          
							var url = '#tickets/filter/' + Ticket_Filter_ID;
							Backbone.history.navigate(url, {trigger : true});
						}
					});

					$('#ticketsModal').modal('hide');
				});
			});
		});
	},

	showWorkflows: function(e){

		var $this = $(e.target);

		$this.siblings("#workflows_list").html('<li><a href="javascript:void(0);">Loading...</a></li>');

		var workflows = Backbone.Collection.extend({
			url : 'core/api/workflows'
		});

		new workflows().fetch({
			success : function(Collection) {
				$('#workflows_list').html(getTemplate("ticket-show-workflows-list", Collection.toJSON()));
			}
		});
	},

toggleFavorite : function(e){

		var favourite = true; 

		//Toggling star color
		if($(e.target).hasClass("fa-star text-warning")){
			$(e.target).removeClass("fa-star text-warning").addClass("fa-star-o text-light");
		     favourite=false;
		}else{
		   
			$(e.target).addClass("fa-star text-warning").removeClass("fa-star-o text-light");
		}

		var url = "/core/api/tickets/" + Current_Ticket_ID + "/activity/toggle-favorite";
		var json = {};

		Tickets.updateModel(url, json, function(model){

			var succesmessage = "Ticket marked favourite";

			if(!favourite)
				succesmessage = "Ticket marked as unfavourite";

             Tickets_Rest.updateDataInModelAndCollection(Current_Ticket_ID, {is_favorite:favourite});

			 showNotyPopUp('information', succesmessage, 'bottomRight', 5000);
		}, null);
	},

	toggleSpam : function(e){

		var url = "/core/api/tickets/" + Current_Ticket_ID + "/activity/toggle-spam";
		var json = {};

		Tickets.updateModel(url, json, function(model){

			var message ="";
			var spam_value=true;

			if(model.toJSON().is_spam)
			{
				$(e.target).addClass("btn-danger").removeClass("btn-default");
			    message="Ticket marked as Spam"; 
			}
			else
			{
				$(e.target).removeClass("btn-danger").addClass("btn-default");
                message="Ticket un marked as Spam";
                spam_value=false;
            }

            showNotyPopUp('information',message, 'bottomRight', 5000);
			
			Tickets_Rest.updateDataInModelAndCollection(Current_Ticket_ID, {is_spam:spam_value});

		}, null);
	},
	changeTicketType: function(event){

		var $select = $('.ticket_type');
		var new_ticket_type = $select.find('option:selected').val();
		$select.attr('disabled', true);

		var url = "/core/api/tickets/" + Current_Ticket_ID + "/activity/change-ticket-type";
		var json = {type: new_ticket_type};

		Ticket.updateModel(url, json, function(){

			// current view
			Tickets_Rest.updateDataInModelAndCollection(Current_Ticket_ID, {type : new_ticket_type}); 
				//update collection 
	   			$select.attr('disabled', false);
	            showNotyPopUp('information', 'Ticket Type has been changed to '+ new_ticket_type.toLowerCase(), 'bottomRight', 5000);
			},

			function(error){
				$select.attr('disabled', false);
			}
		);
	},

	changeTicketPriority: function(event){

		var $priority = $('.ticket_priority');
		var new_priority = $priority.find('option:selected').val();
		$priority.attr('disabled', true);

		var url = "/core/api/tickets/" + Current_Ticket_ID + "/activity/change-priority";
		var json = {priority: new_priority};

		Ticket.updateModel(url, json, function(){

			Tickets_Rest.updateDataInModelAndCollection(Current_Ticket_ID, json);

			$priority.attr('disabled', false);
			showNotyPopUp('information', 'Ticket Type has been changed to '+ new_priority.toLowerCase() , 'bottomRight', 5000);
		    
		}, function(error){
			$priority.attr('disabled', false);
		});
	},

	changeAssignee : function(e){

		var that = e.target;

		var assigneeId = $(that).val();
		//console.log(assigneeId);

		if(!assigneeId)
			return;

	    var groupId = $(that.options[that.selectedIndex]).closest('optgroup').attr('data-group-id');

	    if(!groupId){
	    	groupId = $(that).val();
	    	assigneeId = 0;
	    }
       	
       	var ticketJSON = App_Ticket_Module.ticketView.model.toJSON();

       	if(ticketJSON.assigneeID == assigneeId 
       		&& ticketJSON.groupID == groupId)
       		return;

       	var url = "/core/api/tickets/" + Current_Ticket_ID + "/assign-ticket/" + groupId + "/" + assigneeId;
       	var json = {id: Current_Ticket_ID};

       	Tickets.updateModel(url, json, function(data){
            
			var modelData = data.toJSON();

			try{
				if(modelData.assigneeID != CURRENT_DOMAIN_USER.id && Tickets.isCurrentUserExistInGroup(groupId, Tickets.groupsList))
				$('.assign-to-me').show();
			else
				$('.assign-to-me').hide();
			}
			catch(e){
				console.log(e);
			}

			var assigneeName = (modelData.assigneeID) ? (modelData.assignee.name) : modelData.group.group_name;

			var message = 'Ticket group has been changed to ' + assigneeName;

			if(modelData.assigneeID)
				var message = 'Assignee has been changed to ' + assigneeName;
			
			showNotyPopUp('information', message, 'bottomRight', 5000);

			modelData.assignee = ((modelData.assignee) ? modelData.assignee : "");
			modelData.group = ((modelData.group) ? modelData.group : "");

			// Update assignee in model and collection 
			Tickets_Rest.updateDataInModelAndCollection(modelData.id, modelData); 					
		});
    },

    updateDataInModelAndCollection : function(id, data){

	     //App_Ticket_Module.ticketView.model.set(data, {silent: true});
		// if(id !== App_Ticket_Module.ticketView.model.toJSON().id)
		// 	return;
        if(!App_Ticket_Module.ticketsCollection)
        	return;
		// get data from collection with id
		var updated_model = App_Ticket_Module.ticketsCollection.collection.get(id);

		//Update data in model
		updated_model.set(data, {silent: true, merge: false});
		//App_Ticket_Module.ticketsCollection.collection.add(data, {silent: true, merge: false})

		// App_Ticket_Module.ticketsCollection.collection.remove(data);

		// App_Ticket_Module.ticketsCollection.collection.add(data, {silent: true})

		// console.log(App_Ticket_Module.ticketsCollection.collection.get(id).toJSON());
	}
};