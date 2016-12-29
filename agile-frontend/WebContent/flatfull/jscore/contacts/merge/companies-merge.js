var dup_companies_array = [];


$(function(){
	$('body').off('click', '#duplicate-companies-cancel');
	$('body').on('click', '#duplicate-companies-cancel', function(event){
		event.preventDefault();
		dup_companies_array.length = 0;
		var master_record = App_Companies.companyDetailView.model.toJSON();
		Backbone.history.navigate("company/" + master_record.id, { trigger : true });
	});

	$('body').off('click', '#companies-merge-cancel');
	$('body').on('click', '#companies-merge-cancel', function(event){
		event.preventDefault();
		dup_companies_array.length = 0;
		var master_record = App_Companies.companyDetailView.model.toJSON();
		Backbone.history.navigate("duplicate-company/" + master_record.id, { trigger : true });
	});

	$('body').off('click', '#duplicate-companies-checked-grid');
	$('body').on('click', '#duplicate-companies-checked-grid', function(event){
		event.preventDefault();
		var index_array = [];
		var data_array = [];
		var checked = false;
		var table = $('body').find('.showCheckboxes');
		$(table).find('.tbody_check').each(function(index, element){			
			if ($(element).is(':checked')){
				dup_companies_array.push($(element).closest('tr').find('td.data').attr('data'));
				checked = true;
			}
		});
		if (checked){
			if (dup_companies_array.length > 2){
				showAlertModal("companies_merge_limit", undefined, function(){
					dup_companies_array.length = 0;
				});							
				return;
			}
			Backbone.history.navigate("merge-companies", { trigger : true });
		}else{
			$('body').find(".select-none").html('<div class="alert alert-danger m-t-sm"><a class="close" data-dismiss="alert" href="#">&times;</a>'+_agile_get_translated_val('contacts','merge-error')+'</div>').show().delay(3000).hide(1);
		}
	});

	$('body').off('click', '#merge-companies-model');
	$('body').on('click', '#merge-companies-model', function(event){
		event.preventDefault();
		var confirm_message = "{{agile_lng_translate 'contacts-view' 'merge-records-desc'}}";
	
		var $that = $(this);
		showAlertModal(confirm_message, "confirm", function(){
				$that.attr('disabled', 'disabled');
				$('#companies-merge-cancel').attr('disabled', 'disabled');
				$('#companies-merge-cancel').after('<img class="companies-merge-loading p-r-xs m-b"  src= "'+updateImageS3Path("img/21-0.gif")+'"></img>');
				
				var checked = false;
				var selected_fields = [];
				var table = $('body').find('#merge-companies-table');
				var tbody = $(table).find('tbody');
				var phones = [];
				var emails = [];
				var websites = [];
				var tags = [];
				var custom_fields = [];
				var remove_fields = [];
				var master_record = App_Companies.companyDetailView.model;
				var master_record_dup = JSON.parse(JSON.stringify(master_record.toJSON()));
				var master_id = master_record.id;
				console.log(master_record.toJSON());

				tbody.children().each(function(index, element){
					$(element).find("[type=radio]:checked").each(function(index, element){
						if ($(element).attr("oid") != master_id){
							var fieldName = $(element).attr("field");
							var fieldValue = $(element).attr("data");
							var fieldType = $(element).attr("fieldtype");
							if (typeof fieldType !== typeof undefined && fieldType !== false){
								if (fieldValue){
									custom_field = {};
									custom_field['name'] = fieldName;
									custom_field['value'] = fieldValue;
									custom_field['type'] = 'CUSTOM';
									custom_fields.push(custom_field);
								}else{
									remove_field = {};
									remove_field['name'] = fieldName;
									remove_field['type'] = 'CUSTOM';
									remove_fields.push(remove_field);
								}
							}else{
								if (fieldValue){
									selected_field = {};
									selected_field['name'] = fieldName;
									selected_field['value'] = fieldValue;
									selected_fields.push(selected_field);
									if (fieldName.toLowerCase() == 'company'){
										var company_id = $(element).attr("company_id");
										master_record.set({ "contact_company_id" : company_id });
									}
								}else{
										remove_field = {};
										remove_field['name'] = fieldName;
										remove_field['type'] = 'SYSTEM';
										remove_fields.push(remove_field);
								}
							}
						}
					});

					$(element).find("[type=checkbox]:checked").each(function(index, element){
						var fieldName = $(element).attr("field");
						var fieldValue = $(element).attr("data");
						var fieldType = $(element).attr("fieldtype");
						if (fieldName === "email"){
							var subtype = $(element).attr("subtype");
							email = {};
							email['value'] = fieldValue;
							if (subtype){
								email['subtype'] = subtype;
							}
							emails.push(email);
						}else if (fieldName === "website"){
							var subtype = $(element).attr("subtype");
							website = {};
							website['value'] = fieldValue;
							if (subtype){
								website['subtype'] = subtype;
							}								
							websites.push(website);
						}else if (fieldName === "phone"){
							var subtype = $(element).attr("subtype");
							phone = {};
							phone['value'] = fieldValue;
							if (subtype){
								phone['subtype'] = subtype;
							}
							phones.push(phone);
						}else if (fieldName === "tags"){
							tags.push(fieldValue);
						}
					});
				});
				var properties = master_record_dup.properties;
				master_record.set({ "tags" : tags });
				merge_duplicate_companies(master_record, properties, selected_fields, custom_fields, remove_fields, websites, emails, phones);
			}, undefined, "{{agile_lng_translate 'contacts-view' 'merge-records'}}");
		});	
});


function merge_duplicate_companies(master_record, properties, selected_fields, custom_fields, remove_fields, websites, emails, phones){
	for (var i = properties.length - 1; i >= 0; i--){
		if (properties[i].name.toLowerCase() === 'email' || properties[i].name.toLowerCase() === 'website' || properties[i].name.toLowerCase() === 'phone'){
			properties.splice(i, 1);
		}
	}

	for (var i = 0; i < remove_fields.length; i++){
		for (var j = 0; j < properties.length; j++){
			var property = properties[j];
			if (property.name.toLowerCase() === remove_fields[i].name.toLowerCase() && property.type.toLowerCase() === remove_fields[i].type.toLowerCase()){
				properties.splice(j, 1);
				break;
			}
		}
	}

	for (var j = 0; j < selected_fields.length; j++){
		var element = selected_fields[j];
		for (var k = 0; k < properties.length; k++){
			if (properties[k].name.toLowerCase() === element['name'].toLowerCase()){
				properties[k].value = element['value'];
				break;
			}else if (k == properties.length - 1){
				var object = {};
				object['name'] = element['name'];
				object['value'] = element['value'];
				object['type'] = 'SYSTEM';
				properties.push(object);
				break;
			}
		}
	}

	if (custom_fields.length > 0){
		for (var i = 0; i < custom_fields.length; i++){
			var element = custom_fields[i];
			for (var j = 0; j < properties.length; j++){
				if (properties[j].name.toLowerCase() === element['name'].toLowerCase() && properties[j].type === 'CUSTOM'){
					properties[j].value = element['value'];
					break;
				}else if (j == properties.length - 1){
					if (custom_fields[i].value){
						var object = {};
						object['name'] = custom_fields[i].name;
						object['value'] = custom_fields[i].value;
						object['type'] = 'CUSTOM';
						properties.push(object);
						break;
					}
				}
			}
		}
	}
	if (emails.length > 0){
		for (var i = 0; i < emails.length; i++){
			var object = {};
			object['name'] = 'email';
			object['value'] = emails[i].value;
			object['type'] = 'SYSTEM';
			if (emails[i].subtype){
				object['subtype'] = emails[i].subtype;
			}
			properties.push(object);
		}
	}
	if (phones.length > 0){
		for (var i = 0; i < phones.length; i++){
			var object = {};
			object['name'] = 'phone';
			object['value'] = phones[i].value;
			object['type'] = 'SYSTEM';
			if (phones[i].subtype){
				object['subtype'] = phones[i].subtype;
			}
			properties.push(object);
		}
	}
	if (websites.length > 0){
		for (var i = 0; i < websites.length; i++){
			var object = {};
			object['name'] = 'website';
			object['value'] = websites[i].value;
			object['type'] = 'SYSTEM';
			if (websites[i].subtype){
				object['subtype'] = websites[i].subtype;
			}
			properties.push(object);
		}
	}
	master_record.set({ "properties" : properties });
	merge_related_entity_in_master_record_companies(master_record, dup_companies_array);
}


function merge_related_entity_in_master_record_companies(master_record, duplicate_companies){
	master_record.save({}, { url : '/core/api/contacts/companies/merge/'+ duplicate_companies.toString(), 
		success : function(){
			$(".companies-merge-loading").remove();
			COMPANIES_HARD_RELOAD = true;
			var id = master_record.toJSON().id;
			Backbone.history.navigate("company/" + id, { trigger : true });
		} 
	});
}