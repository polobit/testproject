package com.campaignio.urlshortener.util;

/**
 * <code>Base62</code> handles conversion of numbers from Decimal base to Base62
 * and vice versa.
 * 
 * @author Manohar
 * 
 */
public class Base62
{
    /**
     * Base62 having 62 digits.
     */
    private static final String BASE_DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    /**
     * Returns converted number to required base from decimal. This method is
     * used to get random number
     * 
     * @param base
     *            Required base, number to be converted
     * @param decimalNumber
     *            Decimal number
     * @return string with converted decimal number to other base
     **/
    public static String fromDecimalToOtherBase(int base, long decimalNumber)
    {
	String tempVal = decimalNumber == 0 ? "0" : "";
	long mod = 0;

	while (decimalNumber != 0)
	{
	    mod = decimalNumber % base;
	    tempVal = BASE_DIGITS.substring((int) mod, (int) mod + 1) + tempVal;
	    decimalNumber = decimalNumber / base;
	}

	return tempVal;
    }

    /**
     * Returns decimal number from number with other base
     * 
     * @param base
     *            Base of a number exists at present
     * @param number
     *            Number need to be converted to decimal
     * @return decimal number
     */
    public static long fromOtherBaseToDecimal(int base, String number)
    {
	int iterator = number.length();
	long returnValue = 0;
	long multiplier = 1;

	while (iterator > 0)
	{
	    returnValue = returnValue + (BASE_DIGITS.indexOf(number.substring(iterator - 1, iterator)) * multiplier);
	    multiplier = multiplier * base;
	    --iterator;
	}
	return returnValue;
    }
}