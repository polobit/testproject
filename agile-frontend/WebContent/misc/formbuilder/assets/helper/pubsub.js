define([
		'jquery', 'underscore', 'backbone'
], function($, _, Backbone)
{
	return _.extend({}, Backbone.Events)
});

var getAgileFields = function(fields, callback)
{
	var url = window.location.protocol + '//' + window.location.host + '/core/api/custom-fields/scope?scope=CONTACT';

	$.ajax({ type : 'GET', url : url, asynch : true, dataType : 'json', success : function(data)
	{
		fields = data;
		callback(fields);
	} });
};

var getAgileApi = function(api, callback)
{
	var url = window.location.protocol + '//' + window.location.host + '/core/api/api-key';

	$.ajax({ type : 'GET', url : url, asynch : true, dataType : 'json', success : function(data)
	{
		api = data;
		callback(api);
	} });
};

var addAgileApi = function(json, api, callback)
{
	json = JSON.parse(json);
	var agileapi = {};
	agileapi.label = "Agile API";
	agileapi.type = "input";
	agileapi.value = api.js_api_key;

	var agiledomain = {};
	agiledomain.label = "Agile Domain";
	agiledomain.type = "input";
	agiledomain.value = window.location.hostname.split('.')[0];

	var agileredirecturl = {};
	agileredirecturl.label = "Form Action / Redirect URL";
	agileredirecturl.type = "input";
	agileredirecturl.value = "#";

	var agilepreloadfields = {};
	agilepreloadfields.label = "Preload Fields";
	agilepreloadfields.type = "select";
	agilepreloadfields.value = [{value : false, selected : true, label : "no"}, {value : true, selected : false, label: "yes"}];
   // adding the tag for the TO SEND EMAIL Notification 
	var formemailnotification = {};
	formemailnotification.label = "Email Notification";
	formemailnotification.type = "select";
	formemailnotification.value = [{value : false, selected : true, label : "false"}, {value : true, selected : false, label: "true"}];

	var agileformidtag = {};
	agileformidtag.label = "Form Tags";
	agileformidtag.type = "input";
	agileformidtag.value = "";

	var agiletransparentbackground = {};
	agiletransparentbackground.label = "Transparent Background";
	agiletransparentbackground.type = "select";
	agiletransparentbackground.value = [{value : "", selected : true, label : "no"}, {value : " agile-form-transparent", selected : false, label: "yes"}];

	var agiletheme = {};
	agiletheme.label = "";
	agiletheme.type = "select";
	agiletheme.value = [{value : "", selected : false, label : "default"}, {value : " theme1", selected : false, label: "Theme1"},
	{value : " theme2", selected : false, label: "Theme2"},{value : " theme3", selected : false, label: "Theme3"},{value : " theme4", selected : false, label: "Theme4"},,{value : " theme5", selected : true, label: "Theme5"}];

	for ( var b = 0; b < json.length; b++)
	{
		json[b].fields["agileapi"] = agileapi;
		json[b].fields["agiledomain"] = agiledomain;
		json[b].fields["agileredirecturl"] = agileredirecturl;
		json[b].fields["agilepreloadfields"] = agilepreloadfields;
		json[b].fields["agileformidtag"] = agileformidtag;
		json[b].fields["formemailnotification"] = formemailnotification;
		json[b].fields["agiletransparentbackground"] = agiletransparentbackground;
		json[b].fields["agiletheme"] = agiletheme;
	}
	callback(json);
};

var addAgileFields = function(json, fields, callback)
{
	for ( var s = 0; s < json.length; s++)
	{
		json[s] = JSON.parse(json[s]);
	}
	var agilefield = {};
	agilefield.label = "Agile Field";
	agilefield.type = "select";
	var values = [
			{ value : null, label : "Select", selected : true }, { value : "first_name", label : "First Name", selected : false },
			{ value : "last_name", label : "Last Name", selected : false }, { value : "email", label : "Email", selected : false },
			{ value : "company", label : "Company", selected : false }, { value : "title", label : "Title", selected : false },
			{ value : "website", label : "Website", selected : false }, { value : "phone", label : "Phone", selected : false },
			{ value : "city", label : "City", selected : false }, { value : "state", label : "State", selected : false },
			{ value : "country", label : "Country", selected : false }, { value : "zip", label : "Zip", selected : false },
			{ value : "address", label : "Address", selected : false }, { value : "tags", label : "Tags", selected : false },
			{ value : "note", label : "Note", selected : false }
	];
	for ( var j = 0; j < fields.length; j++)
	{
		var value = {};
		value.value = fields[j].field_label;
		value.label = fields[j].field_label;
		value.selected = false;
		values.push(value);
	}
	agilefield.value = values;
	for ( var k = 0; k < json.length; k++)
	{
		for ( var i = 0; i < json[k].length; i++)
		{
			json[k][i].fields["agilefield"] = agilefield;
		}
	}
	callback(json);
};

var saveform = [];