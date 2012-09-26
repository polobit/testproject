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
		var table = $('body').find('table.showCheckboxes');

		$(table).find('tr .tbody_check').each(function(index, element){
			
			// If element is checked add store it's id in an array 
			if($(element).is(':checked')){
				id_array.push($(element).closest('tr').data().get('id'));
			}
		});
		bulkOperations($(table).attr('url'), id_array);
	});
	
	// Click head - click all checkboxes of table body
	$('.thead_check').live('click', function(event){
		$('.tbody_check').attr('checked', this.checked);
	});	

	$('#top').live('click',function(event){
		event.preventDefault();
		console.log("scroll to top");
		window.scrollTo();
	});
	
});

// Bulk operations - delete function
function bulkOperations(url, id_array){
	var json = {};
	json.model_ids = JSON.stringify(id_array);
	$.ajax({
		url: url,
		type: 'DELETE',
		data: json,
		success: function(){location.reload(true);
			}
	});
	
	/*$.ajax({
		url: url + "/" + idString,
		type: 'DELETE',
		success: function(){//location.reload(true);
			}
	});*/
}
		