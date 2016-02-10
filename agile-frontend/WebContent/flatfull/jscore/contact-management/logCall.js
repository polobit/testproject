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
	
	
	// This method is called when the add-note modal is closed .....
	//This will check if the if the activities is saved or not
		$('#logCallModal').on('hidden.bs.modal', function (e) {
			
			var widget = $("#callWidgetName",$("#phoneLogForm")).val();
			if(CallLogVariables.callActivitySaved || widget == ""){
				resetCallLogVariables();
				return;
			}
			var data ={};
			var direction = CallLogVariables.callType;
			if(direction == "outbound-dial" || direction == "Outgoing" || direction == "outgoing") {
				data.url = CallLogVariables.url + "savecallactivityById";
			}else{
				data.url = CallLogVariables.url + "savecallactivity";
			}
				data.id = CallLogVariables.id;
				data.callType = CallLogVariables.callType;
				data.number = CallLogVariables.phone;
				data.status = CallLogVariables.status;
				data.duration = CallLogVariables.duration;
				data.widget = CallLogVariables.callWidget
				saveLogPhoneActivity(data);
				resetCallLogVariables();
		});  
		
/**
 * select box change functionality on number change
 * @id = "logPhone_number_option"
 * 
 */	
	$('#logCallModal').on('click', '#logPhone_number_option', function(e)
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
	
	$('#logCallModal').on('click', '#statusValue', function(e)
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
	$('#logCallModal').on('click', '#validate-logPhone', function(e)
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
			modalName = "logCallModal";
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
			$("#logCallModal").html(getTemplate("phoneLogModal",logCallParam));
			deserializeForm(logPhone, $("#phoneLogForm", "#logCallModal"));
			$("#phoneLogForm #contact_logPhone_number").html(logPhone.phone);
			$("#phoneLogForm #contact_logPhone_number").attr("value", logPhone.phone);
			
			$("#phoneLogForm #callStatus").attr("value", logPhone.status);
			$("#phoneLogForm #callStatus").html(toTitleCase(logPhone.status));

			if(logPhone.status == 'busy' || logPhone.status == 'failed' || logPhone.status == 'missed'){
				$("#phoneLogForm #hour").attr('disabled','disabled');
				$("#phoneLogForm #min").attr('disabled','disabled');
				$("#phoneLogForm #sec").attr('disabled','disabled');
			}
			
			$("#logCallModal").modal('show');
			$('#phoneLogForm #logPhone_relatedto_tag').html('<li class="btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ contact.id +'">'+name+'</li>');
		}catch(e){
			$('#logCallModal').modal('hide');
			console.log ("an error has occured")
		}
	});
	
/**
	 * Shows logPhone modal and activates contacts
	 * 
	 * Here we are proiding two solution of save/edit and saveactivity
	 * 1) action : whether to add or edit
	 * 2)setting the value of saveactivity hidden text field : True is auto save the activity and false if dont save the activity
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
			$('#logCallModal').modal('hide');
			console.log ("an error has occured")
		}
		
		$("#logCallModal").html(getTemplate("phoneLogModal",logCallParam));
		$('#phoneLogForm #logPhone_relatedto_tag').html('<li class="btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ contact.id +'">'+name+'</li>');
		$('#phoneLogForm #saveActivity').val("true");
		$("#logCallModal").modal('show');


	});
	
	
	/**
	 * Shows edit page to add phone number
	 */
	$('#logCallModal').on('click', '.add_logPhone', function(e)
	{
		e.preventDefault();
		$("#logCallModal").modal('hide');
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

		var logPhone = data.toJSON();

		if($("#saveActivity",form).val() == "true"){
			try{
				var contactDetailsObj;
				if(CallLogVariables.id){
					contactDetailsObj = CallLogVariables.id;
				}else{
					contactDetailsObj = agile_crm_get_contact();	
				}
				var data ={};
				data.url = "/core/api/notes/save_logPhoneActivity";
				data.id = contactDetailsObj.id;
				data.callType = logPhone.callType;
				data.number = logPhone.phone;
				data.status = logPhone.status;
				data.duration = logPhone.duration;
				data.widget = $("#callWidgetName",form).val();
				CallLogVariables.callActivitySaved = true;
				saveLogPhoneActivity(data);
			}catch(e){
				console.log("activities not saved AS CONTACT NOT FOUND");
			}
			
		}
		
		modal.modal('hide');

		
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

function saveLogPhoneActivity(data){
	var direction = data.callType;
	if(direction == "outbound-dial" || direction == "Outgoing" || direction == "outgoing") {
		$.post( data.url,{
			id:data.id,
			direction: direction, 
			phone: data.number, 
			status : data.status,
			callWidget : data.widget,
			duration : data.duration 
			});
	}else{
		$.post( data.url,{
			direction: direction, 
			phone: data.number, 
			status : data.status,
			callWidget : data.widget,
			duration : data.duration 
			});
	}
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
		$("#logCallModal").html(getTemplate("phoneLogModal",logCallParam));
		
		$("#phoneLogForm #callStatus").attr("value", data.status);
		$("#phoneLogForm #callStatus").html(toTitleCase(data.status));
		$("input[name=callType][value="+data.callType+"]").attr('checked', 'checked');
		
		$("#logCallModal").modal('show');
		$('#phoneLogForm #subject').val(data.subject);
		var time = getTimeInArray(data.duration); //[hours,miiutes,second]
		$('#phoneLogForm #sec').val(time.pop());
		$('#phoneLogForm #min').val(time.pop());
		$('#phoneLogForm #hour').val(time.pop());
		$('#phoneLogForm #callWidgetName').val(data.widget);
		$('#phoneLogForm #saveActivity').val("true");
		$('#phoneLogForm #logPhone_relatedto_tag').html('<li class="btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ data.contId +'">'+data.contact_name+'</li>');
		$("#phoneLogForm").find("#description").focus();
		
		CallLogVariables.callActivitySaved = false;
		CallLogVariables.id = data.contId;
		CallLogVariables.callType = data.callType;
		CallLogVariables.status = data.status;
		CallLogVariables.callWidget = data.widget;
		CallLogVariables.duration = data.duration;
		CallLogVariables.phone = data.number;
		CallLogVariables.url = data.url;
		
		
	}catch(e){
		$('#logCallModal').modal('hide');
		console.log ("an error has occured");
	}
}