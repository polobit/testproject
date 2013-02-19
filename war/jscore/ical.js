/**
 * ical.js is a script file that runs when user clicks on subscribe iCal feed.
 * It fetches apikey and domain name of current user. It appends apikey and
 * domain name to url.
 * 
 * author: Naresh
 */
$("#subscribe-ical").live('click', function(event) {
	event.preventDefault();

	var api_key_model = Backbone.Model.extend({
		url : 'core/api/api-key'
	});

	var model = new api_key_model();
	var data = model.fetch({
		success : function(data) {
			var api_key = data.get('api_key');
			setUrlDomain(api_key);
		}
	});
});

/**
 * 
 * Gets domain of current user using Backbone.
 * 
 * @method setUrlDomain
 * @param apiKey -
 *            apiKey of current user.
 */
function setUrlDomain(apiKey) {
	var domain_user = Backbone.Model.extend({
		url : 'core/api/current-user'
	});

	var domain_user = new domain_user();
	domain_user.fetch({
		success : function(data) {
			var domain = data.get('domain');
			setUrl(apiKey, domain);
		}
	});
}

/**
 * 
 * Sets url with domain and apiKey
 * 
 * @method setUrl
 * @param apiKey -
 *            apiKey of current user.
 * 
 * @param domain -
 *            domain of current user.
 */
function setUrl(apiKey, domain) {
	var url = "webcal://" + domain + ".agilecrm.com/backend/ical/" + apiKey;
	$('#ical-feed').attr('href', url);
	$('#ical-feed').text(url);
	console.log(url);
}
