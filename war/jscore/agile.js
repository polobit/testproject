$(function()
{
	// Collapses the menu on a mobile device
	// Without this, the user has to click the collapsible button to remove the menu
	$('.agile-menu > li').click(function(e){
	    
		console.log("Collapsing before ul");
		$nav_collapse = $(this).closest('.nav-collapse');
		console.log($nav_collapse.attr('class'));
		if($nav_collapse.hasClass('collapse'))
		{
			console.log("Collapsing");
			$nav_collapse.collapse('hide');
		}
	});
	
	// Custom event to add checkboxes to specified tables
	$('body').live('agile_collection_loaded', function(event) {
		var table = $(this).find('table.showCheckboxes');
		$(table).removeClass('table-bordered');
		$(table).closest('div.data-block').removeClass('data-block');
		
		//$(table).setAttribute('id', 'sort-table');

		// Remove, if rendere of a collection called multiple times 
		$(table).find('.thead_check').parent().remove();
		$(table).find('.tbody_check').parent().remove();
		$(this).find('.select-none').parent().remove();
		$(this).find('#delete-checked').remove();
		
		$(table).find('thead tr').prepend('<th><input class="thead_check" name="" type="checkbox"/></th>');

		$(table).find('tbody tr').prepend('<td><input class="tbody_check" type="checkbox"/></td>');
		
		$(table).after('<div class="row"><div class="span6  select-none"></div></div><a href="#" class="btn btn-danger left" id="delete-checked"> Delete</a>');
		
		sortTables(table);
	});
	
	// Event to trigger to delete checked entities  
	$('.agile_delete').live('delete-checked', function(event){
		
	});
	
	// Delete button click event
	$('#delete-checked').live('click', function(event){
		event.preventDefault();
		var id_array = [];
		var index_array = [];
		var data_array = [];
		var checked = false;
		var table = $('body').find('table.showCheckboxes');

		$(table).find('tr .tbody_check').each(function(index, element){
			// If element is checked add store it's id in an array 
			if($(element).is(':checked')){
				index_array.push(index);
				id_array.push($(element).closest('tr').data().get('id'));
				data_array.push($(element).closest('tr').data().toJSON());
				checked = true;
			}
		});
		if(checked){
			
			if(!confirm("Are you sure you want to delete?"))
	    		return;
			
			bulkOperations($(table).attr('url'), id_array, index_array, table, data_array);
		}	
		else
            $('body').find(".select-none").html('<div class="alert alert-error"><a class="close" data-dismiss="alert" href="#">×</a>You have not selected any records to delete. Please select at least one record to continue.</div>').show().delay(3000).hide(1);
			
	});
	
	// Click head - click all checkboxes of table body
	$('.thead_check').live('click', function(event){
		$('.tbody_check').attr('checked', this.checked);
		
		// Show bulk operations only when thead check box is checked
		if($(this).is(':checked'))
			$('#bulk-actions').css('display', 'block');
		else
			$('#bulk-actions').css('display', 'none');
	});	
	
	// Stop default functionality(edit) of it's parent (tr)
	$('.tbody_check').live('click', function(event){
		event.stopPropagation();
		
		// Show bulk operations only when any of the check box is checked
		if($(this).attr('checked') == 'checked')
			$('body').find('#bulk-actions').css('display', 'block');
		else{
			var check_count = 0
			$.each($('.tbody_check'), function(index, element){
				if($(element).is(':checked')){
					check_count++;
					return false;
				}
				//return;
			});
			if(check_count == 0){
				$('#bulk-actions').css('display', 'none');
			}
		}	
	});
});

// Bulk operations - delete function
function bulkOperations(url, id_array, index_array, table, data_array){
	var json = {};
	json.model_ids = JSON.stringify(id_array);
	var tbody = $(table).find('tbody');
	
	$.ajax({
		url: url,
		type: 'POST',
		data: json,
		success: function(){
			
			// To remove table rows on delete 
			for(var i = 0; i < index_array.length; i++) 
				$(tbody).find('tr:eq(' + index_array[i] + ')').fadeOut(300, function() { $(this).remove(); });
			
			// Remove data from timeline
			/*$.each(data_array, function(index, data){
				console.log(data);
				$('#timeline').isotope( 'remove', $(getTemplate("timeline", data)) );
			});*/
			
			// Tags re-fetching
			if(App_Contacts.contactsListView){
				setupTags(App_Contacts.contactsListView.el);
			}	
		}
	});
}

// Scroll to top
$(window).load(function() {
	  $("#top").click(function () {
	   $("body, html").animate({
	    scrollTop: 0
	   }, 300);
	   return false;
	  }); 
});

		