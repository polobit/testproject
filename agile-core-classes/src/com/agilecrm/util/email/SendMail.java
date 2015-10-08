package com.agilecrm.util.email;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONObject;

import com.agilecrm.util.JSONUtil;
import com.google.appengine.api.NamespaceManager;
import com.thirdparty.mandrill.Mandrill;

/**
 * <code>SendMail</code> is the base class to send email using different
 * templates from AgileCRM. For each template, name of template and template
 * subject is provided. Mustache.java is used to fill template with json values.
 * <p>
 * SendMail uses ObjectMapper to convert object to JSONObject. All html
 * templates has _html extension whereas for body templates _body extension.
 * SendGridEmail is used to send email.
 * </p>
 * 
 * @author Manohar
 * 
 */
public class SendMail
{

    /**
     * Template name followed by Email Subject of that template. E.g. For file
     * new_user_invited_html.html, template name is new_user_invited.
     */
    public static final String NEW_USER_INVITED = "new_user_invited";
    public static final String NEW_USER_INVITED_SUBJECT = "New User Invitation";

    public static final String USER_ENABLED_NOTIFICATION = "user_enabled";
    public static final String USER_ENABLED_SUBJECT = "User Enabled Notification";

    public static final String USER_DISABLED_NOTIFICATION = "user_disabled";
    public static final String USER_DISABLED_SUBJECT = "User Disabled Notification";

    public static final String FORGOT_PASSWORD = "forgot_password";
    public static final String FORGOT_PASSWORD_SUBJECT = "Your new Agile CRM password";

    public static final String SUBSCRIPTION_PAYMENT_FAILED = "subscription/payment_failed";
    public static final String SUBSCRIPTION_PAYMENT_FAILED_SUBJECT = "Your payment failed";

    public static final String SUBSCRIPTION_DELETED = "subscription/subscription_deleted";
    public static final String SUBSCRIPTION_DELETED_SUBJECT = "Your Account Deleted";

    public static final String REPORTS = "reports";
    public static final String REPORTS_SUBJECT = "Agile CRM Report";

    public static final String WELCOME = "welcome";
    public static final String WELCOME_SUBJECT = "Welcome to Agile CRM";

    public static final String VERIFICATION_EMAIL = "verification_email";
    public static final String VERIFICATION_EMAIL_SUBJECT = "Verify your Agile CRM Account";

    public static final String ACCOUNT_CANCELLED_BY_USER = "account_cancelled_by_user";
    public static final String ACCOUNT_CANCELLED_BY_USER_SUBJECT = "Agile CRM Account Cancelled";

    public static final String EMAIL_SUBSCRIPTION_CANCELLED_BY_USER = "subscription/add-on/email/email_cancelled_by_user";
    public static final String EMAIL_SUBSCRIPTION_CANCELLED_BY_USER_SUBJECT = "Agile CRM Email Package Cancelled";

    public static final String AGENT_ADDED = "agent_added";
    public static final String AGENT_ADDED_SUBJECT = "You have been added to Agile CRM";

    public static final String FIRST_PAYMENT_RECEIVED = "subscription/payments/success/first_payment_received";
    public static final String FIRST_PAYMENT_RECEIVED_SUBJECT = "Payment Received. Thank you";

    public static final String PAYMENT_RECEIVED = "subscription/payments/success/payment_received";
    public static final String PAYMENT_RECEIVED_SUBJECT = "Payment Received. Thank you.";

    public static final String EMAIL_PAYMENT_RECEIVED = "subscription/add-on/email/payment_received";
    public static final String EMAIL_PAYMENT_RECEIVED_SUBJECT = "Payment Received. Thank you.";

    public static final String PLAN_CHANGED = "subscription/plan_changed";
    public static final String PLAN_CHANGED_SUBJECT = "Your Agile CRM plan has changed";

    public static final String EMAIL_PLAN_CHANGED = "subscription/add-on/email/plan_changed";
    public static final String EMAIL_PLAN_CHANGED_SUBJECT = "Your Agile CRM plan has changed";

    public static final String FAILED_BILLINGS_FIRST_TIME = "subscription/payments/failed/failed_billings_first_time";
    public static final String FAILED_BILLINGS_FIRST_TIME_SUBJECT = "[Notice #1] Your Payment to Agile CRM has Declined";

    public static final String FAILED_BILLINGS_SECOND_TIME = "subscription/payments/failed/failed_billings_second_time";
    public static final String FAILED_BILLINGS_SECOND_TIME_SUBJECT = "[Notice #2] Your Payment to Agile CRM has Declined Again.";

    public static final String FAILED_BILLINGS_THIRD_TIME = "subscription/payments/failed/failed_billings_third_time";
    public static final String FAILED_BILLINGS_THIRD_TIME_SUBJECT = "[Final Notice] Your Payment to AgileCRM has Declined Yet Again";

    public static final String FAILED_BILLINGS_FINAL_TIME = "subscription/payments/failed/failed_billings_final_time";
    public static final String FAILED_BILLINGS_FINAL_TIME_SUBJECT = "[Cancelled] Your Payment to Agile CRM has Declined Yet Again";

    public static final String REFUND = "subscription/payments/refund/refund";
    public static final String REFUND_SUBJECT = "[Refund] Your Refund has been Processed";

    public static final String CHARGEBACK_NOTICE = "subscription/chargeback_notice";
    public static final String CHARGEBACK_NOTICE_SUBJECT = "[Payment dispute] Agile CRM chargeback resolution steps";

    public static final String DUE_TASK_REMINDER = "due_task_reminder";
    public static final String DUE_TASK_REMINDER_SUBJECT = "Your Due Tasks.";

    public static final String START_EVENT_REMINDER = "start_event_reminder";

    public static final String PASSWORD_CHANGE_NOTIFICATION = "password_change_notification";
    public static final String PASSWORD_CHANGE_NOTIFICATION_SUBJECT = "Your Password has been changed.";

    public static final String CSV_IMPORT_NOTIFICATION = "csv_reports";
    public static final String CSV_IMPORT_NOTIFICATION_SUBJECT = "CSV Import report";

    public static final String EXPORT_CONTACTS_CSV = "export_contacts_csv";
    public static final String EXPORT_CONTACTS_CSV_SUBJECT = "Agile CRM Contacts CSV";
    public static final String EXPORT_DEALS_CSV = "export_csv";
    public static final String EXPORT_DEALS_CSV_SUBJECT = "Agile CRM Deals CSV";

    public static final String UNSUBSCRIBE_CONFIRMATION = "unsubscribe_confirmation";
    public static final String UNSUBSCRIBE_CONFIRMATION_SUBJECT = "Unsubscribe";

    public static final String STRIPE_IMPORT_NOTIFICATION = "contact_sync_notification_template";
    public static final String STRIPE_IMPORT_NOTIFICATION_SUBJECT = "Stripe Import Report";
    
    public static final String FROM_VERIFICATION_EMAIL = "from_verification_email";
    public static final String FROM_VERIFICATION_EMAIL_SUBJECT = "Verify your Email";

    //Ticket template names
    public static final String TICKET_REPLY = "ticket_reply_email";
    
    /**
     * From Name of email.
     */
    public static final String AGILE_FROM_NAME = "Agile CRM";

    /**
     * From Email-id of email.
     */
    public static final String AGILE_FROM_EMAIL = "noreply@agilecrm.com";

    /**
     * Templates path where template files exist.
     */
    public static final String TEMPLATES_PATH = "misc/email/";

    /**
     * Html body template extension.
     */
    public static final String TEMPLATE_HTML_EXT = "_html.html";

    /**
     * Text(or Body) template extension.
     */
    public static final String TEMPLATE_BODY_EXT = "_body.html";

    @SuppressWarnings("unused")
    private static Object String;

    /**
     * Sends email by replacing template with Object values. Uses SendGridEmail
     * to send email.
     * 
     * @param to
     *            Recipient email id.
     * @param subject
     *            Email Subject-template subject.
     * @param template
     *            Name of template.
     * @param object
     *            Respective object with the template.
     * @param from
     *            From email.
     * @param fromName
     *            From name.
     * @param args
     *            - Variable args to send email attachment
     */
    @SuppressWarnings("unused")
    public static void sendMail(String to, String subject, String template, Object object, String from,
	    String fromName, String... args)
    {
	try
	{
	    System.out.println("Sending email " + template + " " + object);

	    // Serialize, Use ObjectMapper
	    String objectJson = null;
	    String emailString = null;

	    try
	    {
		ObjectMapper mapper = new ObjectMapper();
		objectJson = mapper.writeValueAsString(object);
		System.out.println(objectJson);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
		return;
	    }

	    // Add email properties
	    JSONObject email = new JSONObject();
	    email.put("email_to", to);
	    email.put("email_subject", subject);
	    email.put("email_from", from);
	    email.put("email_from_name", fromName);

	    JSONObject[] jsonObjectArray;

	    // If object to mail template is array then data of array can be
	    // accessed with "class name" key in template
	    if (object instanceof Object[])
	    {
		JSONObject content = new JSONObject();
		for (Object eachObject : (Object[]) object)
		{
		    String className = eachObject.getClass().getSimpleName();
		    content.put(className, new JSONObject(new ObjectMapper().writeValueAsString(eachObject)));
		}

		jsonObjectArray = new JSONObject[] { email, content };
	    }
	    else
	    {
		jsonObjectArray = new JSONObject[] { email, new JSONObject(objectJson) };
	    }

	    // Merge JSONObjects as a single JSONObject in order to get all
	    // values in a single object
	    JSONObject mergedJSON = JSONUtil.mergeJSONs(jsonObjectArray);

	    System.out.println("mergedJson in sendemail" + mergedJSON);

	    // Read template - HTML
	    String emailHTML = MustacheUtil.templatize(template + TEMPLATE_HTML_EXT, mergedJSON);

	    // Read template - Body
	    String emailBody = MustacheUtil.templatize(template + TEMPLATE_BODY_EXT, mergedJSON);

	    // If both are null, nothing to be sent
	    if (emailHTML == null && emailBody == null)
	    {
		System.err.println("Email could not be sent as no matching templates were found " + template);
		return;
	    }

	    // Setting empty namespace to send without any subaccount
	    String oldNamespace = NamespaceManager.get();
	    NamespaceManager.set("");

	    // Send Email
	    Mandrill.sendMail(false, from, fromName, to, null, null, subject, from, emailHTML, emailBody, null, null,
		    null, args);

	    NamespaceManager.set(oldNamespace);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in SendMail..." + e.getMessage());
	}
    }

    /**
     * Appends parameters - From email-id and From name to sendMail method.
     * 
     * @param to
     *            Recipient email id.
     * 
     * @param subject
     *            Email Subject-template subject.
     * @param template
     *            Name of template.
     * @param object
     *            Respective object with the template.
     * @param args
     *            - Variable args to send email attachment.
     */
    public static void sendMail(String to, String subject, String template, Object object)
    {
	sendMail(to, subject, template, object, AGILE_FROM_EMAIL, AGILE_FROM_NAME);
    }
}