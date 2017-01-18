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
			var widgetName = CallLogVariables.callWidget
			var data ={};
			var direction = CallLogVariables.callType;
			if((direction == "outbound-dial" || direction == "Outgoing" || direction == "outgoing") && widgetName != "Asterisk") {
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
		
		// This method is called when the add-note modal is closed .....
		//This will check if the if the activities is saved or not
			$('#logCallModal').on('shown.bs.modal', function (e) {
				$("#phoneLogForm #status-wait").html('<img class="loading-img" style="opacity:0.5; position:absolute; right:45px; top:10px;" src="//doxhze3l6s7v9.cloudfront.net/beta/static//v2/img/ajax-loader-cursor.gif"></img>');
				getTelephonyStatus(function(status){
					var statusHtml="";
					$.each(status,function(index,stats){
					var labelName = stats.label.toLocaleLowerCase();	
					statusHtml = statusHtml +	'<li><a id = "statusValue"  value ="'+labelName+'" >'+stats.label +'</a></li>';
					});
					$("#phoneLogForm #statusValue-ul").html(statusHtml);
					$("#phoneLogForm #status-wait").html("");
				});
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

		 if ($("#"+formName +" #logPhone_relatedto_tag").children().length == 0) {
            $("#"+formName + " #log_relatedto_error").show().delay(5000).hide(1);
            return
        }

		json['status'] = $("#"+formName +" #callStatus").attr("value");
		
		var h = json.hour;
		var m = json.min;
		var s =	json.sec;
		var duration = 0;

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
					
						if(duration < 0){
							$("#"+formName +" #logPhone_duration_error2").show().delay(5000).hide(1);
							return;
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
			$("#phoneLogForm #contact_logPhone_number").removeClass("add_logPhone");
			$("#phoneLogForm #contact_logPhone_number").css({"cursor": "auto","color":"#777"});
			
			$("#phoneLogForm #callStatus").attr("value", logPhone.status);
			$("#phoneLogForm #callStatus").html(toTitleCase(logPhone.status));

			$("#logCallModal").modal('show');
			agile_type_ahead("call_related_to", $("#phoneLogForm", '#logCallModal'), contacts_typeahead);
			/*var contact_html="";
			$.each(contacts,function(index,contact){
				contact_html=contact_html.concat('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ contact.id +'">'+getContactName(contact)+'</li>');
	
			});
			$('#phoneLogForm #logPhone_relatedto_tag').html(contact_html);*/
			//$('#phoneLogForm #logPhone_relatedto_tag').html('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ contact.id +'">'+getContactName(contact)+'</li>');
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
			var contact = null;
			if(company_util.isCompany()){
				contact = App_Companies.companyDetailView.model.toJSON();
			} else {
				contact = App_Contacts.contactDetailView.model.toJSON();
			}
		//	contact = agile_crm_get_contact();
			name = getContactName(contact);
			phone = getPhoneWithSkypeInArray(contact.properties);
			
			logCallParam['num'] = phone;
			logCallParam['action'] = "add";
		
		
		$("#logCallModal").html(getTemplate("phoneLogModal",logCallParam));
		
		$('#phoneLogForm #logPhone_relatedto_tag').html('<li class="tag btn btn-xs btn-default m-r-xs m-b-xs inline-block" data="'+ contact.id +'">'+name+'</li>');
		
		$('#phoneLogForm #saveActivity').val("true");
		$("#logCallModal").modal('show');
		var el = $("#phoneLogForm");
		agile_type_ahead("call_related_to", el, contacts_typeahead);

		}catch(e){
			$('#logCallModal').modal('hide');
			console.log ("an error has occured")
		}

	});
	
	
	/**
	 * Shows edit page to add phone number
	 */
	$('#logCallModal').on('click', '.add_logPhone', function(e)
	{
		e.preventDefault();
		$(".add_logPhone_span","#phoneLogForm").hide();
		$("#contact-add-phone-span", "#phoneLogForm").show();
		
		/*		
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
			}, 1500);*/
		
	});
	
	$('#logCallModal').on('click', '.contact_phone_add', function(e)
			{
				e.preventDefault();
				var contact;
				var is_person = false;
				var phone = $("#phoneLogForm #contact_phone").val().trim();
				if(!phone){
					$("#phoneLogForm #logPhone_number_error").show().delay(5000).hide(1);
					return;
				}
				if(phone){
					var regE1 = new RegExp("^(.*[;]+.*)$");
					var regE2 = new RegExp("^(.+[\;][0-9\*\#]+)$");
					if(regE1.test(value)){
						if(!regE2.test(value)){
							$("#phoneLogForm #logPhone_number_ext_error").show().delay(5000).hide(1);
							return;
						}
					}
				}
				var prop = property_JSON('phone', 'phoneLogForm #contact_phone');
				prop['subtype'] = "";
			if(company_util.isCompany()){
				contact = App_Companies.companyDetailView.model.toJSON();
			} else {
				contact = App_Contacts.contactDetailView.model.toJSON();
				is_person = true;
			}
			contact.properties.push(prop);
			
			var contactModel = new BaseModel();
			contactModel.url = "core/api/contacts";
			contactModel.save(contact,{success : function(data){
				console.log("contact " + data);
				$("#contact-add-phone-span").hide();
				$("#contact_logPhone_number").attr("value",prop.value);
				$(".add_logPhone_span","#phoneLogForm").show();
				$("#contact_logPhone_number").html(prop.value);
				if(is_person){
					App_Contacts.contactDetailView.model = data;
				}else{
					App_Companies.companyDetailView.model = data;
				}
					
				$("#phoneLogForm #contact_logPhone_number").removeClass("add_logPhone");
				$("#phoneLogForm #contact_logPhone_number").css({"cursor": "auto","color":"#777"});
			}
			
			})
			
				/*		
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
					}, 1500);*/
				
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

try{
	var contactDetailsObjId;
	if(CallLogVariables.id){
		contactDetailsObjId = CallLogVariables.id;
	}else{
		if(company_util.isCompany()){
			contactDetailsObjId = App_Companies.companyDetailView.model.toJSON().id;
		} else {
			contactDetailsObjId = agile_crm_get_contact().id;
		}
	}
	
	if($("#saveActivity",form).val() == "true"){
		try{
			var data1 ={};
			data1.url = "/core/api/notes/save_logPhoneActivity?note_id="+logPhone.id;
			data1.id = contactDetailsObjId;

			data1.callType = logPhone.callType;
			data1.number = logPhone.phone;
			data1.status = logPhone.status;
			data1.duration = logPhone.duration;
			data1.widget = $("#callWidgetName",form).val();
			CallLogVariables.callActivitySaved = true;
			saveLogPhoneActivity(data1);
		}catch(e){
			console.log("activities not saved AS CONTACT NOT FOUND");
		}
	}else
		{
			try{
				
				var data1 ={};
				data1.url = "/core/api/notes/update_logPhoneActivity?note_id="+
				logPhone.id+'&subject='+logPhone.subject;
				data1.id = contactDetailsObjId;
				data1.callType = logPhone.callType;
				data1.number = logPhone.phone;
				data1.status = logPhone.status;
				data1.duration = logPhone.duration;
				data1.widget = $("#callWidgetName",form).val();
				CallLogVariables.callActivitySaved = true;
				saveLogPhoneActivity(data1);
			}catch(e){
				console.log("activities not saved AS CONTACT NOT FOUND");
			}
		}
		
	
	if(logPhone.status != 'busy' || logPhone.status == 'failed' || logPhone.status == 'missed'){
		if(!$("#callWidgetName",form).val()){
			twilioIOSaveContactedTime(contactDetailsObjId);
		}
	}
}catch (e) {}

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
			if(window.location.hash.split("/")[1]){  
			   if(window.location.hash.split("/")[1] == contactDetailsObjId){
				notesView.collection.add(new BaseModel(logPhone), { sort : false });
				notesView.collection.sort();

			  }

		    }
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
	  error: function(model, response){
	  	if(response && response.status == 403)
	  	{
	  		enable_save_button($(element));
	  		$('span.save-status', modal).html('<div class="inline-block"><p class="text-base" style="color:#B94A48;"><i>'+Handlebars.compile('{{name}}')({name : response.responseText})+'</i></p></div>');
			setTimeout(function()
			{
				$('span.save-status', modal).html('');
			}, 2000);
			return;
	  	}
		  $(".logPhone-save-status").html("Could not save. Please try again");
		    console.log('error');
		    enable_save_button($(element));
		  } });
}

function toTitleCase(str) {
	try{
    return str.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
	}catch(e){
		return str;
	}
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
		$('#phoneLogForm #logPhone_relatedto_tag').html('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block" data="'+ data.contId +'">'+data.contact_name+'</li>');
		CallLogVariables.description = $("#agilecrm-container #call-noty-notes").val();
		if(CallLogVariables.description){
			$("#phoneLogForm #description").val(CallLogVariables.description.trim());
		}
		$("#phoneLogForm").find("#description").focus();
		agile_type_ahead("call_related_to",  $("#phoneLogForm", '#logCallModal'), contacts_typeahead);
		
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



function getTelephonyStatus(callback){
		$.ajax({
			url: 'core/api/categories?entity_type=TELEPHONY_STATUS',
			type: 'GET',
			dataType: 'json',
			success: function(status){
				if (callback && typeof (callback) === "function"){
					callback(status);
				}else{
					console.log("irrevalent backend fetch for getTelephonyStatus");
				}
			}
		});
}