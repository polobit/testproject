$(function(){ 
	$("#bulk-campaigns").live('click', function(e){
		e.preventDefault();
		var id_array = [];

		var table = $('body').find('table.showCheckboxes');

		$(table).find('tr .tbody_check').each(function(index, element){
			
			// If element is checked add store it's id in an array 
			if($(element).is(':checked')){
				id_array.push($(element).closest('tr').data().get('id'));
			}
		});
		
		console.log(id_array);
		/*
		Backbone.history.navigate("bulk-campaigns", {
            trigger: true
        });*/
		
		
/*		// Campaign select 
		$('#campaignBulkSelect').die().live('change',function(e){
			e.preventDefault();
			var workflow_id = $('#campaignBulkSelect option:selected').attr('value');
			console.log(workflow_id);
			console.log(id_array);

		});*/
        
	});

});
