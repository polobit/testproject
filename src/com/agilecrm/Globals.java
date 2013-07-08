package com.agilecrm;

public class Globals
{

    public static String[] URLS = { "agilecrm.com", "helptor.com" };

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
    public static final String SENDGRID_API_USER_NAME = "naveen123";

    // API key
    // public static final String SENDGRID_API_KEY = "mantra800pbx";
    public static final String SENDGRID_API_KEY = "mantra123";

    // GMAIL
    public static final String GMAIL_API_KEY = "anonymous";
    public static final String GMAIL_SECRET_KEY = "anonymous";

    // LINKED IN
    public static final String LINKED_IN_API_KEY = "kuft8xqzrnfi";
    public static final String LINKED_IN_SECRET_KEY = "BPN9L6QQvWwum7kn";

    // TWITTER
    public static final String TWITTER_API_KEY = "BuHxUT4CouZKfLiX9bqDDw";
    public static final String TWITTER_SECRET_KEY = "LJn5yqFu2hdzVgOpNJE7emKEOm4n6GZzdySFPq7A";

    // FRESHBOOKS
    public static final String FRESHBOOKS_API_KEY = "55b352b9e2c08f778c50c0de6f26f1ab";
    public static final String FRESHBOOKS_SECRET_KEY = "3gVEvFmv9eMCv6jMuBa4pyGmqey7iiHBzL";

    // Payment gateways
    public static final String STRIPE = "Stripe";
    public static final String PAYPAL = "Paypal";

    // Stripe
    public static final String STRIPE_API_KEY = "sk_28JToWfgk6F4wJ9o21W6e6qaNXqe5";
    public static final String STRIPE_CLIENT_ID = "ca_1EEFJHQS129OoDorXXdlqVYwyCq8RyPA";

    // Stripe events
    public static final String STRIPE_INVOICE_PAYMENT_FAILED = "invoice.payment_failed";
    public static final String STRIPE_SUBSCRIPTION_DELETED = "customer.subscription.deleted";
    public static final String STRIPE_CUSTOMER_DELETED = "customer.deleted";
    public static final String STRIPE_INVOICE_PAYMENT_SUCCEEDED = "invoice.payment_succeeded";
    public static final String STRIPE_CUSTOMER_SUBSCRIPTION_UPDATED = "customer.subscription.updated";
    public static final String STRIPE_CHARGE_REFUNDED = "charge.refunded";

    // Max Plan Users
    public static final int TRIAL_USERS_COUNT = 2;

    // Cheat Code
    public static final String MASTER_CODE_INTO_SYSTEM = "agilerocks";

    public static final String BULK_ACTION_BACKENDS_URL = "b1";

}
