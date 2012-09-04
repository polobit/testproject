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

    
    
}


function setupViews(cel) {
	
    // Show the views collection on the actions dropdown 	
   App_Contacts.customView = new Base_Collection_View({
        url: 'core/api/contact-view',
        restKey: "contactView",
        templateKey: "contact-view",
        individual_tag_name: 'li',
        id: 'view-list'

    });
    
  // Fetch collection and add to contact collection template
   App_Contacts.customView.collection.fetch({
	  	success: function(){
	  		$("#view-list",cel).html(App_Contacts.customView.el);
	  	}
    })
}


$(function(){
	$('.ContactView').die().live('click',function(e){
		
		e.preventDefault();
		
		var id = $(this).attr('id');
		
		// Gets Model of selected contact-view
		App_Contacts.contactViewModel = App_Contacts.customView.collection.get(id).toJSON();
		
	    var view = new Base_Collection_View({
            url: '/core/api/contacts',
            restKey: "contact",
            modelData: App_Contacts.contactViewModel ,
            templateKey: "contacts-custom-view",
            individual_tag_name: 'tr'
        });
	    
	    // Defines appendItem for custom view 
	    view.appendItem = contactTableView;
	    
	    // Fetch collection and set tags and contact-views list
	    view.collection.fetch({
	    	success :function() {
	    		setupViews(view.el);
	    		setupTags(view.el);
	    		$('#content').html(view.el);
	    	}
	    });
	    
	});
});



//On click on row in contact views triggers the details of particular contact view
$(function () {
    $('#contact-list-view-model-list > tr').live('click', function (e) {
        e.preventDefault();
        var data = $(this).find('.view').attr('view');

        if (data) {
            Backbone.history.navigate("contact-views-edit/" + data, {
                trigger: true
            });
        }
    });
});