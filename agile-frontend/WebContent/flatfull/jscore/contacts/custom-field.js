/**
 * custom-field.js is a script file to deal with the UI of the custom fields,
 * and also contains a function which adds custom_fields attribute to the
 * desired entity with all the custom fields as values.
 * 
 * @module Custom fields
 * 
 * author: Yaswanth
 */
function initializeCustomFieldsListeners(){
	/**
	 * Loads the respective modal (Text or Date or List or Check-box modal) based
	 * on the id attribute of the clicked link to save the custom fields.
	 */
	$('#custom-fields-accordion').on('click', '.fieldmodal', function(event){
		event.preventDefault();
		var type = $(this).attr("type");
		
		showCustomFieldModel({"scope" : type, "position" : $(this).parent().parent().find('table > tbody > tr').length+1});
		
	});
	
	
	$('#custom-fields-accordion').on('change', '#admin-settings-customfields-model-list > tr > td:not(":first-child")', function(e){
		e.preventDefault();
		var custom_field = $(this).closest('tr').data();
		console.log(custom_field);
		showCustomFieldModel(custom_field.toJSON());
	});
	$('#custom-fields-accordion').on('click', '#edit-custom-field', function(e){
		e.preventDefault();
		var custom_field = $(this).closest('tr').data();
		console.log(custom_field);
		showCustomFieldModel(custom_field.toJSON());
	});
	$('#custom-fields-accordion').on('click', '#delete-custom-field', function(e){
		e.preventDefault();
		var $that = $(this);
		showAlertModal("delete_custom_field", "confirm", function(){
			var custom_field = $that.closest('tr').data();
			console.log(custom_field);
			var currentElement=$that;
			$.ajax({ type : 'DELETE', url : '/core/api/custom-fields/' + custom_field.id, contentType : "application/json; charset=utf-8",
				success : function(data){
					if(custom_field.get("scope")=="CONTACT")
					{
						App_Admin_Settings.contactCustomFieldsListView.collection.remove(custom_field.id);
						if(App_Contacts.contactViewModel && App_Contacts.contactViewModel.fields_set && 
							App_Contacts.contactViewModel.fields_set.indexOf("CUSTOM_"+custom_field.get('field_label'))>-1)
						{
							var index =App_Contacts.contactViewModel.fields_set.indexOf("CUSTOM_"+custom_field.get('field_label'));
							App_Contacts.contactViewModel.fields_set.splice(index,1);
						}
						if(App_Companies.contactCompanyViewModel && App_Companies.contactCompanyViewModel.fields_set && 
							App_Companies.contactCompanyViewModel.fields_set.indexOf("CUSTOM_"+custom_field.get('field_label'))>-1)
						{
							var index =App_Companies.contactCompanyViewModel.fields_set.indexOf("CUSTOM_"+custom_field.get('field_label'));
							App_Companies.contactCompanyViewModel.fields_set.splice(index,1);
						}
				
					}
					else if(custom_field.get("scope")=="COMPANY")
					{
						App_Admin_Settings.companyCustomFieldsListView.collection.remove(custom_field.id);
						if(App_Companies.companyViewModel && App_Companies.companyViewModel.fields_set && 
							App_Companies.companyViewModel.fields_set.indexOf("CUSTOM_"+custom_field.get('field_label'))>-1)
						{
							var index =App_Companies.companyViewModel.fields_set.indexOf("CUSTOM_"+custom_field.get('field_label'));
							App_Companies.companyViewModel.fields_set.splice(index,1);
						}
					}
					else if(custom_field.get("scope")=="DEAL")
						App_Admin_Settings.dealCustomFieldsListView.collection.remove(custom_field.id);
					else if(custom_field.get("scope")=="CASE")
						App_Admin_Settings.caseCustomFieldsListView.collection.remove(custom_field.id);
					else if(custom_field.get("scope")=="LEAD")
						App_Admin_Settings.leadCustomFieldsListView.collection.remove(custom_field.id);
					currentElement.closest('tr').remove();
					CONTACT_CUSTOM_FIELDS=App_Admin_Settings.contactCustomFieldsListView.collection.toJSON();
				}, dataType : 'json' });
		});
	});
}

function showCustomFieldModel(data)
{
	var modelViewCount = 0;
	var isNew = false;
	isNew = !data.id;

	// Creating model for bootstrap-modal
	var modelView = new Base_Model_View({
		url : '/core/api/custom-fields',
		template : 'custom-field-add-modal',
	//	window : 'custom-fields',
		data : data,
		//reload : true,
		modal : "#custom-field-add-modal",
		isNew : isNew,
		prePersist : function(model){
			var scopeExtension = [];
		    var positionList = [];
		    var scopeFields = $("#textModalForm").find(".CustomFieldScope");
		 	$.each(scopeFields , function(index,element)
		 	{
		        if($(element).find('input').is(':checked')){
		            var typ = $(element).find('input').attr('id') ;
		            scopeExtension.push(typ);
		            var position = 0 ;
		            if(typ == 'contacts'){
		                if(App_Admin_Settings.contactCustomFieldsListView && App_Admin_Settings.contactCustomFieldsListView.collection)
		                { 
		                   	$.each(App_Admin_Settings.contactCustomFieldsListView.collection.models , function(i,m)
							{
								if(m.get('position') && m.get('position') > position)
									position = m.get('position') ;
							});
		                    positionList.push(typ+'-'+ position);
		                }
		            }
		            else if(typ == 'companies'){
		                if(App_Admin_Settings.companyCustomFieldsListView && App_Admin_Settings.companyCustomFieldsListView.collection)
		                { 
		                   	$.each(App_Admin_Settings.companyCustomFieldsListView.collection.models , function(i,m)
							{
								if(m.get('position') && m.get('position') > position)
									position = m.get('position') ;
							});
		                    positionList.push(typ+'-'+ position);
		             	}
		            }
		            else if(typ == 'deals'){
		            	if(App_Admin_Settings.dealCustomFieldsListView && App_Admin_Settings.dealCustomFieldsListView.collection)
		                {
		                   	$.each(App_Admin_Settings.dealCustomFieldsListView.collection.models , function(i,m)
							{
								if(m.get('position') && m.get('position') > position)
									position = m.get('position') ;
							});
		                    positionList.push(typ+'-'+ position);
		             	}
		            }
		            else if(typ == 'leads'){
		            	if(App_Admin_Settings.leadCustomFieldsListView && App_Admin_Settings.leadCustomFieldsListView.collection)
		                {
		                   	$.each(App_Admin_Settings.leadCustomFieldsListView.collection.models , function(i,m)
							{
								if(m.get('position') && m.get('position') > position)
									position = m.get('position') ;
							});
		                    positionList.push(typ+'-'+ position);
		             	}
		            }
		        }
		    });
			model.attributes['scopeExtension'] = scopeExtension.toString();
			model.attributes['positionsList'] = positionList.toString();
			if(model.get('field_type') && model.get('field_type') == 'LIST' && model.get('field_data'))
			{
				var data = model.get('field_data').split(';');
				var dataTrim='' ;
				$.each(data , function(a,b)
				{
					if(b)
					{
						dataTrim = dataTrim + b.trim() ;
						dataTrim = dataTrim + ';' ;
					}
				});
				model.attributes.field_data = dataTrim ;
			}
		},
		postRenderCallback : function(el) {
			
			console.log($("#custom-field-add-modal", el));
			
			var scope = $("#textModalForm", el).find("input[name=scope]").val();
			if( scope=="CONTACT")
			   	$('#textModalForm',el).find("#contacts").prop('checked', true); 
			else if(scope=="COMPANY")
				$('#textModalForm',el).find("#companies").prop('checked', true); 
			else if(scope =="DEAL")
				$('#textModalForm',el).find("#deals").prop('checked', true);
			else if(scope =="LEAD")
				$('#textModalForm',el).find("#leads").prop('checked', true);  
			
			//This code will scroll to top to see the modal.
			
			if(!modelViewCount){
				modelViewCount++;	
				$("#custom-field-add-modal", el).modal('show');
			}
			
			//Customizing the style to display the custom field modal in center for screen.
			var modalWidth = $('#custom-field-add-modal').width();
		     $('#custom-field-add-modal').css("left", "50%");
		     $('#custom-field-add-modal').css("width", modalWidth);
		     $('#custom-field-add-modal').css("margin", (modalWidth/2)*-1);

		     bindCustomFiledChangeEvent(el);
		},
		saveCallback : function(models)
		{
			if(models.length > 1)
			{
				$.each(models, function(index, value) {
								
					var custom_field_model_json;

					if(value.scope=="CONTACT")
						custom_field_model_json = App_Admin_Settings.contactCustomFieldsListView.collection.get(value.id);
					else if(value.scope=="COMPANY")
						custom_field_model_json = App_Admin_Settings.companyCustomFieldsListView.collection.get(value.id);
					else if(value.scope=="DEAL")
						custom_field_model_json = App_Admin_Settings.dealCustomFieldsListView.collection.get(value.id);
					else if(value.scope=="CASE")
						custom_field_model_json = App_Admin_Settings.caseCustomFieldsListView.collection.get(value.id);
					else if(value.scope=="LEAD")
						custom_field_model_json = App_Admin_Settings.leadCustomFieldsListView.collection.get(value.id);

					if(custom_field_model_json)
					{
						custom_field_model_json.set(value);
					}
					else
					{
						if(value.scope=="CONTACT")
						{
							App_Admin_Settings.contactCustomFieldsListView.collection.add(value);
							App_Admin_Settings.contactCustomFieldsListView.render(true);
						}
						if(value.scope=="COMPANY")
						{
							App_Admin_Settings.companyCustomFieldsListView.collection.add(value);
							App_Admin_Settings.companyCustomFieldsListView.render(true);	
						}	
						if(value.scope=="DEAL")
						{
							App_Admin_Settings.dealCustomFieldsListView.collection.add(value);
							App_Admin_Settings.dealCustomFieldsListView.render(true);
						}
						if(value.scope=="LEAD")
						{
							App_Admin_Settings.leadCustomFieldsListView.collection.add(model);
							App_Admin_Settings.leadCustomFieldsListView.render(true);
						}
					}

				});
			}
			else
			{
				var custom_field_model_json;var cuModel;
				if(models[0])
					cuModel = models[0];
				else
					cuModel = models;
				if(cuModel.scope=="CONTACT")
					custom_field_model_json = App_Admin_Settings.contactCustomFieldsListView.collection.get(models.id);
				else if(cuModel.scope=="COMPANY")
					custom_field_model_json = App_Admin_Settings.companyCustomFieldsListView.collection.get(models.id);
				else if(cuModel.scope=="DEAL")
					custom_field_model_json = App_Admin_Settings.dealCustomFieldsListView.collection.get(models.id);
				else if(cuModel.scope=="CASE")
					custom_field_model_json = App_Admin_Settings.caseCustomFieldsListView.collection.get(models.id);
				else if(cuModel.scope=="LEAD")
					custom_field_model_json = App_Admin_Settings.leadCustomFieldsListView.collection.get(models.id);
				if(custom_field_model_json)
				{
					custom_field_model_json.set(models);
				}
				else
				{
					if(cuModel.scope=="CONTACT")
					{
						App_Admin_Settings.contactCustomFieldsListView.collection.add(models);
						App_Admin_Settings.contactCustomFieldsListView.render(true);
					}
					if(cuModel.scope=="COMPANY")
					{
						App_Admin_Settings.companyCustomFieldsListView.collection.add(models);
						App_Admin_Settings.companyCustomFieldsListView.render(true);	
					}	
					if(cuModel.scope=="DEAL")
					{
						App_Admin_Settings.dealCustomFieldsListView.collection.add(models);
						App_Admin_Settings.dealCustomFieldsListView.render(true);
					}
					if(cuModel.scope=="LEAD")
					{
						App_Admin_Settings.leadCustomFieldsListView.collection.add(models);
						App_Admin_Settings.leadCustomFieldsListView.render(true);
					}	
				}

			}
			$("#custom-field-add-modal").modal('hide');
			$("body").removeClass("modal-open").css("padding-right", "");
		},
		errorCallback : function(response)
		{
			if(response.responseText.indexOf("Sorry") == 0)
			{
				$('#duplicate-custom-field-err').html("<i>"+response.responseText+"</i>");
				$('#duplicate-custom-field-err').removeClass("hide");
			}
			else
			{
				var errorJSON = {};
				errorJSON["TEXTAREA"] = "Text Area";
				errorJSON["TEXT"] = "Text Field";
				errorJSON["DATE"] = "Date Field";
				errorJSON["CHECKBOX"] = "Checkbox";
				errorJSON["LIST"] = "List";
				errorJSON["NUMBER"] = "Number";
				errorJSON["FORMULA"] = "Formula";
				errorJSON["CONTACT"] = "Contact";
				errorJSON["COMPANY"] = "Company";

				if($('#label', $('#textModalForm')).is(':disabled'))
				{
					$('#duplicate-custom-field-type-err').html("<i>"+errorJSON[response.responseText]+" "+_agile_get_translated_val('customfields','label-exists')+"</i>");
				}
				else
				{
					$('#duplicate-custom-field-type-err').html("<i>"+errorJSON[response.responseText]+" "+_agile_get_translated_val('customfields','label-exists-1')+"</i>");
				}
				$('#duplicate-custom-field-type-err').removeClass("hide");
			}
			setTimeout(function(){
				$('#duplicate-custom-field-err').addClass("hide");
				$('#duplicate-custom-field-type-err').addClass("hide");
			},5000);

		}		

	});

	$('#custom-field-modal').html(modelView.render(true).el);
	if(!isNew){

			if(data.field_data!="")
			{
				if(data.field_type=="LIST")
				{
					$('#formulaData').val("");
					$('#arearows').val("");
				}
				if(data.field_type=="TEXTAREA")
				{
					$('#formulaData').val("");
					$('#listvalues').val("");
				}
				if(data.field_type=="FORMULA")
				{
					$('#listvalues').val("");
					$('#arearows').val("");
				}

			}
			if(!$("#searchable").is(":checked"))
				$('.warning-message','#custom-field-add-modal').parent().show();

			}
		else
			{
				$("#searchable").prop('checked', true); 
			}
	$("#custom-field-type").trigger("change");
}


function bindCustomFiledChangeEvent(el){
	$('#custom-field-add-modal',el).on('change', '#custom-field-type', function(e){
		e.preventDefault();
		var value = $(this).val();
		if(value == "LIST")
		{
			$("#custom-field-data").hide();
			$("input",  $("#custom-field-data")).removeAttr("name");
			$("#custom-field-list-values").show();
			$("input",  $("#custom-field-list-values")).attr("name", "field_data");
			$("#custom-field-formula-data").hide();
			$("textarea",  $("#custom-field-formula-data")).removeAttr("name");
			$('.required-and-searchable').show();
			//$("#searchable").prop('checked', true);
			$("#searchable").prop('disabled', false);
		}
		else if(value == "TEXTAREA")
		{
			$("#custom-field-data").show();
			$("input",  $("#custom-field-data")).attr("name", "field_data");
			$("#custom-field-list-values").hide();
			$("input",  $("#custom-field-list-values")).removeAttr("name");
			$("#custom-field-formula-data").hide();
			$("textarea",  $("#custom-field-formula-data")).removeAttr("name");
			$('.required-and-searchable').show();
			//$("#searchable").prop('checked', true);
			$("#searchable").prop('disabled', false);
		}
		else if(value == "FORMULA")
		{
			$("#custom-field-data").hide();
			$("input",  $("#custom-field-data")).removeAttr("name");
			$("#custom-field-list-values").hide();
			$("input",  $("#custom-field-list-values")).removeAttr("name");
			$("#custom-field-formula-data").show();
			$("textarea",  $("#custom-field-formula-data")).attr("name", "field_data");
			$('.required-and-searchable').hide();
			//$("#searchable").prop('checked', true);
			//$("#searchable").prop('disabled', false);
		}
		else if(value == "CONTACT" || value == "COMPANY")
		{ 	
			$("#searchable").prop('checked', true);
			$("#searchable").prop('disabled', true);
			$("#custom-field-data").hide();
			$("#custom-field-list-values").hide();
			$("#custom-field-formula-data").hide();

		}
		
		else
		{
			$("#custom-field-data").hide();
			$("#custom-field-list-values").hide();
			$("#custom-field-formula-data").hide();
			$('.required-and-searchable').show();
			//$("#searchable").prop('checked', true);
			$("#searchable").prop('disabled', false);
		}
		
	});

	$('#custom-field-add-modal',el).on('click', '#searchable', function(event){
		if(!$(this).is(":checked"))
			$('.warning-message',el).parent().show();
		else
			$('.warning-message',el).parent().hide();
		
	});
	
}

/**
 * Adds custom fields to the the desired entity and then calls the callback to
 * update the custom fields to that entity.
 * 
 * @method add_custom_fields_to_form
 * @param context
 *            entity to fill up with the custom fields
 * @param callback
 *            will be called with the modified entity as parameter, when it is a
 *            function
 * 
 */
function add_custom_fields_to_form(context, callback, scope) {

	if(scope == undefined || scope == "CONTACT")
		$("#content").html(LOADING_HTML);
	var url = "core/api/custom-fields/scope?scope=" + (scope == undefined ? "CONTACT" : scope);
	var custom_fields = Backbone.Model.extend({
		url : url
	});

	new custom_fields().fetch({
		success : function(custom_field_data) {

			var custom_fields_list = [];

			$.each(custom_field_data.toJSON(), function(index, value) {
				custom_fields_list.push(value);
			});
			
			App_Contacts.custom_fields = custom_fields_list;
			// var contact = contact.toJSON();
			context['custom_fields'] = custom_fields_list;
			
			if (callback && typeof (callback) === "function") {
				// execute the callback, passing parameters as necessary
				callback(context);
			}

		}
	});

}

/**
 * Called from handlebars
 * Generates suitable html string for each custom field entity depending upon it's type 
 * and does concatenation. For example, if the type of the field is list then a 'select drop down' 
 * is generated. Similarly, html strings are generated based on other filed types.
 * If the custom field has the attribute is_required as true, then it's associated html
 * string also contains the "required" class. 
 * 
 * @method show_custom_fields_helper
 * @param custom_fields
 * @param properties
 * @returns {String}
 */
function show_custom_fields_helper(custom_fields, properties){

	var el = "";
	var isModal = false;
	if(properties.length > 0){
		if(properties[0] && properties[0] == 'modal'){
			isModal = true;
		}
	}
	
	// Text as default
	var field_type = "text";
		
	// Create Field for each custom field  to insert into the desired form 
	$.each(custom_fields, function(index, field)
	{
		if(!field.field_type)
			return;
		
		var label_style = "";
		var modal_label_style = "";
		var modal_control_style = "";
		var modal_checkbox = "";
		var field_style = "";
		var div_col9_style = "";
		var div_col3_style = "";
		var checkbox_style ="";
		var max_len = 500;
		if(field.scope == "CONTACT"){
			label_style = "col-sm-3 word-break";
			field_style = "col-sm-10";
			div_col9_style = "col-sm-9 company_input";
			div_col3_style = "col-sm-3";
			modal_checkbox = "col-sm-offset-3 modal-cbx-m-t";
		}else if(field.scope == "COMPANY"){
			label_style = "control-label col-sm-3 word-break";
			modal_label_style = "control-label col-sm-3 word-break"; 
			modal_control_style = "col-sm-7";
			div_col9_style = "company_input";
			checkbox_style = "col-sm-3";
			modal_checkbox = "col-sm-offset-3 modal-cbx-m-t";
		}else if(field.scope == "DEAL"){
			label_style = "control-label col-sm-3 word-break";
			modal_label_style = "control-label col-sm-3 word-break";
			modal_control_style = "col-sm-7";
			checkbox_style = "col-sm-3";
			modal_checkbox = "col-sm-offset-3 modal-cbx-m-t";
		}else if(field.scope == "CASE"){
			label_style = "control-label col-sm-3 word-break";
			modal_label_style = "control-label col-sm-3 word-break";
			modal_control_style = "col-sm-7";
			checkbox_style = "col-sm-3";
			modal_checkbox = "col-sm-offset-3";
		}else if(field.scope == "LEAD"){
			label_style = "control-label col-sm-3 word-break-all";
			modal_label_style = "control-label col-sm-3 word-break-all";
			modal_control_style = "col-sm-7";
			checkbox_style = "col-sm-3";
			modal_checkbox = "col-sm-offset-3 modal-cbx-m-t";
		}
		
		// If field type is list create a select dropdown
		if(field.field_type.toLowerCase() == "list")
		{
			var list_values = [],list_options = '<option value="">Select</option>';
			
			// Split values at ";" to separate values of field_data (list options)
			if(field.field_data)
					list_values = field.field_data.split(";");
				
				// Create options based on list values
				$.each(list_values,function(index, value){
					if(value != "")
						list_options = list_options.concat('<option value="'+value+'">'+value+'</option>');
				});
				
				// Create select drop down by checking it's required nature
				if(field.is_required){
					
					if(isModal){
						el = el.concat('<div class="control-group form-group "><label class="control-label word-break '+modal_label_style+'">'
								+field.field_label
								+'<span class="field_req">*</span></label><div class="controls '+modal_control_style+'"><span><select class="'
								+field.field_type.toLowerCase()
								+' custom_field required form-control '+field_style+'" id='
								+field.id
								+' name="'
								+field.field_label
								+'">'
								+list_options
								+'</select></span></div></div>');											
					}else{
						el = el.concat('<div class="control-group form-group "><label class="control-label '+label_style+'">'
								+field.field_label
								+' <span class="field_req">*</span></label><div class="controls col-sm-9 '+div_col9_style+'"><select class="'
								+field.field_type.toLowerCase()
								+' custom_field required form-control '+field_style+'" id='
								+field.id
								+' name="'
								+field.field_label
								+'">'
								+list_options
								+'</select></div></div>');
					}
					
				}else{
					if(isModal){
						el = el.concat('<div class="control-group form-group "><label class="control-label word-break '+modal_label_style+'">'
								+field.field_label
								+'</label><div class="controls '+modal_control_style+'"><select class="'
								+field.field_type.toLowerCase()
								+' custom_field form-control '+field_style+'" id='
								+field.id
								+' name="'
								+field.field_label+'">'
								+list_options+'</select></div></div>');
					}else{
						el = el.concat('<div class="control-group form-group ">	<label class="control-label '+label_style+'">'
									+field.field_label
									+'</label><div class="controls col-sm-9 '+div_col9_style+'"><select class="'
									+field.field_type.toLowerCase()
									+' custom_field form-control '+field_style+'" id='
									+field.id
									+' name="'
									+field.field_label+'">'
									+list_options+'</select></div></div>');
					}
				}
				
			return;
		}
		else if(field.field_type.toLowerCase() == "checkbox")
			{
				field_type = "checkbox";
				
				if(field.scope=="DEAL"){
					if(field.is_required){
						if(isModal){
							el = el.concat('<div class="control-group form-group modal-cbx-m-t"><div class="checkbox '+modal_checkbox+' col-sm-6"><label class="i-checks i-checks-sm ">'
									+'<input type="'
									+field_type
									+'" class="'
									+field.field_type.toLowerCase()
									+'_input custom_field required" id='
									+field.id+' name="'
									+field.field_label
									+'"><i></i>'+field.field_label+'</label><div class="field_req inline-block">*</div><span for="'+field.field_label+'" generated="true" class="help-inline"></span></div></div>');

						}else{
							el = el.concat('<div class="control-group form-group ">	<label class="i-checks i-checks-sm '+label_style+'">'
									+'<span class="field_req">*</span><input type="'
									+field_type
									+'" class="'
									+field.field_type.toLowerCase()
									+'_input custom_field required" id='
									+field.id+' name="'
									+field.field_label
									+'"><i></i>'+field.field_label+'</label></div>');
						}
					}else{
						if(isModal){
							el = el.concat('<div class="control-group form-group modal-cbx-m-t"><div class="checkbox '+modal_checkbox+' col-sm-6"><label class="i-checks i-checks-sm">'

									+'<input type="'
									+field_type
									+'" class="'
									+field.field_type.toLowerCase()
									+'_input custom_field" id='
									+field.id+' name="'
									+field.field_label
									+'"><i></i>'+field.field_label+'</label></div></div>');
						}else{
							el = el.concat('<div class="control-group form-group "><label class="i-checks i-checks-sm '+label_style+'">'
									+'<input type="'
									+field_type
									+'" class="'
									+field.field_type.toLowerCase()
									+'_input custom_field" id='
									+field.id+' name="'
									+field.field_label
									+'"><i></i>'+field.field_label+'</label></div>');
						}
					}
					return;
				}
				
				if(field.is_required){
					if(isModal){
						el = el.concat('<div class="control-group form-group modal-cbx-m-t"><div class="checkbox '+modal_checkbox+' col-sm-6">'

								+'<label class="i-checks i-checks-sm"><input type="'
								+field_type
								+'" class="'
								+field.field_type.toLowerCase()
								+'_input custom_field required" id='
								+field.id+' name="'
								+field.field_label
								+'"><i></i>'+field.field_label+'</label><div class="field_req inline-block">*</div><span for="'+field.field_label+'" generated="true" class="help-inline"></span></div></div>');
					}else{
						el = el.concat('<div class="control-group form-group ">	<label class="control-label '+checkbox_style+" "+label_style+'">'
								+field.field_label
								+' <span class="field_req">*</span></label><div class="controls col-sm-9 '+div_col3_style+' m-t-xs"><label class="i-checks i-checks-sm"><input type="'
								+field_type
								+'" class="'
								+field.field_type.toLowerCase()
								+'_input custom_field required" id='
								+field.id+' name="'
								+field.field_label
								+'"><i></i></label></div></div>');
					}
				}
				else{
					if(isModal){
						el = el.concat('<div class="control-group form-group modal-cbx-m-t"><div class="checkbox '+modal_checkbox+' col-sm-6"><label class="i-checks i-checks-sm">'

								+'<input type="'
								+field_type
								+'" class="'
								+field.field_type.toLowerCase()
								+'_input custom_field" id='
								+field.id+' name="'
								+field.field_label
								+'"><i></i>'+field.field_label+'</label></label></div></div>');
					}else{
						el = el.concat('<div class="control-group form-group "><label class="control-label '+checkbox_style+" "+label_style+'">'
								+field.field_label
								+'</label><div class="controls col-sm-9 '+div_col3_style+' m-t-xs"><label class="i-checks i-checks-sm"><input type="'
								+field_type
								+'" class="'
								+field.field_type.toLowerCase()
								+'_input custom_field" id='
								+field.id+' name="'
								+field.field_label
								+'"><i></i></label></div></div>');
					}
				}
				return;
			}
		else if(field.field_type.toLowerCase() == "textarea")
		{
			field_type = "textarea";
			var rows = 3;
			
			if(field.field_data)
				rows = parseInt(field.field_data);
				
			if(field.is_required){
				if(isModal){
					el = el.concat('<div class="control-group form-group "><label class="control-label word-break '+modal_label_style+'">'
							+field.field_label
							+'<span class="field_req">*</span></label><div class="controls agiletxexpander '+modal_control_style+'"><textarea rows="'
							+rows+'" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field required form-control textarea resize-vertical field_length" data-agileexpand="true" id='
							+field.id+' name="'
							+field.field_label
							+'" max_len="'+max_len+'"></textarea></div></div>');
				}else{
					el = el.concat('<div class="control-group form-group  "><label class="control-label '+label_style+'">'
							+field.field_label
							+'<span class="field_req">*</span></label><div class="controls col-sm-9 agiletxexpander '+div_col9_style+'"><textarea rows="'
							+rows+'" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field required form-control textarea resize-vertical field_length"  data-agileexpand="true" id='
							+field.id+' name="'
							+field.field_label
							+'"  max_len="'+max_len+'"></textarea></div></div>');
				}
			}else{
				if(isModal){
					el = el.concat('<div class="control-group form-group  "><label class="control-label word-break '+modal_label_style+'">'
							+field.field_label
							+'</label><div class="controls agiletxexpander '+modal_control_style+'"><textarea rows="'
							+rows+'" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field form-control textarea resize-vertical field_length" data-agileexpand="true" id='
							+field.id+' name="'
							+field.field_label
							+'"  max_len="'+max_len+'"></textarea></div></div>');
				}else{
					el = el.concat('<div class="control-group form-group "><label class="control-label '+label_style+'">'
							+field.field_label
							+'</label><div class="controls agiletxexpander col-sm-9 '+div_col9_style+'"><textarea rows="'
							+rows+'" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field form-control textarea resize-vertical field_length" data-agileexpand="true" id='
							+field.id+' name="'
							+field.field_label
							+'"  max_len="'+max_len+'"></textarea></div></div>');
				}
			}
			return;
		}
		else if(field.field_type.toLowerCase() == "number")
		{
			field_type = "number";
			if(field.is_required){
				if(isModal){
					el = el.concat('<div class="control-group form-group "><label class="control-label word-break '+modal_label_style+'">'
						+field.field_label
						+'<span class="field_req">*</span></label><div class="controls custom-number-controls '+modal_control_style+'"><input type="number" class="'
						
						+'custom_field required form-control field_length" id="'
						+field.id+'" name="'
						+field.field_label
						+'" max_len="'+max_len+'" placeholder="{{agile_lng_translate "contacts" "enter-number"}}"></input>'
						+'</div></div>');
				}else{
					el = el.concat('<div class="control-group form-group ">	<label class="control-label '+label_style+'">'
							+field.field_label
							+' <span class="field_req">*</span></label><div class="controls col-sm-9 '+div_col9_style+' custom-number-controls"><input type="number" class="'
							
							+' custom_field required form-control field_length" id="'
							+field.id+'" name="'
							+field.field_label
							+'" max_len="'+max_len+'" placeholder="{{agile_lng_translate "contacts" "enter-number"}}"></input>'
							+'</div></div>');
				}
			}else{
				if(isModal){
					el = el.concat('<div class="control-group form-group "><label class="control-label word-break '+modal_label_style+'">'
						+field.field_label
						+'</label><div class="controls custom-number-controls '+modal_control_style+'"><input type="number" class="'
						
						+'  custom_field form-control field_length" id="'
						+field.id+'" name="'
						+field.field_label
						+'"max_len="'+max_len+'" placeholder="{{agile_lng_translate "contacts" "enter-number"}}"></input>'
						+'</div></div>');
				}else{
					el = el.concat('<div class="control-group form-group ">	<label class="control-label '+label_style+'">'
							+field.field_label
							+'</label><div class="controls col-sm-9 '+div_col9_style+' custom-number-controls"><input type="number" class="'
							
							+' custom_field form-control field_length" id="'
							+field.id+'" name="'
							+field.field_label
							+'" max_len="'+max_len+'" placeholder="{{agile_lng_translate "contacts" "enter-number"}}"></input>'
							+'</div></div>');
				}
			}
				
			return;
		}
		else if(field.field_type.toLowerCase() == "formula")
		{
			//If custom field is formula we return without appending anything	
			return;
		}
		else if(field.field_type.toLowerCase() == "contact")
		{
			field_type = "contact";
			if(field.is_required){
				if(isModal){
					el = el.concat('<div class="control-group form-group " id="custom_contact_'+field.id+'"><label class="control-label word-break col-sm-3">'
								+field.field_label
								+'<span class="field_req">*</span></label><div class="controls col-sm-7">'
								+'<ul name="'+field.field_label+'" class="contacts tagsinput tags p-n m-n custom_contact"></ul>'
								+'<input type="text" class="'
								+field.field_type.toLowerCase()
								+'_input custom_field required_field form-control field_length typeahead typeahead_contacts" id='
								+field.id+' name="'+field.field_label
								+'" max_len="'+max_len+'" placeholder="{{agile_lng_translate "cases" "contact-name"}}"></div></div>');
				}else{
					el = el.concat('<div class="control-group form-group " id="custom_contact_'+field.id+'"><label class="control-label '+label_style+'">'
							+field.field_label
							+' <span class="field_req">*</span></label><div class="controls col-sm-9 '+div_col9_style+'">'
							+'<ul name="'+field.field_label+'" class="contacts tagsinput tags p-n m-n custom_contact"></ul>'
							+'<input type="text" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field required_field form-control field_length typeahead typeahead_contacts" id='
							+field.id+' name="'+field.field_label
							+'" max_len="'+max_len+'" placeholder="{{agile_lng_translate "cases" "contact-name"}}"></div></div>');
				}
			}else{
				if(isModal){
					el = el.concat('<div class="control-group form-group " id="custom_contact_'+field.id+'"><label class="control-label word-break col-sm-3">'
								+field.field_label
								+'</label><div class="controls col-sm-7">'
								+'<ul name="'+field.field_label+'" class="contacts tagsinput tags p-n m-n custom_contact"></ul>'
								+'<input type="text" class="'
								+field.field_type.toLowerCase()
								+'_input custom_field form-control field_length typeahead typeahead_contacts" id='
								+field.id+' name="'
								+field.field_label
								+'" max_len="'+max_len+'" placeholder="{{agile_lng_translate "cases" "contact-name"}}"></div></div>');
				}else{
					el = el.concat('<div class="control-group form-group " id="custom_contact_'+field.id+'"><label class="control-label '+label_style+'">'
							+field.field_label
							+'</label><div class="controls col-sm-9 '+div_col9_style+'">'
							+'<ul name="'+field.field_label+'" class="contacts tagsinput tags p-n m-n custom_contact"></ul>'
							+'<input type="text" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field form-control field_length typeahead typeahead_contacts" id='
							+field.id+' name="'
							+field.field_label
							+'" max_len="'+max_len+'" placeholder="{{agile_lng_translate "cases" "contact-name"}}"></div></div>');
				}
			}
				
			return;
		}
		else if(field.field_type.toLowerCase() == "company")
		{
			field_type = "company";
			if(field.is_required){
				if(isModal){
					el = el.concat('<div class="control-group form-group " id="custom_company_'+field.id+'"><label class="control-label word-break col-sm-3">'
								+field.field_label
								+'<span class="field_req">*</span></label><div class="controls col-sm-7">'
								+'<ul name="'+field.field_label+'" class="contacts tagsinput tags p-n m-n custom_company"></ul>'
								+'<input type="text" class="'
								+field.field_type.toLowerCase()
								+'_input custom_field required_field form-control field_length typeahead typeahead_contacts" id='
								+field.id+' name="'+field.field_label
								+'" max_len="'+max_len+'" placeholder="{{agile_lng_translate "contact-edit" "company-name"}}"></div></div>');
				}else{
					el = el.concat('<div class="control-group form-group " id="custom_company_'+field.id+'">	<label class="control-label '+label_style+'">'
							+field.field_label
							+' <span class="field_req">*</span></label><div class="controls col-sm-9 '+div_col9_style+'">'
							+'<ul name="'+field.field_label+'" class="contacts tagsinput tags p-n m-n custom_company"></ul>'
							+'<input type="text" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field required_field form-control field_length typeahead typeahead_contacts" id='
							+field.id+' name="'+field.field_label
							+'" max_len="'+max_len+'" placeholder="{{agile_lng_translate "contact-edit" "company-name"}}"></div></div>');
				}
			}else{
				if(isModal){
					el = el.concat('<div class="control-group form-group " id="custom_company_'+field.id+'"><label class="control-label word-break col-sm-3">'
								+field.field_label
								+'</label><div class="controls col-sm-7">'
								+'<ul name="'+field.field_label+'" class="contacts tagsinput tags p-n m-n custom_company"></ul>'
								+'<input type="text" class="'
								+field.field_type.toLowerCase()
								+'_input custom_field form-control field_length typeahead typeahead_contacts" id='
								+field.id+' name="'
								+field.field_label
								+'" max_len="'+max_len+'" placeholder="{{agile_lng_translate "contact-edit" "company-name"}}"></div></div>');
				}else{
					el = el.concat('<div class="control-group form-group " id="custom_company_'+field.id+'"><label class="control-label '+label_style+'">'
							+field.field_label
							+'</label><div class="controls col-sm-9 '+div_col9_style+'">'
							+'<ul name="'+field.field_label+'" class="contacts tagsinput tags p-n m-n custom_company"></ul>'
							+'<input type="text" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field form-control field_length typeahead typeahead_contacts" id='
							+field.id+' name="'
							+field.field_label
							+'" max_len="'+max_len+'" placeholder="{{agile_lng_translate "contact-edit" "company-name"}}"></div></div>');
				}
			}
				
			return;
		}

		// If the field is not of type list or checkbox, create text field (plain text field or date field)
		if(field.is_required){
			if(isModal){
				el = el.concat('<div class="control-group form-group "><label class="control-label word-break '+modal_label_style+'">'
							+field.field_label
							+'<span class="field_req">*</span></label><div class="controls '+modal_control_style+'"><input type="text" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field required form-control field_length" id='
							+field.id+' name="'+field.field_label
							+'" max_len="'+max_len+'"></div></div>');
			}else{
				el = el.concat('<div class="control-group form-group ">	<label class="control-label '+label_style+'">'
						+field.field_label
						+' <span class="field_req">*</span></label><div class="controls col-sm-9 '+div_col9_style+'"><input type="text" class="'
						+field.field_type.toLowerCase()
						+'_input custom_field required form-control field_length" id='
						+field.id+' name="'+field.field_label
						+'" max_len="'+max_len+'"></div></div>');
			}
		}else{
			if(isModal){
				el = el.concat('<div class="control-group form-group "><label class="control-label word-break '+modal_label_style+'">'
							+field.field_label
							+'</label><div class="controls '+modal_control_style+'"><input type="text" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field form-control field_length" id='
							+field.id+' name="'
							+field.field_label
							+'" max_len="'+max_len+'"></div></div>');
			}else{
				el = el.concat('<div class="control-group form-group "><label class="control-label '+label_style+'">'
						+field.field_label
						+'</label><div class="controls col-sm-9 '+div_col9_style+'"><input type="text" class="'
						+field.field_type.toLowerCase()
						+'_input custom_field form-control field_length" id='
						+field.id+' name="'
						+field.field_label
						+'" max_len="'+max_len+'"></div></div>');
			}
		}
	});

	return el;
}

/**
 * It builds UI for showing custom fields in the contacts-merge feature
 */
function show_custom_fields_helper_for_merge(custom_fields, contacts) {
	var el = "";
	$.each(custom_fields,function(index, field) {
		var elements = [];
		for (var i = 0; i < contacts.length; i++) {
			if(i===0){
				var checked = false;
				elements.push('<tr><td style="background-color:#f3f3f3">'
						+ field.field_label + '</td>');
			}
			var contact_field = contacts[i];
			for (var j = 0; j < contact_field.properties.length; j++) {
				var property = contact_field.properties[j];
				if (property.type == "CUSTOM"
					&& property.name == field.field_label) {
					var value = property.value;
					if (value) {
						checked = true;
						if (field.field_type.toLowerCase() == "date") {
							try {
								value = new Date(
										property.value * 1000)
								.format('mm/dd/yyyy');

							} catch (err) {
							}
						}
						if (i === 0) {
							var ele = '<td>'
								+ '<input type="radio" name="'
								+ field.field_label
								+ '" class="'
								+ field.field_type
								.toLowerCase()
								+ '" checked="checked" fieldtype="custom" oid="'
								+ contact_field.id
								+ '" id="'
								+ field.id
								+ '" field="'
								+ field.field_label
								+ '" data="'
								+ value + '">'
								+ value + '</td>';
							elements.push(ele);
							break;
						} else {
							var ele = '<td>'
								+ '<input type="radio" name="'
								+ field.field_label
								+ '" class="'
								+ field.field_type
								.toLowerCase()
								+ '" fieldtype="custom" oid="'
								+ contact_field.id
								+ '" id="'
								+ field.id
								+ '" field="'
								+ field.field_label
								+ '" data="'
								+ value + '">'
								+ value + '</td>';
							elements.push(ele);
							break;
						}
					}// end of if loop checking value is null or not
				}
				else if (j === contact_field.properties.length - 1) {
					var ele = '<td></td>';
					elements.push(ele);
				}
			} // end of contact properties for loop
			if(i===contacts.length-1){
				if(checked){
					for(var i=0;i<elements.length;i++){
						el = el.concat(elements[i]);
					}
					el = el.concat('</tr>');
				}
				elements.length = 0;
			}
		}// end of contacts for loop
	});
	return el;
}

/**
 * De-serializes custom fields (fills the matched custom field values of the entity 
 * (for list and check-box fields) to the generated html string above) and return 
 * string to handlebars register helper to return as handlebars safestring.
 * 
 * @method fill_custom_field_values
 * @param {String} form 
 * 				html string of custom field values
 * @param {Object} content json object including custom fields
 * @returns {String} prefilled html string with matched custom field values
 */
function fill_custom_field_values(form, content)
{
	console.log(content);
	$.each(content, function(index , property){
		if(property.type == "CUSTOM")
			{
				fill_custom_data(property, form);
			}
			
	});
	return $('<div>').append(form).html();
}

function fill_custom_fields_values_generic(form, content)
{
	$.each(content, function(index , property){
		fill_custom_data(property, form);
	});
	
	return $('<div>').append(form).html();
}

function fill_custom_data(property, form)
{
	if(!property.value)
		return;
	var element = $(form).find('*[name="' + property.name + '"]');
	console.log(element);
	// If custom field is deleted or not found with property name return
	if(!element[0])
		{
			return;
		}
	console.log($(element[0]).hasClass("date_input"))
		var tagName = element[0].tagName.toLowerCase();
		var type = element.attr("type");
		 console.log(property.value)
		 console.log($(element[0]));
	if(tagName == "input")
		{
			if(type == "checkbox" && property.value == "on")
				{
					element.attr("checked", "checked"); 
					return;
				}
			else if($(element[0]).hasClass("date_input"))
				{
				try {
					var dateString = new Date(property.value);
					if(dateString == "Invalid Date")
						element.attr("value", getDateInFormatFromEpoc(property.value));
					else
						element.attr("value", getDateInFormat(dateString));
					return;
				} catch (err) {

				}
				}
			
			element.attr("value", property.value);
			console.log(element.val());
		}
	if(tagName == "textarea")
		{
			element.html(property.value);							
		}
	if(tagName == "select")
		{
			if(property.value)
			element.find('option[value="'+property.value.trim()+'"]').attr("selected", "selected");
		}	
}

function serialize_custom_fields(form)
{
	var custom_field_elements =  $("#" + form).find('.custom_field');
	
	console.log(custom_field_elements.length);
   var arr = [];
    $.each(custom_field_elements, function(index, element){
    	name = $(element).attr('name');
    	
    	var json = {};
    	json.name = name;
    	var elem_type = $(element).attr('type')
    	json.value =  $(element).val();
    	
    	if(elem_type=='checkbox')json.value = $(element).is(':checked')?'on':'off';
    	if($(element).hasClass("date_input") && ($(element).val() !=undefined && $(element).val().trim() !=""))
    		if(CURRENT_USER_PREFS.dateFormat.indexOf("dd/mm/yy") != -1 || CURRENT_USER_PREFS.dateFormat.indexOf("dd.mm.yy") != -1)
    			json.value = en.dateFormatter({raw: "MM/dd/yyyy"})(new Date(convertDateFromUKtoUS(this.value)));
    		else
    			json.value = en.dateFormatter({raw: "MM/dd/yyyy"})(new Date(this.value));
    	
    	if(($(element).hasClass("contact_input") || $(element).hasClass("company_input")) && isValidContactCustomField($(element).attr('id')))
    	{
    		var contact_values = [];
			$('ul[name="'+name+'"]', $('#'+form)).find('li').each(function(index){
				contact_values.push($(this).attr("data"));
			});
			json.value = JSON.stringify(contact_values);
    	}

    	
    	if(!json.value)
    		return;
        arr.push(json);
    });
   return arr;
}
function groupingCustomFields(base_model){
	var templateKey = "admin-settings-customfields-"+base_model.get("scope").toLowerCase();
	if(base_model.get("scope")=="CONTACT"){
		App_Admin_Settings.contactCustomFieldsListView = new Base_Collection_View({ url : '/core/api/custom-fields/scope/position?scope='+base_model.get("scope"), sortKey : "position", restKey : "customFieldDefs",
			templateKey : templateKey, individual_tag_name : 'tr',
			postRenderCallback : function(custom_el){
				enableCustomFieldsSorting(custom_el,'custom-fields-'+base_model.get("scope").toLowerCase()+'-tbody','admin-settings-customfields-'+base_model.get("scope").toLowerCase()+'-model-list');
				bindModelSearchable(App_Admin_Settings.contactCustomFieldsListView.collection)
			}});
		function bindModelSearchable(collection)
		{
			$.each(collection, function (i, m){
				
			})
		}
		function appendItem(base_model)
		{
			addCustomFieldToSearch(base_model,  base_model.get("scope"));
		};

		function removeItem(base_model)
		{
			removeCustomFieldFromSortOptions(base_model, base_model.get("scope"));
		};

		function updateItem(base_model){
				updateCustomFieldToSearch(base_model, base_model.get("scope"));
		};
		App_Admin_Settings.contactCustomFieldsListView.collection.bind('add', appendItem);
		App_Admin_Settings.contactCustomFieldsListView.collection.bind('remove', removeItem);
		App_Admin_Settings.contactCustomFieldsListView.collection.bind('change', updateItem);
		App_Admin_Settings.contactCustomFieldsListView.collection.fetch();
		$('#customfields-contacts-accordion', this.el).append($(App_Admin_Settings.contactCustomFieldsListView.render().el));
	}else if(base_model.get("scope")=="COMPANY"){
		App_Admin_Settings.companyCustomFieldsListView = new Base_Collection_View({ url : '/core/api/custom-fields/scope/position?scope='+base_model.get("scope"), sortKey : "position", restKey : "customFieldDefs",
			templateKey : templateKey, individual_tag_name : 'tr',
			postRenderCallback : function(custom_el){
				enableCustomFieldsSorting(custom_el,'custom-fields-'+base_model.get("scope").toLowerCase()+'-tbody','admin-settings-customfields-'+base_model.get("scope").toLowerCase()+'-model-list');
			}});
		App_Admin_Settings.companyCustomFieldsListView.collection.fetch();
		$('#customfields-companies-accordion', this.el).append($(App_Admin_Settings.companyCustomFieldsListView.render().el));
	}else if(base_model.get("scope")=="DEAL"){
		App_Admin_Settings.dealCustomFieldsListView = new Base_Collection_View({ url : '/core/api/custom-fields/scope/position?scope='+base_model.get("scope"), sortKey : "position", restKey : "customFieldDefs",
			templateKey : templateKey, individual_tag_name : 'tr',
			postRenderCallback : function(custom_el){
				enableCustomFieldsSorting(custom_el,'custom-fields-'+base_model.get("scope").toLowerCase()+'-tbody','admin-settings-customfields-'+base_model.get("scope").toLowerCase()+'-model-list');
			}});
		App_Admin_Settings.dealCustomFieldsListView.collection.fetch();
		$('#customfields-deals-accordion', this.el).append($(App_Admin_Settings.dealCustomFieldsListView.render().el));
	}else if(base_model.get("scope")=="CASE"){
		App_Admin_Settings.caseCustomFieldsListView = new Base_Collection_View({ url : '/core/api/custom-fields/scope/position?scope='+base_model.get("scope"), sortKey : "position", restKey : "customFieldDefs",
			templateKey : templateKey, individual_tag_name : 'tr',
			postRenderCallback : function(custom_el){
		
				enableCustomFieldsSorting(custom_el,'custom-fields-'+base_model.get("scope").toLowerCase()+'-tbody','admin-settings-customfields-'+base_model.get("scope").toLowerCase()+'-model-list');
			}});
		App_Admin_Settings.caseCustomFieldsListView.collection.fetch();
		$('#customfields-cases-accordion', this.el).append($(App_Admin_Settings.caseCustomFieldsListView.render().el));
	}else if(base_model.get("scope")=="LEAD"){
		App_Admin_Settings.leadCustomFieldsListView = new Base_Collection_View({ url : '/core/api/custom-fields/scope/position?scope='+base_model.get("scope"), sortKey : "position", restKey : "customFieldDefs",
			templateKey : templateKey, individual_tag_name : 'tr',
			postRenderCallback : function(custom_el){
				enableCustomFieldsSorting(custom_el,'custom-fields-'+base_model.get("scope").toLowerCase()+'-tbody','admin-settings-customfields-'+base_model.get("scope").toLowerCase()+'-model-list');
			}});
		App_Admin_Settings.leadCustomFieldsListView.collection.fetch();
		$('#customfields-leads-accordion', this.el).append($(App_Admin_Settings.leadCustomFieldsListView.render().el));
	}
}
function enableCustomFieldsSorting(el,connClass,connId){
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function(){
		$('.'+connClass).sortable({
			axis: "y" ,
			containment: '.'+connClass,
			scroll: false,
			items:'tr',
			helper: function(e, tr){
			    var $originals = tr.children();
			    var $helper = tr.clone();
			    $helper.children().each(function(index)
			    {
			      // Set helper cell sizes to match the original sizes
			      $(this).width($originals.eq(index).width()+50);
			      $(this).css("background","#f5f5f5");
			      $(this).css("border-bottom","1px solid #ddd");
			      $(this).css("max-width",($originals.eq(index).width()+50)+"px");
			    });
			    return $helper;
			},
			/*start: function(event, ui){
				//alert(ui.width());
				$.each(ui.item.children(),function(index,ele){
					ui.helper.children().eq(index).width(ui.helper.children().eq(index).width()-$(this).width());
				});
				ui.helper.width(ui.helper.width());
			},*/
			sort: function(event, ui){
				ui.helper.css("top",(ui.helper.offset().top+ui.item.offset().top)+"px");
			},
			forceHelperSize:true,
			placeholder:'<tr><td></td></tr>',
			forcePlaceholderSize:true,
			handle: ".icon-move",
			cursor: "move",
			tolerance: "intersect"
		});
		
		/*
		 * This event is called after sorting stops to save new positions of
		 * custom fields
		 */
		$('.'+connClass,el).on("sortstop",function(event, ui){
			var models=[];
			$('#'+connId+' > tr').each(function(column){
				var model_id = $(this).data().id;
				
				models.push({ id : model_id, position : column+1 });
			});
			// Saves new positions in server
			$.ajax({ type : 'POST', url : '/core/api/custom-fields/positions', data : JSON.stringify(models),
				contentType : "application/json; charset=utf-8", dataType : 'json' });
		});
	});
}
/*$('#formulaData').live("change",function(e){
	var source = $(this).val();
	var tpl;
	var compiled=true;
	try{
		tpl = Handlebars.precompile(source);
	}catch(err){
		err.message;
		compiled=false;
		return false;
	}
});*/