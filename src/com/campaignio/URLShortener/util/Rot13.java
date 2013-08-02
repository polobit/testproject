package com.campaignio.URLShortener.util;

public class Rot13
{
    /**
     * Converts string using Rot13 algorithm.Same method can be used to encrypt
     * and decrypt the string. E.g., A <-> N, B <-> O etc.
     * 
     * @param value
     *            - Required string to be converted.
     * @return - converted string.
     */
    public static String convertStringUsingRot13(String value)
    {
	// To append characters.
	StringBuffer temp = new StringBuffer();

	for (int i = 0; i < value.length(); i++)
	{
	    char c = value.charAt(i);
	    if (c >= 'a' && c <= 'm')
		c += 13;
	    else if (c >= 'A' && c <= 'M')
		c += 13;
	    else if (c >= 'n' && c <= 'z')
		c -= 13;
	    else if (c >= 'N' && c <= 'Z')
		c -= 13;

	    temp.append(c);
	}
	return temp.toString();
    }
}
