// Adding custom fields Author: Yaswanth  08-10-2012

$(function(){
	$(".fieldmodal").die().live('click', function(event){
		event.preventDefault();
		var modal_id = $(this).attr('id');
		//Creating model for bootstrap-modal
		var modelView = new Base_Model_View({
			url: '/core/api/custom-fields',
			template: 'custom-field-'+modal_id+'-modal',
			window: 'custom-fields',
			reload: true,
			modal: '#'+modal_id+'Modal',
			isNew: true,
			postRenderCallback: function(el){ 
				$('.modal-backdrop').remove();
				
				$('#'+modal_id+'Modal',el).modal('show');
				}
			});

		
		$('#custom-field-modal').html( modelView.render().el );
	});
});

function addCustomFieldsToForm(context, callback)
{

	var custom_fields = Backbone.Model.extend({
		url: "core/api/custom-fields"
	});
	
	new custom_fields().fetch({success: function(custom_field_data) {
    		
    		var custom_fields_list = [];
    		
    		$.each(custom_field_data.toJSON(), function(index, value){
    			custom_fields_list.push(value);
    		});
    		
    		//var contact = contact.toJSON();
    		
    		context['custom_fields'] = custom_fields_list;
    		
    		if (callback && typeof(callback) === "function") {
        		
        		// execute the callback, passing parameters as necessary
        		callback(context);
        	}
    		
		}
	});

}