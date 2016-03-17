var Ticket_Utils = {

	fetchAssignees: function(callback){

		if(Assingees_Collection &&
			Assingees_Collection.collection){

			if(callback)
				callback();

			return;
		}

		//Initializing base collection with groups URL
		Assingees_Collection = new Base_Collection_View({
			url : '/core/api/users/partial'
		});

		//Fetching assingnee collection
		Assingees_Collection.collection.fetch({
			success: function(){
				
				if(callback)
					callback();
			}
		});
	},

	fetchGroups: function(callback){

		if(Groups_Collection &&
			Groups_Collection.collection){

			if(callback)
				callback();

			return;
		}

		//Initializing base collection with groups URL
		Groups_Collection = new Base_Collection_View({
			url : '/core/api/tickets/groups'
		});

		//Fetching groups collection
		Groups_Collection.collection.fetch({
			success: function(model){
				
				if(callback)
					callback();
			}
		});
	},

	fetchContact: function(contact_id, callback){

		var contact = Backbone.Model.extend({
			url : "/core/api/contacts/" + contact_id
		});

		new contact().fetch({
			success : function(contactModel) {

				Ticket_Utils.Current_Ticket_Contact = contactModel;

				if (callback)
					callback();
			}
		});
	},

	dateDiff: function(date_future, date_now){

		// get total seconds between the times
		var delta = Math.abs(date_future - date_now) / 1000;

		// calculate (and subtract) whole days
		var days = Math.floor(delta / 86400);
		delta -= days * 86400;

		// calculate (and subtract) whole hours
		var hours = Math.floor(delta / 3600) % 24;
		delta -= hours * 3600;

		var txt = (days > 0) ? (days + ' day' + (days > 1 ? 's' : '') + ' ') : '';

		txt += (hours > 0) ? (hours + ' hr' + (hours > 1 ? 's' : '')) : '';

		return txt.trim();
	},

	resetModalSettings: function($ele){

		if($ele)
			$ele.modal('hide');

		var $body = $('body');

		if($body.hasClass('modal-open')){
			$body.removeClass('modal-open').animate({scrollTop: 0}, "slow");
			$body.css('padding-right', '');
		}
	},

	loadDateChartAndDatePicker: function(callback){

		head.js(LIB_PATH + 'lib/date-charts.js', 
				  LIB_PATH + 'lib/date-range-picker.js'+'?_=' + _AGILE_VERSION, function(){

			if(callback)
				callback();
		});
	},

	loadTextExpander: function(callback){

		head.js('/flatfull/lib/jquery.textarea-expander.js?_=' + _AGILE_VERSION, function(){

			if(callback)
				callback();
		});
	},

	loadInsertCursor: function(callback){

		head.js('/flatfull/lib/jquery.insertatcursor.js?_=' + _AGILE_VERSION, function(){

			if(callback)
				callback();
		});
	},

	enableTooltips: function(el){
		$('[data-toggle="tooltip"]', el).tooltip();
	},

	loadTimeAgoPlugin: function(callback){
		head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
			
			if(callback)
				callback();
		});
	},

	getPropertyFromTicket: function(property_name){

		if(!App_Ticket_Module.ticketView.model)
			return '';

		var ticketJSON = App_Ticket_Module.ticketView.model.toJSON();

		return ticketJSON[property_name];
	},

	//Should be used only when ticket collection is available
	isTicketAttributesChanged: function(ticket_id, attributesJSON){

		var ticket_json = App_Ticket_Module.ticketsCollection.collection.get(ticket_id).toJSON();

		var isAttributeChanged = false;

		for (var key in attributesJSON) {
		  
		  if(attributesJSON[key] === ticket_json[key])
		  	continue;

		  isAttributeChanged = true;
		}

		return isAttributeChanged;
	},

	showNoty: function(type, message, position, timeout){

		$.noty.clearQueue();
		
		head.js('lib/noty/layouts/bottom.js', LIB_PATH
				+ 'lib/noty/layouts/bottomRight.js', LIB_PATH
				+ 'lib/noty/themes/default.js', function(){

			noty({
				text : message,
				layout : position,
				//dismissQueue: true,
				type : type,
				animation : {
					open : {
						height : 'toggle'
					},
					close : {
						height : 'toggle'
					},
					easing : 'swing',
					speed : 500
				},
				timeout : timeout,
			});
		});
	}
};