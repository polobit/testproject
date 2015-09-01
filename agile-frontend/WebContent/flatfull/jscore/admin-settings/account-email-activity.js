/**
 * Fetches account prefs and render the template.
 * 
 * @param $account_activity -
 *            settings-account-activity template
 */
function load_admin_account_prefs($account_activity)
{
	var view = new Base_Model_View({ url : '/core/api/account-prefs', template : "admin-settings-account-prefs" });

	$account_activity.find('#admin-account-prefs').html(view.render().el);

}

/**
 * Fetches mandrill subaccount info and render them email activity template.
 * 
 * @param $account_activity -
 *            settings-account-activity template
 */
function load_account_email_activity($account_activity)
{
	// Email Activity
	var emailActivityModelView = new Base_Model_View({ url : 'core/api/emails/email-activity', template : 'admin-settings-email-activity', });

	$account_activity.find('#account-email-activity').html(emailActivityModelView.render().el);

}
