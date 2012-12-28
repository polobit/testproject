package com.agilecrm.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.StringReader;
import java.math.BigInteger;
import java.net.URL;
import java.net.URLConnection;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;
import java.util.Vector;

import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import au.com.bytecode.opencsv.CSVReader;

import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.thirdparty.SendGridEmail;

public class Util
{

    public static Set<String> getSearchTokens(Set<String> strings)
    {
	StringBuilder sb = new StringBuilder();
	for (String s : strings)
	    sb.append(s + " ");

	String input = sb.toString();

	// Set<String> tokens = tokenize(input);
	return StringUtils2.breakdownFragments(input);
    }

    // URL
    public static String accessURL(String url)
    {
	try
	{
	    URL yahoo = new URL(url);
	    URLConnection conn = yahoo.openConnection();
	    conn.setConnectTimeout(60000);
	    conn.setReadTimeout(60000);

	    BufferedReader reader = new BufferedReader(new InputStreamReader(
		    conn.getInputStream()));

	    String output = "";
	    String inputLine;
	    while ((inputLine = reader.readLine()) != null)
	    {
		output += inputLine;
	    }
	    reader.close();
	    return output;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println(e.getMessage());
	}
	return null;
    }

    // URL
    public static String accessURLUsingPost(String postURL, String data)
	    throws Exception
    {
	// Send data
	URL url = new URL(postURL);
	URLConnection conn = url.openConnection();
	conn.setDoOutput(true);
	OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
	wr.write(data);
	wr.flush();

	// Get the response
	BufferedReader reader = new BufferedReader(new InputStreamReader(
		conn.getInputStream()));
	String output = "";
	String inputLine;
	while ((inputLine = reader.readLine()) != null)
	{
	    output += inputLine;
	}

	wr.close();
	reader.close();

	return output;

    }

    // HashMap() of Error and Array
    public static Hashtable convertCSVToJSONArray2(String csv,
	    String duplicateFieldName) throws Exception
    {

	CSVReader reader = new CSVReader(new StringReader(csv.trim()));

	// Get Header Liner
	String[] headers = reader.readNext();
	if (headers == null)
	{
	    System.out.println("Empty List");
	    new Exception("Empty List");
	}

	// CSV Json Array
	JSONArray csvJSONArray = new JSONArray();

	// HashTable of keys to check duplicates - we will store all keys into
	// this hashtable and if there are any - we will exclude them
	Vector<String> keys = new Vector();
	Vector<String> duplicates = new Vector();

	String[] csvValues;
	while ((csvValues = reader.readNext()) != null)
	{
	    JSONObject csvJSONObject = new JSONObject();

	    boolean isDuplicate = false;
	    for (int j = 0; j < csvValues.length; j++)
	    {
		// Check if the header is same as duplicate name
		if (duplicateFieldName != null
			&& headers[j].equalsIgnoreCase(duplicateFieldName))
		{
		    System.out.println("If already present " + headers[j] + " "
			    + csvValues[j]);

		    // Check if is already present in already imported items
		    if (keys.contains(csvValues[j]))
		    {
			duplicates.add(csvValues[j]);
			isDuplicate = true;
			break;
		    }

		    keys.add(csvValues[j]);
		}

		csvJSONObject.put(headers[j], csvValues[j]);
	    }

	    if (!isDuplicate)
		csvJSONArray.put(csvJSONObject);
	}

	Hashtable resultHashtable = new Hashtable();
	resultHashtable.put("result", csvJSONArray);

	// Put warning
	if (duplicateFieldName != null && duplicates.size() > 0)
	{
	    resultHashtable.put("warning",
		    "Duplicate Values (" + duplicates.size()
			    + ") were not imported " + duplicates);
	}

	System.out.println("Converted csv " + csv + " to " + resultHashtable);
	return resultHashtable;

    }

    // Get Calendar in Pacific
    public static String getCalendarString(long timeout)
    {
	// define output format and print
	SimpleDateFormat sdf = new SimpleDateFormat("d MMM yyyy hh:mm aaa");
	TimeZone pst = TimeZone.getTimeZone("PST");

	sdf.setTimeZone(pst);
	Calendar calendar = Calendar.getInstance();
	calendar.setTimeInMillis(timeout);

	String date = sdf.format(calendar.getTime());
	return date;
    }

    // Change Number
    public static String changeNumber(String number)
    {

	// Add if it does not start with 1 or +
	if (number.startsWith("+"))
	    return number;

	if (number.startsWith("1"))
	    return "+" + number;

	return "+1" + number;
    }

    private static final String KEY = "some-secret-key-of-your-choice";

    public static String encrypt(final String text)
    {
	byte[] encrypted = Base64.encodeBase64(xor(text.getBytes()));
	return new String(encrypted);
    }

    public static String decrypt(final String hash) throws DecoderException
    {
	try
	{
	    return new String(xor(Base64.decodeBase64(hash.getBytes())),
		    "UTF-8");
	}
	catch (java.io.UnsupportedEncodingException ex)
	{
	    throw new IllegalStateException(ex);
	}
    }

    private static byte[] xor(final byte[] input)
    {
	final byte[] output = new byte[input.length];
	final byte[] secret = KEY.getBytes();
	int spos = 0;
	for (int pos = 0; pos < input.length; pos += 1)
	{
	    output[pos] = (byte) (input[pos] ^ secret[spos]);
	    spos += 1;
	    if (spos >= secret.length)
	    {
		spos = 0;
	    }
	}
	return output;
    }

    // Read Resource from File (war)
    public static String readResource(String path)
    {
	try
	{
	    // System.out.println(path);
	    File f = new File(path);
	    if (!f.exists())
	    {
		System.out.println("File does not exist");
		return null;
	    }

	    InputStream is = new FileInputStream(f);

	    return IOUtils.toString(is, "UTF-8");
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Send Email

    public static String sendMail(String fromEmail, String fromName, String to,
	    String subject, String replyTo, String html, String text)
    {
	return SendGridEmail.sendMail(fromEmail, fromName, to, subject,
		replyTo, html, text, null, null);

    }

    // Set Cache
    public static void setCache(String key, Object value)
    {

	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	syncCache.put(key, value);

	NamespaceManager.set(oldNamespace);
    }

    // Add Cache
    public static Object getCache(String key)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	Object value = syncCache.get(key);

	NamespaceManager.set(oldNamespace);

	return value;
    }

    // Delete Cache
    public static void deleteCache(String key)
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	MemcacheService syncCache = MemcacheServiceFactory.getMemcacheService();
	if (syncCache.contains(key))
	    syncCache.delete(key);

	NamespaceManager.set(oldNamespace);
    }

    // Get OAuth Domain Name
    public static String getOauthURL(String provider)
    {
	Map<String, String> openIdProviders = new HashMap<String, String>();
	openIdProviders.put("google", "www.google.com/accounts/o8/id");
	openIdProviders.put("yahoo", "yahoo.com");
	openIdProviders.put("myspace", "myspace.com");
	openIdProviders.put("aol", "aol.com");
	openIdProviders.put("myopenid.com", "stats.agilecrm.com");

	return openIdProviders.get(provider.toLowerCase());
    }

    // Hash function MD5 for password
    public static String getMD5HashedPassword(String password)
    {
	String hashedPassword = null;

	if (password == null)
	    return null;
	try
	{

	    // Create MessageDigest object for MD5
	    MessageDigest digest = MessageDigest.getInstance("MD5");

	    // Update input string in message digest
	    digest.update(password.getBytes(), 0, password.length());

	    // Converts message digest value in base 16
	    hashedPassword = new BigInteger(1, digest.digest()).toString(16);

	}
	catch (NoSuchAlgorithmException e)
	{

	    e.printStackTrace();
	}
	return hashedPassword;
    }
}