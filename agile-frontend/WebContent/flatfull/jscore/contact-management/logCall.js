/**
 * logPhone.js script file defines the functionality of saving a logPhone in logPhone
 * database. If logPhone is related to a contact, which is in contact detail view
 * then the logPhone model is inserted into time-line.
 * 
 * @module Contact management
 * @author Prakash
 */
$(function()
{
/**
 * select box change functionality on number change
 * @id = "logPhone_number_option"
 * 
 */	
	$('#globalModal').on('click', '#logPhone_number_option', function(e)
	{
		var formName = $(this).parents("form").attr("id");
		
		if($("#"+formName + " #logPhone_number_error").is(":visible")){
			$("#"+formName + " #logPhone_number_error").hide();
		}	
		
		var opt = $(this).attr("value");
		var optHtml = $(this).html();
		$("#"+formName + " #contact_logPhone_number").html(optHtml);
		$("#"+formName + " #contact_logPhone_number").attr("value", opt);
		
	});
	
	/**
	 * select box change functionality on status change
	 * @id = "callStatus"
	 * 
	 */
	
	$('#globalModal').on('click', '#statusValue', function(e)
			{
				var formName = $(this).parents("form").attr("id");
				var opt = $(this).attr("value");
				var optHtml = $(this).html();
				$("#"+formName + " #callStatus").html(optHtml);
				$("#"+formName + " #callStatus").attr("value", opt);
				if(opt == 'busy' || opt == 'failed' || opt == 'missed'){
					$("#hour").attr('disabled','disabled');
					$("#min").attr('disabled','disabled');
					$("#sec").attr('disabled','disabled');
				}else{
					$("#hour").removeAttr('disabled');
					$("#min").removeAttr('disabled');
					$("#sec").removeAttr('disabled');
				}
			});
	
	/**
	 * Saves logPhone model using "Bcakbone.Model" object, and adds saved data to
	 * time-line if necessary.
	 */
	$('#globalModal').on('click', '#validate-logPhone', function(e)
	{
		e.preventDefault();

		// Returns, if the save button has disabled attribute
		if ($(this).attr('disabled'))
			return;
		
		var formName;
		var modalName;
		if($(this).attr('action') == "update"){
			formName = "phoneLogForm_update";
			modalName = "phoneLogModal_update";
		}else{
			formName = "phoneLogForm";
			modalName = "globalModal";
		}
		
		var json = serializeForm(formName);
		
		if (!isValidForm("#" + formName))
		{
			return;
		}
		
		if(!json.subject){
			$("#"+formName +" #logPhone_subject_error").show().delay(5000).hide(1);
			return;
		}
		
		if($("#"+formName +" #contact_logPhone_number").attr("value") == "")
		{
			$("#"+formName +" #logPhone_number_error").show().delay(5000).hide(1);
			return;
		}
		
		if($("#"+formName +" #callStatus").attr("value") == ""){
			$("#"+formName +" #logPhone_status_error").show().delay(5000).hide(1);
			return;
		}

		json['status'] = $("#"+formName +" #callStatus").attr("value");
		
		var h = json.hour;
		var m = json.min;
		var s =	json.sec;
		var duration = 0;
			if(json['status'] == 'busy' || json['status'] == 'failed' || json['status'] == 'missed' ){
				duration = 0;
			}else{
				if(isNaN(h) || isNaN(m) || isNaN(s)){
					$("#"+formName +" #logPhone_duration_error1").show().delay(5000).hide(1);
					return;
				}else{
					if(h < 0){
						$("#"+formName +" #logPhone_duration_error1").show().delay(5000).hide(1);
						return;
					}else if(m >59 || m < 0 || s > 59 || s < 0){
						$("#"+formName +" #logPhone_duration_error").show().delay(5000).hide(1);
						return;
					}
					h = parseInt(h);
					m = parseInt(m);
					s = parseInt(s);
					duration = (h*3600)+(m*60)+(s*1);
				}
			}
		

		disable_save_button($(this));
		json['phone'] = $("#"+formName +" #contact_logPhone_number").attr("value");
		json['duration'] = duration;
	//	json['contact_id'] =  $("#"+formName +" #contact_id").attr("value");
		console.log(json);
		saveLogPhone($("#"+formName), $("#"+modalName), this, json);
		
	});
	



	/**
	 * this method will call on click of update button in phone log modal
	 * this will update the edited logPhone
	 *
	 *
	 */
	
	
	$('body').on('click', '.edit-logPhone', function(e)
	{
		e.preventDefault();
		console.log($(this).attr('data'));  // data gives us the id for the particular logphone model
		var logPhone = notesView.collection.get($(this).attr('data'));

		// Clone modal, so we dont have to create a update modal.
		// we can clone add change ids and use it as different modal

		try{
			var logCallParam = {};
			logPhone = logPhone.toJSON();
			var contact = logPhone.contacts[0];
			var name = getContactName(contact);
			phone = getPhoneWithSkypeInArray(contact.properties);
			logCallParam['num'] = phone;
			logCallParam['action'] = "edit";
			$("#globalModal").html(getTemplate("phoneLogModal",logCallParam));
			deserializeForm(logPhone, $("#phoneLogForm", "#globalModal"));
			$("#phoneLogForm #contact_logPhone_number").html(logPhone.phone);
			$("#phoneLogForm #contact_logPhone_number").attr("value", logPhone.phone);
			
			$("#phoneLogForm #callStatus").attr("value", logPhone.status);
			$("#phoneLogForm #callStatus").html(toTitleCase(logPhone.status));

			if(logPhone.status == 'busy' || logPhone.status == 'failed' || logPhone.status == 'missed'){
				$("#phoneLogForm #hour").attr('disabled','disabled');
				$("#phoneLogForm #min").attr('disabled','disabled');
				$("#phoneLogForm #sec").attr('disabled','disabled');
			}
			
			$("#globalModal").modal('show');
			$('#phoneLogForm #logPhone_relatedto_tag').html('<li class="btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ contact.id +'">'+name+'</li>');
		}catch(e){
			$('#globalModal').modal('hide');
			console.log ("an error has occured")
		}
	});
	
/**
	 * Shows logPhone modal and activates contacts
	 */
	$('body').on('click', '.show-logPhone', function(e)
	{
		e.preventDefault();
		
		try{
			var logCallParam = {};
			contact = agile_crm_get_contact();
			name = getContactName(contact);
			phone = getPhoneWithSkypeInArray(contact.properties);
			logCallParam['num'] = phone;
			logCallParam['action'] = "add";
		}catch(e){
			$('#globalModal').modal('hide');
			console.log ("an error has occured")
		}
		
		$("#globalModal").html(getTemplate("phoneLogModal",logCallParam));
		$('#phoneLogForm #logPhone_relatedto_tag').html('<li class="btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ contact.id +'">'+name+'</li>');
		$('#phoneLogForm #saveActivity').val("true");
		$("#globalModal").modal('show');


	});
	
	
	/**
	 * Shows edit page to add phone number
	 */
	$('#globalModal').on('click', '.add_logPhone', function(e)
	{
		e.preventDefault();
		$("#globalModal").modal('hide');
		routeToPage("contact-edit");
		setTimeout(function()
			{
				if($("#continueform #phone:visible").length < 1){
					setTimeout(function()
							{
								$("#continueform #phone:visible").trigger('focus');
							}, 2000);
				}
				$("#continueform #phone:visible").trigger('focus');
			}, 1500);
		
	});
	

});


function saveLogPhone(form, modal, element, logPhone)
{

	console.log(logPhone);
	 $(".logPhone-save-status").html("");
	 
	var logPhoneModel = new Backbone.Model();
	logPhoneModel.url = 'core/api/notes';
	logPhoneModel.save(logPhone, { success : function(data)
	{

		// Removes disabled attribute of save button
		enable_save_button($(element));//$(element).removeAttr('disabled');

		form.each(function()
		{
			this.reset();
		});

		modal.modal('hide');

		var logPhone = data.toJSON();

		console.log(logPhone);
		// function
		if (notesView && notesView.collection)
		{
			console.log(notesView.collection.toJSON());
			if(notesView.collection.get(logPhone.id))
			{
				notesView.collection.get(logPhone.id).set(new BaseModel(logPhone));
			}
			else
			{
				notesView.collection.add(new BaseModel(logPhone), { sort : false });
				notesView.collection.sort();
			}
		}
		if($("#saveActivity",form).val() == "true"){
			saveLogPhoneActivity(logPhone.callType, logPhone.phone, logPhone.status, logPhone.duration, "" );
		}
		
		//updating in contact detail view
		if (App_Contacts.contactDetailView && Current_Route == "contact/" + App_Contacts.contactDetailView.model.get('id'))
		{
			
				if (logPhone.contacts[0].id == App_Contacts.contactDetailView.model.get('id'))
				{

					add_entity_to_timeline(data);

					return false;
				}

		}
		
		
	},
	  error: function(){
		  $(".logPhone-save-status").html("Could not save. Please try again");
		    console.log('error');
		    enable_save_button($(element));
		  } });
}

function toTitleCase(str) {
    return str.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
}



function saveLogPhoneActivity(direction,phone,status,duration,widgetName){
	
	
	$.post( "/core/api/notes/save_logPhoneActivity",{
		direction: direction, 
		phone: phone, 
		status : status,
		duration : duration,
		widgetName : widgetName
		});
	
}



/**
 * It will return the phone and skype phone in array having more than one contact
 */
function getPhoneWithSkypeInArray(items)
{
	var va = [];
	var phone = "phone";
	var skype = "skypePhone";
	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == phone || items[i].name == skype)
		{
			// If phone number has value only then add to array
			if (items[i].value != "" || items[i].value != null)
				va[va.length] = items[i].value;
		}
	}
	return va;
}


/**
 * this method will dynamically populate the log call modal with the supplier params
 * this will update the edited logPhone
 *
 *
 */

function showDynamicCallLogs(data)
{
	try{
		console.log("parameter send" + data );
		var logCallParam = {};
		logCallParam['num'] = [data.number];
		logCallParam['action'] = "add";
		$("#globalModal").html(getTemplate("phoneLogModal",logCallParam));
		
		$("#phoneLogForm #callStatus").attr("value", data.status);
		$("#phoneLogForm #callStatus").html(toTitleCase(data.status));
		$("input[name=callType][value="+data.callType+"]").attr('checked', 'checked');
		
		$("#globalModal").modal('show');
		$('#phoneLogForm #subject').val(data.subject);
		var time = getTimeInArray(data.duration); //[hours,miiutes,second]
		$('#phoneLogForm #sec').val(time.pop());
		$('#phoneLogForm #min').val(time.pop());
		$('#phoneLogForm #hour').val(time.pop());
		
		$('#phoneLogForm #logPhone_relatedto_tag').html('<li class="btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ data.contId +'">'+data.contact_name+'</li>');
		$("#phoneLogForm").find("#description").focus();
	}catch(e){
		$('#globalModal').modal('hide');
		console.log ("an error has occured");
	}
}