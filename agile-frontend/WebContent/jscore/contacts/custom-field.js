/**
 * custom-field.js is a script file to deal with the UI of the custom fields,
 * and also contains a function which adds custom_fields attribute to the
 * desired entity with all the custom fields as values.
 * 
 * @module Custom fields
 * 
 * author: Yaswanth
 */
$(function() {
	/**
	 * Loads the respective modal (Text or Date or List or Check-box modal) based
	 * on the id attribute of the clicked link to save the custom fields.
	 */
	$(".fieldmodal").die().live('click', function(event) {
		event.preventDefault();
		var type = $(this).attr("type");
		
		showCustomFieldModel({"scope" : type, "position" : $(this).parent().parent().find('table > tbody > tr').length+1});
		
	});
	
	$("#custom-field-type").die().live("change", function(e){
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
		}
		else if(value == "TEXTAREA")
		{
			$("#custom-field-data").show();
			$("input",  $("#custom-field-data")).attr("name", "field_data");
			$("#custom-field-list-values").hide();
			$("input",  $("#custom-field-list-values")).removeAttr("name");
			$("#custom-field-formula-data").hide();
			$("textarea",  $("#custom-field-formula-data")).removeAttr("name");
		}
		else if(value == "FORMULA")
		{
			$("#custom-field-data").hide();
			$("input",  $("#custom-field-data")).removeAttr("name");
			$("#custom-field-list-values").hide();
			$("input",  $("#custom-field-list-values")).removeAttr("name");
			$("#custom-field-formula-data").show();
			$("textarea",  $("#custom-field-formula-data")).attr("name", "field_data");
		}
		else
		{
			$("#custom-field-data").hide();
			$("#custom-field-list-values").hide();
			$("#custom-field-formula-data").hide();
		}
		
	})
	
	$('#admin-settings-customfields-model-list > tr > td:not(":first-child")').live('click', function(e) {
		e.preventDefault();
		var custom_field = $(this).closest('tr').data();
		console.log(custom_field);
		showCustomFieldModel(custom_field.toJSON());
	});
	$('#edit-custom-field').live('click', function(e) {
		e.preventDefault();
		var custom_field = $(this).closest('tr').data();
		console.log(custom_field);
		showCustomFieldModel(custom_field.toJSON());
	});
	$('#delete-custom-field').live('click', function(e) {
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
});

function showCustomFieldModel(data)
{
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
			$('.modal-backdrop').remove();	
			console.log($("#custom-field-add-modal", el));
			
			$("#custom-field-add-modal", el).modal('show');
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
			$('.modal-backdrop').remove();	
			$("#custom-field-add-modal").modal('hide');
			$("#custom-field-add-modal").modal('hide');
		}
	});

	$('#custom-field-modal').html(modelView.render(true).el);
	$("#custom-field-type").trigger("change");
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
	
	// Text as default
	var field_type = "text"
		
	// Create Field for each custom field  to insert into the desired form 
	$.each(custom_fields, function(index, field)
	{
		if(!field.field_type)
			return;
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
				if(field.is_required)
					el = el.concat('<div class="control-group">	<label class="control-label">'
									+field.field_label
									+' <span class="field_req">*</span></label><div class="controls"><select class="'
									+field.field_type.toLowerCase()
									+' custom_field required" id='
									+field.id
									+' name="'
									+field.field_label
									+'">'
									+list_options
									+'</select></div></div>');
				else
					el = el.concat('<div class="control-group">	<label class="control-label">'
									+field.field_label
									+'</label><div class="controls"><select class="'
									+field.field_type.toLowerCase()
									+' custom_field" id='
									+field.id
									+' name="'
									+field.field_label+'">'
									+list_options+'</select></div></div>');
				
			return;
		}
		else if(field.field_type.toLowerCase() == "checkbox")
			{
				field_type = "checkbox";
				
				if(field.scope=="DEAL"){
					if(field.is_required)
						el = el.concat('<div class="control-group">	<label class="control-label">'
									+'<span class="field_req">*</span><input type="'
									+field_type
									+'" class="'
									+field.field_type.toLowerCase()
									+'_input custom_field required" id='
									+field.id+' name="'
									+field.field_label
									+'" style="margin: 0px 5px;">'+field.field_label+'</label></div></div>');
					else
						el = el.concat('<div class="control-group">	<label class="control-label">'
									+'<input type="'
									+field_type
									+'" class="'
									+field.field_type.toLowerCase()
									+'_input custom_field" id='
									+field.id+' name="'
									+field.field_label
									+'" style="margin: 0px 5px;">'+field.field_label+'</label></div>');
					return;
				}
				
				if(field.is_required)
					el = el.concat('<div class="control-group">	<label class="control-label">'
								+field.field_label
								+' <span class="field_req">*</span></label><div class="controls"><input type="'
								+field_type
								+'" class="'
								+field.field_type.toLowerCase()
								+'_input custom_field required" id='
								+field.id+' name="'
								+field.field_label
								+'"></div></div>');
				else
					el = el.concat('<div class="control-group">	<label class="control-label">'
								+field.field_label
								+'</label><div class="controls"><input type="'
								+field_type
								+'" class="'
								+field.field_type.toLowerCase()
								+'_input custom_field" id='
								+field.id+' name="'
								+field.field_label
								+'"></div></div>');
				return;
			}
		else if(field.field_type.toLowerCase() == "textarea")
		{
			field_type = "textarea";
			var rows = 3;
			
			if(field.field_data)
				rows = parseInt(field.field_data);
				
			if(field.is_required)
				el = el.concat('<div class="control-group">	<label class="control-label">'
							+field.field_label
							+' <span class="field_req">*</span></label><div class="controls"><textarea style="max-width:420px;" rows="'
							+rows+'" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field required" id='
							+field.id+' name="'
							+field.field_label
							+'"></textarea></div></div>');
			else
				el = el.concat('<div class="control-group">	<label class="control-label">'
							+field.field_label
							+'</label><div class="controls"><textarea style="max-width:420px;" rows="'
							+rows+'" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field" id='
							+field.id+' name="'
							+field.field_label
							+'"></textarea></div></div>');
			return;
		}
		else if(field.field_type.toLowerCase() == "number")
		{
			field_type = "number";
			if(field.is_required)
				el = el.concat('<div class="control-group">	<label class="control-label">'
						+field.field_label
						+' <span class="field_req">*</span></label><div class="controls custom-number-controls"><input type="number" style="max-width:420px;" class="'
						+field.field_type.toLowerCase()
						+'_input custom_field required" id="'
						+field.id+'" name="'
						+field.field_label
						+'" value="0"></input>'
						+'</div></div>');
			else
				el = el.concat('<div class="control-group">	<label class="control-label">'
						+field.field_label
						+'</label><div class="controls custom-number-controls"><input type="number" style="max-width:420px;" class="'
						+field.field_type.toLowerCase()
						+'_input custom_field" id="'
						+field.id+'" name="'
						+field.field_label
						+'" value="0"></input>'
						+'</div></div>');
			
				
			return;
		}
		else if(field.field_type.toLowerCase() == "formula")
		{
			//If custom field is formula we return without appending anything	
			return;
		}
		
		// If the field is not of type list or checkbox, create text field (plain text field or date field)
		if(field.is_required)
			el = el.concat('<div class="control-group">	<label class="control-label">'
							+field.field_label
							+' <span class="field_req">*</span></label><div class="controls"><input type="text" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field required" id='
							+field.id+' name="'+field.field_label
							+'"></div></div>');
		else
			el = el.concat('<div class="control-group">	<label class="control-label">'
							+field.field_label
							+'</label><div class="controls"><input type="text" class="'
							+field.field_type.toLowerCase()
							+'_input custom_field" id='
							+field.id+' name="'
							+field.field_label
							+'"></div></div>');
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
					element.attr("value", new Date(property.value * 1000)
							.format('mm/dd/yyyy'));
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
			      $(this).width($originals.eq(index).width());
			      $(this).css("background","#f5f5f5");
			      $(this).css("border-bottom","1px solid #ddd");
			    });
			    return $helper;
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