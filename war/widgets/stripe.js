/**
 * ===stripe.js==== It is a pluginIn to be integrated with CRM, developed based
 * on the third party JavaScript API provided. It interacts with the application
 * based on the function provided on agile_widgets.js (Third party API). 
 */
$(function ()
{
    // Plugin name as a global variable
    Stripe_PLUGIN_NAME = "Stripe";

    // Stripe profile loading image declared as global
    STRIPE_PROFILE_LOAD_IMAGE = '<center><img id="stripe_profile_load" ' +
        'src=\"img/1-0.gif\" style="margin-bottom: 10px;margin-right: 16px;" >' +
        '</img></center>';

    // Retrieves the plugin object saved with Stripe plugin name
    var plugin = agile_crm_get_plugin(Stripe_PLUGIN_NAME);

    // Gets plugin id from plugin object
    var plugin_id = plugin.id;

    // Gets plugin Preferences to check whether to show setup button or to
    // fetch details
    var plugin_prefs = plugin.prefs;

    // If not found - considering first time usage of widget, setupStripeOAuth
    // method is called 
    if (plugin_prefs == undefined)
    {
        setupStripeOAuth(plugin_id);
        return;
    }

    // Retrieves the customer id of stripe saved to contact
    var customer_id = agile_crm_get_contact_property("Stripe Customer Id");
    console.log("customer id " + customer_id);

    // If customer id is undefined, message is shown
    if (!customer_id)
    {
        $('#Stripe').html("<div style='padding: 0px 5px 7px 5px;line-height:160%;'>" +
            "No stripe customer id is related to this contact</div>");
        return;
    }

    // If defined, shows the details of the customer in Stripe panel
    showStripeProfile(plugin_id, customer_id);

});

/**
 * Shows setup if user adds Stripe widget for the first time. Uses ScribeServlet 
 * to create a client and get preferences and save it to the widget.
 * 
 * @param plugin_id
 * 			To get the widget and save tokens in it.
 */
function setupStripeOAuth(plugin_id)
{
    // Shows loading until the set up is shown
    $('#Stripe').html(STRIPE_PROFILE_LOAD_IMAGE);

    // URL to return, after authenticating from Stripe
    var callbackURL = window.location.href;

    /*
     * Creates a URL, which on click can connect to scribe using parameters sent
     * and returns back to the profile based on return URL provided and saves widget  
     * preferences in widget based on plugin id
     */
    var url = '/scribe?service=stripe&return_url=' + encodeURIComponent(callbackURL) +
        '&plugin_id=' + encodeURIComponent(plugin_id);

    $('#Stripe').html('<div style="padding: 0px 5px 7px 5px;line-height: 160%;" >' +
        'Stripe enables individuals and businesses to accept payments over the ' +
        'internet.<p style="margin: 10px 0px 5px 0px;"><a href=' + url + '>' +
        '<img src="/img/plugins/stripe-connect-button.png" style="width: 190px;' +
        'height: 33px;"></a></p></div>');
}

/**
 * Shows stripe profile based on customer Id and Plugin Id
 * 
 * @param plugin_id
 * 			plugin_id to get tokens saved to connect with Stripe
 * @param customer_id
 * 			Stripe customer id based on which details are retrieved
 */
function showStripeProfile(plugin_id, customer_id)
{
    //Shows loading until the profile is retrieved
    $('#Stripe').html(STRIPE_PROFILE_LOAD_IMAGE);

    // Sends request to url "/core/api/widgets/stripe/" with plugin id and customer id 
    // as path parameters which calls WidgetsAPI class 
    $.get("/core/api/widgets/stripe/" + plugin_id + "/" + customer_id,

    function (data)
    {
        //populates the template with and shows in the widget panel
        $('#Stripe').html(getTemplate("stripe-profile", JSON.parse(data)));

        // if error occurs
    }).error(function (data)
    {
        // Shows error message in the stripe panel
        $('#Stripe').html('<div style="padding: 0px 5px 7px 5px;line-height:160%;' +
            'word-wrap: break-word;" >' + data.responseText + '</div>');
    });
}