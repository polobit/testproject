$(function(){
	$("#api_key_generate_icon").live('click', function(e){
		e.preventDefault();
		$.ajax({
			url : 'core/api/api-key/key',
			type : 'POST',
			success : function(){
				$.ajax({
					url : 'core/api/api-key',
					type : 'GET',
					dataType  : 'json',
					success : function(data){
						$('#api_key_code')[0].innerHTML = data.api_key;
					}
				});
			}
		});
	});
	
	$("#jsapi_key_generate_icon").live('click', function(e){
		$.ajax({
			url : 'core/api/api-key/jskey',
			type : 'POST',
			success : function(){
				$.ajax({
					url : 'core/api/api-key',
					type : 'GET',
					dataType : 'json',
					success : function(data){
						$("#jsapi_key_code")[0].innerHTML = data.js_api_key;
					}
				});
			}
		});
	});
});