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
import com.agilecrm.contact.Note;

public class FormsUtil
{
	public static String getFieldName(String fieldName)
	{
		String firstNameAlias[] = { Contact.FIRST_NAME, "Name", "First" };
		String lastNameAlias[] = { Contact.LAST_NAME, "Last" };
		String companyNameAlias[] = { Contact.COMPANY, "organisation, organization", "Organization", "Organisation",
				"Company" };
		String contactTitleAlias[] = { Contact.TITLE, "designation", "Title", "Designation" };
		String emailAlias[] = { Contact.EMAIL };
		String mainPhoneAlias[] = { Contact.PHONE, "phone_number" };
		String workPhoneAlias[] = { "work phone" };
		String mobilePhoneAlias[] = { "mobile", "mobile phone", "Mobile" };
		String websiteAlias[] = { "url" };
		String skypeIdAlias[] = { "skype", "Skype" };
		String twitterAlias[] = { "twitter", "Twitter" };
		String googlePlusAlias[] = { "google+", "Google+" };
		String linkedinAlias[] = { "linkedin", "Linkedin" };
		String facebookAlias[] = { "facebook", "Facebook" };
		String xingAlias[] = { "xing", "Xing" };
		String flickrAlias[] = { "flickr", "Flickr" };
		String githubAlias[] = { "github", "Github" };
		String youtubeAlias[] = { "youtube", "Youtube" };
		String feedAlias[] = { "feed", "Feed" };
		String addressAlias[] = { "Street Address", "Location", "Street", "street", "address", "location" };
		String addressLineAlias[] = { "Address Line 2" };
		String addressCityAlias[] = { "City", "province" };
		String addressCountryAlias[] = { "Country", "country" };
		String addressStateAlias[] = { "State / Province / Region", "State", "stateprovince", "state" };
		String addressZipAlias[] = { "Zip", "Zip code", "Postal code", "Postal / Zip Code", "zip" };

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
		mainPhone.put(Contact.PHONE, Arrays.asList(mainPhoneAlias));

		HashMap<String, List<String>> workPhone = new HashMap<String, List<String>>();
		workPhone.put(Contact.PHONE + " work", Arrays.asList(workPhoneAlias));

		HashMap<String, List<String>> mobilePhone = new HashMap<String, List<String>>();
		mobilePhone.put(Contact.PHONE + " mobile", Arrays.asList(mobilePhoneAlias));

		HashMap<String, List<String>> website = new HashMap<String, List<String>>();
		website.put(Contact.WEBSITE, Arrays.asList(websiteAlias));

		HashMap<String, List<String>> skypeId = new HashMap<String, List<String>>();
		skypeId.put(Contact.WEBSITE + " skype", Arrays.asList(skypeIdAlias));

		HashMap<String, List<String>> twitter = new HashMap<String, List<String>>();
		twitter.put(Contact.WEBSITE + " twitter", Arrays.asList(twitterAlias));

		HashMap<String, List<String>> googlePlus = new HashMap<String, List<String>>();
		googlePlus.put(Contact.WEBSITE + " googleplus", Arrays.asList(googlePlusAlias));

		HashMap<String, List<String>> linkedin = new HashMap<String, List<String>>();
		linkedin.put(Contact.WEBSITE + " linkedin", Arrays.asList(linkedinAlias));

		HashMap<String, List<String>> facebook = new HashMap<String, List<String>>();
		facebook.put(Contact.WEBSITE + " facebook", Arrays.asList(facebookAlias));

		HashMap<String, List<String>> xing = new HashMap<String, List<String>>();
		xing.put(Contact.WEBSITE + " xing", Arrays.asList(xingAlias));

		HashMap<String, List<String>> flickr = new HashMap<String, List<String>>();
		flickr.put(Contact.WEBSITE + " flickr", Arrays.asList(flickrAlias));

		HashMap<String, List<String>> github = new HashMap<String, List<String>>();
		github.put(Contact.WEBSITE + " github", Arrays.asList(githubAlias));

		HashMap<String, List<String>> youtube = new HashMap<String, List<String>>();
		youtube.put(Contact.WEBSITE + " youtube", Arrays.asList(youtubeAlias));

		HashMap<String, List<String>> feed = new HashMap<String, List<String>>();
		feed.put(Contact.WEBSITE + " feed", Arrays.asList(feedAlias));

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

		for (HashMap<String, List<String>> map : allFields)
		{
			for (Map.Entry<String, List<String>> entry : map.entrySet())
			{
				if (entry.getValue().contains(fieldName))
					return entry.getKey();
			}
		}
		return fieldName;
	}

	public static List<ContactField> updateContactProperties(List<ContactField> newProperties,
			List<ContactField> oldProperties)
	{
		List<ContactField> updatedProperties = new ArrayList<ContactField>();
		List<ContactField> outdatedProperties = new ArrayList<ContactField>();

		if (oldProperties.size() != 0)
		{
			for (ContactField oldProperty : oldProperties)
				for (ContactField newProperty : newProperties)
					if (StringUtils.equals(oldProperty.name, newProperty.name)
							&& (StringUtils.equals(oldProperty.subtype, newProperty.subtype)))
						outdatedProperties.add(oldProperty);
			oldProperties.removeAll(outdatedProperties);
			updatedProperties.addAll(oldProperties);
		}
		updatedProperties.addAll(newProperties);

		return updatedProperties;
	}

	public static ContactField buildProperty(String name, String value, String subtype)
	{
		ContactField field = new ContactField();
		field.name = name;
		field.type = FieldType.CUSTOM;
		field.value = value;
		field.subtype = subtype;
		return field;
	}

	public static String getCountry(String value)
	{
		String code = countrycodemap().get(value);
		return (!StringUtils.isBlank(code)) ? code : value;
	}

	public static void jsonToAgile(JSONObject finalJson, List<ContactField> properties, List<Note> notes)
	{
		try
		{
			JSONObject addressJson = new JSONObject();
			String checkBox = new String();
			String addString = new String();

			Iterator<?> keys = finalJson.keys();
			while (keys.hasNext())
			{
				String key = (String) keys.next();
				String value = finalJson.getString(key);

				if (key.contains(" "))
				{
					String[] keyArray = key.split(" ");
					String tokenKey = keyArray[0];
					String subType = keyArray[1];

					if (key.contains("textarea"))
					{
						Note note = new Note(key.replace(" textarea", ""), value);
						notes.add(note);
					}
					else if (key.contains("checkbox"))
					{
						checkBox = (!StringUtils.isBlank(checkBox)) ? checkBox + ", " + value : value;
						buildProperty(key.replace(" checkbox", ""), checkBox, null);
					}
					else if (StringUtils.equals(subType, "lineone"))
						addString = value;
					else if (StringUtils.equals(subType, "linetwo"))
						addString = addString + ", " + value;
					else if (StringUtils.equals(subType, "city") || StringUtils.equals(subType, "state")
							|| StringUtils.equals(subType, "zip"))
						addressJson.put(subType, value);
					else if (StringUtils.equals(subType, "country"))
						addressJson.put(subType, getCountry(value));
					else if (StringUtils.equals(tokenKey, Contact.WEBSITE)
							|| StringUtils.equals(tokenKey, Contact.PHONE))
						properties.add(new ContactField(tokenKey, value, subType));
					else
						properties.add(buildProperty(key, value, null));
				}
				else if (key.equals(Contact.FIRST_NAME) || key.equals(Contact.LAST_NAME) || key.equals(Contact.COMPANY)
						|| key.equals(Contact.TITLE) || key.equals(Contact.WEBSITE) || key.equals(Contact.EMAIL)
						|| key.equals(Contact.PHONE))
					properties.add(new ContactField(key, value, null));
				else
					properties.add(buildProperty(key, value, null));
			}
			if (addressJson.length() != 0)
			{
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
}