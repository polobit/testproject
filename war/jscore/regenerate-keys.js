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
						$("#admin-prefs-tabs-content").html(getTemplate("admin-settings-api-key-model",data));
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
						$("#admin-prefs-tabs-content").html(getTemplate("admin-settings-api-key-model",data));
					}
				});
			}
		});
	});
});