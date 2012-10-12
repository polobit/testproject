// For 
// var GADGET_SERVER_URL = "https://test.agilecrm.com/";
var GADGET_SERVER_URL = "http://localhost:8888/";

//var GADGET_TEMPLATE = "http://localhost:8888/misc/gmail/gadget.html";
var GADGET_TEMPLATE = "https://googleapps.agilecrm.com/misc/gmail/gadget.html";

var _agile = _agile || [];

// Init Agile Gadget
function init_agile_gadget()
{
	
	// Set API Key first - agile-min.js executes at the very beginning
	_agile.push(['_setAccount', 't87mbpn15789194cojt6j0ujd5', 'localhost']);
	
	// Download scripts and load UI
	download_scripts(build_ui);
	
}

function download_scripts(callback)
{	
	
	console.log("Downloading scripts");
	
	// var LIB_PATH = "https://googleapps.agilecrm.com/";
	
	var LIB_PATH = "http://localhost:8888/";
	
	var JQUERY_LIB_PATH = LIB_PATH + 'lib/jquery.min.js';
	
	<!-- Load Jquery and validate -->
	head.js(JQUERY_LIB_PATH, LIB_PATH + 'lib/jquery.validate.min.js', LIB_PATH + 'jscore/handlebars-agile.js');
	
	<!-- Handle bars -->
	head.js(LIB_PATH + 'lib/handlebars-1.0.0.beta.6-min.js');
	
	<!-- MD5 & Handlebars -->
	head.js(LIB_PATH + 'jscore/md5.js');
	
	<!-- JS API -->
	head.js(GADGET_SERVER_URL + 'stats/min/agile-min.js');
	
	
	head.ready(function() {	
		if (callback && typeof(callback) === "function") {
			
			console.log("Downloading scripts done");
			
    		callback();
    	}
	});
}


// Get Emails
function get_emails()
{
	<!-- Fetch the array of content matches. -->
    matches = google.contentmatch.getContentMatches();
    var matchList = document.createElement('UL');
    var listItem;
    var extractedText;
    var emails = [];
    <!-- Iterate through the array and display output for each match. -->
    for (var match in matches) {
      for (var key in matches[match]) {
        listItem = document.createElement('LI');
        extractedText = document.createTextNode(key + ": " + matches[match][key]);
        emails.push(extractedText);
        listItem.appendChild(extractedText);
        matchList.appendChild(listItem);
      }
    }
    document.body.appendChild(matchList);
    
    gadgets.window.adjustHeight(100);
    
    return emails;
}

// Get emails
function build_ui()
{
     
     // Get Emails
     // var emails = get_emails();
     var emails = ["manohar@invox.com"];
     
     // Build UI
     build_ui_for_emails(emails);
     
     // Init Handlers
     init_handlers();
}


// Retrieve contact details from email list
function build_ui_for_emails(email_ids){
	
	var url = GADGET_SERVER_URL + "core/api/contacts/search/email";
	var json = {};
	json.email_ids = JSON.stringify(email_ids);
	
	
	
	$.post(url, json, function(data){
		
		
		
		// Remove loading icon
		$("#content").html('');
			
		$.each(data, function(index, val){
			if(!val)
			{	
				val = {};
				val.email = email_ids[index];
			}
			
			console.log(val);
			
			// Add to content
			var individualTemplate = getTemplate('gadget', val, 'no');	
			console.log(individualTemplate);
			$("#content").append($(individualTemplate));
	
		});
	});
}

// Validating form
function isValidForm(form){
	$(form).validate();
	return $(form).valid();
}


// JQuery Handlers
function init_handlers() {
	// Adding contact from gadget
	$('#gadget-contact-validate').die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div#gadgetContactDetailsTab").find("#gadgetContactForm");
		  if(!isValidForm($(el)))
	      {	
	        return;
	      }
		  var json = [];
		  var data = {};
		  var tags = {};
		  json = $(el).serializeArray();
		  $.each(json, function(index, val){
			  if(val.name == "tags")
				  tags[val.name] = val.value;
			  else
				  data[val.name] = val.value;
			});
		  _agile = [];
		  _agile.push(["_createContact", data, tags]);
		  _agile_execute();
	});
	
	//Adding Note for contact
	$('#gadget-note-validate').die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div#gadgetContactDetailsTab").find("#gadgetNoteForm");
		  if(!isValidForm($(el)))
	      {	
	      	return;
	      }
		  var json = [];
		  var data = {};
		  var email = {};
		  json = $(el).serializeArray();
		  $.each(json, function(index, val){
			  if(val.name == "email")
				  email[val.name] = val.value;
			  else
				  data[val.name] = val.value;
			});
		  _agile = [];
		  _agile.push(["_addNote", email, data]);
		  _agile_execute();
	});
	
	//Adding Task for contact
	$('#gadget-task-validate').die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div#gadgetContactDetailsTab").find("#gadgetTaskForm");
		  if(!isValidForm($(el)))
	      {	
	      	return;
	      }
		  var json = [];
		  var data = {};
		  var email = {};
		  json = $(el).serializeArray();
		  $.each(json, function(index, val){
			  if(val.name == "email")
				  email[val.name] = val.value;
			  else
				  data[val.name] = val.value;
			});
		  _agile = [];
		  _agile.push(["_addTask", email, data]);
		  _agile_execute();
	});
	
	//Adding Deal for contact
	$('#gadget-deal-validate').die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div#gadgetContactDetailsTab").find("#gadgetDealForm");
		  if(!isValidForm($(el)))
	      {	
	      	return;
	      }
		  var json = [];
		  var data = {};
		  var email = {};
		  json = $(el).serializeArray();
		  $.each(json, function(index, val){
			  if(val.name == "email")
				  email[val.name] = val.value;
			  else
				  data[val.name] = val.value;
			});
		  _agile = [];
		  _agile.push(["_addDeal", email, data]);
		  _agile_execute();
	});
	
	//toggle event for add note
	$("#gadget-add-note").die().live('click', function(e){
		var el = $(this).closest("div#gadgetContactDetailsTab").find("div#showForm");
		$("#gadget-task", el).hide();
		$("#gadget-deal", el).hide();
		$("#gadget-note", el).toggle();
	});

	//toggle event for add task
	$("#gadget-add-task").die().live('click', function(e){
		var el = $(this).closest("div#gadgetContactDetailsTab").find("div#showForm");
		$("#gadget-deal", el).hide();
		$("#gadget-note", el).hide();
		$("#gadget-task", el).toggle();
	});
	
	//toggle event for add deal
	$("#gadget-add-deal").die().live('click', function(e){
		var el = $(this).closest("div#gadgetContactDetailsTab").find("div#showForm");
		$("#gadget-note", el).hide();
		$("#gadget-task", el).hide();
		$("#gadget-deal", el).toggle();
	});
	
}
