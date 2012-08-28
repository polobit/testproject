// Adding custom fields Author: Yaswanth  08-10-2012
$(function(){
	$('.fieldmodal').die().live('click',function(event){
		event.preventDefault();
		
		var modal_id = $(this).attr('id');
		alert(modal_id);
		//Creating model for bootstrap-modal
		var modelView = new Base_Model_View({
			url: '/core/api/custom-fields',
			template: 'custom-field-'+modal_id+'-modal',
			window: 'custom-fields',
			modal: '#'+modal_id+'Modal',
			postRenderCallback: function(el){
				alert('showing modal');
				$('#'+modal_id+'Modal').modal('show');
				}
			});

		
		$('#custom-field-modal').html( modelView.render().el );
	});
});