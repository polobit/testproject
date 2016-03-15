var Ticket_Utils = {

	assignees: [],
	groups: [],

	fetchAssgineesAndGroups: function(callback){

		if(Ticket_Utils.assignees.length && Ticket_Utils.groups.length){

			if(callback)
				callback();

			return;
		}

		var Assignees = Backbone.Collection.extend({url : '/core/api/users'});
		
		new Assignees().fetch({success: function(model, response, options){
			
			Ticket_Utils.assignees = model.toJSON();

			var Groups = Backbone.Collection.extend({url: '/core/api/tickets/groups?only_groups=true'});
			new Groups().fetch({success: function(model, response, options){

				Ticket_Utils.groups = model.toJSON();

				if(callback)
					callback();
			}});
		}});
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
	}
};