$(function(){ 

	$("#choose-avatar-modal table td a").die().live('click', function(e) {
	
			e.preventDefault();
	
			var modalId = $(this).closest('.modal').attr("id");
	
			var source = $(this).find("img").attr("src");
	
			$(this).closest(".modal-body").find("input[type='hidden']").val(source);
	
			$(this).closest('.modal').modal('hide');
			$(this).trigger('choose-image')
	});
	
	$('#choose-avatar-modal').die().live('choose-image', function() {
	
			var selectedSource = $(this).find(".modal-body input[type='hidden']").val();
			
			if(selectedSource)
			{
				$("input[name='custom_image']").val(selectedSource);
				
				setImageURL(selectedSource);
				
				/*var modalId = $(this).attr("id");
				$("a[href='#" + modalId + "']").find("img").attr('src', selectedSource);*/
				//$(".preview-avatar").attr("src", selectedSource);
			}
	});
	$('#choose-avatar-test').die().live('choose-image', function() {
		$("#choose-avatar-modal").closest('.modal').modal('hide');
		var selectedSource = $(this).find(".modal-body input[type='hidden']").val();
		
		if(selectedSource)
		{
			$("input[name='custom_image']").val(selectedSource);
			
			setImageURL(selectedSource);
			
			/*var modalId = $(this).attr("id");
			$("a[href='#" + modalId + "']").find("img").attr('src', selectedSource);*/
			//$(".preview-avatar").attr("src", selectedSource);
		}
});
	
	$('#choose-avatar-modal').on('show.bs.modal',function (e) {
		$('#choose-avatar-modal').html($('#choose-avatar-test').html());
	});
});

// selects default avatars randomly
function choose_random_avatar()
{
	var avatar = ["https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/86.png",
	              "https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/72.png",
	              "https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/17.png",
	              "https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/5.png",
	              "https://d1gwclp1pmzk26.cloudfront.net/img/gravatar/3.png"];

	var random = Math.floor((Math.random() * avatar.length));

	return avatar[random];
}