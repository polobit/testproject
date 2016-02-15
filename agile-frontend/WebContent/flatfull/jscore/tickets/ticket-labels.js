var Ticket_Labels = {

	labelsCollection : undefined,

	initChoosenSelect : function(el) {

		head.js('/lib/chosen.jquery.min.js', function() {
			var $select = $(".chosen-select", el);

			// Initliazing multi select drop down
			$select.chosen({no_results_text: "No labels found"});

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

	showSelectedLabels : function(labels, el) {

		this.fetchCollection(function() {
				Ticket_Labels.prepareOptionsList(labels, el);
			});

		return;
	},

	prepareOptionsList : function(labels, el) {

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
		this.initChoosenSelect(el);
	},

	updateLabel : function(label, command, callback) {

        //console.log(command);
		if (!label || !Current_Ticket_ID) {
			if (callback)
				callback();

			return;
		}

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

				console.log(ticket_labels);                      
			}

			ticket_model.set({labels: ticket_labels}, {
					silent : true
			});

			//console.log(App_Ticket_Module.ticketsCollection.collection.get(Current_Ticket_ID)); 
		} 		         
		
		var newTicketModel = new BaseModel();
		     
		newTicketModel.url = "/core/api/tickets/update-labels?command="
				+ command + "&label=" + label + '&id=' + Current_Ticket_ID;

		//var ticketModel = App_Ticket_Module.ticketView.model.toJSON();

		newTicketModel.save(ticket_model, {
			success : function(model) {
               
    //            App_Ticket_Module.ticketView.model.set(model, {
				// 	silent : true
				// });

				if (callback)
					callback();
			}
		});
	},

	loadColorPicker: function(color){

		var colors = [ '007034', '0d8957', '2b9464', '3da179', '399b22', '5e8c00',
			'83bf17', '83aa30', '7ea333', '8bad39', '8c8535', '999900',
			'b8be1c', 'aba918', 'b1eb00', 'bff073', 'ccc51c', 'd0c91f',
			'cbbb58', 'f7f960', 'ff9700', 'ffba00', 'ffac00', 'fe9601',
			'ff9d33', 'ffc833', 'e8b71a', 'ffe600', 'fce014', 'ffd900',
			'f5df65', 'f0a830', 'ffca00', 'ffd464', 'ffc300', 'ffd041',
			'f07818', 'ff8400', 'cc6600', '9c0f5f', 'b9006e', 'bd007d',
			'cc0063', 'd40e52', 'aa2159', 'e03d89', 'e664a1', 'ff66cc',
			'ff85cb', 'e8a0b8', 'cd7881', 'd94e67', 'bb0f00', 'de0202',
			'cd1719', 'c91b26', 'ff2321', 'ed1c24', 'e53535', 'dc2742',
			'db3340', 'd93240', 'ff432e', 'ff534b', 'dc403b', 'de4d4e',
			'ff4c65', 'e94c6f', 'c15661', 'e74700', 'ff5108', 'f05a28',
			'f2671f', 'e95d22', 'da4624', 'd14d28', 'f05b47', 'de593a',
			'f76835', 'ed7d4e', 'd75c37', 'd96459', 'de5842', 'c05949',
			'fb6648', 'f98a5f', 'df514c', 'e45f56', 'fb6964', 'f15d58',
			'eb7260', 'f26547', 'ef9950', 'f2ae72', '3a0256', '5c00bd',
			'442d65', '3f0082', '660066', '60047a', '86269b', '5c2d50',
			'5e3448', '775ba3', '8b8dd2', '6e70c7', '62587c', '74aaf7',
			'4d6684', '3475a7', '008bba', '14b8b1', '29aba4', '4aaaa5',
			'009d97', '17a697', '25aaa0', '28be9b', '02d0ac', '41d4cf',
			'02c9c9', '5db89d', '77ba9b', '91c5a9', '78c0a8', '00b796',
			'1fda9a', 'a3d39c', '588c73', '59c4c5', '8fd4d9', '92dce0',
			'53bbf4', '33afff', '1499d3', '28abe3', '0b99bc', '1ba3e1',
			'009bff', '0c98cf', '0aa0d9', '6e9ecf', '3a9ad9', '59c8df',
			'0dc9f7', '00c8f8', '00c8f9', '05bde9', '00d2f1', '00ccd6',
			'017280', '241b3b', '021542', '160a47', '10206b', '1352a2',
			'3b5998', '293e6a', '20457c', '015391', '817996', '638ca6',
			'6991ac', '7195a3', '348e99', '5f9da1', '609194', '0f5959',
			'3b3a35', '363635', '3d3d3d', '333333', '333332', '525252',
			'424242', '5a6a62', '818181', '7f7f7f', '6c6e70', '666666',
			'67727a', '3c4554', '354458', '35404f', '274257', '7c0f0f',
			'6e0000', '591e23', '542733', '57102c', '6d2908', '643200',
			'753a48', '8c4646', '954f47', 'a68572', '2d3033', '000000',
			'281400', '333300', '2b2301', '49352a', '493621', '5e412f',
			'704f2d', '73503c', '82683b', 'a68f58', 'afa577', 'a79e65',
			'b6a754', 'b4830b', 'c39c3c' ];

		if (color)
			color = color.replace("#", "");

		if (($.inArray(color, colors) == -1) || color == "gray") {
			color = "241b3b";
		}

		head.js('lib/jquery.colorpicker.min.js', function() {

			if($('#color_code').is(':visible')){
				$.fn.colorPicker.defaults.colors = colors;
				
				$('#color_code').val(color);

				$('#color_code').colorPicker();

				// Disable color input field
				$('.colorPicker-palette').find('input').attr('disabled', 'disabled');
			}
		});
	}
};