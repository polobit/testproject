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
		if(confirm("Are you sure you want to delete?")){
			e.preventDefault();
			var custom_field = $(this).closest('tr').data();
			console.log(custom_field);
			var currentElement=$(this);
			$.ajax({ type : 'DELETE', url : '/core/api/custom-fields/' + custom_field.id, contentType : "application/json; charset=utf-8",
				success : function(data){
					if(custom_field.get("scope")=="CONTACT")
						App_Admin_Settings.contactCustomFieldsListView.collection.remove(custom_field.id);
					else if(custom_field.get("scope")=="COMPANY")
						App_Admin_Settings.companyCustomFieldsListView.collection.remove(custom_field.id);
					else if(custom_field.get("scope")=="DEAL")
						App_Admin_Settings.dealCustomFieldsListView.collection.remove(custom_field.id);
					else if(custom_field.get("scope")=="CASE")
						App_Admin_Settings.caseCustomFieldsListView.collection.remove(custom_field.id);
					currentElement.closest('tr').remove();
				}, dataType : 'json' });
		}
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
		postRenderCallback : function(el) {
			console.log($("#custom-field-add-modal", el));
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
		saveCallback : function(model)
		{
			console.log(model);
			//var custom_field_model_json = App_Admin_Settings.customFieldsListView.collection.get(model.id);
			var custom_field_model_json;
			if(model.scope=="CONTACT")
				custom_field_model_json = App_Admin_Settings.contactCustomFieldsListView.collection.get(model.id);
			else if(model.scope=="COMPANY")
				custom_field_model_json = App_Admin_Settings.companyCustomFieldsListView.collection.get(model.id);
			else if(model.scope=="DEAL")
				custom_field_model_json = App_Admin_Settings.dealCustomFieldsListView.collection.get(model.id);
			else if(model.scope=="CASE")
				custom_field_model_json = App_Admin_Settings.caseCustomFieldsListView.collection.get(model.id);
			
			
			if(custom_field_model_json)
			{
				//App_Admin_Settings.customFieldsListView.collection.remove(custom_field_model_json);
				custom_field_model_json.set(new BaseModel(model),{silent:true});
				if(model.scope=="CONTACT")
					App_Admin_Settings.contactCustomFieldsListView.render(true);
				else if(model.scope=="COMPANY")
					App_Admin_Settings.companyCustomFieldsListView.render(true);
				else if(model.scope=="DEAL")
					App_Admin_Settings.dealCustomFieldsListView.render(true);
				else if(model.scope=="CASE")
					App_Admin_Settings.caseCustomFieldsListView.render(true);
			}
			
			else
			{
				if(model.scope=="CONTACT"){
					App_Admin_Settings.contactCustomFieldsListView.collection.add(model);
					App_Admin_Settings.contactCustomFieldsListView.render(true);
				}else if(model.scope=="COMPANY"){
					App_Admin_Settings.companyCustomFieldsListView.collection.add(model);
					App_Admin_Settings.companyCustomFieldsListView.render(true);
				}else if(model.scope=="DEAL"){
					App_Admin_Settings.dealCustomFieldsListView.collection.add(model);
					App_Admin_Settings.dealCustomFieldsListView.render(true);
				}else if(model.scope=="CASE"){
					App_Admin_Settings.caseCustomFieldsListView.collection.add(model);
					App_Admin_Settings.caseCustomFieldsListView.render(true);
				}
				/*App_Admin_Settings.customFieldsListView.collection.add(model);
				if(App_Admin_Settings.customFieldsListView.collection.length == 1)
					App_Admin_Settings.customFieldsListView.render(true);*/
			}

			$("#custom-field-add-modal").modal('hide');
		}
	});

	$('#custom-field-modal').html(modelView.render(true).el);
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
		}
		else
		{
			$("#custom-field-data").hide();
			$("#custom-field-list-values").hide();
			$("#custom-field-formula-data").hide();
			$('.required-and-searchable').show();
		}
		
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
		var field_style = "";
		var div_col9_style = "";
		var div_col3_style = "";
		var checkbox_style ="";
		var max_len = 500;
		if(field.scope == "CONTACT"){
			label_style = "col-sm-3 word-break-all";
			field_style = "col-sm-10";
			div_col9_style = "col-sm-9";
			div_col3_style = "col-sm-3";
		}else if(field.scope == "COMPANY" || field.scope == "DEAL" || field.scope == "CASE"){
			label_style = "control-label col-sm-3 word-break-all";
			checkbox_style = "col-sm-3";
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
						el = el.concat('<div class="control-group form-group "><label class="control-label word-break-all"><b>'
								+field.field_label
								+'</b><span class="field_req">*</span></label><div class="controls"><span><select class="'
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
						el = el.concat('<div class="control-group form-group "><label class="control-label word-break-all"><b>'
								+field.field_label
								+'</b></label><div class="controls"><select class="'
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
							el = el.concat('<div class="control-group form-group "><label class="i-checks i-checks-sm">'
									+'<input type="'
									+field_type
									+'" class="'
									+field.field_type.toLowerCase()
									+'_input custom_field required" id='
									+field.id+' name="'
									+field.field_label
									+'" style="margin: 0px 5px;"><i></i><div class="field_req inline-block">*</div><b>'+field.field_label+'</b></label></div>');
						}else{
							el = el.concat('<div class="control-group form-group ">	<label class="i-checks i-checks-sm '+label_style+'">'
									+'<span class="field_req">*</span><input type="'
									+field_type
									+'" class="'
									+field.field_type.toLowerCase()
									+'_input custom_field required" id='
									+field.id+' name="'
									+field.field_label
									+'" style="margin: 0px 5px;"><i></i>'+field.field_label+'</label></div>');
						}
					}else{
						if(isModal){
							el = el.concat('<div class="control-group form-group "><label class="i-checks i-checks-sm">'
									+'<input type="'
									+field_type
									+'" class="'
									+field.field_type.toLowerCase()
									+'_input custom_field" id='
									+field.id+' name="'
									+field.field_label
									+'" style="margin: 0px 5px;"><i></i><b>'+field.field_label+'</b></label></div>');
						}else{
							el = el.concat('<div class="control-group form-group "><label class="i-checks i-checks-sm '+label_style+'">'
									+'<input type="'
									+field_type
									+'" class="'
									+field.field_type.toLowerCase()
									+'_input custom_field" id='
									+field.id+' name="'
									+field.field_label
									+'" style="margin: 0px 5px;"><i></i>'+field.field_label+'</label></div>');
						}
					}
					return;
				}
				
				if(field.is_required){
					if(isModal){
						el = el.concat('<div class="control-group form-group ">'
								+'<label class="i-checks i-checks-sm"><input type="'
								+field_type
								+'" class="'
								+field.field_type.toLowerCase()
								+'_input custom_field required" id='
								+field.id+' name="'
								+field.field_label
								+'"><i></i><div class="field_req inline-block">*</div><b>'+field.field_label+'</b></label></div>');
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
						el = el.concat('<div class="control-group form-group "><label class="i-checks i-checks-sm">'
								+'<input type="'
								+field_type
								+'" class="'
								+field.field_type.toLowerCase()
								+'_input custom_field" id='
								+field.id+' name="'
								+field.field_label
								+'"><i></i><b>'+field.field_label+'</b></label></label></div>');
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
					el = el.concat('<div class="control-group form-group "><label class="control-label word-break-all"><b>'
							+field.field_label
							+'</b><span class="field_req">*</span></label><div class="controls"><textarea rows="'
							+rows+'" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field required form-control resize-vertical field_length" id='
							+field.id+' name="'
							+field.field_label
							+'" max_len="'+max_len+'"></textarea></div></div>');
				}else{
					el = el.concat('<div class="control-group form-group "><label class="control-label '+label_style+'">'
							+field.field_label
							+'<span class="field_req">*</span></label><div class="controls col-sm-9 '+div_col9_style+'"><textarea rows="'
							+rows+'" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field required form-control resize-vertical field_length" id='
							+field.id+' name="'
							+field.field_label
							+'"  max_len="'+max_len+'"></textarea></div></div>');
				}
			}else{
				if(isModal){
					el = el.concat('<div class="control-group form-group "><label class="control-label word-break-all"><b>'
							+field.field_label
							+'</b></label><div class="controls"><textarea rows="'
							+rows+'" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field form-control resize-vertical field_length" id='
							+field.id+' name="'
							+field.field_label
							+'"  max_len="'+max_len+'"></textarea></div></div>');
				}else{
					el = el.concat('<div class="control-group form-group "><label class="control-label '+label_style+'">'
							+field.field_label
							+'</label><div class="controls col-sm-9 '+div_col9_style+'"><textarea rows="'
							+rows+'" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field form-control resize-vertical field_length" id='
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
					el = el.concat('<div class="control-group form-group "><label class="control-label word-break-all"><b>'
						+field.field_label
						+'</b><span class="field_req">*</span></label><div class="controls custom-number-controls"><input type="number" class="'
						+field.field_type.toLowerCase()
						+'_input custom_field required form-control field_length" id="'
						+field.id+'" name="'
						+field.field_label
						+'" value="0" max_len="'+max_len+'"></input>'
						+'</div></div>');
				}else{
					el = el.concat('<div class="control-group form-group ">	<label class="control-label '+label_style+'">'
							+field.field_label
							+' <span class="field_req">*</span></label><div class="controls col-sm-9 '+div_col3_style+' custom-number-controls"><input type="number" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field required form-control field_length" id="'
							+field.id+'" name="'
							+field.field_label
							+'" value="0" max_len="'+max_len+'"></input>'
							+'</div></div>');
				}
			}else{
				if(isModal){
					el = el.concat('<div class="control-group form-group "><label class="control-label word-break-all"><b>'
						+field.field_label
						+'</label><div class="controls custom-number-controls"><input type="number" class="'
						+field.field_type.toLowerCase()
						+'_input custom_field form-control field_length" id="'
						+field.id+'" name="'
						+field.field_label
						+'" value="0" max_len="'+max_len+'"></input>'
						+'</div></div>');
				}else{
					el = el.concat('<div class="control-group form-group ">	<label class="control-label '+label_style+'">'
							+field.field_label
							+'</label><div class="controls col-sm-9 '+div_col3_style+' custom-number-controls"><input type="number" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field form-control field_length" id="'
							+field.id+'" name="'
							+field.field_label
							+'" value="0" max_len="'+max_len+'"></input>'
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
		
		// If the field is not of type list or checkbox, create text field (plain text field or date field)
		if(field.is_required){
			if(isModal){
				el = el.concat('<div class="control-group form-group "><label class="control-label word-break-all"><b>'
							+field.field_label
							+'</b><span class="field_req">*</span></label><div class="controls"><input type="text" class="'
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
				el = el.concat('<div class="control-group form-group "><label class="control-label word-break-all"><b>'
							+field.field_label
							+'</b></label><div class="controls"><input type="text" class="'
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
			}});
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