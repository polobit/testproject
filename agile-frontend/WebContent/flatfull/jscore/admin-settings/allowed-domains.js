$(function(){
	$("#update_allowed_domains").die().live("click", function(e){
		e.preventDefault();
		var allowed_domains = $("#allowed_domains").val();
		$.ajax({
			url : "/core/api/api-key/allowed-domains?allowed_domains=" + encodeURIComponent(allowed_domains), 
			method: "PUT",
			async: true
		});
	});
});