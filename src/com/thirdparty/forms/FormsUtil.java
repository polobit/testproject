package com.thirdparty.forms;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.ContactField.FieldType;
import com.agilecrm.contact.util.ContactUtil;

public class FormsUtil
{
	public static List<ContactField> updateContactProperties(List<ContactField> newProperties,
			List<ContactField> oldProperties)
	{

		List<ContactField> updatedProperties = new ArrayList<ContactField>();
		List<ContactField> outdatedProperties = new ArrayList<ContactField>();

		if (oldProperties.size() != 0)
		{
			for (ContactField oldProperty : oldProperties)
			{
				for (ContactField newProperty : newProperties)
				{
					if (StringUtils.equals(oldProperty.name, newProperty.name)
							&& (StringUtils.equals(oldProperty.subtype, newProperty.subtype)))
						outdatedProperties.add(oldProperty);
				}
			}
			oldProperties.removeAll(outdatedProperties);
			updatedProperties.addAll(oldProperties);
		}
		updatedProperties.addAll(newProperties);

		return updatedProperties;
	}

	public static ContactField wufooBuildPropertyWithSubtype(String name, String value, String subtype)
			throws JSONException
	{
		// Initialize ContactField
		ContactField field = new ContactField();

		// Set field type to SYSTEM for name, email, company, title, phone, all
		// other fields save as CUSTOM.
		field.name = name;
		field.type = FieldType.SYSTEM;
		field.value = value;
		field.subtype = subtype;

		return field;
	}

	public static ContactField wufooBuildProperty(String name, String value) throws JSONException
	{
		// Initialize ContactField
		ContactField field = new ContactField();

		// Set field type to SYSTEM for name, email, company, title, phone, all
		// other fields save as CUSTOM.
		if (name.equalsIgnoreCase("name") || name.equalsIgnoreCase("first"))
		{
			field.name = Contact.FIRST_NAME;
			field.type = FieldType.SYSTEM;
			field.value = value;
		}
		else if (name.equalsIgnoreCase("last"))
		{
			field.name = Contact.LAST_NAME;
			field.type = FieldType.SYSTEM;
			field.value = value;
		}
		else if (name.toLowerCase().contains("organisation") || name.toLowerCase().contains("organization")
				|| name.equalsIgnoreCase(Contact.COMPANY))
		{
			field.name = Contact.COMPANY;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.toLowerCase().contains("designation") || name.equalsIgnoreCase(Contact.TITLE))
		{
			field.name = Contact.TITLE;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.toLowerCase().contains("work phone"))
		{
			field.name = "phone";
			field.value = value;
			field.type = FieldType.SYSTEM;
			field.subtype = "work";
		}
		else if (name.toLowerCase().contains("mobile"))
		{
			field.name = "phone";
			field.value = value;
			field.type = FieldType.SYSTEM;
			field.subtype = "mobile";
		}
		else if (name.toLowerCase().contains("skype"))
		{
			field.name = Contact.WEBSITE;
			field.value = value;
			field.type = FieldType.SYSTEM;
			field.subtype = "SKYPE";
		}
		else if (name.toLowerCase().contains("twitter"))
		{
			field.name = Contact.WEBSITE;
			field.type = FieldType.SYSTEM;
			field.subtype = "TWITTER";
			field.value = value;
		}
		else if (name.toLowerCase().contains("google+"))
		{
			field.name = Contact.WEBSITE;
			field.type = FieldType.SYSTEM;
			field.subtype = "GOOGLE-PLUS";
			field.value = value;
		}
		else if (name.toLowerCase().contains("linkedin"))
		{
			field.name = Contact.WEBSITE;
			field.value = value;
			field.subtype = "LINKEDIN";
			field.type = FieldType.SYSTEM;
		}
		else if (name.toLowerCase().contains("facebook"))
		{
			field.name = Contact.WEBSITE;
			field.value = value;
			field.subtype = "FACEBOOK";
			field.type = FieldType.SYSTEM;
		}
		else if (name.toLowerCase().contains("xing"))
		{
			field.name = Contact.WEBSITE;
			field.value = value;
			field.subtype = "XING";
			field.type = FieldType.SYSTEM;
		}
		else if (name.toLowerCase().contains("flickr"))
		{
			field.name = Contact.WEBSITE;
			field.value = value;
			field.subtype = "FLICKR";
			field.type = FieldType.SYSTEM;
		}
		else if (name.toLowerCase().contains("github"))
		{
			field.name = Contact.WEBSITE;
			field.value = value;
			field.subtype = "GITHUB";
			field.type = FieldType.SYSTEM;
		}
		else if (name.toLowerCase().contains("youtube"))
		{
			field.name = Contact.WEBSITE;
			field.subtype = "YOUTUBE";
			field.type = FieldType.SYSTEM;
			field.value = value;
		}
		else if (name.toLowerCase().contains("feed"))
		{
			field.name = Contact.WEBSITE;
			field.value = value;
			field.subtype = "FEED";
			field.type = FieldType.SYSTEM;
		}
		else if (name.equals("address"))
		{
			field.name = Contact.ADDRESS;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else
		{
			field.name = name;
			field.value = value;
			field.type = FieldType.CUSTOM;
		}
		return field;
	}

	public static ContactField unbounceBuildProperty(String name, String value)
	{
		// Initialize ContactField
		ContactField field = new ContactField();

		// Set field type to SYSTEM for name, email, company, title, phone, all
		// other fields save as CUSTOM.
		if (name.equalsIgnoreCase("name") || name.equalsIgnoreCase(Contact.FIRST_NAME)
				|| name.equalsIgnoreCase("first name") || name.equalsIgnoreCase("first"))
		{
			field.name = Contact.FIRST_NAME;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.equalsIgnoreCase(Contact.LAST_NAME) || name.equalsIgnoreCase("last name")
				|| name.equalsIgnoreCase("last"))
		{
			field.name = Contact.LAST_NAME;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.toLowerCase().contains("organisation") || name.toLowerCase().contains("organization")
				|| name.equalsIgnoreCase(Contact.COMPANY))
		{
			field.name = Contact.COMPANY;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.toLowerCase().contains("designation") || name.equalsIgnoreCase(Contact.TITLE))
		{
			field.name = Contact.TITLE;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.toLowerCase().contains("phone"))
		{
			field.name = "phone";
			field.value = value;
			field.type = FieldType.SYSTEM;
			field.subtype = "work";
		}
		else if (name.toLowerCase().contains("mobile"))
		{
			field.name = "phone";
			field.value = value;
			field.type = FieldType.SYSTEM;
			field.subtype = "home";
		}
		else if (name.toLowerCase().contains("email"))
		{
			if (ContactUtil.isValidEmail(value))
			{
				field.name = Contact.EMAIL;
				field.value = value;
				field.type = FieldType.SYSTEM;
			}
		}
		else if (name.toLowerCase().contains("website"))
		{
			field.name = Contact.WEBSITE;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.equals("address"))
		{
			field.name = Contact.ADDRESS;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else
		{
			field.name = name;
			field.value = value;
			field.type = FieldType.CUSTOM;
		}
		return field;
	}

	public static ContactField gravityBuildProperty(String name, String value)
	{
		// Initialize ContactField
		ContactField field = new ContactField();

		// Set field type to SYSTEM for name, email, company, title, phone, all
		// other fields save as CUSTOM.
		if (name.equalsIgnoreCase(Contact.FIRST_NAME) || name.equalsIgnoreCase("name")
				|| name.equalsIgnoreCase("first name") || name.equalsIgnoreCase("first"))
		{
			field.name = Contact.FIRST_NAME;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.equalsIgnoreCase(Contact.LAST_NAME) || name.equalsIgnoreCase("last name")
				|| name.equalsIgnoreCase("last"))
		{
			field.name = Contact.LAST_NAME;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.toLowerCase().contains("organisation") || name.toLowerCase().contains("organization")
				|| name.toLowerCase().equals(Contact.COMPANY))
		{
			field.name = Contact.COMPANY;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.equalsIgnoreCase("designation") || name.equalsIgnoreCase(Contact.TITLE))
		{
			field.name = Contact.TITLE;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.toLowerCase().contains("phone"))
		{
			field.name = "phone";
			field.value = value;
			field.type = FieldType.SYSTEM;
			field.subtype = "work";
		}
		else if (name.toLowerCase().contains("mobile"))
		{
			field.name = "phone";
			field.value = value;
			field.type = FieldType.SYSTEM;
			field.subtype = "home";
		}
		else if (name.toLowerCase().contains("email"))
		{
			if (ContactUtil.isValidEmail(value))
			{
				field.name = Contact.EMAIL;
				field.value = value;
				field.type = FieldType.SYSTEM;
			}
		}
		else if (name.toLowerCase().contains("website"))
		{
			field.name = Contact.WEBSITE;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.equals("address"))
		{
			field.name = Contact.ADDRESS;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else
		{
			field.name = name;
			field.value = value;
			field.type = FieldType.CUSTOM;
		}
		return field;
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
