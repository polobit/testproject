$(function(){ 

	$("#choose-avatar-modal table td a").die().live('click', function(e) {
	
			e.preventDefault();
	
			var modalId = $(this).closest('.modal').attr("id");
	
			var source = $(this).find("img").attr("src");
	
			$(this).closest(".modal-body").find("input[type='hidden']").val(source);
	
			$(this).closest('.modal').modal('hide');
	});
	
	$('#choose-avatar-modal').die().live('hide', function() {
	
			var selectedSource = $(this).find(".modal-body input[type='hidden']").val();
			
			$("input[name='custom_image']").val(selectedSource);
			
			setImageURL(selectedSource);
			
			//var modalId = $(this).attr("id");
			//$("a[href='#" + modalId + "']").find("img").attr('src', selectedSource);
			//$(".preview-avatar").attr("src", selectedSource);
	});
	
});