package com.agilecrm.util;

import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Base64;

/**
 * <code>EncryptDecryptUtil</code> is a utility class which includes methods
 * need to encrypt and decrypt the given string.
 * <p>
 * This class imports <code>Base64</code> to perform its encryption and
 * decryption.
 * </p>
 * 
 * @author
 * 
 */
public class EncryptDecryptUtil
{
    // Key to perform xor operation with the given string
    private static final String KEY = "some-secret-key-of-your-choice";

    /**
     * Encrypts the given string by performing xor operation with the specified
     * "KEY" and then sending the result to <code>Base64</code> encoder.
     * 
     * @param text
     * @return encrypted string
     */
    public static String encrypt(final String text)
    {
	byte[] encrypted = Base64.encodeBase64(xor(text.getBytes()));
	return new String(encrypted);
    }

    /**
     * Decrypts the given string by sending it to <code>Base64</code> decoder
     * and then sending the result to xor operation with the specified "KEY"
     * 
     * @param hash
     * @return decrypted string
     * @throws DecoderException
     */
    public static String decrypt(final String hash) throws DecoderException
    {
	try
	{
	    return new String(xor(Base64.decodeBase64(hash.getBytes())), "UTF-8");
	}
	catch (java.io.UnsupportedEncodingException ex)
	{
	    throw new IllegalStateException(ex);
	}
    }

    /**
     * Performs xor operation between two byte arrays
     * 
     * @param input
     * @return byte array
     */
    private static byte[] xor(final byte[] input)
    {
	final byte[] output = new byte[input.length];
	final byte[] secret = KEY.getBytes();
	int spos = 0;
	for (int pos = 0; pos < input.length; pos += 1)
	{
	    output[pos] = (byte) (input[pos] ^ secret[spos]);
	    spos += 1;

	    /*
	     * If the length of the KEY (secret) is not enough for the input
	     * repeats it again from the beginning.
	     */
	    if (spos >= secret.length)
	    {
		spos = 0;
	    }
	}
	return output;
    }
}