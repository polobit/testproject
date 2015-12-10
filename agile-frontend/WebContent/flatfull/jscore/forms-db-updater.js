function updateFormsDB(){

	if(CURRENT_DOMAIN_USER.is_forms_updated)
		   return;

	// Fetch and update forms db
	$.getJSON("/core/api/forms", {}, function(data){

		var noOfOldForms = 0;
		for(var i = 0; i < data.length; i++){
			if(!data[i].formHtml) {
				noOfOldForms++;
				createIframe(data[i].id);
			}
		}

		// Update user DB with true param
		console.log("No. of old forms : "+noOfOldForms);
		if(noOfOldForms == 0) {
			$.get('/core/api/users/formsupdated',{},function(data){
				console.log("All forms are updated.");
			});
		}

	});
}

function createIframe(formId) { 

  var iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = "form.jsp?id=" + formId;
  document.body.appendChild(iframe);

 }

function updateAgileFormDB(form) {
	$.ajax({
		type : 'POST',
		url : 'core/api/forms',
		async : true,
		contentType : 'application/json',
		data : JSON.stringify(form),
		success: function(){
		}
	});
}

$(function(){
	updateFormsDB();
});
