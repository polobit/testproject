package com.agilecrm;

public class Globals
{

    public static String[] URLS = { "agilecrm.com", "helptor.com", "-dot-sandbox-dot-agile-crm-cloud.appspot.com" };
    public static String SUB_VERSION_URL = "-dot-agile-crm-cloud.appspot.com";

    public static String GOOGLE_APPS_DOMAIN = "googleapps";

    public static String[] LOGIN_DOMAINS = { "my", "localhost", "127.0.0.1" };

    public static String REDIRECT_URL = "/redirect";
    public static String LOGIN = "/login";
    public static String CHOOSE_DOMAIN = "https://my.agilecrm.com/choose-domain";

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
    public static final String GOOGLE_SECRET_KEY = "qExl7mLlRlE_fjnw0YkxAeW5";// "21kj3QAnEAkCJs6fmrcDghAI";

    // GMAIL
    public static final String GOOGLE_CALENDAR_CLIENT_ID = GOOGLE_CLIENT_ID;// "391091478365.apps.googleusercontent.com";
    public static final String GOOGLE_CALENDAR_SECRET_KEY = GOOGLE_SECRET_KEY;// "21kj3QAnEAkCJs6fmrcDghAI";

    // LINKED IN
    public static final String LINKED_IN_API_KEY = "kuft8xqzrnfi";// "zh4a4mmt5o9i";
    public static final String LINKED_IN_SECRET_KEY = "BPN9L6QQvWwum7kn";// "ZbgecRN4QI4HhAz4";

    // TWITTER
    public static final String TWITTER_API_KEY = "BuHxUT4CouZKfLiX9bqDDw";
    public static final String TWITTER_SECRET_KEY = "LJn5yqFu2hdzVgOpNJE7emKEOm4n6GZzdySFPq7A";

    // FRESHBOOKS
    public static final String FRESHBOOKS_API_KEY = "55b352b9e2c08f778c50c0de6f26f1ab";
    public static final String FRESHBOOKS_SECRET_KEY = "3gVEvFmv9eMCv6jMuBa4pyGmqey7iiHBzL";

    // Payment gateways
    public static final String STRIPE = "Stripe";
    public static final String PAYPAL = "Paypal";

    // Stripe live keys
    public static final String STRIPE_API_KEY = "sk_live_kV3JFirLAOXsEUcYYO3YsCJ5";
    public static final String STRIPE_CLIENT_ID = "ca_33Ms3QZgGsn0nqkvilqNUFYU9BcDyNVC";

    // development keys
    // public static final String STRIPE_API_KEY =
    // "sk_test_qxs4FCoEJ3o5aED4d1rIWiCE";
    // public static final String STRIPE_CLIENT_ID =
    // "ca_33Msd2IrjZ2f4JPH4c2GanFe9uGqnhPX";

    // Max Plan Users
    public static final int TRIAL_USERS_COUNT = 2;

    // Cheat Code
    public static final String MASTER_CODE_INTO_SYSTEM = "agilerocks";

    public static final String BULK_ACTION_BACKENDS_URL = "b1-sandbox";

    public static final String BULK_BACKENDS = "bulk";
    public static final String NORMAL_BACKENDS = "normal";

    // PUBNUB Credentials
    public static final String PUBNUB_PUBLISH_KEY = "pub-c-e4c8fdc2-40b1-443d-8bb0-2a9c8facd274";
    public static final String PUBNUB_SUBSCRIBE_KEY = "sub-c-118f8482-92c3-11e2-9b69-12313f022c90";

    // MANDRILL MAIL API
    public static final String MANDRIL_API_KEY_VALUE = "iQ_811cc9NxpLG11Ue4ftA";
    public static final String MANDRILL_TEST_API_KEY_VALUE = "MRiwkducZGEbXrLW1LC5oQ";

    // Mailgun API key
    public static final String MAILGUN_API_KEY_VALUE = "key-6rj8jh4d-ftsq2er2oqneoa7zi3e2-j3";

    // Appengine request time limit
    public static final long REQUEST_LIMIT_MILLIS = 1000 * 25;

    // Campaign and Email pull queues
    public static final String CAMPAIGN_PULL_QUEUE = "campaign-pull-queue";
    public static final String EMAIL_PULL_QUEUE = "email-pull-queue";
}