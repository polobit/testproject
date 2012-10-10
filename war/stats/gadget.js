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
		  var json = [];
		  var obj = {};
		  json = $(el).serializeArray();
		  $.each(json, function(index, val){
			 obj[val.name] = val.value;
			});
		  obj = JSON.stringify(obj);
		  console.log(obj);
		  _agile = [];
		  _agile.push(["_createContact", obj, {"tags":"tag1 tag2"}]);
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
		  var obj = {};
		  var email = {};
		  json = $(el).serializeArray();
		  $.each(json, function(index, val){
			  if(val.name == "email")
				  email[val.name] = val.value;
			  else
			      obj[val.name] = val.value;
			});
		  _agile = [];
		  _agile.push(["_addNote", email, obj]);
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
		  var obj = {};
		  var email = {};
		  json = $(el).serializeArray();
		  $.each(json, function(index, val){
			  if(val.name == "email")
				  email[val.name] = val.value;
			  else
			      obj[val.name] = val.value;
			});
		  _agile = [];
		  _agile.push(["_addTask", email, obj]);
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
		  var obj = {};
		  var email = {};
		  json = $(el).serializeArray();
		  $.each(json, function(index, val){
			  if(val.name == "email")
				  email[val.name] = val.value;
			  else
			      obj[val.name] = val.value;
			});
		  _agile = [];
		  _agile.push(["_addDeal", email, obj]);
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
	
});
