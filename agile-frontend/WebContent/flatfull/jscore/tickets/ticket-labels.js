var Ticket_Labels = {

	labelsCollection : undefined,

	initChoosenSelect : function(el) {

		head.js('/lib/chosen.jquery.min.js', function() {
			var $select = $(".chosen-select", el);

			// Initliazing multi select drop down
			$select.chosen();

			$select.off('change');
			$select.on('change', function(evt, params) {

				if (params && params.deselected) {
					Ticket_Labels.updateLabel(params.deselected, 'remove');
					return;
				}

				Ticket_Labels.updateLabel(params.selected, 'add');
			});
		});
	},

	fetchCollection : function(callback) {

		if(this.labelsCollection && this.labelsCollection.toJSON() && callback){
			callback(this.labelsCollection.toJSON());
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

	showSelectedLabels : function(labels, key, el) {

		this.fetchCollection(function() {
				Ticket_Labels.prepareOptionsList(labels, key, el);
			});

			return;

	},

	prepareOptionsList : function(labels, key, el) {

		if (!this.labelsCollection)
			return;

		var newLabelJSON = {};
		var optionList = "";
		$.each(this.labelsCollection.toJSON(), function(index, eachLabel) {

			if ($.inArray(eachLabel.id, labels) != -1)
				optionList += "<option value='" + eachLabel.id
						+ "' 'selected'>" + eachLabel.label + "</option>";
			else
				optionList += "<option value='" + eachLabel.id + "'>"
						+ eachLabel.label + "</option>";

		});

		$(".chosen-select").html(optionList);

		// Initializing type ahead for tags
		this.initChoosenSelect(el);
	},

	updateLabel : function(label, command, callback) {

		if (!label || !Current_Ticket_ID) {
			if (callback)
				callback();

			return;
		}

		var ticketModel = App_Ticket_Module.ticketView.model.toJSON();

		if (ticketModel.labels)
			ticketModel.labels.push(label);
		else
			ticketModel.labels = new Array(label);

		var newTicketModel = new BaseModel();
		newTicketModel.url = "/core/api/tickets/update-labels?command="
				+ command + "&label=" + label + '&id=' + Current_Ticket_ID;
		newTicketModel.save(ticketModel, {
			success : function(model) {

				App_Ticket_Module.ticketView.model.set(model, {
					silent : true
				});

				if (callback)
					callback();
			}
		});
	}
};