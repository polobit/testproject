(function(categories, $, undefined) {
	
	var sendReuestInQueue = function(url,data,successCallback,errorCallback){
		queuePostRequest("task_categories", url, data, function(data)
				{
					// If defined, execute the callback function
					if (successCallback && typeof (successCallback) === "function")
						successCallback(data);

				}, function(data)
				{
					// If defined, execute the callback function
					if (errorCallback && typeof (errorCallback) === "function")
						errorCallback(data);
				});
	};
	
    var saveCategory = function(that){
    	
    	var label = $('#add_new_task_category').val();
    	// Returns, if the save button has disabled attribute
    	if ($(that).attr('disabled'))
    		return;
    	// Disables save button to prevent multiple click event issues
    	disable_save_button($(that));//$(saveBtn).attr('disabled', 'disabled');
    	
    	if (!isValidForm('#pipelineForm')) {
    		// Removes disabled attribute of save button
    		enable_save_button($(that));//$(saveBtn).removeAttr('disabled');
    		return false;
    	}
    	
    	var cat = {};
    	cat.label = label;
    	cat.order = $('#admin-settings-categories-model-list').find('tr').length;
    	console.log(cat);
    	// Saving that pipeline object
    	var category = new Backbone.Model();
    	category.url = '/core/api/categories';
    	category.save(cat, {
    		// If the milestone is changed, to show that change in edit popup if opened without reloading the app.
    		success : function(model, response) {
    			// Removes disabled attribute of save button
    			enable_save_button($(that));
    			App_Admin_Settings.categories();
    		},
			error: function(data,response){
				console.log(response,data);
				$(that).parent().find('.save-status').html('<span style="color:red;">'+response.responseText+'</span>');
				enable_save_button($(that));
			}
    	});
    	
    };
    
    deleteCategory = function(id){
    	var url = '/core/api/categories/delete';
    	var data = {};
		data.id = id;
		console.log('------------',data);
		sendReuestInQueue(url,data,function(){
			App_Admin_Settings.categoryGridView.collection.remove(App_Admin_Settings.categoryGridView.collection.get(id));
	    	$('#category-delete-modal').modal('hide');
	    	$('#'+id).closest('tr').remove();
		});
    };
	
	categories.saveCategoryOrder = function(){
		var url = '/core/api/categories/order';
		var catIds = [];
		
		$('#admin-settings-categories-model-list').find('tr').each(function(index){
			catIds[index] = $(this).find('input[name="id"]').val();
		});
		var data = {};
		data.ids = JSON.stringify(catIds);
		console.log('------------',data);
		sendReuestInQueue(url,data);
	};
	
	categories.setup_categories = function(el){
		head.js(LIB_PATH + 'lib/jquery-ui.min.js', function() {
			$(el).find('tbody').each(function(index){
				$(this).sortable({
				      containment : "#admin-settings-categories-model-list",
				      items:'tr',
				      helper: function(e, tr){
				          var $originals = tr.children();
				          var $helper = tr.clone();
				          $helper.children().each(function(index)
				          {
				            // Set helper cell sizes to match the original sizes
				            $(this).width($originals.eq(index).width());
				            $(this).css("background","#f5f5f5");
				            $(this).css("border-bottom","1px solid #ddd");
				          });
				          return $helper;
				      },
				     start: function(event, ui){
				    	  $.each(ui.item.children(),function(index,ele){
				    		  ui.helper.children().eq(index).width(ui.helper.children().eq(index).width()-$(this).width());
				    	  });
				    	  ui.helper.width(ui.helper.width());
				      },
				      sort: function(event, ui){
				    	  ui.helper.css("top",(ui.helper.offset().top+ui.item.offset().top)+"px");
				      },
				      forceHelperSize:true,
				      placeholder:'<tr><td></td></tr>',
				      forcePlaceholderSize:true,
				      handle: ".icon-move",
				      cursor: "move",
				      tolerance: "intersect",
				      
				      // When milestone is dropped its input value is changed 
				      update : function(event, ui) {
				    	  console.log($(ui.item).attr('data'));
				    	  categories.saveCategoryOrder();
				    	 // fill_ordered_milestone($(ui.item).closest('form').attr('id'));
				        }
			    });
			});
		});
	};
	
	categories.init = function(){
		$('.show_task_category_field').die().live('click',function(e){
			e.preventDefault();
			$(this).parent().hide();
			$('#task-category').find('.show_field').show();
		});
		
	    $("#add_task_category").die().live('click', function(e){
	    	e.preventDefault();
	    	saveCategory(this);
	    });
	    
	    $('.category-delete').die().live('click',function(e){
	    	e.preventDefault();
	    	$('#delete-category-confirm-dialog input').val($(this).attr('id'));
	    	$('#category-name').text($(this).attr('data'));
	    	$('#category-delete-modal').modal('show');
	    });
	    
	    $('#category-delete-confirm').die().live('click',function(e){
	    	e.preventDefault();
	    	var id = $('#delete-category-confirm-dialog input').val();
	    	deleteCategory(id);
	    });
	    
	};
	
	
}(window.categories = window.categories || {}, $));