/* Copyright 2012 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.agilecrm.imap;

import java.security.Provider;
import java.security.Security;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

import javax.mail.Session;
import javax.mail.URLName;

import com.google.appengine.api.NamespaceManager;
import com.sun.mail.auth.OAuth2SaslClientFactory;
import com.sun.mail.imap.IMAPStore;
import com.sun.mail.smtp.SMTPTransport;

/**
 * Performs OAuth2 authentication.
 * 
 * <p>
 * Before using this class, you must call {@code initialize} to install the
 * OAuth2 SASL provider.
 */
public class OAuth2Authenticator
{
    private static final Logger logger = Logger.getLogger(OAuth2Authenticator.class.getName());

    public static final class OAuth2Provider extends Provider
    {
	private static final long serialVersionUID = 1L;

	public OAuth2Provider()
	{
	    super("Google OAuth2 Provider", 1.0, "Provides the XOAUTH2 SASL Mechanism");
	    put("SaslClientFactory.XOAUTH2", "com.sun.mail.auth.OAuth2SaslClientFactory");
	}
    }

    /**
     * Installs the OAuth2 SASL provider. This must be called exactly once
     * before calling other methods on this class.
     */
    static
    {
	Security.addProvider(new OAuth2Provider());
    }

    /**
     * Connects and authenticates to an IMAP server with OAuth2. You must have
     * called {@code initialize}.
     * 
     * @param host
     *            Hostname of the imap server, for example
     *            {@code imap.googlemail.com}.
     * @param port
     *            Port of the imap server, for example 993.
     * @param userEmail
     *            Email address of the user to authenticate, for example
     *            {@code oauth@gmail.com}.
     * @param oauthToken
     *            The user's OAuth token.
     * @param debug
     *            Whether to enable debug logging on the IMAP connection.
     * 
     * @return An authenticated IMAPStore that can be used for IMAP operations.
     */

    public static Map<String, IMAPStoreWrapper> cacheMap = new ConcurrentHashMap<String, IMAPStoreWrapper>();

    public static IMAPStore connectToImap(String host, int port, String userEmail, String oauthToken, boolean debug)
	    throws Exception
    {
	Properties props = new Properties();
	props.put("mail.imaps.sasl.enable", "true");
	props.put("mail.imap.auth.plain.disable", "true");
	props.put("mail.imaps.sasl.mechanisms", "XOAUTH2");
	props.put("mail.imaps.sasl.mechanisms.oauth2.oauthToken", oauthToken);
	// System.out.println("the token:" + oauthToken);
	Session session = Session.getInstance(props);
	String domain = NamespaceManager.get();
	String connection_key = domain + userEmail;

	IMAPStoreWrapper store = cacheMap.get(connection_key);
	IMAPStore store1 = null;

	// If exists in cachemap
	if (store != null)
	{
	    store1 = store.getStore();

	    // storeWrapper.setLastUsedTime(System.currentTimeMillis());

	    if (store1 != null)
	    {
		if (store1.isConnected())
		{
		    System.out.println("Returning store from map cache INBOX...");
		    return store1;
		}
		else
		{
		    store1.connect();

		    if (store1.isConnected())
			return store1;
		    else
			store1.close();
		}
	    }
	}

	store1 = (IMAPStore) session.getStore("imaps");
	store1.connect(host, userEmail, oauthToken);
	// cacheMap.put(connection_key, store);
	addStoreToCacheMap(connection_key, store1);

	// CacheUtil.setCache(connection_key, store);

	System.out.println("connected");
	System.out.println("CacheMap size is " + cacheMap.size());
	//
	return store1;
    }

    public static void addStoreToCacheMap(String key, IMAPStore store)
    {
	IMAPStoreWrapper storeWrapper = new IMAPStoreWrapper();
	storeWrapper.setStore(store);
	storeWrapper.setLastUsedTime(System.currentTimeMillis());
	cacheMap.put(key, storeWrapper);
	// CacheUtil.setCache(key, store);
	System.out.println("the connection key in addStore method INBOX" + key);
    }

    /**
     * Connects and authenticates to an SMTP server with OAuth2. You must have
     * called {@code initialize}.
     * 
     * @param host
     *            Hostname of the smtp server, for example
     *            {@code smtp.googlemail.com}.
     * @param port
     *            Port of the smtp server, for example 587.
     * @param userEmail
     *            Email address of the user to authenticate, for example
     *            {@code oauth@gmail.com}.
     * @param oauthToken
     *            The user's OAuth token.
     * @param debug
     *            Whether to enable debug logging on the connection.
     * 
     * @return An authenticated SMTPTransport that can be used for SMTP
     *         operations.
     */
    public static SMTPTransport connectToSmtp(String host, int port, String userEmail, String oauthToken, boolean debug)
	    throws Exception
    {
	Properties props = new Properties();
	props.put("mail.smtp.starttls.enable", "true");
	props.put("mail.smtp.starttls.required", "true");
	props.put("mail.smtp.sasl.enable", "true");
	props.put("mail.smtp.sasl.mechanisms", "XOAUTH2");
	props.put("mail.imaps.sasl.mechanisms.oauth2.oauthToken", oauthToken);
	Session session = Session.getInstance(props);
	// session.setDebug(debug);

	final URLName unusedUrlName = null;
	SMTPTransport transport = new SMTPTransport(session, unusedUrlName);
	// If the password is non-null, SMTP tries to do AUTH LOGIN.
	final String emptyPassword = " ";
	transport.connect(host, port, userEmail, oauthToken);

	return transport;
    }

    /**
     * Authenticates to IMAP with parameters passed in on the commandline.
     */
    public static void main(String args[]) throws Exception
    {

	IMAPStore imapStore = connectToImap("imap.gmail.com", 993, "yaswanth@agilecrm.com",
		"ya29.1.AADtN_Uf-GR-Q_pRyYCarZd92RBUBWON-aIX9uhl5m57ANmpkInv1ZIG2E9JoO8a4wy4nQ", true);
	System.out.println("Successfully authenticated to IMAP.\n");

    }
}