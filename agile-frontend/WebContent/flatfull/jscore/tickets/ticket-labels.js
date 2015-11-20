
var Ticket_Labels = {

	initEvents: function(el){

		/**
		 * Initializing click event on add label btn
		 */
		$(el).on('click', "a#add-new-label, a.close-new-label", function(e){
			e.preventDefault();
			
			$('#add-label-btn').toggle();
			$('#new-label-form').toggle();
			$('input', el).focus();
		});

		/**
		 * Initializing click event on save btn and enter event in input field
		 */
		$(el).on('click', "input.add-new-label, a.add-new-label", function(e){
			e.preventDefault();
			

		});
	},

	appendLabelManagement: function(base_model){

		var itemView = new Ticket_Base_Model({
			model : base_model,
			"view" : "inline",
			template : this.options.templateKey + "-model",
			tagName : 'li',
		});

		console.log(itemView);

		var key = base_model.get('label').charAt(0).toUpperCase();
		console.log($('div[tag-alphabet="' + encodeURI(key) + '"]', this.el))

		var el = itemView.render().el;
		$(el).addClass('tag bg-white');
		
		var tag_name = base_model.get('label');
		if(!isValidTag(tag_name, false)) {
			$(el).addClass('error');
		}

		var element = $('div[tag-alphabet="' + encodeURI(key) + '"] ul', this.el);
		console.log(element.length);
		if (element.length > 0)
			$('div[tag-alphabet="' + encodeURI(key) + '"] ul', this.el).append(
					$(el));
		else {
			$(this.model_list_element).append("<div class='clearfix'></div>")
					.append($(el));
		}
	}
};
