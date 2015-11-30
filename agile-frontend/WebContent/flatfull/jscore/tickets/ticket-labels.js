
var Ticket_Labels = {

	labelsCollection : new Object(),

	initChoosenSelect: function(el){

		head.js('/lib/chosen.jquery.min.js', function()
		{	
			var $select = $(".chosen-select", el);

			//Initliazing multi select drop down
			$select.chosen();

			$select.off('change');
			$select.on('change', function(evt, params) {
			   
				if(params && params.deselected){
			   		Ticket_Labels.updateLabel(params.deselected, 'remove');
			   		return;
			   	}

			   	Ticket_Labels.updateLabel(params.selected, 'add');
			});
		});
	},

	fetchCollection: function(callback){

		var Labels = Backbone.Collection.extend({
		  url: '/core/api/tickets/labels'
		});

		new Labels().fetch({success: function(collection){

			console.log('Label collection length: ' + collection.length);
			Ticket_Labels.labelsCollection = collection;

			if(callback)
				callback(collection);
		}});
	},

	showSelectedLabels: function(labels, key, el){

		if(!this.labelsCollection || $.isEmptyObject(this.labelsCollection)){
			this.fetchCollection(function(){
				Ticket_Labels.prepareOptionsList(labels, key, el);
			});

			return;
		}

		this.prepareOptionsList(labels, key, el);	
	},

	prepareOptionsList: function(labels, key, el){

		if(!this.labelsCollection)
			return;

		var optionList = '';

		var labelsJSON = this.labelsCollection.toJSON();

		var key = (!key) ? "label" : key;	

		for(var i =0; i< labelsJSON.length; i++){

			var selected = '';

			for(var j=0; j< labels.length; j++){

				if(labels[j] == labelsJSON[i][key]){
					selected =  'selected';
					break;
				}	
			}

			//var isLabelSelected = labels.
			optionList += "<option value='"+ labelsJSON[i][key] + "' " + selected + ">" + labelsJSON[i].label + "</option>";
		}

		$(".chosen-select").html(optionList);

		//Initializing type ahead for tags
		this.initChoosenSelect(el);
	},

	updateLabel: function(label, command, callback){

		if(!label || !Current_Ticket_ID){
			if(callback)
				callback();

			return;	
		}
				
		var ticketModel = App_Ticket_Module.ticketView.model.toJSON();

		if(ticketModel.labels)
			ticketModel.labels.push(label);
		else
			ticketModel.labels = new Array(label);

		var newTicketModel = new BaseModel();
		newTicketModel.url = "/core/api/tickets/update-labels?command="+ command +"&label=" + label + '&id=' + Current_Ticket_ID;
		newTicketModel.save(ticketModel, 
			{
				success: function(model){

				 App_Ticket_Module.ticketView.model.set(model, {silent: true});

				if(callback)
					callback();
			}
		});
	}
};