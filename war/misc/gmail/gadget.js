var _agile = _agile || [];

var Is_Localhost = true;

// Global Lib Path - set automaticlaly in init based on localhost or production
var LIB_PATH;


function login() {
   
    var domain = gadgets.util.getUrlParameters()['parent'].match(/.+\/a\/(.+)\/html/)[1];
    var url = 'https://googleapps.agilecrm.com/gmail?hd=' + domain;
    console.log("Osapi from " + url);
   
     // Hit the server, passing in a signed request (and OpenSocial ID), to see if we know who the user is.
     osapi.http.get({
       'href' : url,
       'format' : 'json',
       'authz' : 'signed'
     }).execute(handleLoadResponse);
   }

   function handleLoadResponse(data) {
   
   console.log("Returned data");
   console.log(data);
   
     // User exists, OpenID must have occurred previously.
     if (data.content.user_exists) {
       document.getElementById('output').innerHTML = 'user exists';
       
       // Get API Key
       var api_key = data.content.api_key;
       
       // Get Domain Key
       var domain = data.content.domain;
       
       console.log("Fetched " + api_key + " " + domain);
       
       _agile.push(['_setAccount', api_key, domain]);
		
       
     } else {
       var url_root = data.content.popup;
       // Retrieve the domain of the current user. gadgets.util.getUrlParameters()['parent'] returns a value
       // of of the form: http(s)://mail.google.com/mail/domain.com/html for Gmail (other containers are similar).
       // The example below shows a regular expression for use with Gmail. For Calendar, use this regular
       // expression instead: /calendar\/hosted\/([^\/]+)/
       var domain = gadgets.util.getUrlParameters()['parent'].match(/.+\/a\/(.+)\/html/)[1];

       var url = url_root + '&hd=' + domain;

       var button = document.createElement('a');
       button.setAttribute('href', 'javascript:void(0);');
       button.setAttribute('onclick', 'openPopup("' + url + '")');

       var text = document.createTextNode('Associate your account - one time setup');
       button.appendChild(text);

       document.getElementById('output').appendChild(button);
     }
   }

   function openPopup(url) {
     var popup = window.open(url, 'OpenID','height=200,width=200');

     // Check every 100 ms if the popup is closed.
     finishedInterval = setInterval(function() {
       // If the popup is closed, we've either finished OpenID, or the user closed it. Verify with the server in case the
       // user closed the popup.
       if (popup.closed) {
	         login();
	         clearInterval(finishedInterval);
       }
     }, 100);
   }

// Init Agile Gadget
function init_agile_gadget()
{
	
	// Check if localhost
	console.log(window.location.host);
	if (window.location.host.indexOf("localhost") != -1)
	{
		Is_Localhost = true;
		LIB_PATH = "http://localhost:8888/";
		
		// Set API Key first - agile-min.js executes at the very beginning
		// Sukanya Localhost
		// _agile.push(['_setAccount', 't87mbpn15789194cojt6j0ujd5', 'localhost']);
		
		// MC Localhost
		_agile.push(['_setAccount', 'g0ge03gebtspp3s18pa7gfeprl', 'localhost']);
		
		//_agile.push(['_setAccount', 'fbl6p636276j2ff7tp2m023t0q', 'test']);
		
		// Download scripts and load UI
		download_scripts(build_ui);
		
	}
	else
	{
		gadgets.window.adjustHeight();
		LIB_PATH = "https://googleapps.agilecrm.com/";
		
		// Login - this will call download scripts if everything is good
		login();
	}
}


function download_scripts(callback)
{	
	
	console.log("Downloading scripts");
	
	var JQUERY_LIB_PATH = LIB_PATH + 'lib/jquery.min.js';
	
	<!-- Load Jquery and validate -->
	head.js(JQUERY_LIB_PATH, LIB_PATH + 'lib/jquery.validate.min.js', LIB_PATH + 'lib/handlebars-1.0.0.beta.6-min.js', LIB_PATH + 'jscore/handlebars-agile.js');
	
	<!-- Handle bars -->
	//head.js(LIB_PATH + 'lib/handlebars-1.0.0.beta.6-min.js');
	
	<!-- MD5 & Handlebars -->
	head.js(LIB_PATH + 'jscore/md5.js');
	
	<!-- JS API -->
	head.js(LIB_PATH + 'stats/min/agile-min.js');
	
	head.ready(function() {	
		if (callback && typeof(callback) === "function") {
			
			console.log("Downloading scripts done");
			
    		$().ready(callback);
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
	var emails;
	if(!Is_Localhost)
		emails = get_emails();
	else
		emails = ["manohar@invox.com","manohar123@invox.com"];
	
     
     // Build UI
     console.log("Building UI");
 	 build_ui_for_emails(emails);
     
 	// Init Handlers
    init_handlers();
     
}

// Retrieve contact details from email list
function build_ui_for_emails(email_ids){
	
		// Remove loading icon
		$("#content").html('');
			
		$.each(email_ids, function(index, email){
	
			agile_getContact(email, function(val)
					{
						val.email = email;
						fill_individual_template_ui(val, $('#content'));
					});
		});
}

function fill_individual_template_ui(val, selector, append){
	
	// Default value for append is true
	append = append || "true";
	
	// If not append, empty it - useful while refreshing the same div
	if(!append)
		selector.empty();
	
	// Add to content
	var individualTemplate = getTemplate('gadget', val, 'no');	
	
	selector.append($(individualTemplate));
	
	if(!Is_Localhost)
		gadgets.window.adjustHeight();
}

// Validating form
function isValidForm(form){
	$(form).validate();
	return $(form).valid();
}

//Validating and serialize form data
function serializeForm(form){
	if(!isValidForm(form))
    {	
      return;
    }
	var json = form.serializeArray();
	return json;
}

// JQuery Handlers
function init_handlers() {
	// Adding contact from gadget
	$('.gadget-contact-validate').die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div.gadget_contact_details_tab").find(".gadget_contact_form");
		  var json = [];
		  var data = {};
		  var tags = {};
		  json = serializeForm($(el));
		  
		  $.each(json, function(index, val){
			  if(val.name == "tags")
				  tags[val.name] = val.value;
			  else
				  data[val.name] = val.value;
			});
		  _agile = [];
		  _agile.push(["_createContact", data, tags, function(response)
		               {    
			                // Refresh the views
			  				var selector = $(this).closest("div.gadget_contact_details_tab").find(".gadget_contact");
			  				fill_individual_template_ui(response, selector, false);
			  				build_ui();
			           }]);
		  _agile_execute();
	});
	
	// Adding Note for contact
	$('.gadget-note-validate').die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div.gadget_contact_details_tab").find(".gadget_note_form");
		  var json = [];
		  var data = {};
		  var email = {};
		  json = serializeForm($(el));
		  $.each(json, function(index, val){
			  if(val.name == "email")
				  email[val.name] = val.value;
			  else
				  data[val.name] = val.value;
			});
		  _agile = [];
		  _agile.push(["_addNote", email, data, function(response)
		               {
							// Refresh the views
							var selector = $(this).closest("div.gadget_contact_details_tab").find(".gadget_contact");
							$('.status', el).show().delay(3000).hide(1);
		               }]);
		  _agile_execute();
	});
	
	//Adding Task for contact
	$('.gadget-task-validate').die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div.gadget_contact_details_tab").find(".gadget_task_form");
		  var json = [];
		  var data = {};
		  var email = {};
		  json = serializeForm($(el));
		  $.each(json, function(index, val){
			  if(val.name == "email")
				  email[val.name] = val.value;
			  else
				  data[val.name] = val.value;
			});
		  _agile = [];
		  _agile.push(["_addTask", email, data, function(response)
		               {
							// Refresh the views
							var selector = $(this).closest("div.gadget_contact_details_tab").find(".gadget_contact");
							$('.status', el).show().delay(3000).hide(1);
		               }]);
		  _agile_execute();
	});
	
	//Adding Deal for contact
	$('.gadget-deal-validate').die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div.gadget_contact_details_tab").find(".gadget_deal_form");
		  var json = [];
		  var data = {};
		  var email = {};
		  json = serializeForm($(el));
		  $.each(json, function(index, val){
			  if(val.name == "email")
				  email[val.name] = val.value;
			  else
				  data[val.name] = val.value;
			});
		  $('.status', el).show().delay(3000).hide(1);
		  _agile = [];
		  _agile.push(["_addDeal", email, data, function(response)
		               {
							// Refresh the views
							var selector = $(this).closest("div.gadget_contact_details_tab").find(".gadget_contact");
							$('.status', el).show().delay(3000).hide(1);
		               }]);
		  _agile_execute();
	});
	
	//toggle event for add note
	$(".gadget-add-note").die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div.gadget_contact_details_tab").find("div.show_form");
		$(".gadget-task", el).hide();
		$(".gadget-deal", el).hide();
		$(".gadget-note", el).toggle();
	});

	//toggle event for add task
	$(".gadget-add-task").die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div.gadget_contact_details_tab").find("div.show_form");
		$(".gadget-deal", el).hide();
		$(".gadget-note", el).hide();
		$(".gadget-task", el).toggle();
	});
	
	//toggle event for add deal
	$(".gadget-add-deal").die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div.gadget_contact_details_tab").find("div.show_form");
		$(".gadget-note", el).hide();
		$(".gadget-task", el).hide();
		$(".gadget-deal", el).toggle();
	});
	
	//toggle event for add contact
	$(".gadget-add-contact").die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div.gadget_contact_details_tab").find("div.show_form");
		$(".gadget-no-contact", el).toggle();
		$(".gadget-contact", el).toggle();
	});
	
	//cancel event for buttons
	$(".cancel").die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div.gadget_contact_details_tab").find("div.show_form");
		$(".gadget-contact", el).hide();
		$(".gadget-no-contact", el).show();
		$(".gadget-note", el).hide();
		$(".gadget-deal", el).hide();
		$(".gadget-task", el).hide();
	});
}
