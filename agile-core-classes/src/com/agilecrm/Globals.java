package com.agilecrm;

public class Globals
{
    public static String[] URLS = { "agilecrm.com", "helptor.com", "-dot-sandbox-dot-agile-crm-cloud.appspot.com",
	    "-dot-sandbox-dot-agilecrmbeta.appspot.com", "-dot-addon-dot-agilecrmbeta.appspot.com",
	    "-dot-mcsandbox-dot-agile-crm-cloud.appspot.com", "-dot-sandbox-dot-agilesanbox.appspot.com",
	    "agilesanbox.com", "-dot-newui-dot-agilecrmbeta.appspot.com", "-dot-async-dot-agilecrmbeta.appspot.com" };

    public static String SUB_VERSION_URL = "-dot-agile-crm-cloud.appspot.com";

    public static String GOOGLE_APPS_DOMAIN = "googleapps";

    public static String[] LOGIN_DOMAINS = { "my", "localhost", "127.0.0.1" };

    public static String REDIRECT_URL = "/redirect";
    public static String LOGIN = "/login";
    public static String CHOOSE_DOMAIN = "https://my.agilecrm.com/register";

    // Push data into stats
    public static String PUSH_STATS = "https://stats.agilecrm.com:90/push";

    // We store Namespace for GoogleApps in session
    public static final String GOOGLE_APP_SESSION_ID = "gapps_namespace";

    // API user name
    // public static final String SENDGRID_API_USER_NAME = "shelley";
    // public static final String SENDGRID_API_USER_NAME = "naveen123";
    public static final String SENDGRID_API_USER_NAME = "agilecrm";

    // API key
    // public static final String SENDGRID_API_KEY = "mantra800pbx";
    // public static final String SENDGRID_API_KEY = "mantra123";
    public static final String SENDGRID_API_KEY = "send@agile1";

    // For clickdeskengage domain
    public static final String CLICKDESK_SENDGRID_API_USER_NAME = "venkat";

    // For clickdeskengage domain
    public static final String CLICKDESK_SENDGRID_API_KEY = "mantra123";

    // Clickdesk domain to which emails are sent through SendGrid
    public static final String CLICKDESK_ENGAGE_DOMAIN = "clickdeskengage";

    // GMAIL
    public static final String GMAIL_API_KEY = "anonymous";
    public static final String GMAIL_SECRET_KEY = "anonymous";

    // GMAIL
    public static final String GOOGLE_CLIENT_ID = "661717543880-elcdgrfs73tl9mbimhmkiqcgic7lqu3i.apps.googleusercontent.com";
    public static final String GOOGLE_SECRET_KEY = "qExl7mLlRlE_fjnw0YkxAeW5";
    // "21kj3QAnEAkCJs6fmrcDghAI";

    // GMAIL
    public static final String GOOGLE_CALENDAR_CLIENT_ID = GOOGLE_CLIENT_ID;// "391091478365.apps.googleusercontent.com";
    public static final String GOOGLE_CALENDAR_SECRET_KEY = GOOGLE_SECRET_KEY;// "21kj3QAnEAkCJs6fmrcDghAI";

    // LINKED IN
    public static final String LINKED_IN_API_KEY = "kuft8xqzrnfi";// "zh4a4mmt5o9i";
    public static final String LINKED_IN_SECRET_KEY = "BPN9L6QQvWwum7kn";// "ZbgecRN4QI4HhAz4";

    // TWITTER
    public static final String TWITTER_API_KEY = "DwCqQYK5oRCHBIAHc2c2CMVzO";
    public static final String TWITTER_SECRET_KEY = "aC9YD03BzTftvDXhEfGJTwAEtil7n5qP62ma0IoTdNjO9dbbn6";

    // FRESHBOOKS
    public static final String FRESHBOOKS_API_KEY = "55b352b9e2c08f778c50c0de6f26f1ab";
    public static final String FRESHBOOKS_SECRET_KEY = "3gVEvFmv9eMCv6jMuBa4pyGmqey7iiHBzL";

    // Payment gateways
    public static final String STRIPE = "Stripe";    

    // development keys
    // public static final String DEV_STRIPE_API_KEY =
    // "sk_test_qxs4FCoEJ3o5aED4d1rIWiCE";

    // Stripe live keys
    // public static final String STRIPE_API_KEY =
    // "sk_live_kV3JFirLAOXsEUcYYO3YsCJ5";
    // public static final String STRIPE_CLIENT_ID =
    // "ca_33Ms3QZgGsn0nqkvilqNUFYU9BcDyNVC";
    // Stripe live keys
    // public static final String STRIPE_LIVE_API_KEY =
    // "sk_live_kV3JFirLAOXsEUcYYO3YsCJ5";
    // public static final String STRIPE_LIVE_CLIENT_ID =
    // "ca_33Ms3QZgGsn0nqkvilqNUFYU9BcDyNVC";

    public static final String STRIPE_LIVE_API_KEY = "sk_test_qxs4FCoEJ3o5aED4d1rIWiCE";
    public static final String STRIPE_TEST_API_KEY = "sk_test_qxs4FCoEJ3o5aED4d1rIWiCE";
    public static final String STRIPE_LIVE_CLIENT_ID = "ca_33Ms3QZgGsn0nqkvilqNUFYU9BcDyNVC";

    // development keys
    public static final String DEV_STRIPE_API_KEY = STRIPE_LIVE_API_KEY;
    public static final String DEV_STRIPE_CLIENT_ID = STRIPE_LIVE_CLIENT_ID;

    // Stripe live keys
    public static final String STRIPE_API_KEY = STRIPE_LIVE_API_KEY;
    public static final String STRIPE_CLIENT_ID = STRIPE_LIVE_CLIENT_ID;

    // Xero live keys
    public static final String XERO_API_KEY = "DLVO983KIWJ7AOZDYGVLNSC5VORU1F";
    public static final String XERO_CLIENT_ID = "EGL5WPETBTSYYQ6E8QI4JSZSOW3DZW";
    // develop key
    // public static final String QUICKBOOKS_APP_KEY =
    // "f0fca6d6b0541b470bb9711b713000493994";
    // public static final String QUICKBOOKS_CONSUMER_KEY =
    // "qyprdnkO01AkcMJjNmabqS1PBDsmFp";
    // public static final String QUICKBOOKS_CONSUMER_SECRET =
    // "CmBH6OWTlDmemY3uHOBIjFE87MZ6O8FRcsLqtYZF";
    // production key
    // public static final String QUICKBOOKS_APP_KEY =
    // "08945c87bae1fb46bab9241ba0e81dc19bbf";
    // public static final String QUICKBOOKS_CONSUMER_KEY =
    // "qyprdCLvyUgaMn6K9lrd3eyPDn1DuL";
    // public static final String QUICKBOOKS_CONSUMER_SECRET =
    // "o7hOCLRSBidVE9gkGQPBaFy0IIcyvtHuXPpL8kmw";
    /**
     * public static final String QUICKBOOKS_APP_KEY =
     * "08945c87bae1fb46bab9241ba0e81dc19bbf"; public static final String
     * QUICKBOOKS_CONSUMER_KEY = "qyprdCLvyUgaMn6K9lrd3eyPDn1DuL"; public static
     * final String QUICKBOOKS_CONSUMER_SECRET =
     * "o7hOCLRSBidVE9gkGQPBaFy0IIcyvtHuXPpL8kmw";
     */
    // "8f73de20b0e45b476ab9b8abd3e659c2aa74";
    // public static final String QUICKBOOKS_CONSUMER_KEY =
    // "qyprdGhvaKh6kMZEKXIKffUmQIwMuK";
    // public static final String QUICKBOOKS_CONSUMER_SECRET =
    // "CSLHb8B5vIlcgLN3N1LcOe5tt5iagel1QZNk9Kye";
    // production key
    
    //original sync activated
    public static final String QUICKBOOKS_APP_KEY = "a572c32cb35f8b404cbbadbb224fbd6d0fc6";
    public static final String QUICKBOOKS_CONSUMER_KEY = "qyprdiBIgnIhxVdzKKdnWohGfPmrOD";
    public static final String QUICKBOOKS_CONSUMER_SECRET = "sHeU8i12GIHe6YpgdgFpNfLV0jIiZhe0iG4A9cgS";


    //New Testing Keys for widget Issue (AgileCRM Widget APP keys)
    public static final String QUICKBOOKS_WIDGET_APP_KEY = "1639cdaab6418b4af9bb9eab600468969077";
    public static final String QUICKBOOKS_WIDGET_CONSUMER_KEY = "qyprdXoSXv87x0xWWzSPPA5fOFkmDU";
    public static final String QUICKBOOKS_WIDGET_CONSUMER_SECRET = "eX0eco8KJuGStfCBKf0R59bxxEHmMAtPwUxoxA3m";
    
    
    /** test facebook app details */
    // public static final String FACEBOOK_APP_ID = "1472962409608031";
    // public static final String FACEBOOK_APP_SECRET =
    // "f9d7abe14b5610ab861d373036521abc";
    /** facebook app details */
    public static final String FACEBOOK_APP_ID = "1472694689634803";
    public static final String FACEBOOK_APP_SECRET = "4b2d379cbb6c33a0bdab9a89dc2bb2c5";

    // Max Plan Users
    public static final int TRIAL_USERS_COUNT = 2;

    // Cheat Code
    public static final String MASTER_CODE_INTO_SYSTEM = "AgileRocks#@!";

    public static final String BULK_ACTION_BACKENDS_URL = "agile-normal-bulk";

    public static final String BULK_BACKENDS = "agile-campaigns-bulk";
    public static final String NORMAL_BACKENDS = "agile-campaigns-normal";

    // PUBNUB Credentials
    public static final String PUBNUB_PUBLISH_KEY = "pub-c-e4c8fdc2-40b1-443d-8bb0-2a9c8facd274";
    public static final String PUBNUB_SUBSCRIBE_KEY = "sub-c-118f8482-92c3-11e2-9b69-12313f022c90";

    // MANDRILL MAIL API
    public static final String MANDRIL_API_KEY_VALUE = "iQ_811cc9NxpLG11Ue4ftA";
    public static final String MANDRILL_TEST_API_KEY_VALUE = "MRiwkducZGEbXrLW1LC5oQ";

    // Mandrill API Key for FREE
    public static final String MANDRILL_API_KEY_VALUE_2 = "RSn1Y3FmVLr59WKZqlKDGQ";

    public static final String MANDRILL_PAID_POOL = "paid-pool";

    // Mailgun API key
    public static final String MAILGUN_API_KEY_VALUE = "key-6rj8jh4d-ftsq2er2oqneoa7zi3e2-j3";

    // Appengine request time limit
    public static final long REQUEST_LIMIT_MILLIS = 1000 * 25;

    // Campaign and Email pull queues
    public static final String CAMPAIGN_PULL_QUEUE = "campaign-pull-queue";
    public static final String EMAIL_PULL_QUEUE = "email-pull-queue";
    public static final String SMS_PULL_QUEUE = "sms-pull-queue";
    // shopify app credential
    // public static final String SHOPIFY_API_KEY =
    // "70a2391cd9e9af0d666657a67885d9ec";
    // public static final String SHOPIFY_SECRET_KEY =
    // "a1f88bc91e5c70c34c215bf224ebd7d3";
    /** The Constant SHOPIFY_API_KEY. */
    public static final String SHOPIFY_API_KEY = "66198cc5eb16795088bfc0a3f8d2c011";

    /** The Constant SHOPIFY_SECRET_KEY. */
    public static final String SHOPIFY_SECRET_KEY = "68e7c78529457be317dde3807b67de0b";
    // shopify app php app credential
    // public static final String SHOPIFY_API_KEY =
    // "70a2391cd9e9af0d666657a67885d9ec";
    // public static final String SHOPIFY_SECRET_KEY =
    // "a1f88bc91e5c70c34c215bf224ebd7d3";

    public static final String COMPANY_DOMAIN = "our";

    public static final String TAG_VALIDATION_REGEX = "^[A-Za-z][A-Za-z0-9_ :-]*$";
    
    public static final String PAYPAL = "Paypal";
    // Live Keys Paypal.
	public static final String PAYPAL_CLIENT_ID = "Abxw5tgxf1RAaZuDTUUTeTkHUJ5HnVKIQ0aJ_kx6UOhGKOkbbgg2ziXOlQU4L9uineV7hb-DC38Gy3lW";
	public static final String PAYPAL_SECRET_ID = "ENOWlqN3kIwW7VRDdB8yKGL64vP_rL4zjBnengt3uYcidReug2fqfi67PkRmVV-86S7qWBR9Ry4ywzJu";
    // Sandbox Keys Paypal.
	//	public static final String PAYPAL_CLIENT_ID = "AdinLitMf9_3K9nwxTQEs5KyBom16l6EuR4FHy8vefth7Lup57d07e80Rz1tbt6gABT-l9jgEykvOVhr";
	//	public static final String PAYPAL_SECRET_ID = "EGyp6P-kmdaDsoNUK2F2nYs5-RifRg3nhPJkmzai-TRqpRmTpj3lm4NG6pw_B08IJSdpv5pfGfWQF1Bb";
	public static final String GRAVATAR_SECURE_DEFAULT_IMAGE_URL = "https://clickdesk.agilecrm.com/flatfull/images/flatfull/user-default.jpg";
}
