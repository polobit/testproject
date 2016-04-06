function load_agile_form(id){

		id = id.split("_");
		var host = id[0];
		var formId = id[id.length-1];
		 var url = window.location.protocol+'//'+host+'/'+ 'core/api/forms/form?formId='+formId;
		 
		 console.log("url "+url);
		 
		 var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
		    if (xhttp.readyState == 4 && xhttp.status == 200) {
		    	var saveform = JSON.parse(xhttp.responseText);
		    	console.log("saveform"+saveform);
		      document.getElementById(id).innerHTML = saveform.formHtml;
		    }
		  };
		  xhttp.open("GET", url, true);
		  xhttp.setRequestHeader('Accept', 'application/json');
		  xhttp.send();
}