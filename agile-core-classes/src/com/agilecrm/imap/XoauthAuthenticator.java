package com.agilecrm.imap;

import java.security.Provider;
import java.security.Security;
import java.util.Properties;

import javax.mail.Session;
import javax.mail.URLName;

import net.oauth.OAuthConsumer;

import com.sun.mail.imap.IMAPSSLStore;
import com.sun.mail.smtp.SMTPTransport;

public class XoauthAuthenticator
{
    public static OAuthConsumer getAnonymousConsumer()
    {
	return new OAuthConsumer(null, "anonymous", "anonymous", null);
    }

    public static void initialize()
    {
	Security.addProvider(new XoauthProvider());
    }

    public static IMAPSSLStore connectToImap(String host, int port, String userEmail, String oauthToken, String oauthTokenSecret, OAuthConsumer consumer,
	    boolean debug) throws Exception
    {
	Properties props = new Properties();
	props.put("mail.imaps.sasl.enable", "true");
	props.put("mail.imaps.sasl.mechanisms", "XOAUTH");
	props.put("mail.imaps.sasl.mechanisms.xoauth.oauthToken", oauthToken);
	props.put("mail.imaps.sasl.mechanisms.xoauth.oauthTokenSecret", oauthTokenSecret);
	props.put("mail.imaps.sasl.mechanisms.xoauth.consumerKey", consumer.consumerKey);
	props.put("mail.imaps.sasl.mechanisms.xoauth.consumerSecret", consumer.consumerSecret);
	Session session = Session.getInstance(props);
	session.setDebug(debug);

	URLName unusedUrlName = null;
	IMAPSSLStore store = new IMAPSSLStore(session, unusedUrlName);
	String emptyPassword = "";
	store.connect(host, port, userEmail, "");
	return store;
    }

    public static SMTPTransport connectToSmtp(String host, int port, String userEmail, String oauthToken, String oauthTokenSecret, OAuthConsumer consumer,
	    boolean debug) throws Exception
    {
	Properties props = new Properties();
	props.put("mail.smtp.ehlo", "true");
	props.put("mail.smtp.auth", "false");
	props.put("mail.smtp.starttls.enable", "true");
	props.put("mail.smtp.starttls.required", "true");
	props.put("mail.smtp.sasl.enable", "false");
	Session session = Session.getInstance(props);
	session.setDebug(debug);

	URLName unusedUrlName = null;
	SMTPTransport transport = new SMTPTransport(session, unusedUrlName);

	String emptyPassword = null;
	transport.connect(host, port, userEmail, emptyPassword);

	XoauthSaslResponseBuilder builder = new XoauthSaslResponseBuilder();
	byte[] saslResponse = builder.buildResponse(userEmail, XoauthProtocol.SMTP, oauthToken, oauthTokenSecret, consumer);
	saslResponse = BASE64EncoderStream.encode(saslResponse);
	transport.issueCommand("AUTH XOAUTH " + new String(saslResponse), 235);
	return transport;
    }

    public static void main(String[] args) throws Exception
    {
	if (args.length != 3)
	{
	    System.err.println("Usage: XoauthAuthenticator <email> <oauthToken> <oauthTokenSecret>");
	    return;
	}
	String email = args[0];
	String oauthToken = args[1];
	String oauthTokenSecret = args[2];

	initialize();

	IMAPSSLStore imapSslStore = connectToImap("imap.googlemail.com", 993, email, oauthToken, oauthTokenSecret, getAnonymousConsumer(), true);
	System.out.println("Successfully authenticated to IMAP.\n");
	SMTPTransport smtpTransport = connectToSmtp("smtp.googlemail.com", 587, email, oauthToken, oauthTokenSecret, getAnonymousConsumer(), true);
	System.out.println("Successfully authenticated to SMTP.");
    }

    public static final class XoauthProvider extends Provider
    {
	public XoauthProvider()
	{
	    super("Google Xoauth Provider", 1.0D, "Provides the Xoauth experimental SASL Mechanism");
	    put("SaslClientFactory.XOAUTH", "com.agilecrm.email.xoauth.XoauthSaslClientFactory");
	}
    }
}