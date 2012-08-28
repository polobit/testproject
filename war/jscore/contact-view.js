function contactTableView(base_model) {
    var itemView = new Base_List_View({
        model: base_model,
        template: 'contacts-custom-view-model',
        tagName: this.options.individual_tag_name
    });

    var modelData = this.options.modelData;

    var data = modelData['fields_set'];

    var json = base_model.toJSON();
    
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

    });
    
  // Fetch collection and add to contact collection template
   App_Contacts.customView.collection.fetch({
	  	success: function(){
	  		$("#view-list",cel).html(App_Contacts.customView.render().el);
	  	}	
    })
}


$(function(){
	$('.ContactView').die().live('click',function(e){
		
		e.preventDefault();
		
		var id = $(this).attr('id');
		
		// Gets Model of selected contact-view
		var contactViewModel = App_Contacts.customView.collection.get(id).toJSON();
		
	    var view = new Base_Collection_View({
            url: '/core/api/contacts',
            restKey: "contact",
            modelData: contactViewModel,
            templateKey: "contacts-custom-view",
            individual_tag_name: 'tr'
        });
	    
	    // Defines appendItem for custom view 
	    view.appendItem = contactTableView;
	    
	    // Fetch collection and set tags and contact-views list
	    view.collection.fetch({
	    	success :function() {
	    		setupViews(view.render().el);
	    		setupTags(App_Contacts.contactsListView.el);
	    	}
	    });
	   
	    $('#content').html(view.render().el);
		
	});
});