package com.agilecrm.util;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * <code>MD5Util</code> is a utility class, which includes methods need to
 * return fixed length hash value for the given data.
 * 
 * @author
 * 
 */
public class MD5Util
{
    /**
     * Hash function MD5 for password, which takes arbitrary-sized data and
     * output a fixed-length (16) hash value.
     * 
     * @param password
     * @return hashed value as a string
     */
    public static String getMD5HashedPassword(String password)
    {
	if (password == null)
	    return null;

	String hashedPassword = null;
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