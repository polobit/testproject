function contactTableView(base_model) {
    var itemView = new Base_List_View({
        model: base_model,
        template: 'contacts-custom-view-model',
        tagName: this.options.individual_tag_name
    });

    var modelData = this.options.modelData;

    
    var data = modelData['fields_set'];
    
    var json = base_model.toJSON();
    
  //  $(this.el).html(getTemplate((this.options.templateKey + '-collection'), this.options.modelData));
    
    $('#contacts-custom-view-model-template').empty();

    $.each(data, function (index, element) {
    	$('#contacts-custom-view-model-template').append(getTemplate('contacts-custom-view-' + element, json));
    });

    $(('#contacts-custom-view-model-list'), this.el).append(itemView.render().el);

    
    $(('#contacts-custom-view-model-list'), this.el).find('tr:last').data(base_model);
    
}


function setupViews(cel, button_name) {
	
    // Show the views collection on the actions dropdown 	
	var customView = new Base_Collection_View({
        url: 'core/api/contact-view',
        restKey: "contactView",
        templateKey: "contact-view",
        individual_tag_name: 'li',
        id: 'view-list',
        postRenderCallback: function(el)
        {
        	if(button_name)
        		$(el).find('.custom_view').append(button_name);
        }

    });
    
  // Fetch collection and add to contact collection template
   customView.collection.fetch({
	  	success: function(){
	  		$("#view-list",cel).html(customView.el);
	  	}
    })
}


$(function(){
	
	$('.DefaultView').die().live('click', function(e) {
		e.preventDefault();
		console.log("default view selected");
		eraseCookie("contact_view");
		App_Contacts.contacts();
		
	});
	
	$('.ContactView').die().live('click',function(e){
		
		e.preventDefault();
		
		// Get id of the view
		var id = $(this).attr('id');
		
		// Save contact_view id as cookie
		createCookie("contact_view", id);

		// If filter is send filter url to show only filter data
		if(filter_id = readCookie('contact_filter'))
		{
			App_Contacts.customView(id, undefined, 'core/api/filters/query/' + filter_id);
			return;
		}
		
		App_Contacts.customView(id);
	});
});

//On click on row in contact views triggers the details of particular contact view
$(function () {
    $('#contact-custom-view-model-list > tr').live('click', function (e) {
        e.preventDefault();
        var data = $(this).find('.view').attr('view');

        if (data) {
            Backbone.history.navigate("contact-custom-view-edit/" + data, {
                trigger: true
            });
        }
    });
});