var _agile = _agile || [];
var Is_Localhost = true;

// Global Lib Path - set automaticlaly in init based on localhost or production
var LIB_PATH;

// Login to open gadget
function login() {
   
//    var url = 'https://googleapps.agilecrm.com/gmail';
	var url = 'https://googleapps-dot-sandbox-dot-agile-crm-cloud.appspot.com/gmail';
    console.log("Osapi from " + url);
   
	// Hit the server, passing in a signed request (and OpenSocial ID), to
	// see if we know who the user is.
	osapi.http.get({
		'href' : url,
        'format' : 'json',
        'authz' : 'signed'
	}).execute(handleLoadResponse);
}

function handleLoadResponse(data) {
	
	console.log("user auth data.");
	console.log(data);
	// User exists, OpenID must have occurred previously.
	if (data.content.user_exists) {
	   
       // Get API Key
       var api_key = data.content.api_key;
       // Get Domain Key
       var domain = data.content.domain;
       
       // Hide Loading Icon
       document.getElementById('loading').style.display = 'block';
       
       download_scripts(function() {
    	   // setting account
    	   _agile.set_account(api_key, domain);
		   // building the contact UI
    	   build_ui();
       });
       
	} else {
       
		// Retrieve the domain of the current user.
		// gadgets.util.getUrlParameters()['parent'] returns a value (mail domain of gmail account)
		// of the form: http(s)://mail.google.com/mail/domain.com/html for
		// Gmail (other containers are similar).
		// The example below shows a regular expression for use with Gmail. For
		// Calendar, use this regular
		// expression instead: /calendar\/hosted\/([^\/]+)/
		
		// Example email from gmail account abc@userdomain.com --> domain = userdomain.com
		var domain = gadgets.util.getUrlParameters()['parent'].match(/.+\/a\/(.+)\/html/)[1];
		// To set-up user account
		var url_root = data.content.popup + "&hd=" + domain;
         
		// Creating text box and Go button to let user enter its desired agile domain name
// <!-- START -->		
		var textNode = document.createElement('p');
		var text = document.createTextNode('Associate your account - one time setup');
		var inpbox = document.createElement('input');
		var butGo = document.createElement('input');
		
		textNode.appendChild(text);
		inpbox.setAttribute('id', 'user_domain');
		inpbox.setAttribute('placeholder','Enter your Domain');
		inpbox.style.margin = '0 10px 0 0';
		
		butGo.setAttribute('type','button');
		butGo.setAttribute('value','Go');
		butGo.setAttribute('onclick', 'openPopup("' + url_root + '")');
	 	
		document.getElementById('output').innerHTML ="";
		var nodeArray = [textNode, inpbox, butGo];
		for(var node=0; node<nodeArray.length; node++){
			document.getElementById('output').appendChild(nodeArray[node]);
		}
// <!-- END -->		
		// Hide Loading Icon
		document.getElementById('loading').style.display = 'none';
		gadgets.window.adjustHeight();
	} 
}

// Popup for one time domain registration.
function openPopup(url) {
	   
	var userDomain = document.getElementById('user_domain');
	// Text box validation for empty box
	if(userDomain.value == 'Enter your Domain' || userDomain.value == '') {
		alert("Please enter your domain !");
		userDomain.focus();
		userDomain.select();
	} else {
			
		url += '&domain=' + userDomain.value;
		userDomain.value = '';
		console.log(url);
			
		var popup = window.open(url, 'OpenID','height=400,width=400');
		// Check every 100 ms if the popup is closed.
		finishedInterval = setInterval(function() {
			// If the popup is closed, we've either finished OpenID, or the
			// user closed it. Verify with the server in case the
			// user closed the popup.
			if (popup.closed) {
				login();
				clearInterval(finishedInterval);
			}
		}, 100);
	}
}

// Init Agile Gadget
function init_agile_gadget()
{
	// Check if localhost
	console.log(window.location.host);
	if (window.location.host.indexOf("localhost") != -1) {
		Is_Localhost = true;
		LIB_PATH = "http://localhost:8888/";
		
		download_scripts(function() {
			// setting account
			_agile.set_account('sopts1qmr8f7t8ubeirkdmh5lo', 'localhost');
			// building the contact UI
			build_ui();
	   });
	} else {
		
		// if production version
		gadgets.window.adjustHeight();
		LIB_PATH = "https://googleapps-dot-sandbox-dot-agile-crm-cloud.appspot.com/";
		
		// Login - this will call download scripts if everything is good
		login();
		
		gadgets.window.adjustHeight();
	}
}

//downloading scripts before generating GUI
function download_scripts(callback) {	
	
	console.log("Downloading scripts");

//	<!-- Load Jquery and validate -->
	head.js(LIB_PATH + 'lib/jquery.min.js', LIB_PATH + 'lib/jquery.validate.min.js');
//	<!-- Handle bars -->
	 head.js(LIB_PATH + 'lib/handlebars-1.0.0.beta.6-min.js', LIB_PATH + 'jscore/handlebars/handlebars-agile.js', LIB_PATH + 'jscore/handlebars/handlebars-helpers.js', LIB_PATH + 'jscore/util.js');
//	<!-- MD5 & Handlebars -->
	head.js(LIB_PATH + 'jscore/md5.js');
//	<!-- JS API -->
	head.js(LIB_PATH + 'stats/min/agile-min.js');
// <!-- Bootstrap  -->
	head.js(LIB_PATH + 'lib/bootstrap.min.js', LIB_PATH + 'lib/bootstrap-datepicker-min.js');

	head.ready(function() {	
		if (callback && typeof(callback) === "function") {
			console.log("Downloading scripts done");
			//callback to build UI
			$().ready(callback);
    	}
	});
}

//Get Emails
function get_emails() {
	//	<!-- Fetch the array of content matches. -->
	matches = google.contentmatch.getContentMatches();
	console.log("mails & info: ");
	console.log(matches);
	var emails = [];
	var sender_name, sender_email = "";
	
	// <!-- Iterate through the array and display output for each match. -->
	for (var match in matches) {
		for (var key in matches[match]) {
			if(key == "email" || key == "email_sender"){
				if(key != "email_sender")
					emails.push(matches[match][key]);
				else
					sender_email = matches[match][key];
			}
			if(key == "email_name")
				sender_name = matches[match][key];
		}
	}
	
	//checking for duplicate emails
	var index = {};
	index[sender_email] = true;
	// traverse array from end to start so removing the current item from the array
	// doesn't mess up the traversal
	for (var i = emails.length - 1; i >= 0; i--) {
		if (emails[i] in index) {
			// remove this item
			emails.splice(i, 1);
		} else {
			// add this value index
			index[emails[i]] = true;
		}
	}
	//set sender of email as first mail in the mail list to pass in get contact
	emails.splice(0, 0, sender_email);
	gadgets.window.adjustHeight();
	return [emails, sender_name, sender_email];
}

//build UI
function build_ui() {
	
	var emails;
	// Get Emails
	if(!Is_Localhost)
		emails = get_emails();
	else{
		var mailList = ["manohar@invox.com","maruthi.motors@invox.com","dheeraj@invox.com","praveen@invox.com","maruthi.motors@invox.com"];
		//checking for duplicate emails (locathost test)
		var index = {};
		// traverse array from end to start so removing the current item from the array
		// doesn't mess up the traversal
		for (var i = mailList.length - 1; i >= 0; i--) {
			if (mailList[i] in index) {
				// remove this item
				mailList.splice(i, 1);
			} else {
				// add this value index
				index[mailList[i]] = true;
			}
		}
		emails = [mailList, "Manohar Chapalamadugu", "manohar@invox.com"];
	}
	// Build UI
    console.log("Building UI");
 	build_ui_for_emails(emails);
     
 	// Init Handlers
    init_handlers();
    
    if(!Is_Localhost)
		gadgets.window.adjustHeight();
}

// Retrieve contact details from email list
function build_ui_for_emails(email_ids){
	
//		 Remove loading icon
		$("#content").html('');
			
		$.each(email_ids[0], function(index, email){
			// requires email
			agile_getContact(email, function(val)
			{
				//setting name fields for sender's email to show in add contact form
				if(email == email_ids[2] && val.id == null){
					val.fname = email_ids[1].split(" ")[0];
					val.lname = email_ids[1].split(" ")[1];
					val.email = email;
				} else {
					val.email = email;
				}
					
				fill_individual_template_ui(val, $('#content'));
			});
		});
		
		if(!Is_Localhost)
			gadgets.window.adjustHeight();
}

// filling UI template with data
function fill_individual_template_ui(val, selector){
	
	// Add to content
	var individualTemplate = getTemplate('gadget', val, 'no');	
	selector.append($(individualTemplate));
	
	//enables date picker
	$('.calender').datepicker({
		format: 'mm/dd/yyyy'
	});
	
	// building tags list
	var tagList = $("#content .gadget_contact_details_tab:last").find("#added-tags-ul");
	build_tag_ui(tagList, val);
	
	if(!Is_Localhost)
		gadgets.window.adjustHeight();
}

//build tags
function build_tag_ui(tagList, val){
	
	$(tagList).children("li:gt(0)").remove();
	for(index=0; index < val.tags.length; index++){
        //cloning list item
		var CloneElement = $(tagList).children().eq(0).clone(true);
        $(CloneElement).css('display','inline-block');
        $('.tagName',CloneElement).text(val.tags[index]);
        CloneElement.appendTo(tagList);
    }
}

// Validating form
function isValidForm(form){
	$(form).validate();
	return $(form).valid();
}

// Validating and serialize form data
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
		json = serializeForm($(el));
		  
		$.each(json, function(index, val){
			data[val.name] = val.value;
		});
		$('.saving', el).show();
		_agile.create_contact(data, function(response){
			console.log("create contact resp: "+ response);
			$('.saving', el).hide(1);
			build_ui();
		});
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
		$('.saving', el).show();
		_agile.add_note(email, data, function(response){
			  
			$('.saving', el).hide(1);
			$('.status', el).show().delay(3000).hide(1);
			// clearing form fields
			$(el).validate().resetForm();
			$(el).get(0).reset();
		});
	});
	
	// Adding Task for contact
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
		//formatting date
		data.due = new Date(data.due).getTime() / 1000.0;
		  
		$('.saving', el).show();
		agile_addTask(email, data, function(response){
			  
			$('.saving', el).hide(1);
			$('.status', el).show().delay(3000).hide(1);
			// clearing form fields
			$(el).validate().resetForm();
			$(el).get(0).reset();
		});
	});
	
	// Adding Deal for contact
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
		//formatting date
		data.close_date = new Date(data.close_date).getTime() / 1000.0;
		  
		$('.saving', el).show();
		agile_addDeal(email, data, function(response){
			  
			$('.saving', el).hide(1);
			$('.status', el).show().delay(3000).hide(1);
			// clearing form fields
			$(el).validate().resetForm();
			$(el).get(0).reset();
		});
	});
	
	// Adding Score for contact
	$('.add-score').die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div.score-scope")
		var email = $('input[name="email"]', el).val();
		var oldScore = parseInt($.trim($('.score-value', el).text()), 10);
		$('.score-value', el).text(oldScore+1);
		
		_agile.add_score(1, function(response){
			  
			console.log("score added.");
			console.log(response);
		  }, email);
	});
	
	// Subtracting Score for contact
	$('.subtract-score').die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div.score-scope")
		var email = $('input[name="email"]', el).val();
		var oldScore = parseInt($.trim($('.score-value', el).text()), 10);
		if(oldScore > 0)
			$('.score-value', el).text(oldScore-1);
		
		_agile.add_score(-1, function(response){
			  
			console.log("score subtracted.");
			console.log(response);
		  }, email);
	});
	
	// enter key press event for tag input box
	$('#tags').die().live('keypress', function(evt){
		var evt = (evt) ? evt : ((event) ? event : null);
		var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);

		// checking for enter key code
		if (evt.keyCode === 13){
			evt.preventDefault();
			$(this).next().trigger('click');
		}
	});
	
	//Adding tags for contact
	$('#contact-add-tags').die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div.add-tag");
		var json = [];
		var tags = {};
		var email = {};
		json = serializeForm($(el).find("#addTagsForm"));
		
		$.each(json, function(index, val){
			if(val.name == "email")
				email[val.name] = val.value;
			else
				tags[val.name] = val.value;
		});

		//send request if tags are entered
		if(tags.tags.length != 0){
			$('.saving', el).show();
			$("#addTagsForm", el).toggle();
			_agile.add_tag(tags.tags, function(response){
				  
				$('.saving', el).hide();
				$(".toggle-tag", el).toggle();
				  
				var tagList = $(el).find("#added-tags-ul");
				build_tag_ui(tagList, response);
				  
				if(!Is_Localhost)
					gadgets.window.adjustHeight();  
			}, email.email);
		} else{
			$("#addTagsForm", el).toggle();
			$(".toggle-tag", el).show();
		}
	});
	
	// Removing tags from contact
	$('.remove-tag').die().live('click', function(e){
		e.preventDefault();
		
		var el = $(this).closest("div.add-tag");
		var email = $(el).find('#addTagsForm input[name="email"]').val();
		var tag = $(this).prev().text();
		
		$('.saving', el).show();
		$('.toggle-tag', el).hide();
		_agile.remove_tag(tag, function(response){
			
			$('.saving', el).hide();
			$('.toggle-tag', el).show();
			var tagList = $(el).find("#added-tags-ul");
			build_tag_ui(tagList, response);
			
			if(!Is_Localhost)
				gadgets.window.adjustHeight();  
		}, email);
	});
	
	// show add tag
	$('.toggle-tag').die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div.add-tag");
		$(el).find('form input[name="tags"]').val("");
		$("#addTagsForm", el).toggle();
		$(".toggle-tag", el).hide();
		if(!Is_Localhost)
			gadgets.window.adjustHeight();
	});
	
	// select option (adding note/task/deal) event
	$(".optionDD").die().live('change', function(e){
		e.preventDefault();
		var el = $(this).closest("div.gadget_contact_details_tab").find("div.show_form");
		
		if($(this).val() === 'New'){
			$(".gadget-contact", el).hide();
			$(".gadget-no-contact", el).show();
			$(".gadget-note", el).hide();
			$(".gadget-deal", el).hide();
			$(".gadget-task", el).hide();
		}
		
		// toggle event for add note
		if($(this).val() === 'Note'){
			$(".gadget-task", el).hide();
			$(".gadget-deal", el).hide();
			$(".gadget-note", el).toggle();
		}
		
		// toggle event for add Task
		if($(this).val() === 'Task'){
			$(".gadget-deal", el).hide();
			$(".gadget-note", el).hide();
			$(".gadget-task", el).toggle();
		}
		
		// toggle event for add deal
		if($(this).val() === 'Deal'){
			$(".gadget-note", el).hide();
			$(".gadget-task", el).hide();
			$(".gadget-deal", el).toggle();
		}
		
		if(!Is_Localhost)
				gadgets.window.adjustHeight();
	});
	
	// toggle event for add contact
	$(".gadget-add-contact").die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div.gadget_contact_details_tab").find("div.show_form");
		$(".gadget-no-contact", el).toggle();
		$(".gadget-contact", el).toggle();
	});
	
	// cancel event for button
	$(".cancel").die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div.gadget_contact_details_tab");
		$('.optionDD', el).val( $('.optionDD').prop('defaultSelected') );
		$('.optionDD', el).trigger('change');
		$(this).closest('form').validate().resetForm();
		$(this).closest('form').get(0).reset();
		$(".gadget-contact", el).hide();
		$(".gadget-no-contact", el).show();
	});
}
