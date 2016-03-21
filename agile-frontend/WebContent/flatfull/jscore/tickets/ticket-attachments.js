var Ticket_Attachments = {
	
	renderExistingDocs: function(selectId, el){
		
		var collection_def = Backbone.Collection.extend({ url : 'core/api/documents'});

		// Creates a collection and fetches the data from the url set in collection
		var collection = new collection_def();

		collection.fetch({ success : function()
		{
			var data = collection.toJSON();
			data.sort(function(a, b)
			{
				if (a.name < b.name)
					return -1;
				if (b.name < a.name)
					return 1;
				return 0;
			});

			var template = "<option value='{{id}}' network_type='{{titleFromEnums network_type}}' file-name='{{name}}' size='{{size}}' url='{{url}}'>{{name}}</option>";

			// Convert template into HTML
			var modelTemplate = Handlebars.compile(template);

			$("#" + selectId).empty();

			// Iterates though each model in the collection and
			// populates the template using handlebars
			$.each(data, function(index, model)
			{
				$("#" + selectId).append(modelTemplate(model));
			});

			$("#" + selectId).append("<option value='new'>Upload new doc</option>");
		}});
	},

	toggleDocsDropdown: function(){

		$('.docs-container').css('display', 'inline');
		$('.toggle-docs-dropdown').hide();

		this.renderExistingDocs('choose-document');	
	},

	addDocument: function(){

		var $option = $('select.choose-document').find(":selected");

		var json = {};
		json.name = $option.attr('file-name');
		json.url = $option.attr('url');
		json.size = $option.attr('size');

		$('ul.attachments-list').append(getTemplate('ticket-attachment-li', json));
	},

	cancelDocsDropdown: function(){

		$('.toggle-docs-dropdown').show();
		$('.docs-container').hide();
	},

	removeAttachment: function(e){
		$(e.target).closest('li').remove();
	},

	serializeList: function(form_id){

		var array = [];
		var attachments_json = $('#' + form_id + ' ul.attachments-list').map(function() {

	        $.each($(this).children(), function(g, li) {

	        	var $li = $(li);

	    		var json = {};
				json.name = $li.attr('file-name');
				json.url = $li.attr('url');
				json.size = $li.attr('size');

				array.push(json);
		    });

		    return { name: 'attachments_list', value: array };
		}).get();

		return attachments_json;
	}
};