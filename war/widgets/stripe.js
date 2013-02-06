$(function() {

	// Plugin name as a global variable
	Stripe_PLUGIN_NAME = "Stripe";
	Stripe_PLUGIN_HEADER = '<div></div>'

	
	var plugin = agile_crm_get_plugin(Stripe_PLUGIN_NAME);
	// Gets plugin id from plugin object, fetched using script API
	var plugin_id = plugin.id;

	// Gets Plugin Prefs, required to check whether to show setup button or to
	// fetch details
	var plugin_prefs = plugin.prefs;
	
	// If not found - considering first time usage of widget, setupStripeOAuth
	// called
	if (plugin_prefs == undefined) {
		setupStripeOAuth(plugin_id);
		return;
	}
	
	var customer_id = agile_crm_get_contact_property("stripe_customer_id");
	
	console.log("customer id "+ customer_id);
	
	if(!customer_id)
		$('#Stripe').html('No customer id related to this contact');
	
	showStripeProfile(plugin_id, customer_id);
	
	
});

function setupStripeOAuth(plugin_id) {	
	
	 var url = '/scribe?service=stripe&return_url=' + encodeURIComponent(window.location.href) + '&plugin_id=' + encodeURIComponent(plugin_id);

	 $('#Stripe').html('<p>Stripe enables individuals and businesses to accept payments over the internet </p><a href="' + url + '" style="margin-bottom: 10px;"><img src="/img/plugins/stripe-connect-button.png" width="190" height="33"></a>');	
		
	
}

function showStripeProfile(plugin_id,customer_id){
	
	
	
	$.get("/core/api/widgets/stripe/" + plugin_id + "/" +  customer_id, function(data){
		
		console.log("Stripe user data : "+ data);
		$('#Stripe').html(getTemplate("stripe-profile", JSON.parse(data)));
	});
}