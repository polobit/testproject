//Retrieving contact details from email list
function getGadgetForEmail(email_ids){
	var url = "/core/api/contacts/search/email";
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
			$("#content").append(getTemplate("gadget-without-both", val));
		});
	});
}

//validating form
function isValidForm(form){
	$(form).validate();
	return $(form).valid();
}

$(function() {
	// Adding contact from gadget
	$('#gadget-contact-validate').die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div#gadgetContactDetailsTab").find("#gadgetContactForm");
		  if(!isValidForm($(el)))
	      {	
	        return;
	      }
		  console.log($(el).serializeArray());
		  _agile = [];
		  _agile.push(["_createContact", {"email": "yaswanth3@invox.com", "first_name":"yaswanth2", "last_name":"chapalamadugu"}, {"tags":"tag1 tag2"}]);
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
		  console.log($(el).serializeArray());
		  _agile.push(["_addNote", {"email": "yaswanth3@invox.com"}, {"subject":"about", "description":"details"}]);
	});
	
	//Adding Task for contact
	$('#gadget-task-validate').die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div#gadgetContactDetailsTab").find("#gadgetTaskForm");
		  if(!isValidForm($(el)))
	      {	
	      	return;
	      }
		  console.log($(el).serializeArray());
		  _agile.push(["_addTask", {"email": "yaswanth3@invox.com"}, {"subject":"TaskName", "type":"CALL", "due":"6989789","priority_type":"HIGH"}]);
	});
	
	//Adding Deal for contact
	$('#gadget-deal-validate').die().live('click', function(e){
		e.preventDefault();
		var el = $(this).closest("div#gadgetContactDetailsTab").find("#gadgetDealForm");
		  if(!isValidForm($(el)))
	      {	
	      	return;
	      }
		  console.log($(el).serializeArray());
		  _agile.push(["_addDeal", {"email": "yaswanth3@invox.com"}, {"name":"DealName", "expected_value":"45654", "milestone":"Open", "probability":"99", "close_date":"6256466"}]);
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
	
});
