var admin_products = {
	showProductNew : function(data,el) 
	{
		var isNew = false;
		isNew = !data.id;
		var modelView = new Base_Model_View
		({
			url : '/core/api/products',
			template : 'product-field-add-modal',
		//	window : 'custom-fields',
			data : data,
			//reload : true,
			modal : "#product-field-add-modal",
			isNew : isNew,
			postRenderCallback : function(el) 
			{
				console.log($("#product-field-add-modal", el));
				//This code will scroll to top to see the modal.
				
				$("#product-field-add-modal", el).modal('show');
				
				
				//Customizing the style to display the custom field modal in center for screen.
				var modalWidth = $('#product-field-add-modal').width();
			     $('#product-field-add-modal').css("left", "50%");
			     $('#product-field-add-modal').css("width", modalWidth);
			     $('#product-field-add-modal').css("margin", (modalWidth/2)*-1);
			     //bindCustomFiledChangeEvent(el);
			},
			saveCallback : function(model)
			{
				console.log(model);
				$("#product-field-add-modal").modal('hide');
				$("body").removeClass("modal-open").css("padding-right", "");
				var product_model_json = App_Admin_Settings.productsGridView.collection.get(model.id);
				if(product_model_json)
					product_model_json.set(model);	
				else	
					App_Admin_Settings.productsGridView.collection.add(model);

			},
			errorCallback : function(response)
			{
				
				$('#duplicate-product-err').html("<i>"+response.responseText + "</i>");
				$('#duplicate-product-err').removeClass("hide");
				setTimeout(function(){
					$('#duplicate-product-err').addClass("hide");
					$('#duplicate-product-err').addClass("hide");
				},3000);

			}
		});

		$('#admin-products-modal').html(modelView.render(true).el);
		
	}

}	
function initializeAdminProductsListners(el)
{
	$('#milestone-listner').off();	
	$('#milestone-listner a[href="#product-add"]').on('click', function(e) {
		e.preventDefault();
		admin_products.showProductNew({},el);
	});	
	$('#milestone-listner').on('click', '#edit-product-field', function(e){
		e.preventDefault();
		var product_field = $(this).closest('tr').data();
		admin_products.showProductNew(product_field.toJSON());
	});
	$('#milestone-listner').on('click', '#delete-product-field', function(e){
		if(confirm("Are you sure you want to delete?")){
			e.preventDefault();
			var product_field = $(this).closest('tr').data();
			console.log(product_field);
			var currentElement=$(this);
			$.ajax({ type : 'DELETE', url : '/core/api/products/' + product_field.id, contentType : "application/json; charset=utf-8",
				success : function(data){
					App_Admin_Settings.productsGridView.collection.remove(product_field.id);
					currentElement.closest('tr').remove();
				}, dataType : 'json' });
		}
	});
}