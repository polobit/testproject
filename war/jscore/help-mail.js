$(function() {
// Help mail
$('#helpMail').die().live('click',function(e){
	e.preventDefault();
	var json = serializeForm("helpmailForm");
	var url =  'core/api/send-email?from=' + encodeURIComponent(json.from) + '&to=' + 
	   										 encodeURIComponent(json.to) + '&subject=' + encodeURIComponent(json.subject) + '&body=' + 
	   										 encodeURIComponent(json.body);
	$.post(url);

});
});