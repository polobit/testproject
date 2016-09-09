var Ticket_Labels = {

	labelsCollection : undefined,

	initChoosenSelect : function(el, execute_callback) {

		this.loadChosenLibrary(function() {
			var $select = $(".chosen-select", el);

			// Initliazing multi select drop down
			$select.chosen({no_results_text: "{{agile_lng_translate 'tickets' 'no-labels-found'}}"});
            
            if(execute_callback) {
				$select.off('change');
				$select.on('change', function(evt, params) {

					if (params && params.deselected) {
						Ticket_Labels.updateLabel(params.deselected, 'remove');
						return;
					}

					Ticket_Labels.updateLabel(params.selected, 'add');
				});
		    }
		});
	},

	fetchCollection : function(callback) {

		if(this.labelsCollection && this.labelsCollection.length > 0 && this.labelsCollection.toJSON() && callback){
			callback(this.labelsCollection);
			return;
		}

		var Labels = Backbone.Collection.extend({
			url : '/core/api/tickets/labels'
		});

		new Labels().fetch({
			success : function(collection) {

				console.log('Label collection length: ' + collection.length);
				Ticket_Labels.labelsCollection = collection;

				if (callback)
					callback(collection);
			}
		});
	},

	showSelectedLabels : function(labels, el, execute_callback) {

		this.fetchCollection(function() {
			Ticket_Labels.prepareOptionsList(labels, el, execute_callback);
		});

		return;
	},

	prepareOptionsList : function(labels, el, execute_callback) {

		if (!this.labelsCollection)
			return;

		var newLabelJSON = {};
		var optionList = "";
		$.each(this.labelsCollection.toJSON(), function(index, eachLabel) {

			if ($.inArray(eachLabel.id, labels) != -1)
				optionList += "<option value='" + eachLabel.id
						+ "' selected='selected'>" + eachLabel.label + "</option>";
			else
				optionList += "<option value='" + eachLabel.id + "'>"
						+ eachLabel.label + "</option>";

		});

		$(".chosen-select", el).html(optionList);

		// Initializing type ahead for tags
		this.initChoosenSelect(el, execute_callback);
	},

	updateLabel : function(label, command, callback) {

		//console.log(command);
		if (!label || !Current_Ticket_ID 
			 || Current_Route.indexOf('edit-canned-response') != -1) {
			if (callback)
				callback();

			return;
		}

        
		var url = "/core/api/tickets/" + Current_Ticket_ID + "/activity/update-labels";
		var json = {command: command, labelID: label, id: Current_Ticket_ID};

       	Tickets.updateModel(url, json, function(model){
       		

       		var label_text = $('.chosen-select option[value="'+json.labelID+'"]', 
       								App_Ticket_Module.ticketView.el).text();
       		
       		//Updating model
       		
       		if(App_Ticket_Module.ticketsCollection){

            var ticket_model = App_Ticket_Module.ticketsCollection.collection.get(Current_Ticket_ID);
            var ticket_labels = ticket_model.get('labels');
		    //console.log(ticket_labels);  
		    
		    if(!ticket_labels)
			    ticket_labels = [];

		   	if(command=='add'){
	        	ticket_labels.push(parseInt(label));
	        }
		    else{
				
				ticket_labels= jQuery.grep(ticket_labels, function(value) {
				 	return value != label;
				});                   
			}
		    ticket_model.set({labels:ticket_labels},{silent: true});
		} 		         
		
       		var msg = "{{agile_lng_translate 'contacts-view' 'label'}} "+ label_text + " {{agile_lng_translate 'tickets' 'label-deleted'}}";

       		if(json.command == 'add')
				msg = "{{agile_lng_translate 'contacts-view' 'label'}} " + label_text + " {{agile_lng_translate 'tickets' 'label-added'}}" ;
                   		
       		Ticket_Utils.showNoty('information', msg, 'bottomRight', 5000);

       		if (callback)
				callback();
		});
	},

	loadChosenLibrary: function(callback){

		head.js('/flatfull/css/misc/chosen.css', '/lib/chosen.jquery.min.js', function() {

			if (callback)
				callback();
		});
	}
};