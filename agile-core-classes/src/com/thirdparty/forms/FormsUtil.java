package com.thirdparty.forms;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.ContactField.FieldType;
import com.agilecrm.contact.util.TagUtil;
import com.agilecrm.contact.Note;

/**
 * <code>FormsUtil</code><br>
 * <p>
 * This class contains <b>Utility methods</b> required by <b>Form Webhook
 * Servlets</b>
 * </p>
 *
 * @author agile
 * @version 1.0
 * @since 2013-12-31
 */
public class FormsUtil
{
    /**
     * Get <b>Agile Field Names</b> from <b>Form Field Titles</b>
     * 
     * @param fieldName
     *            form field name as provided by form vendor
     * @return fieldName || agileFieldName
     */
    public static String getFieldName(String fieldName)
    {
	// String arrays with all possible form field titles from (Wufoo /
	// Unbounce / Gravity)
	String firstNameAlias[] = { Contact.FIRST_NAME, "Name", "First", "name", "first", "firstname", "first name" };
	String lastNameAlias[] = { Contact.LAST_NAME, "Last", "last", "lastname", "last name" };
	String companyNameAlias[] = { Contact.COMPANY, "organisation", "organization" };
	String contactTitleAlias[] = { Contact.TITLE, "designation" };
	String emailAlias[] = { Contact.EMAIL, "email id", "mail", "mail id", "email address" };
	String mainPhoneAlias[] = { Contact.PHONE, "phone_number", "phone number" };
	String workPhoneAlias[] = { "work phone" };
	String mobilePhoneAlias[] = { "mobile", "mobile phone" };
	String websiteAlias[] = { Contact.URL, Contact.WEBSITE };
	String skypeIdAlias[] = { "skype", "skype id" };
	String twitterAlias[] = { "twitter" };
	String googlePlusAlias[] = { "google+" };
	String linkedinAlias[] = { "linkedin" };
	String facebookAlias[] = { "facebook" };
	String xingAlias[] = { "xing" };
	String flickrAlias[] = { "flickr" };
	String githubAlias[] = { "github" };
	String youtubeAlias[] = { "youtube" };
	String feedAlias[] = { "feed" };
	String addressAlias[] = { "Street Address", "Location", "Street", "street", "address", "location",
	        "street address", "address1" };
	String addressLineAlias[] = { "Address Line 2", "address2" };
	String addressCityAlias[] = { "City", "province", "city" };
	String addressCountryAlias[] = { "Country", "country", "country_code" };
	String addressStateAlias[] = { "State / Province / Region", "State", "stateprovince", "state", "province_code" };
	String addressZipAlias[] = { "Zip", "Zip code", "Postal code", "Postal / Zip Code", "zip", "postal code",
	        "zip code", "pin code", "pin" };

	// Maps with key as agile contact property label, value as list of
	// aliases for
	// that property with sub type
	HashMap<String, List<String>> firstName = new HashMap<String, List<String>>();
	firstName.put(Contact.FIRST_NAME, Arrays.asList(firstNameAlias));

	HashMap<String, List<String>> lastName = new HashMap<String, List<String>>();
	lastName.put(Contact.LAST_NAME, Arrays.asList(lastNameAlias));

	HashMap<String, List<String>> companyName = new HashMap<String, List<String>>();
	companyName.put(Contact.COMPANY, Arrays.asList(companyNameAlias));

	HashMap<String, List<String>> contactTitle = new HashMap<String, List<String>>();
	contactTitle.put(Contact.TITLE, Arrays.asList(contactTitleAlias));

	HashMap<String, List<String>> email = new HashMap<String, List<String>>();
	email.put(Contact.EMAIL, Arrays.asList(emailAlias));

	HashMap<String, List<String>> mainPhone = new HashMap<String, List<String>>();
	mainPhone.put(Contact.PHONE + " main", Arrays.asList(mainPhoneAlias));

	HashMap<String, List<String>> workPhone = new HashMap<String, List<String>>();
	workPhone.put(Contact.PHONE + " work", Arrays.asList(workPhoneAlias));

	HashMap<String, List<String>> mobilePhone = new HashMap<String, List<String>>();
	mobilePhone.put(Contact.PHONE + " mobile", Arrays.asList(mobilePhoneAlias));

	HashMap<String, List<String>> website = new HashMap<String, List<String>>();
	website.put(Contact.WEBSITE + " URL", Arrays.asList(websiteAlias));

	HashMap<String, List<String>> skypeId = new HashMap<String, List<String>>();
	skypeId.put(Contact.WEBSITE + " SKYPE", Arrays.asList(skypeIdAlias));

	HashMap<String, List<String>> twitter = new HashMap<String, List<String>>();
	twitter.put(Contact.WEBSITE + " TWITTER", Arrays.asList(twitterAlias));

	HashMap<String, List<String>> googlePlus = new HashMap<String, List<String>>();
	googlePlus.put(Contact.WEBSITE + " GOOGLE-PLUS", Arrays.asList(googlePlusAlias));

	HashMap<String, List<String>> linkedin = new HashMap<String, List<String>>();
	linkedin.put(Contact.WEBSITE + " LINKEDIN", Arrays.asList(linkedinAlias));

	HashMap<String, List<String>> facebook = new HashMap<String, List<String>>();
	facebook.put(Contact.WEBSITE + " FACEBOOK", Arrays.asList(facebookAlias));

	HashMap<String, List<String>> xing = new HashMap<String, List<String>>();
	xing.put(Contact.WEBSITE + " XING", Arrays.asList(xingAlias));

	HashMap<String, List<String>> flickr = new HashMap<String, List<String>>();
	flickr.put(Contact.WEBSITE + " FLICKR", Arrays.asList(flickrAlias));

	HashMap<String, List<String>> github = new HashMap<String, List<String>>();
	github.put(Contact.WEBSITE + " GITHUB", Arrays.asList(githubAlias));

	HashMap<String, List<String>> youtube = new HashMap<String, List<String>>();
	youtube.put(Contact.WEBSITE + " YOUTUBE", Arrays.asList(youtubeAlias));

	HashMap<String, List<String>> feed = new HashMap<String, List<String>>();
	feed.put(Contact.WEBSITE + " FEED", Arrays.asList(feedAlias));

	HashMap<String, List<String>> address = new HashMap<String, List<String>>();
	address.put(Contact.ADDRESS + " lineone", Arrays.asList(addressAlias));

	HashMap<String, List<String>> addressLine = new HashMap<String, List<String>>();
	addressLine.put(Contact.ADDRESS + " linetwo", Arrays.asList(addressLineAlias));

	HashMap<String, List<String>> addressCity = new HashMap<String, List<String>>();
	addressCity.put(Contact.ADDRESS + " city", Arrays.asList(addressCityAlias));

	HashMap<String, List<String>> addressState = new HashMap<String, List<String>>();
	addressState.put(Contact.ADDRESS + " state", Arrays.asList(addressStateAlias));

	HashMap<String, List<String>> addressCountry = new HashMap<String, List<String>>();
	addressCountry.put(Contact.ADDRESS + " country", Arrays.asList(addressCountryAlias));

	HashMap<String, List<String>> addressZip = new HashMap<String, List<String>>();
	addressZip.put(Contact.ADDRESS + " zip", Arrays.asList(addressZipAlias));

	// List of all maps (map with key: agile property name, value: list of
	// all aliases for that property)
	ArrayList<HashMap<String, List<String>>> allFields = new ArrayList<HashMap<String, List<String>>>();
	allFields.add(firstName);
	allFields.add(lastName);
	allFields.add(companyName);
	allFields.add(contactTitle);
	allFields.add(email);
	allFields.add(mainPhone);
	allFields.add(workPhone);
	allFields.add(mobilePhone);
	allFields.add(website);
	allFields.add(skypeId);
	allFields.add(twitter);
	allFields.add(googlePlus);
	allFields.add(linkedin);
	allFields.add(facebook);
	allFields.add(xing);
	allFields.add(flickr);
	allFields.add(github);
	allFields.add(youtube);
	allFields.add(feed);
	allFields.add(address);
	allFields.add(addressLine);
	allFields.add(addressCity);
	allFields.add(addressCountry);
	allFields.add(addressState);
	allFields.add(addressZip);

	// Iterate list of maps
	for (HashMap<String, List<String>> map : allFields)
	{
	    for (Map.Entry<String, List<String>> entry : map.entrySet())
	    {
		// If fieldName matches with list of aliases return key of that
		// list in map
		if (entry.getValue().contains(fieldName) || entry.getValue().contains(fieldName.toLowerCase()))
		    return entry.getKey();
	    }
	}
	// Else return fieldName
	return fieldName + " " + "agilecustomfield";
    }

    /**
     * Compare oldProperties with newProperties, and update Contact Properties
     * 
     * @param newProperties
     *            List of new contact properties
     * @param oldProperties
     *            List of old contact properties
     * @return updatedProperties
     */
    public static List<ContactField> updateContactProperties(List<ContactField> newProperties,
	    List<ContactField> oldProperties)
    {
	List<ContactField> updatedProperties = new ArrayList<ContactField>();
	List<ContactField> outdatedProperties = new ArrayList<ContactField>();

	// If oldProperties exist
	if (oldProperties.size() != 0)
	{
	    for (ContactField oldProperty : oldProperties)
		for (ContactField newProperty : newProperties)

		    // If oldProperty updated replace with newProperty
		    if (StringUtils.equals(oldProperty.name, newProperty.name)
			    && (StringUtils.equals(oldProperty.subtype, newProperty.subtype)))
			outdatedProperties.add(oldProperty);
	    oldProperties.removeAll(outdatedProperties);
	    updatedProperties.addAll(oldProperties);
	}
	updatedProperties.addAll(newProperties);

	return updatedProperties;
    }

    /**
     * Build CUSTOM ContactField form name, value, and subtype of property
     * 
     * @param name
     *            Name of contact property
     * @param value
     *            Value of contact property
     * @param subtype
     *            subtype of contact property
     * @return field
     */
    public static ContactField buildProperty(String name, String value, String subtype)
    {
	ContactField field = new ContactField();
	field.name = name;
	field.type = FieldType.CUSTOM;
	field.value = value;
	field.subtype = subtype;
	return field;
    }

    /**
     * Get country code from country name if match, else return country name
     * 
     * @param value
     *            country name
     * @return country code || value
     */
    public static String getCountry(String value)
    {
	String code = countrycodemap().get(value);
	return (!StringUtils.isBlank(code)) ? code : value;
    }

    /**
     * Map finalJson to contact fields in agilecrm
     * 
     * @param finalJson
     * @param properties
     * @param notes
     * @return void
     */
    public static void jsonToAgile(JSONObject finalJson, List<ContactField> properties, List<Note> notes)
    {
	try
	{
	    // Define addressJson, checkBox, addString
	    JSONObject addressJson = new JSONObject();
	    String addString = new String();

	    // Iterate finalJson keys
	    Iterator<?> keys = finalJson.keys();
	    while (keys.hasNext())
	    {
		String key = (String) keys.next();
		String value = finalJson.getString(key);
		key = key.replace("\n", " ");

		// If key contains " "
		if (StringUtils.contains(key, "agilecustomfield"))
		{
		    if (StringUtils.contains(key, "agilenote"))
		    {
			Note note = new Note(key.replace(" agilenote agilecustomfield", ""), value);
			notes.add(note);
		    }
		    else if (StringUtils.contains(key, "agilecheckbox"))
			properties.add(buildProperty(key.replace(" agilecheckbox agilecustomfield", ""), value, null));
		    else
			properties.add(buildProperty(key.replace(" agilecustomfield", ""), value, null));
		}
		else if (key.contains(" ") && !StringUtils.contains(key, Contact.ADDRESS))
		{
		    String[] keyArray = key.split(" ");

		    // Separate name and sub type from key by splitting at " "
		    String tokenKey = keyArray[0];
		    String subType = keyArray[1];

		    properties.add(new ContactField(tokenKey, value, subType));
		}
		else if (key.contains(Contact.ADDRESS))
		{
		    String[] keyArray = key.split(" ");

		    // Separate name and sub type from key by splitting at " "
		    String subType = keyArray[1];

		    if (StringUtils.equals(subType, "lineone"))
			addString = value;
		    else if (StringUtils.equals(subType, "linetwo"))
			addString = addString + ", " + value;

		    // If subtype is city, state, zip add to addressJson
		    else if (StringUtils.equals(subType, "city") || StringUtils.equals(subType, "state")
			    || StringUtils.equals(subType, "zip"))
			addressJson.put(subType, value);

		    // If subtype is country, get country code and add to
		    // addressJson
		    else if (StringUtils.equals(subType, "country"))
			addressJson.put(subType, getCountry(value));
		}
		else
		    properties.add(new ContactField(key, value, null));
	    }
	    if (addressJson.length() != 0)
	    {
		// Add addString to addressJson and add to properties
		addressJson.put("address", addString);
		properties.add(new ContactField(Contact.ADDRESS, addressJson.toString(), null));
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Error is " + e.getMessage());
	    return;
	}
    }

    /**
     * Map with country names as key and codes as values
     * 
     * @return countryCode
     */
    public static HashMap<String, String> countrycodemap()
    {
	HashMap<String, String> countryCode = new HashMap<String, String>();
	countryCode.put("United States", "US");
	countryCode.put("United Kingdom", "UK");
	countryCode.put("Australia", "AU");
	countryCode.put("Canada", "CA");
	countryCode.put("France", "FR");
	countryCode.put("New Zealand", "NZ");
	countryCode.put("India", "IN");
	countryCode.put("Brazil", "BR");
	countryCode.put("Afganistan", "AF");
	countryCode.put("Åland Islands", "AX");
	countryCode.put("Albania", "AL");
	countryCode.put("Algeric", "DZ");
	countryCode.put("American Samoa", "AS");
	countryCode.put("Andorra", "AD");
	countryCode.put("Angola", "AO");
	countryCode.put("Anguilla", "AI");
	countryCode.put("Antarctica", "AQ");
	countryCode.put("Antigua and Barbuda", "AG");
	countryCode.put("Argentina", "AR");
	countryCode.put("Armenia", "AM");
	countryCode.put("Aruba", "AW");
	countryCode.put("Austria", "AT");
	countryCode.put("Azerbaijan", "AZ");
	countryCode.put("Bahamas", "BS");
	countryCode.put("Bahrain", "BH");
	countryCode.put("Bangladesh", "BD");
	countryCode.put("Barbados", "BB");
	countryCode.put("Belarus", "BY");
	countryCode.put("Belgium", "BE");
	countryCode.put("Belize", "BZ");
	countryCode.put("Benin", "BJ");
	countryCode.put("Bermuda", "BM");
	countryCode.put("Bhutan", "BT");
	countryCode.put("Bolivia", "BO");
	countryCode.put("Bosnia and Herzegovina", "BA");
	countryCode.put("Botswana", "BW");
	countryCode.put("British Indian Ocean Territory", "IO");
	countryCode.put("Brunei Darussalam", "BN");
	countryCode.put("Bulgaria", "BG");
	countryCode.put("Burkina Faso", "BF");
	countryCode.put("Burundi", "BI");
	countryCode.put("Cambodia", "KH");
	countryCode.put("Cameroon", "CM");
	countryCode.put("Cape Verde", "CV");
	countryCode.put("Cayman Islands", "KY");
	countryCode.put("Central African Republic", "CF");
	countryCode.put("Chad", "TD");
	countryCode.put("Chile", "CL");
	countryCode.put("China", "CN");
	countryCode.put("Colombia", "CO");
	countryCode.put("Comoros", "KM");
	countryCode.put("Democratic Republic of the Congo", "CG");
	countryCode.put("Republic of the Congo", "CG");
	countryCode.put("Cook Islands", "CK");
	countryCode.put("Costa Rica", "CR");
	countryCode.put("Côte d'Ivoire", "CI");
	countryCode.put("Croatia", "HR");
	countryCode.put("Cuba", "CU");
	countryCode.put("Cyprus", "CY");
	countryCode.put("Czech Republic", "CZ");
	countryCode.put("Denmark", "DK");
	countryCode.put("Djibouti", "DJ");
	countryCode.put("Dominica", "DM");
	countryCode.put("Dominican Republic", "DO");
	countryCode.put("East Timor", "TL");
	countryCode.put("Ecuador", "EC");
	countryCode.put("Egypt", "EG");
	countryCode.put("El Salvador", "SV");
	countryCode.put("Equatorial Guinea", "GQ");
	countryCode.put("Eritrea", "ER");
	countryCode.put("Estonia", "EE");
	countryCode.put("Ethiopia", "ET");
	countryCode.put("Faroe Islands", "FO");
	countryCode.put("Fiji", "FJ");
	countryCode.put("Finland", "FI");
	countryCode.put("Gabon", "GA");
	countryCode.put("Gambia", "GM");
	countryCode.put("Georgia", "GE");
	countryCode.put("Germany", "DE");
	countryCode.put("Ghana", "GH");
	countryCode.put("Gibraltar", "GI");
	countryCode.put("Greece", "GR");
	countryCode.put("Grenada", "GD");
	countryCode.put("Guatemala", "GT");
	countryCode.put("Guinea", "GN");
	countryCode.put("Guinea-Bissau", "GW");
	countryCode.put("Guyana", "GY");
	countryCode.put("Haiti", "HT");
	countryCode.put("Honduras", "HN");
	countryCode.put("Hong Kong", "HK");
	countryCode.put("Hungary", "HU");
	countryCode.put("Iceland", "IS");
	countryCode.put("Indonesia", "ID");
	countryCode.put("Iran", "IR");
	countryCode.put("Iraq", "IQ");
	countryCode.put("Ireland", "IE");
	countryCode.put("Israel", "IL");
	countryCode.put("Italy", "IT");
	countryCode.put("Jamaica", "JM");
	countryCode.put("Japan", "JP");
	countryCode.put("Jordan", "JE");
	countryCode.put("Kazakhstan", "KZ");
	countryCode.put("Kenya", "KE");
	countryCode.put("Kiribati", "KI");
	countryCode.put("North Korea", "KP");
	countryCode.put("South Korea", "KR");
	countryCode.put("Kuwait", "KW");
	countryCode.put("Kyrgyzstan", "KG");
	countryCode.put("Laos", "LA");
	countryCode.put("Latvia", "LV");
	countryCode.put("Lebanon", "LB");
	countryCode.put("Lesotho", "LS");
	countryCode.put("Liberia", "LR");
	countryCode.put("Libya", "LY");
	countryCode.put("Liechtenstein", "LI");
	countryCode.put("Lithuania", "LT");
	countryCode.put("Luxembourg", "LU");
	countryCode.put("Macedonia", "MK");
	countryCode.put("Madagascar", "MG");
	countryCode.put("Malawi", "MW");
	countryCode.put("Malaysia", "MY");
	countryCode.put("Maldives", "MV");
	countryCode.put("Mali", "ML");
	countryCode.put("Malta", "MT");
	countryCode.put("Marshall Islands", "MH");
	countryCode.put("Mauritania", "MQ");
	countryCode.put("Mauritius", "MR");
	countryCode.put("Mexico", "MX");
	countryCode.put("Micronesia", "FM");
	countryCode.put("Moldova", "MD");
	countryCode.put("Monaco", "MC");
	countryCode.put("Mongolia", "MN");
	countryCode.put("Montenegro", "ME");
	countryCode.put("Morocco", "MA");
	countryCode.put("Mozambique", "MZ");
	countryCode.put("Myanmar", "MM");
	countryCode.put("Namibia", "NA");
	countryCode.put("Nauru", "NR");
	countryCode.put("Nepal", "NP");
	countryCode.put("Netherlands", "");
	countryCode.put("Netherlands Antilles", "NL");
	countryCode.put("Nicaragua", "NI");
	countryCode.put("Niger", "NE");
	countryCode.put("Nigeria", "NG");
	countryCode.put("Norway", "NO");
	countryCode.put("Oman", "OM");
	countryCode.put("Pakistan", "PK");
	countryCode.put("Palau", "PW");
	countryCode.put("Palestine", "PS");
	countryCode.put("Panama", "PA");
	countryCode.put("Papua New Guinea", "PG");
	countryCode.put("Paraguay", "PY");
	countryCode.put("Peru", "PE");
	countryCode.put("Philippines", "PH");
	countryCode.put("Poland", "PL");
	countryCode.put("Portugal", "PT");
	countryCode.put("Puerto Rico", "PR");
	countryCode.put("Qatar", "QA");
	countryCode.put("Romania", "RO");
	countryCode.put("Russia", "RU");
	countryCode.put("Rwanda", "RW");
	countryCode.put("Saint Kitts and Nevis", "KN");
	countryCode.put("Saint Lucia", "LC");
	countryCode.put("Saint Vincent and the Grenadines", "");
	countryCode.put("Samoa", "WS");
	countryCode.put("San Marino", "SM");
	countryCode.put("Sao Tome and Principe", "ST");
	countryCode.put("Saudi Arabia", "SA");
	countryCode.put("Senegal", "SN");
	countryCode.put("Serbia", "RS");
	countryCode.put("Seychelles", "SC");
	countryCode.put("Sierra Leone", "SL");
	countryCode.put("Singapore", "SG");
	countryCode.put("Slovakia", "SK");
	countryCode.put("Slovenia", "SI");
	countryCode.put("Solomon Islands", "SB");
	countryCode.put("Somalia", "SO");
	countryCode.put("South Africa", "ZA");
	countryCode.put("Spain", "ES");
	countryCode.put("Sri Lanka", "LK");
	countryCode.put("Sudan", "SD");
	countryCode.put("Suriname", "SR");
	countryCode.put("Swaziland", "SZ");
	countryCode.put("Sweden", "SE");
	countryCode.put("Switzerland", "CH");
	countryCode.put("Syria", "SY");
	countryCode.put("Taiwan", "TW");
	countryCode.put("Tajikistan", "TJ");
	countryCode.put("Tanzania", "TZ");
	countryCode.put("Thailand", "TH");
	countryCode.put("Togo", "TG");
	countryCode.put("Tonga", "TO");
	countryCode.put("Trinidad and Tobago", "TT");
	countryCode.put("Tunisia", "TN");
	countryCode.put("Turkey", "TR");
	countryCode.put("Turkmenistan", "TM");
	countryCode.put("Tuvalu", "TV");
	countryCode.put("Uganda", "UG");
	countryCode.put("Ukraine", "UA");
	countryCode.put("United Arab Emirates", "AE");
	countryCode.put("United States Minor Outlying Islands", "UM");
	countryCode.put("Uruguay", "UY");
	countryCode.put("Uzbekistan", "UZ");
	countryCode.put("Vanuatu", "VU");
	countryCode.put("Vatican City", "VA");
	countryCode.put("Venezuela", "VE");
	countryCode.put("Vietnam", "VN");
	countryCode.put("Virgin Islands, British", "VG");
	countryCode.put("Virgin Islands, U.S.", "VI");
	countryCode.put("Yemen", "YE");
	countryCode.put("Zambia", "ZM");
	countryCode.put("Zimbabwe", "ZW");
	return countryCode;
    }

    public static String[] getValidTags(String[] tags)
    {
	List<String> validTags = new ArrayList<String>();
	for (int i = 0; i < tags.length; i++)
	{
	    String tag = TagUtil.getValidTag(tags[i]);
	    if (tag == null)
		continue;
	    validTags.add(tag);
	}
	return validTags.toArray(new String[validTags.size()]);
    }
}