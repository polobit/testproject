$(function()
{
	/*// Collapses the menu on a mobile device
	// Without this, the user has to click the collapsible button to remove the menu
	$('.agile-menu > li').click(function(e){
	    
		console.log("Collapsing before ul");
		
		console.log($(this).html());
		
		if($(this).find('ul').length == 0)
	      {
	    	  console.log("Collapsing");
	    	  //$('.nav-collapse').collapse('hide');
	      }
	});*/
	
	// Custom event to add checkboxes to specified tables
	$('body').live('agile_collection_loaded', function(event) {
		var table = $(this).find('table.showCheckboxes');
		$(table).removeClass('table-bordered');

		// Remove, if rendere of a collection called multiple times 
		$(table).find('.thead_check').parent().remove();
		$(table).find('.tbody_check').parent().remove();
		$(this).find('#delete-checked').remove();
		
		$(table).find('thead tr').prepend('<th><input class="thead_check" name="" type="checkbox"/></th>');

		$(table).find('tbody tr').prepend('<td><input class="tbody_check" type="checkbox"/></td>');
		
		$(table).after('</br><a href="#" class="btn btn-danger left" id="delete-checked"> Delete</a>');
	});
	
	// Event to trigger to delete checked entities  
	$('.agile_delete').live('delete-checked', function(event){
		
	});
	
	// Delete button click event
	$('#delete-checked').live('click', function(event){
		event.preventDefault();
		var id_array = [];
		var index_array = [];
		var table = $('body').find('table.showCheckboxes');

		$(table).find('tr .tbody_check').each(function(index, element){
			// If element is checked add store it's id in an array 
			if($(element).is(':checked')){
				index_array.push(index);
				id_array.push($(element).closest('tr').data().get('id'));
			}
		});
		bulkOperations($(table).attr('url'), id_array, index_array, table);
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
function bulkOperations(url, id_array, index_array, table){
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

		