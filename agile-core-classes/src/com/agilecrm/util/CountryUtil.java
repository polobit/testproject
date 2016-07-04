package com.agilecrm.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.ContactField;

/**
 * <code>CountryUtil</code> class checks country names and codes when contacts
 * are import or sync from google, shopify, stripe etc.
 * 
 * It provides country name as well as country code based on the parameter passed.
 * 
 * @author Subrahmanyam
 * 
 * @since July 2016
 */
public class CountryUtil 
{
	/**
	 * Gives list of countries as <code>Map<code>.
	 */
	public static Map<String, String> getCountries()
	{
		Map<String, String> countriesMap = new HashMap<String, String>();
		
		countriesMap.put("AF", "Afghanistan");
		countriesMap.put("AL", "Albania");
		countriesMap.put("DZ", "Algeria");
		countriesMap.put("AS", "American Samoa");
		countriesMap.put("AD", "Andorra");
		countriesMap.put("AO", "Angola");
		countriesMap.put("AI", "Anguilla");
		countriesMap.put("AQ", "Antarctica");
		countriesMap.put("AG", "Antigua and Barbuda");
		countriesMap.put("AR", "Argentina");
		countriesMap.put("AM", "Armenia");
		countriesMap.put("AW", "Aruba");
		countriesMap.put("AU", "Australia");
		countriesMap.put("AT", "Austria");
		countriesMap.put("AZ", "Azerbaijan");
		countriesMap.put("BS", "Bahamas");
		countriesMap.put("BH", "Bahrain");
		countriesMap.put("BD", "Bangladesh");
		countriesMap.put("BB", "Barbados");
		countriesMap.put("BY", "Belarus");
		countriesMap.put("BE", "Belgium");
		countriesMap.put("BZ", "Belize");
		countriesMap.put("BJ", "Benin");
		countriesMap.put("BM", "Bermuda");
		countriesMap.put("BT", "Bhutan");
		countriesMap.put("BO", "Bolivia");
		countriesMap.put("BA", "Bosnia and Herzegovina");
		countriesMap.put("BW", "Botswana");
		countriesMap.put("BV", "Bouvet Island");
		countriesMap.put("BR", "Brazil");
		countriesMap.put("IO", "British Indian Ocean Territory");
		countriesMap.put("VG", "British Virgin Islands");
		countriesMap.put("BN", "Brunei");
		countriesMap.put("BG", "Bulgaria");
		countriesMap.put("BF", "Burkina Faso");
		countriesMap.put("BI", "Burundi");
		countriesMap.put("KH", "Cambodia");
		countriesMap.put("CM", "Cameroon");
		countriesMap.put("CA", "Canada");
		countriesMap.put("CV", "Cape Verde");
		countriesMap.put("KY", "Cayman Islands");
		countriesMap.put("CF", "Central African Republic");
		countriesMap.put("TD", "Chad");
		countriesMap.put("CL", "Chile");
		countriesMap.put("CN", "China");
		countriesMap.put("CX", "Christmas Island");
		countriesMap.put("CC", "Cocos Islands");
		countriesMap.put("CO", "Colombia");
		countriesMap.put("KM", "Comoros");
		countriesMap.put("CG", "Congo");
		countriesMap.put("CK", "Cook Islands");
		countriesMap.put("CR", "Costa Rica");
		countriesMap.put("HR", "Croatia");
		countriesMap.put("CU", "Cuba");
		countriesMap.put("CY", "Cyprus");
		countriesMap.put("CZ", "Czech Republic");
		countriesMap.put("CI", "Cote d'Ivoire");
		countriesMap.put("DK", "Denmark");
		countriesMap.put("DJ", "Djibouti");
		countriesMap.put("DM", "Dominica");
		countriesMap.put("DO", "Dominican Republic");
		countriesMap.put("EC", "Ecuador");
		countriesMap.put("EG", "Egypt");
		countriesMap.put("SV", "El Salvador");
		countriesMap.put("GQ", "Equatorial Guinea");
		countriesMap.put("ER", "Eritrea");
		countriesMap.put("EE", "Estonia");
		countriesMap.put("ET", "Ethiopia");
		countriesMap.put("FK", "Falkland Islands");
		countriesMap.put("FO", "Faroe Islands");
		countriesMap.put("FJ", "Fiji");
		countriesMap.put("FI", "Finland");
		countriesMap.put("FR", "France");
		countriesMap.put("GF", "French Guiana");
		countriesMap.put("PF", "French Polynesia");
		countriesMap.put("TF", "French Southern Territories");
		countriesMap.put("GA", "Gabon");
		countriesMap.put("GM", "Gambia");
		countriesMap.put("GE", "Georgia");
		countriesMap.put("DE", "Germany");
		countriesMap.put("GH", "Ghana");
		countriesMap.put("GI", "Gibraltar");
		countriesMap.put("GR", "Greece");
		countriesMap.put("GL", "Greenland");
		countriesMap.put("GD", "Grenada");
		countriesMap.put("GP", "Guadeloupe");
		countriesMap.put("GU", "Guam");
		countriesMap.put("GT", "Guatemala");
		countriesMap.put("GG", "Guernsey");
		countriesMap.put("GN", "Guinea");
		countriesMap.put("GW", "Guinea-Bissau");
		countriesMap.put("GY", "Guyana");
		countriesMap.put("HT", "Haiti");
		countriesMap.put("HM", "Heard Island And McDonald Islands");
		countriesMap.put("HN", "Honduras");
		countriesMap.put("HK", "Hong Kong");
		countriesMap.put("HU", "Hungary");
		countriesMap.put("IS", "Iceland");
		countriesMap.put("IN", "India");
		countriesMap.put("ID", "Indonesia");
		countriesMap.put("IR", "Iran");
		countriesMap.put("IQ", "Iraq");
		countriesMap.put("IE", "Ireland");
		countriesMap.put("IM", "Isle Of Man");
		countriesMap.put("IL", "Israel");
		countriesMap.put("IT", "Italy");
		countriesMap.put("JM", "Jamaica");
		countriesMap.put("JP", "Japan");
		countriesMap.put("JE", "Jersey");
		countriesMap.put("JO", "Jordan");
		countriesMap.put("KZ", "Kazakhstan");
		countriesMap.put("KE", "Kenya");
		countriesMap.put("KI", "Kiribati");
		countriesMap.put("KW", "Kuwait");
		countriesMap.put("KG", "Kyrgyzstan");
		countriesMap.put("LA", "Laos");
		countriesMap.put("LV", "Latvia");
		countriesMap.put("LB", "Lebanon");
		countriesMap.put("LS", "Lesotho");
		countriesMap.put("LR", "Liberia");
		countriesMap.put("LY", "Libya");
		countriesMap.put("LI", "Liechtenstein");
		countriesMap.put("LT", "Lithuania");
		countriesMap.put("LU", "Luxembourg");
		countriesMap.put("MO", "Macao");
		countriesMap.put("MK", "Macedonia");
		countriesMap.put("MG", "Madagascar");
		countriesMap.put("MW", "Malawi");
		countriesMap.put("MY", "Malaysia");
		countriesMap.put("MV", "Maldives");
		countriesMap.put("ML", "Mali");
		countriesMap.put("MT", "Malta");
		countriesMap.put("MH", "Marshall Islands");
		countriesMap.put("MQ", "Martinique");
		countriesMap.put("MR", "Mauritania");
		countriesMap.put("MU", "Mauritius");
		countriesMap.put("YT", "Mayotte");
		countriesMap.put("MX", "Mexico");
		countriesMap.put("FM", "Micronesia");
		countriesMap.put("MD", "Moldova");
		countriesMap.put("MC", "Monaco");
		countriesMap.put("MN", "Mongolia");
		countriesMap.put("ME", "Montenegro");
		countriesMap.put("MS", "Montserrat");
		countriesMap.put("MA", "Morocco");
		countriesMap.put("MZ", "Mozambique");
		countriesMap.put("MM", "Myanmar");
		countriesMap.put("NA", "Namibia");
		countriesMap.put("NR", "Nauru");
		countriesMap.put("NP", "Nepal");
		countriesMap.put("NL", "Netherlands");
		countriesMap.put("AN", "Netherlands Antilles");
		countriesMap.put("NC", "New Caledonia");
		countriesMap.put("NZ", "New Zealand");
		countriesMap.put("NI", "Nicaragua");
		countriesMap.put("NE", "Niger");
		countriesMap.put("NG", "Nigeria");
		countriesMap.put("NU", "Niue");
		countriesMap.put("NF", "Norfolk Island");
		countriesMap.put("KP", "North Korea");
		countriesMap.put("MP", "Northern Mariana Islands");
		countriesMap.put("NO", "Norway");
		countriesMap.put("OM", "Oman");
		countriesMap.put("PK", "Pakistan");
		countriesMap.put("PW", "Palau");
		countriesMap.put("PS", "Palestine");
		countriesMap.put("PA", "Panama");
		countriesMap.put("PG", "Papua New Guinea");
		countriesMap.put("PY", "Paraguay");
		countriesMap.put("PE", "Peru");
		countriesMap.put("PH", "Philippines");
		countriesMap.put("PN", "Pitcairn");
		countriesMap.put("PL", "Poland");
		countriesMap.put("PT", "Portugal");
		countriesMap.put("PR", "Puerto Rico");
		countriesMap.put("QA", "Qatar");
		countriesMap.put("RE", "Reunion");
		countriesMap.put("RO", "Romania");
		countriesMap.put("RU", "Russia");
		countriesMap.put("RW", "Rwanda");
		countriesMap.put("SH", "Saint Helena");
		countriesMap.put("KN", "Saint Kitts And Nevis");
		countriesMap.put("LC", "Saint Lucia");
		countriesMap.put("PM", "Saint Pierre And Miquelon");
		countriesMap.put("VC", "Saint Vincent And The Grenadines");
		countriesMap.put("WS", "Samoa");
		countriesMap.put("SM", "San Marino");
		countriesMap.put("ST", "Sao Tome And Principe");
		countriesMap.put("SA", "Saudi Arabia");
		countriesMap.put("SN", "Senegal");
		countriesMap.put("RS", "Serbia");
		countriesMap.put("CS", "Serbia and Montenegro");
		countriesMap.put("SC", "Seychelles");
		countriesMap.put("SL", "Sierra Leone");
		countriesMap.put("SG", "Singapore");
		countriesMap.put("SK", "Slovakia");
		countriesMap.put("SI", "Slovenia");
		countriesMap.put("SB", "Solomon Islands");
		countriesMap.put("SO", "Somalia");
		countriesMap.put("ZA", "South Africa");
		countriesMap.put("GS", "South Georgia And The South Sandwich Islands");
		countriesMap.put("KR", "South Korea");
		countriesMap.put("ES", "Spain");
		countriesMap.put("LK", "Sri Lanka");
		countriesMap.put("SD", "Sudan");
		countriesMap.put("SR", "Suriname");
		countriesMap.put("SJ", "Svalbard And Jan Mayen");
		countriesMap.put("SZ", "Swaziland");
		countriesMap.put("SE", "Sweden");
		countriesMap.put("CH", "Switzerland");
		countriesMap.put("SY", "Syria");
		countriesMap.put("TW", "Taiwan");
		countriesMap.put("TJ", "Tajikistan");
		countriesMap.put("TZ", "Tanzania");
		countriesMap.put("TH", "Thailand");
		countriesMap.put("CD", "The Democratic Republic Of Congo");
		countriesMap.put("TL", "Timor-Leste");
		countriesMap.put("TG", "Togo");
		countriesMap.put("TK", "Tokelau");
		countriesMap.put("TO", "Tonga");
		countriesMap.put("TT", "Trinidad and Tobago");
		countriesMap.put("TN", "Tunisia");
		countriesMap.put("TR", "Turkey");
		countriesMap.put("TM", "Turkmenistan");
		countriesMap.put("TC", "Turks And Caicos Islands");
		countriesMap.put("TV", "Tuvalu");
		countriesMap.put("VI", "U.S. Virgin Islands");
		countriesMap.put("UG", "Uganda");
		countriesMap.put("UA", "Ukraine");
		countriesMap.put("AE", "United Arab Emirates");
		countriesMap.put("GB", "United Kingdom");
		countriesMap.put("US", "United States");
		countriesMap.put("UM", "United States Minor Outlying Islands");
		countriesMap.put("UY", "Uruguay");
		countriesMap.put("UZ", "Uzbekistan");
		countriesMap.put("VU", "Vanuatu");
		countriesMap.put("VA", "Vatican");
		countriesMap.put("VE", "Venezuela");
		countriesMap.put("VN", "Vietnam");
		countriesMap.put("WF", "Wallis And Futuna");
		countriesMap.put("EH", "Western Sahara");
		countriesMap.put("YE", "Yemen");
		countriesMap.put("ZM", "Zambia");
		countriesMap.put("ZW", "Zimbabwe");
		countriesMap.put("AX", "Aland Islands");
		
		return countriesMap;
	}
	
	/**
	 * Checks with country name in provided countries and return proper country code if exists, 
	 * otherwise return country name which is passed as parameter.
	 * 
	 * @param countryName
	 */
	public static String getCountryCode(String countryName)
	{
		if(countryName != null && "land Islands".equalsIgnoreCase(countryName.substring(1)))
		{
			return "AX";
		}
		
		if(countryName != null && "te d'Ivoire".equalsIgnoreCase(countryName.substring(2)))
		{
			return "CI";
		}
		
		Map<String, String> countriesMap = getCountries();
		
		for (Entry<String, String> entry : countriesMap.entrySet()) 
		{
	        if (entry.getValue().equalsIgnoreCase(countryName)) 
	        {
	            return entry.getKey();
	        }
	    }
		return countryName;
	}
	
	/**
	 * Checks with country code in provided countries and return proper country name if exists, 
	 * otherwise return country code which is passed as parameter.
	 * 
	 * @param countryCode
	 */
	public static String getCountryName(String countryCode)
	{
		Map<String, String> countriesMap = getCountries();
		
		if(countryCode != null)
		{
			return countriesMap.get(countryCode);
		}
		return countryCode;
	}
	
	/**
	 * Checks with country name in provided countries and return true if exists, 
	 * otherwise return false.
	 * 
	 * @param countryName
	 */
	public static boolean hasCountryCode(String countryName)
	{
		if(countryName != null && "land Islands".equalsIgnoreCase(countryName.substring(1)))
		{
			return true;
		}
		
		if(countryName != null && "te d'Ivoire".equalsIgnoreCase(countryName.substring(2)))
		{
			return true;
		}
		
		Map<String, String> countriesMap = getCountries();
		
		return countriesMap.containsValue(countryName);
	}
	
	/**
	 * Checks with country code in provided countries and return true if exists, 
	 * otherwise return false.
	 * 
	 * @param countryName
	 */
	public static boolean hasCountryName(String countryCode)
	{
		Map<String, String> countriesMap = getCountries();
		
		if(countryCode != null)
		{
			return countriesMap.containsKey(countryCode);
		}
		return false;
		
	}
	
	public static void setCountryCode(JSONObject addressJSON, ContactField field, String country) throws JSONException
    {
		if(field != null && field.value != null && !field.value.equals("country"))
		{
			addressJSON.put(field.value, country);
			return;
		}
		
		updateCountryCode(addressJSON, country);
    }
	
	private static void updateCountryCode(JSONObject addressJSON, String country) throws JSONException
	{
		if(hasCountryName(country))
	    {
			addressJSON.put("country", country);
			addressJSON.put("countryname", CountryUtil.getCountryName(country));
	    }
	    else
	    {
	    	addressJSON.put("country", CountryUtil.getCountryCode(country));
	    	addressJSON.put("countryname", country);
	    }
	}
}
