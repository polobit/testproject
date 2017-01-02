
/**
 * If the template is not found in document body, then template paths are built
 * based on template name and download requests are sent. if it is down-loaded
 * append it to the document body. And call the function (getTemplate) again by
 * setting the download parameter to "no"
 */
function getTemplateUrls(templateName)
{
	// Stores template URLS
	var template_relative_urls = [];

	if (templateName.indexOf("settings") == 0)
	{
		template_relative_urls.push("settings.js");
	}
	if (templateName.indexOf("admin-settings") == 0)
	{
		template_relative_urls.push("admin-settings.js");
	}
	if (templateName.indexOf("continue") == 0)
	{
		template_relative_urls.push("continue.js");
	}
	if (templateName.indexOf("all-domain") == 0)
	{
		template_relative_urls.push("admin.js");
	}
	if (templateName.indexOf("contact-detail") == 0 || templateName.indexOf("timeline") == 0 || templateName.indexOf("company-detail") == 0 || templateName.indexOf("leads-details") == 0)
	{
		template_relative_urls.push("contact-detail.js");
		if (HANDLEBARS_PRECOMPILATION)
			template_relative_urls.push("contact-detail.html");
	}
	if (templateName.indexOf("contact-filter") == 0 || templateName.indexOf("filter-contacts") == 0)
	{
		template_relative_urls.push("contact-filter.js");
	}
	if (templateName.indexOf("contact-view") == 0 || templateName.indexOf("contact-custom") == 0 || templateName.indexOf("contacts-custom") == 0 || templateName
			.indexOf("contacts-grid") == 0 || templateName.indexOf("company-view") == 0 || templateName.indexOf("companies-custom") == 0)
	{
		template_relative_urls.push("contact-view.js");
	}
	if (templateName.indexOf("bulk-actions") == 0)
	{
		template_relative_urls.push("bulk-actions.js");
	}
	if (templateName.indexOf("case") == 0)
	{
		template_relative_urls.push("case.js");
	}
	if (templateName.indexOf("document") == 0)
	{
		template_relative_urls.push("document.js");
	}	
	if (templateName.indexOf("voice-mail") == 0)
	{
		template_relative_urls.push("voice-mail.js");
	}
	if (templateName.indexOf("gmap") == 0)
	{
		template_relative_urls.push("gmap.js");
	}
	if (templateName.indexOf("report") == 0)
	{
		template_relative_urls.push("report.js");
	}
	if (templateName.indexOf("webrule") == 0)
	{
		template_relative_urls.push("web-rules.js");
	}
	if (templateName.indexOf("workflow") == 0 || templateName.indexOf("campaign") == 0 || templateName.indexOf("trigger") == 0 || templateName
			.indexOf("automation") == 0)
	{
		template_relative_urls.push("workflow.js");
	}
	if (templateName.indexOf("purchase") == 0 || templateName.indexOf("subscription") == 0 || templateName.indexOf("subscribe") == 0 || templateName
			.indexOf("invoice") == 0)
	{
		template_relative_urls.push("billing.js");
	}

	if (templateName.indexOf("widget") == 0)
	{
		template_relative_urls.push("widget.js");
	}
	if (templateName.indexOf("helpscout") == 0)
	{
		template_relative_urls.push("helpscout.js");
	}
	else if (templateName.indexOf("clickdesk") == 0)
	{
		template_relative_urls.push("clickdesk.js");
	}
	else if (templateName.indexOf("zendesk") == 0)
	{
		template_relative_urls.push("zendesk.js");
	}
	else if (templateName.indexOf("freshbooks") == 0)
	{
		template_relative_urls.push("freshbooks.js");
	}
	else if (templateName.indexOf("linkedin") == 0)
	{
		template_relative_urls.push("linkedin.js");
	}
	else if (templateName.indexOf("rapleaf") == 0)
	{
		template_relative_urls.push("rapleaf.js");
	}
	else if (templateName.indexOf("stripe") == 0)
	{
		template_relative_urls.push("stripe.js");
	}
	else if (templateName.indexOf("twilioio") == 0)
	{
	template_relative_urls.push("twilioio.js");
	}
	else if (templateName.indexOf("twilio") == 0)
	{
		template_relative_urls.push("twilio.js");
	}	
	else if (templateName.indexOf("sip") == 0)
	{
	template_relative_urls.push("sip.js");
	}
	else if (templateName.indexOf("ozonetel") == 0)
	{
	template_relative_urls.push("ozonetel.js");
	}
	else if (templateName.indexOf("twitter") == 0)
	{
		template_relative_urls.push("twitter.js");
	}
	else if (templateName.indexOf("googleplus") == 0)
	{
		template_relative_urls.push("googleplus.js");
	}	
	else if (templateName.indexOf("paypal") == 0)
	{
		template_relative_urls.push("paypal.js");
	}
	else if (templateName.indexOf("knowlarity") == 0)
	{
		template_relative_urls.push("knowlarity.js");
	}
	else if (templateName.indexOf("xero") == 0)
	{
		template_relative_urls.push("xero.js");
	}
	else if (templateName.indexOf("braintree") == 0)
	{
		template_relative_urls.push("braintree.js");
	}
	else if (templateName.indexOf("quickbooks") == 0)
	{
		template_relative_urls.push("quickbooks.js");
	}
	else if (templateName.indexOf("facebook") == 0)
	{
		template_relative_urls.push("facebook.js");
	}
	else if (templateName.indexOf("callscript") == 0)
	{
		template_relative_urls.push("callscript.js");
	}
	else if (templateName.indexOf("fullcontact") == 0)
	{
		template_relative_urls.push("fullcontact.js");
	}
	else if (templateName.indexOf("klout") == 0)
 	{
 		template_relative_urls.push("klout.js");
 	}

	if (templateName.indexOf("chargify") == 0)
	{
		template_relative_urls.push("chargify.js");
	}
	if (templateName.indexOf("shopify") == 0)
	{
		template_relative_urls.push("shopify.js");
	}
	if (templateName.indexOf("socialsuite") == 0)
	{
		template_relative_urls.push("socialsuite.js");
	}


	if (templateName.indexOf("portlet") == 0)
	{
		template_relative_urls.push("portlets.js");
	}
	if (templateName.indexOf("deal-detail") == 0)
	{
		template_relative_urls.push("deal-detail.js");
	}
	if (templateName.indexOf("fbpagetab") == 0)
	{
		template_relative_urls.push("facebookpage.js");
	}
	if (templateName.indexOf("landingpages") == 0)
	{
		template_relative_urls.push("landingpages.js");
	}
	if (templateName.indexOf("emailbuilder") == 0)
	{
		template_relative_urls.push("emailbuilder.js");
	}
	if (templateName.indexOf("segmentation") == 0)
	{
		template_relative_urls.push("segmentation.js");
	}
	if (templateName.indexOf("ticket") == 0)
	{
		template_relative_urls.push("tickets.js");
	}
	if (templateName.indexOf("billing-settings") == 0 || templateName.indexOf("creditcard-update") == 0)
	{
		template_relative_urls.push("settings.js");
	}
	if (templateName.indexOf("bria") == 0)
	{
		template_relative_urls.push("bria.js");
	}
	if (templateName.indexOf("skype") == 0)
	{
		template_relative_urls.push("skype.js");
	}
	if(templateName.indexOf("formbuilder") == 0)
	{
		template_relative_urls.push("formbuilder.js")
	}
	if (templateName.indexOf("uservoice") == 0)
	{
		template_relative_urls.push("uservoice.js");
	}
    if (templateName.indexOf("dashboard") == 0)
	{
		template_relative_urls.push("dashboards.js");
	}
	if (templateName.indexOf("refer") == 0)
	{
		template_relative_urls.push("referals.js");
	}
	if (templateName.indexOf("generic-timeline") == 0)
	{
		template_relative_urls.push("generic-timeline.js");
	}
	if (templateName.indexOf("helpcenter") == 0)
	{
		template_relative_urls.push("helpcenter.js");
	}
	if (templateName.indexOf("push-notification") == 0)
	{
		template_relative_urls.push("notification.js");
	}
	if (templateName.indexOf("affiliate") != -1)
	{
		template_relative_urls.push("affiliate.js");
	}
	if (templateName.indexOf("video-record") == 0)
	{
		template_relative_urls.push("video-record.js");
	}
	if (templateName.indexOf("leads-filter") == 0 || templateName.indexOf("leads-lhs-filters") == 0 || templateName.indexOf("leads-static-filters") == 0)
	{
		template_relative_urls.push("leads-filters.js");
	}
	if (templateName.indexOf("new-lead") == 0 || templateName.indexOf("update-lead") == 0)
	{
		template_relative_urls.push("leads-form.js");
	}
	if (templateName.indexOf("leads-header") == 0 || templateName.indexOf("leads-list-view") == 0 || 
		templateName.indexOf("leads-sources-statuses") == 0 || templateName.indexOf("leads-grid") == 0)
	{
		template_relative_urls.push("leads-view.js");
	}
	if (templateName.indexOf("leads-details") == 0)
	{
		template_relative_urls.push("leads-detail.js");
	}
	
	return template_relative_urls;
}

/**
 * Takes list of templates to downloaded and pops URL from list and sends
 * request to download asynchronously. After last URL in list is removed and
 * download request is sent, on callback of downloaded URL, new request is sent
 * to fetch next template URL in the list. Continues sending requests till list
 * is empty.
 * 
 * @param templateName
 * @param context
 * @param template_relative_urls
 * @param callback
 */
function load_templates_async(templateName, context, template_relative_urls, callback)
{
	// Removes last url from the list to fetch template.
	var url = template_relative_urls.pop();

	// URL is undefined when list is empty which means all templates specified
	// in array are downloaded. As list is empty get template is called with
	// download parameter 'no' which fills and sends template in callback
	if (!url)
	{
		getTemplate(templateName, context, 'no', callback);
		return;
	}

	// Fetches template and call current method in recursion to download other
	// templates in list
	downloadTemplate(url, function()
	{
		{
			// Recursion call to download other templates
			load_templates_async(templateName, context, template_relative_urls, callback);
		}
	});
}

/**
 * Sends request to download template synchronously
 * 
 * @param template_relative_urls
 */
function load_templates_sync(template_relative_urls)
{
	for ( var index in template_relative_urls)
		downloadTemplate(template_relative_urls[index]);
}

String.prototype.endsWith = function(suffix)
{
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

/**
 * Iterates the given "items", to find a match with the given "name", if found
 * returns the value of its value attribute
 * 
 * @param {Object}
 *            items array of json objects
 * @param {String}
 *            name to get the value (of value atribute)
 * @returns value of the matched object
 */
function getPropertyValue(items, name)
{
	if (items == undefined)
		return;

	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name){
			if(items[i].value!=null)
			 items[i].value=items[i].value.trim();
			return items[i].value;
		}
		}
}
function getSystemPropertyValue(items, name)
{
	if (items == undefined)
		return;

	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name && items[i].type == "SYSTEM"){
			if(items[i].value!=null)
			 items[i].value=items[i].value.trim();
			if(name == 'url')
			return items[i].value.toLowerCase();

			return items[i].value;
		}
		}
}


/**
 * appends , between contact fields
 * @param items
 * @param name
 * @returns {String}
 */

function getPropertyValueByCheckingExistance(items, companyname,jobtitle)
{
	if (items == undefined)
		return;

	var companyExists=false;
	var jobTitleExists=false;
	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == companyname){
			if(items[i].value){
				companyExists=true;
			}
			
		}
		else if (items[i].name == jobtitle){
			if(items[i].value){
				jobTitleExists=true;
			}
			
		}
	}
	if(companyExists&&jobTitleExists)
		return ',';
}



function getMarginLength(items, companyname)
{
	if (items == undefined)
		return;

	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == companyname)
			return '3px';
	}
	return '0px';
}


/**
 * checks the contact properties existance
 * @param items
 * @param name
 * @param name1
 * @returns {String}
 */
function checkPropertyValueExistance(items,name,name1){

	if (items == undefined)
		return "none";

	var valueExists=false;
	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name || items[i].name == name1){
			if(items[i].value){
				valueExists=true;
			}
			
		}
	}
	if(valueExists==true)
		return 'block';
	else
		return 'none';
}

/**
 * Iterates the given "items", to find all matches with the given "name" and
 * concats each matched value by given separator
 * 
 * @param {Object}
 *            items array of json objects
 * @param {String}
 *            name to get the value (of value atribute)
 * @param {String}
 *            separator to combine matched values like ,(comma) etc
 * 
 * @returns matched values combined by separator or undefined
 */
function getAllPropertyValuesByName(items, name, separator)
{
	if (items == undefined)
		return;

	var val = "";

	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
		{
			var va = items[i].value;
			val += va + separator;
		}
	}

	// Removes trailing separators
	var regex = new RegExp("(^" + separator + ")|(" + separator + "$)", "g");
	val = val.replace(regex, "");

	console.log(val);
	return val;
}

/**
 * Returns contact property based on the name of the property
 * 
 * @param items :
 *            porperties in contact object
 * @param name :
 *            name of the property
 * @returns
 */
function getProperty(items, name)
{
	if (items == undefined)
		return;

	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
			return items[i];
	}
}

function getCustomProperty(items, name)
{
	if (items == undefined)
		return;

	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name && items[i].type == "CUSTOM" )
			return items[i];
	}
}

/**
 * Returns contact property based on its property name and subtype
 */
function getPropertyValueBySubtype(items, name, subtype)
{
	if (items == undefined)
		return;

	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name && items[i].subtype == subtype)
			return items[i].value;
	}
}

/**
 * Returns contact property based on the sub type (LINKEDIN, TWITTER, URL, SKYPE
 * etc..) of the property
 * 
 * @param items :
 *            properties list
 * @param name :
 *            name of the property
 * @param type :
 *            type of the property
 * @param subtype :
 *            subtype of property
 * @returns
 */
function getPropertyValueBytype(items, name, type, subtype)
{
	if (items == undefined)
		return;

	// Iterates though each property object and compares each property by name
	// and its type
	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name == name)
		{
			if (type && type == items[i].type)
			{
				if (subtype && subtype == items[i].subtype)
					return items[i].value;
			}

			if (subtype && subtype == items[i].subtype)
			{
				return items[i].value;
			}
		}
	}
}

function getPropertyValueInCheckbox(items, name, id, checked)
{
	if (items == undefined)
		return;
	var el = "";
	for (var i = 0, l = items.length; i < l; i++)
	{
		if (items[i].name === name)
		{		
			if(name === "website"){
			  if(checked === 'checked'){			  
				  el = el.concat('<label class="i-checks i-checks-sm"><input type="checkbox" field="'+name+ '" subtype="'+get_subtype_value(items[i])+ '" data="'+items[i].value+ '" oid="'+id+ '" checked="'+checked+ '"><i></i></label>' + items[i].value);
			  }
			  else{
				  el = el.concat('<label class="i-checks i-checks-sm"><input type="checkbox" field="'+name+ '" subtype="'+get_subtype_value(items[i])+ '" data="'+items[i].value+ '" oid="'+id+ '"><i></i></label>' + items[i].value);
			  }
			  el = el.concat(get_website_icon(items[i]));
			}
			else if(name === "phone"){
				 if(checked === 'checked'){			  
					  el = el.concat('<label class="i-checks i-checks-sm"><input type="checkbox" field="'+name+ '" subtype="'+get_subtype_value(items[i])+ '" data="'+items[i].value+ '" oid="'+id+ '" checked="'+checked+ '"><i></i></label>' + items[i].value );
				 }
				 else{
					  el = el.concat('<label class="i-checks i-checks-sm"><input type="checkbox" field="'+name+ '" subtype="'+get_subtype_value(items[i])+ '" data="'+items[i].value+ '" oid="'+id+ '"><i></i></label>' + items[i].value );
				 }
			 el = el.concat(get_subtype(items[i]));
			}
			else if(name === "email"){
				if(checked === 'checked')
					el = el.concat('<label class="i-checks i-checks-sm"><input type="checkbox" field="'+name+ '" subtype="'+get_subtype_value(items[i])+ '" data="'+items[i].value+ '" oid="'+ id + '" checked="'+checked+ '"><i></i></label>' + items[i].value);
				else{
					el = el.concat('<label class="i-checks i-checks-sm"><input type="checkbox" field="'+name+ '" subtype="'+get_subtype_value(items[i])+ '" data="'+items[i].value+ '" oid="'+ id + '"><i></i></label>' + items[i].value);
				}
				el = el.concat(get_subtype(items[i]));
			}
		}
	}
	return el;
}

function get_website_icon(item){
	var icon = get_social_icon(item.subtype);
	var str = "<i class=\"".concat(icon).concat("\"").concat(" style=\"font-size: 1.3em !important; margin-left:10px \"></i> <br>");
	return str;
}

function get_social_icon(name){
	if (!name)
	return "fa fa-globe";

    var icon_json = { "TWITTER" : "fa fa-twitter", "LINKEDIN" : "fa fa-linkedin-square", "URL" : "fa fa-globe", "GOOGLE-PLUS" : "fa fa-google-plus-square",
	"FACEBOOK" : "fa fa-facebook-square", "GITHUB" : "fa fa-github", "FEED" : "icon-rss", "XING" : "fa fa-xing-square", "SKYPE" : "icon-skype",
	"YOUTUBE" : "fa fa-youtube-square", "FLICKR" : "fa fa-flickr" };

    name = name.trim();

    if (icon_json[name])
	return icon_json[name];

    return "fa fa-globe";
}

function get_subtype(item){
	
	if(item.subtype!=undefined && item.subtype!=""){
		var str = "<span style=\"margin:3px 0px 3px 10px\">".concat(item.subtype).concat("</span> <br>");
		return str;
	}
	else
		return "<br>";
}

function get_subtype_value(item){
	
	if(item.subtype!=undefined && item.subtype!=""){
		var str = item.subtype;
		return str;
	}
	else
	   return "";
}


/**
 * Returns list of custom properties. used to fill custom data in fields in
 * continue contact
 * 
 * @param items
 * @returns
 */
function getContactCustomProperties(items)
{
	if (items == undefined)
		return items;

	var fields = [];
	var fieldName='';
	var datajson={};
	if(!Current_Route)
		Current_Route = window.location.hash.split("#")[1]
	
	var curr_route = Current_Route;
	if(curr_route == "contacts" || curr_route.indexOf("contact")>=0){
		curr_route = "CONTACT";
	}else if(curr_route == "companies" || curr_route.indexOf("company")>=0){
		curr_route = "COMPANY";
	}else if(curr_route == "deals" || curr_route.indexOf("deal")>=0){
		curr_route = "DEAL";
	}

	var position_arr = {};
	var position_max = 0;
	
	/*if(App_Contacts.customFieldsList!=undefined && App_Contacts.customFieldsList!=null){
		position_max = App_Contacts.customFieldsList.collection.models.length+1;
		for(var i=0;i<App_Contacts.customFieldsList.collection.models.length;i++){
			curr_scope = App_Contacts.customFieldsList.collection.models[i].get("scope");
			if(curr_route==curr_scope){
				temp_position = App_Contacts.customFieldsList.collection.models[i].get("position");
				if(!(temp_position==undefined || temp_position==0 || temp_position=="")){
					if(temp_position>=position_max){
						position_max = temp_position+1;
					}
				}
			}
		}
	}*/

	if(App_Contacts.customFieldsList!=undefined && App_Contacts.customFieldsList!=null){
		position_max = App_Contacts.customFieldsList.collection.models.length+1;
		for(var i=0;i<App_Contacts.customFieldsList.collection.models.length;i++){
			curr_scope = App_Contacts.customFieldsList.collection.models[i].get("scope");
			if(curr_route==curr_scope){
				if(App_Contacts.customFieldsList.collection.models[i].get("position")==0 || App_Contacts.customFieldsList.collection.models[i].get("position")==""){
					position_arr[''+App_Contacts.customFieldsList.collection.models[i].get("field_label")] = position_max;
					position_max++;
				}else{
					position_arr[''+App_Contacts.customFieldsList.collection.models[i].get("field_label")] = App_Contacts.customFieldsList.collection.models[i].get("position");
				}
			}
		}
	}

	var temp_fields = [];
	for (var i = 0; i < items.length; i++)
	{
		if (items[i].type == "CUSTOM" && items[i].name != "image")
		{
			if(fieldName=='')
				fieldName=items[i].name;
			//fields.push(items[i]);
			//temp_fields[position_arr[items[i].name]] = items[i];
			if(position_arr[items[i].name]!=undefined && position_arr[items[i].name]!=""){
				temp_fields[position_arr[items[i].name]] = items[i];
			}else{
				temp_fields[position_max] = items[i];
				position_max++;
			}
			datajson[''+items[i].name]=items[i].value;
		}
	}
	
	for (var i = 0; i < temp_fields.length; i++){
		if(temp_fields[i]!=undefined && temp_fields[i]!=""){
			fields.push(temp_fields[i]);
		}
	}

	//Added for formula type custom field
	var type='';
	if(App_Contacts.customFieldsList!=undefined && App_Contacts.customFieldsList!=null){
		for(var i=0;i<App_Contacts.customFieldsList.collection.models.length;i++){
			if(App_Contacts.customFieldsList.collection.models[i].get("field_label")==fieldName){
				type = App_Contacts.customFieldsList.collection.models[i].get("scope");
				if(curr_route==type)
					break;
			}
		}
	}
	
	var formulaFields=[];
	var allCustomFields=[];
	var finalFields=[];
	
	if(App_Contacts.customFieldsList!=undefined && App_Contacts.customFieldsList!=null){
		if(type=='')
			type='CONTACT';
		for(var i=0;i<App_Contacts.customFieldsList.collection.models.length;i++){
			var json={};
			if(App_Contacts.customFieldsList.collection.models[i].get("scope")==type && App_Contacts.customFieldsList.collection.models[i].get("field_type")=="FORMULA"){
				var tplEleData = Mustache.render(App_Contacts.customFieldsList.collection.models[i].get("field_data"),datajson);
				var evalFlag = true;
				var tplEleDataAftEval;
				try{
					tplEleDataAftEval = eval(tplEleData)
				}catch(err){
					console.log(err.message);
					evalFlag = false;
				}
				if(!evalFlag)
					tplEleDataAftEval = tplEleData;
				if(evalFlag && tplEleDataAftEval!=undefined && tplEleDataAftEval!=null){
					json.name=App_Contacts.customFieldsList.collection.models[i].get("field_label");
					json.type="CUSTOM";
					json.position=App_Contacts.customFieldsList.collection.models[i].get("position");
					json.value=tplEleDataAftEval;
					json.field_type=App_Contacts.customFieldsList.collection.models[i].get("field_type");
					allCustomFields.push(json);
					
					formulaFields.push(json);
				}
			}else if(App_Contacts.customFieldsList.collection.models[i].get("scope")==type){
				json.name=App_Contacts.customFieldsList.collection.models[i].get("field_label");
				json.type="CUSTOM";
				json.position=App_Contacts.customFieldsList.collection.models[i].get("position");
				json.field_type=App_Contacts.customFieldsList.collection.models[i].get("field_type");
				allCustomFields.push(json);
			}
		}
	}
	if(fields.length>0){
		if(allCustomFields.length>0){
			for(var i=0;i<allCustomFields.length;i++){
				var isFieldExist = false;
				if(allCustomFields[i].field_type=="FORMULA"){
					if($.inArray(allCustomFields[i], finalFields)==-1)
						finalFields.push(allCustomFields[i]);
				}else{
					for(var j=0;j<fields.length;j++){
						if(allCustomFields[i].name==fields[j].name){
							if($.inArray(fields[j], finalFields)==-1){
								for(var m=0;m<allCustomFields.length;m++){
									if(fields[j].name == allCustomFields[m].name && (allCustomFields[m].field_type == "CONTACT" || allCustomFields[m].field_type == "COMPANY")){
										fields[j].custom_field_type = allCustomFields[m].field_type
									}
								}
								finalFields.push(fields[j]);
							}	
							isFieldExist = true;
							break;
						}
						if(!isFieldExist){
							if($.inArray(fields[j], finalFields)==-1)
							{
								for(var m=0;m<allCustomFields.length;m++){
									if(fields[j].name == allCustomFields[m].name && (allCustomFields[m].field_type == "CONTACT" || allCustomFields[m].field_type == "COMPANY")){
										fields[j].custom_field_type = allCustomFields[m].field_type
									}
								}
								finalFields.push(fields[j]);
							}
								
						}
					}
				}
			}
		}else{
			for(var k=0;k<fields.length;k++){
				if($.inArray(fields[k], finalFields)==-1)
					finalFields.push(fields[k]);	
			}
		}
		
	}else{
		for(var k=0;k<formulaFields.length;k++){
			if($.inArray(formulaFields[k], finalFields)==-1)
				finalFields.push(formulaFields[k]);	
		}
	}
	for(var x=0;x<fields.length;x++){
 		if($.inArray(fields[x], finalFields) == -1)
 			finalFields.push(fields[x]);	
 	}
 	var finalCustomFields = [];
 	for(var x = 0;x<finalFields.length ;x++){
 		if(finalFields[x].name != 'first_name' && finalFields[x].name != 'last_name')
 			finalCustomFields.push(finalFields[x]);
 	}

	return finalCustomFields;
}


/**
 * Returns list of custom properties. used to fill custom data in fields in
 * continue contact
 * 
 * @param items
 * @returns
 */
function getCompanyCustomProperties(items)
{
	if (items == undefined)
		return items;

	var fields = [];
	var fieldName='';
	var datajson={};

	var curr_route = Current_Route;
	if(curr_route == "contacts" || curr_route.indexOf("contact")>=0){
		curr_route = "CONTACT";
	}else if(curr_route == "companies" || curr_route.indexOf("company")>=0){
		curr_route = "COMPANY";
	}else if(curr_route == "deals" || curr_route.indexOf("deal")>=0){
		curr_route = "DEAL";
	}

	var position_arr = {};
	var position_max = 0;
	/*
	if(App_Companies.customFieldsList!=undefined && App_Companies.customFieldsList!=null){
		position_max = App_Companies.customFieldsList.collection.models.length+1;
		for(var i=0;i<App_Companies.customFieldsList.collection.models.length;i++){
			curr_scope = App_Companies.customFieldsList.collection.models[i].get("scope");
			if(curr_route==curr_scope){
				temp_position = App_Companies.customFieldsList.collection.models[i].get("position");
				if(!(temp_position==undefined || temp_position==0 || temp_position=="")){
					if(temp_position>=position_max){
						position_max = temp_position+1;
					}
				}
			}
		}
	}*/

	if(App_Companies.customFieldsList!=undefined && App_Companies.customFieldsList!=null){
		position_max = App_Companies.customFieldsList.collection.models.length+1;
		for(var i=0;i<App_Companies.customFieldsList.collection.models.length;i++){
			curr_scope = App_Companies.customFieldsList.collection.models[i].get("scope");
			if(curr_route==curr_scope){
				if(App_Companies.customFieldsList.collection.models[i].get("position")==0 || App_Companies.customFieldsList.collection.models[i].get("position")==""){
					position_arr[''+App_Companies.customFieldsList.collection.models[i].get("field_label")] = position_max;
					position_max++;
				}else{
					position_arr[''+App_Companies.customFieldsList.collection.models[i].get("field_label")] = App_Companies.customFieldsList.collection.models[i].get("position");
				}
			}
		}
	}

	var temp_fields = [];
	for (var i = 0; i < items.length; i++)
	{
		if (items[i].type == "CUSTOM" && items[i].name != "image")
		{
			if(fieldName=='')
				fieldName=items[i].name;
			//fields.push(items[i]);
			//temp_fields[position_arr[items[i].name]] = items[i];
			if(position_arr[items[i].name]!=undefined && position_arr[items[i].name]!=""){
				temp_fields[position_arr[items[i].name]] = items[i];
			}else{
				temp_fields[position_max] = items[i];
				position_max++;
			}
			datajson[''+items[i].name]=items[i].value;
		}
	}
	
	for (var i = 0; i < temp_fields.length; i++){
		if(temp_fields[i]!=undefined && temp_fields[i]!=""){
			fields.push(temp_fields[i]);
		}
	}

	//Added for formula type custom field
	var type='';
	if(App_Companies.customFieldsList!=undefined && App_Companies.customFieldsList!=null){
		for(var i=0;i<App_Companies.customFieldsList.collection.models.length;i++){
			if(App_Companies.customFieldsList.collection.models[i].get("field_label")==fieldName){
				type = App_Companies.customFieldsList.collection.models[i].get("scope");
				if(curr_route==type)
					break;
			}
		}
	}
	
	var formulaFields=[];
	var allCustomFields=[];
	var finalFields=[];
	
	if(App_Companies.customFieldsList!=undefined && App_Companies.customFieldsList!=null){
		if(type=='')
			type='CONTACT';
		for(var i=0;i<App_Companies.customFieldsList.collection.models.length;i++){
			var json={};
			if(App_Companies.customFieldsList.collection.models[i].get("scope")==type && App_Companies.customFieldsList.collection.models[i].get("field_type")=="FORMULA"){
				var tplEleData = Mustache.render(App_Companies.customFieldsList.collection.models[i].get("field_data"),datajson);
				var evalFlag = true;
				var tplEleDataAftEval;
				try{
					tplEleDataAftEval = eval(tplEleData)
				}catch(err){
					console.log(err.message);
					evalFlag = false;
				}
				if(!evalFlag)
					tplEleDataAftEval = tplEleData;
				if(evalFlag && tplEleDataAftEval!=undefined && tplEleDataAftEval!=null){
					json.name=App_Companies.customFieldsList.collection.models[i].get("field_label");
					json.type="CUSTOM";
					json.position=App_Companies.customFieldsList.collection.models[i].get("position");
					json.value=tplEleDataAftEval;
					json.field_type=App_Companies.customFieldsList.collection.models[i].get("field_type");
					allCustomFields.push(json);
					
					formulaFields.push(json);
				}
			}else if(App_Companies.customFieldsList.collection.models[i].get("scope")==type){
				json.name=App_Companies.customFieldsList.collection.models[i].get("field_label");
				json.type="CUSTOM";
				json.position=App_Companies.customFieldsList.collection.models[i].get("position");
				json.field_type=App_Companies.customFieldsList.collection.models[i].get("field_type");
				allCustomFields.push(json);
			}
		}
	}
	if(fields.length>0){
		if(allCustomFields.length>0){
			for(var i=0;i<allCustomFields.length;i++){
				var isFieldExist = false;
				if(allCustomFields[i].field_type=="FORMULA"){
					finalFields.push(allCustomFields[i]);
				}else{
					for(var j=0;j<fields.length;j++){
						if($.inArray(fields[j], finalFields)==-1){
							if(allCustomFields[i].name==fields[j].name){
								for(var m=0;m<allCustomFields.length;m++){
									if(fields[j].name == allCustomFields[m].name && (allCustomFields[m].field_type == "CONTACT" || allCustomFields[m].field_type == "COMPANY")){
										fields[j].custom_field_type = allCustomFields[m].field_type
									}
								}
								finalFields.push(fields[j]);
								isFieldExist = true;
								break;
							}
						}
						if(!isFieldExist){
							if($.inArray(fields[j], finalFields)==-1)
							{
								for(var m=0;m<allCustomFields.length;m++){
									if(fields[j].name == allCustomFields[m].name && (allCustomFields[m].field_type == "CONTACT" || allCustomFields[m].field_type == "COMPANY")){
										fields[j].custom_field_type = allCustomFields[m].field_type
									}
								}
								finalFields.push(fields[j]);
							}
								
						}
					}
				}
			}
		}else{
			for(var k=0;k<fields.length;k++){
				if($.inArray(fields[k], finalFields)==-1)
					finalFields.push(fields[k]);	
			}
		}
		
	}else{
		for(var k=0;k<formulaFields.length;k++){
			if($.inArray(fields[k], finalFields)==-1)
				finalFields.push(formulaFields[k]);	
		}
	}
	for(var x=0;x<fields.length;x++){
 		if($.inArray(fields[x], finalFields) == -1)
 			finalFields.push(fields[x]);	
 	}
 	var finalCustomFields = [];
 	for(var x = 0;x<finalFields.length ;x++){
 		if(finalFields[x].name != 'first_name' && finalFields[x].name != 'last_name')
 			finalCustomFields.push(finalFields[x]);
 	}

	return finalCustomFields;
	
}

/**
 * Turns the first letter of the given string to upper-case and the remaining to
 * lower-case (EMaiL to Email).
 * 
 * @param {String}
 *            value to convert as ucfirst
 * @returns converted string
 */
function ucfirst(value)
{
	return (value && typeof value === 'string') ? (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) : '';

}

/**
 * Creates titles from strings. Replaces underscore with spaces and capitalize
 * first word of string.
 * 
 * @param value
 * @returns
 */
function titleFromEnums(value)
{
	if (!value)
		return;

	var str = value.replace(/_/g, ' ');

	return ucfirst(str.toLowerCase());
}

/**
 * Counts total number of attributes in a json object
 * 
 * @param obj
 * @returns {Number}
 */
function countJsonProperties(obj)
{
	var prop;
	var propCount = 0;

	for (prop in obj)
	{
		propCount++;
	}
	return propCount;
}

/**
 * Get the current contact property
 * 
 * @param value
 * @returns {String}
 */
function getCurrentContactProperty(value)
{
	if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model)
	{
		var contact_properties = App_Contacts.contactDetailView.model.get('properties')
		return getPropertyValue(contact_properties, value);
	}
}

function getCount(collection)
{
	if (collection[0] && collection[0].count && (collection[0].count != -1))
		return "(" + collection[0].count + " " +_agile_get_translated_val('other','total')+ ")";
	else
		return "(" + collection.length + " " +_agile_get_translated_val('other','total')+ ")";
}
function getSimpleCount(collection)
{
	for(var i=0;i<collection.length;i++){
		if (collection[i] && collection[i].count && (collection[i].count != -1))
			return collection[i].count ;
			
			}
		return collection.length ;
}
function getTaskCount(collection)
{
	if (collection[0] && collection[0].count && (collection[0].count != -1))
		return collection[0].count ;
	else
		return collection.length ;
}

/**
 * Returns id from hash. Id must be last in hash.
 */
function getIdFromHash()
{

	// Returns "workflows" from "#workflows"
	var hash = window.location.hash.substr(1);

	// remove trailing slash '/'
	if (hash.substr(-1) === "/")
	{
		hash = hash.replace(/\/$/, "");
	}

	// Returns campaign_id from "workflow/all-contacts/campaign_id".
	var id = hash.split('/').pop();

	return id;
}

function updateCustomData(el)
{
	$(".custom-data", App_Contacts.contactDetailView.el).html(el)
}

function updateCompanyCustomData(el)
{
	$(".custom-data", App_Companies.companyDetailView.el).html(el)
}

/**
 * Returns list of custom properties. used to fill custom data in fields in
 * deal details
 * 
 * @param items
 * @returns
 */
function getDealCustomProperties(items)
{
	if (items == undefined)
		return items;

	var fields = [];
	var datajson={};
	for (var i = 0; i < items.length; i++)
	{
		fields.push(items[i]);
		datajson[''+items[i].name]=items[i].value;
	}
	
	var formulaFields=[];
	var allCustomFields=[];
	var finalFields=[];
	
	if(App_Deals.customFieldsList!=undefined && App_Deals.customFieldsList!=null)
	{
		for(var i=0;i<App_Deals.customFieldsList.collection.models.length;i++)
		{
			var json={};
			if(App_Deals.customFieldsList.collection.models[i].get("field_type")=="FORMULA"){
				var tplEleData = Mustache.render(App_Deals.customFieldsList.collection.models[i].get("field_data"),datajson);
				var evalFlag = true;
				var tplEleDataAftEval;
				try
				{
					tplEleDataAftEval = eval(tplEleData)
				}catch(err)
				{
					console.log(err.message);
					evalFlag = false;
				}
				if(!evalFlag)
					tplEleDataAftEval = tplEleData;
				if(evalFlag && tplEleDataAftEval!=undefined && tplEleDataAftEval!=null)
				{
					json.name=App_Deals.customFieldsList.collection.models[i].get("field_label");
					json.position=App_Deals.customFieldsList.collection.models[i].get("position");
					json.value=tplEleDataAftEval;
					json.field_type=App_Deals.customFieldsList.collection.models[i].get("field_type");
					allCustomFields.push(json);
					
					formulaFields.push(json);
				}
			}
			else
			{
				json.name=App_Deals.customFieldsList.collection.models[i].get("field_label");
				json.position=App_Deals.customFieldsList.collection.models[i].get("position");
				json.field_type=App_Deals.customFieldsList.collection.models[i].get("field_type");
				allCustomFields.push(json);
			}
		}
	}
	
	if(fields.length>0)
	{
		if(allCustomFields.length>0)
		{
			for(var i=0;i<allCustomFields.length;i++)
			{
				if(allCustomFields[i].field_type=="FORMULA")
				{
					finalFields.push(allCustomFields[i]);
				}
				else if(allCustomFields[i].field_type=="DATE")
				{
					for(var j=0;j<fields.length;j++)
					{
						if(allCustomFields[i].name==fields[j].name)
						{
							fields[j].is_date = true;
							if(!fields[j].value)
								return '';
							/*if(fields[j].index && (CURRENT_USER_PREFS.dateFormat.indexOf("dd/mm/yy") != -1 || CURRENT_USER_PREFS.dateFormat.indexOf("dd.mm.yy") != -1))
								fields[j].value = convertDateFromUKtoUS(fields[j].value);
							var dateString = new Date(fields[j].value);
							if(dateString == "Invalid Date")
								fields[j].value = getDateInFormatFromEpoc(fields[j].value);
							else
								fields[j].value = en.dateFormatter({raw: getGlobalizeFormat()})(dateString);*/

							finalFields.push(fields[j]);
							break;
						}
					}
				}
				else
				{
					for(var j=0;j<fields.length;j++)
					{
						if(allCustomFields[i].name==fields[j].name)
						{
							if(allCustomFields[i].field_type == "CONTACT"){
								fields[j].custom_field_type = "CONTACT";
							}else if(allCustomFields[i].field_type == "COMPANY"){
								fields[j].custom_field_type = "COMPANY";
							}
							finalFields.push(fields[j]);
							break;
						}
					}
				}
			}
		}
		else
		{
			for(var k=0;k<fields.length;k++)
			{
				finalFields.push(fields[k]);	
			}
		}
		
	}
	else
	{
		for(var k=0;k<formulaFields.length;k++)
		{
			finalFields.push(formulaFields[k]);	
		}
	}
	for(var x=0;x<fields.length;x++){
 		if($.inArray(fields[x], finalFields) == -1)
 			finalFields.push(fields[x]);	
 	}
	
	return finalFields;
}

/**
 * Returns list of custom properties. used to fill custom data in fields in
 * continue lead
 * 
 * @param items
 * @returns
 */
function getLeadCustomProperties(items)
{
	if (items == undefined)
		return items;

	var fields = [];
	var fieldName='';
	var datajson={};
	for (var i = 0; i < items.length; i++)
	{
		if (items[i].type == "CUSTOM" && items[i].name != "image")
		{
			if(fieldName=='')
				fieldName=items[i].name;
			fields.push(items[i]);
			datajson[''+items[i].name]=items[i].value;
		}
	}
	
	//Added for formula type custom field
	var type='';
	if(App_Leads.customFieldsList!=undefined && App_Leads.customFieldsList!=null){
		for(var i=0;i<App_Leads.customFieldsList.collection.models.length;i++){
			if(App_Leads.customFieldsList.collection.models[i].get("field_label")==fieldName){
				type = App_Leads.customFieldsList.collection.models[i].get("scope");
				break;
			}
		}
	}
	
	var formulaFields=[];
	var allCustomFields=[];
	var finalFields=[];
	
	if(App_Leads.customFieldsList!=undefined && App_Leads.customFieldsList!=null){
		if(type=='')
			type='LEAD';
		for(var i=0;i<App_Leads.customFieldsList.collection.models.length;i++){
			var json={};
			if(App_Leads.customFieldsList.collection.models[i].get("scope")==type && App_Leads.customFieldsList.collection.models[i].get("field_type")=="FORMULA"){
				var tplEleData = Mustache.render(App_Leads.customFieldsList.collection.models[i].get("field_data"),datajson);
				var evalFlag = true;
				var tplEleDataAftEval;
				try{
					tplEleDataAftEval = eval(tplEleData)
				}catch(err){
					console.log(err.message);
					evalFlag = false;
				}
				if(!evalFlag)
					tplEleDataAftEval = tplEleData;
				if(evalFlag && tplEleDataAftEval!=undefined && tplEleDataAftEval!=null){
					json.name=App_Leads.customFieldsList.collection.models[i].get("field_label");
					json.type="CUSTOM";
					json.position=App_Leads.customFieldsList.collection.models[i].get("position");
					json.value=tplEleDataAftEval;
					json.field_type=App_Leads.customFieldsList.collection.models[i].get("field_type");
					allCustomFields.push(json);
					
					formulaFields.push(json);
				}
			}else if(App_Leads.customFieldsList.collection.models[i].get("scope")==type){
				json.name=App_Leads.customFieldsList.collection.models[i].get("field_label");
				json.type="CUSTOM";
				json.position=App_Leads.customFieldsList.collection.models[i].get("position");
				json.field_type=App_Leads.customFieldsList.collection.models[i].get("field_type");
				allCustomFields.push(json);
			}
		}
	}
	if(fields.length>0){
		if(allCustomFields.length>0){
			for(var i=0;i<allCustomFields.length;i++){
				var isFieldExist = false;
				if(allCustomFields[i].field_type=="FORMULA"){
					if($.inArray(allCustomFields[i], finalFields)==-1)
						finalFields.push(allCustomFields[i]);
				}else{
					for(var j=0;j<fields.length;j++){
						if(allCustomFields[i].name==fields[j].name){
							if($.inArray(fields[j], finalFields)==-1){
								for(var m=0;m<allCustomFields.length;m++){
									if(fields[j].name == allCustomFields[m].name && (allCustomFields[m].field_type == "CONTACT" || allCustomFields[m].field_type == "COMPANY")){
										fields[j].custom_field_type = allCustomFields[m].field_type
									}
								}
								finalFields.push(fields[j]);
							}	
							isFieldExist = true;
							break;
						}
						if(!isFieldExist){
							if($.inArray(fields[j], finalFields)==-1)
							{
								for(var m=0;m<allCustomFields.length;m++){
									if(fields[j].name == allCustomFields[m].name && (allCustomFields[m].field_type == "CONTACT" || allCustomFields[m].field_type == "COMPANY")){
										fields[j].custom_field_type = allCustomFields[m].field_type
									}
								}
								finalFields.push(fields[j]);
							}
								
						}
					}
				}
			}
		}else{
			for(var k=0;k<fields.length;k++){
				if($.inArray(fields[k], finalFields)==-1)
					finalFields.push(fields[k]);	
			}
		}
		
	}else{
		for(var k=0;k<formulaFields.length;k++){
			if($.inArray(formulaFields[k], finalFields)==-1)
				finalFields.push(formulaFields[k]);	
		}
	}
	
	var finalCustomFields = [];
 	for(var x = 0;x<finalFields.length ;x++){
 		if(finalFields[x].name != 'first_name' && finalFields[x].name != 'last_name')
 			finalCustomFields.push(finalFields[x]);
 	}

	return finalCustomFields;
}

function updateLeadCustomData(el)
{
	$(".custom-data", App_Leads.leadDetailView.el).html(el)
}

/*
 * To enable leads for some domains
 *
 */
 function isAccessToLeads()
 {
 	var domainNamesJSON = {"phanidesk" : true, "subrahmanyam" : true, "jilukara" : true};
 	if(CURRENT_DOMAIN_USER && domainNamesJSON[CURRENT_DOMAIN_USER.domain])
 	{
 		return true;
 	}

 	return false;
 }
function isDuplicateContactProperty(properties,key)
{
	if (App_Contacts.contactDetailView && App_Contacts.contactDetailView.model && Current_Route.indexOf("contact/") == 0)
		{
			var contact_properties = App_Contacts.contactDetailView.model.get('properties');
			var currentContactEntity = getPropertyValue(contact_properties, key);
			var contactEntity = getPropertyValue(properties, key);

			if (!currentContactEntity || !contactEntity)
			{
				currentContactEntity = getPropertyValue(contact_properties, "first_name") + " ";
				if(getPropertyValue(contact_properties, "last_name"))
					currentContactEntity=currentContactEntity+getPropertyValue(contact_properties, "last_name");
				contactEntity = getPropertyValue(properties, "first_name") + " " + getPropertyValue(properties, "last_name");
			}
			
			if(App_Contacts.contactDetailView.model.get('type') == 'COMPANY')
			{
				currentContactEntity = getPropertyValue(contact_properties, "name") ;
				contactEntity = getPropertyValue(properties, "name");
			}

			if (currentContactEntity.toLowerCase() == contactEntity.toLowerCase())
				return true;

			return false;
		}
		if (App_Companies.companyDetailView && App_Companies.companyDetailView.model && Current_Route.indexOf("company/") == 0)
		{
			var contact_properties = App_Companies.companyDetailView.model.get('properties');
			var currentContactEntity = getPropertyValue(contact_properties, key);
			var contactEntity = getPropertyValue(properties, key);

			if (!currentContactEntity || !contactEntity)
			{
				currentContactEntity = getPropertyValue(contact_properties, "first_name") + " " + getPropertyValue(contact_properties, "last_name");
				contactEntity = getPropertyValue(properties, "first_name") + " " + getPropertyValue(properties, "last_name");
			}
			
			if(App_Companies.companyDetailView.model.get('type') == 'COMPANY')
			{
				currentContactEntity = getPropertyValue(contact_properties, "name") ;
				contactEntity = getPropertyValue(properties, "name");
			}

			if (currentContactEntity && contactEntity && currentContactEntity.toLowerCase() == contactEntity.toLowerCase())
				return true;

			return false;
		}
	}	