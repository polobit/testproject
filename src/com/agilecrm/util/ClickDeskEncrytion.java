package com.agilecrm.util;

import java.io.IOException;
import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.RSAPrivateKeySpec;
import java.security.spec.RSAPublicKeySpec;

import javax.crypto.Cipher;



public class ClickDeskEncrytion {

	public static RSAPublicKeySpec publicKey = null;
	public static RSAPrivateKeySpec privateKey = null;
	
	// Modulus
	public static String CLICKDESK_RSA_PUBLIC_KEY_MODULUS = "xx";
	public static String CLICKDESK_RSA_PUBLIC_KEY_EXPONENT = "xx";

	public static String CLICKDESK_RSA_PRIVATE_KEY = "xx";
	
	public static void generateKeys() throws IOException {

		try {

			System.out.println("Generating pair...");

			KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
			kpg.initialize(2560);
			KeyPair kp = kpg.genKeyPair();

			KeyFactory fact = KeyFactory.getInstance("RSA");
			publicKey = fact.getKeySpec(kp.getPublic(), RSAPublicKeySpec.class);
			privateKey = fact.getKeySpec(kp.getPrivate(),
					RSAPrivateKeySpec.class);

			System.out.println("pubic key = " + publicKey.toString());
			System.out.println("Modulus = " + publicKey.getModulus()
					+ "Exponent = " + publicKey.getPublicExponent() + "");

			System.out.println("private key = " + privateKey.toString());
			System.out.println("Modulus = " + privateKey.getModulus()
					+ "Exponent = " + privateKey.getPrivateExponent() + "");

		} catch (Exception e) {
			// throw new RuntimeException("Spurious serialisation error", e);
		}
	}

	public static PublicKey getPublicKey() throws Exception {
		try {

			if (publicKey == null)
				generateKeys();

			KeyFactory fact = KeyFactory.getInstance("RSA");

			BigInteger mod = (BigInteger) publicKey.getModulus();
			BigInteger exp = (BigInteger) publicKey.getPublicExponent();

			RSAPublicKeySpec keySpec = new RSAPublicKeySpec(mod, exp);
			return fact.generatePublic(keySpec);

		} catch (Exception e) {
			throw new RuntimeException("Error = ", e);
		}
	}

	public static PrivateKey getPrivateKey() throws Exception {
		try {

			if (privateKey == null)
				generateKeys();

			KeyFactory fact = KeyFactory.getInstance("RSA");

			BigInteger mod = (BigInteger) privateKey.getModulus();
			BigInteger exp = (BigInteger) privateKey.getPrivateExponent();
			RSAPrivateKeySpec keySpec = new RSAPrivateKeySpec(mod, exp);
			return fact.generatePrivate(keySpec);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}

	public static PublicKey getRSAPublicKeyWithExponent(String exponent) throws Exception {
		try {

			RSAPublicKeySpec keySpec = new RSAPublicKeySpec(new BigInteger(CLICKDESK_RSA_PUBLIC_KEY_MODULUS), new BigInteger(exponent));
		    KeyFactory fact = KeyFactory.getInstance("RSA");
		    return fact.generatePublic(keySpec);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	} 
	
	public static PrivateKey getRSAPrivateKeyWithExponent(String exponent) throws Exception {
		try {

			KeyFactory fact = KeyFactory.getInstance("RSA");
			RSAPrivateKeySpec keySpec = new RSAPrivateKeySpec( new BigInteger(CLICKDESK_RSA_PUBLIC_KEY_MODULUS), new BigInteger(exponent));
			return fact.generatePrivate(keySpec);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	} 

	
	public static String RSAEncrypt(byte[] data) throws Exception {

		// PublicKey pubKey = getPublicKey();
		PublicKey pubKey = getRSAPublicKeyWithExponent(CLICKDESK_RSA_PUBLIC_KEY_EXPONENT);
		Cipher cipher = Cipher.getInstance("RSA");
		cipher.init(Cipher.ENCRYPT_MODE, pubKey);

		byte[] cipherData = cipher.doFinal(data);
		String encryptedValue = new Base64Encoder().encode(cipherData);
		return encryptedValue;

	}

	public static String RSADecrypt(byte[] data) throws Exception {

		// PrivateKey privateKey = getPrivateKey();
		PrivateKey privateKey = getRSAPrivateKeyWithExponent(CLICKDESK_RSA_PRIVATE_KEY);
		Cipher cipher = Cipher.getInstance("RSA");
		cipher.init(Cipher.DECRYPT_MODE, privateKey);

		byte[] decordedValue = new Base64Encoder().decode(new String(data));
		byte[] decValue = cipher.doFinal(decordedValue);

		String decryptedValue = new String(decValue);
		return decryptedValue;

	}

	public static String RSADecrypt(byte[] data, String exponentKey) throws Exception {

		// PrivateKey privateKey = getPrivateKey();
		PrivateKey privateKey = getRSAPrivateKeyWithExponent(exponentKey);
		Cipher cipher = Cipher.getInstance("RSA");
		cipher.init(Cipher.DECRYPT_MODE, privateKey);

		byte[] decordedValue = new Base64Encoder().decode(new String(data));
		byte[] decValue = cipher.doFinal(decordedValue);

		String decryptedValue = new String(decValue);
		return decryptedValue;

	}

	
	public static void main(String[] args) throws Exception {
		// generate 
		generateKeys();
		
		String data = "";
		data = "{\"phone\":\"8666086998\",\"address_line1\":\"63 king yip street unit 118\",\"exp_year\":\"2014\",\"exp_month\":\"4\",\"address_line2\":\"\",\"name\":\"stanley cheung\",\"cvc\":\"818\",\"address_country\":\"Hong Kong\",\"number\":\"4966132007102838\",\"address_zip\":\"852\",\"address_state\":\"Hong Kong\"}";
		System.out.println(data);

		System.out.println("After Encryption");
		String encrytedString = RSAEncrypt(data.getBytes());
		System.out.println(encrytedString);

		System.out.println("After Decryption");
		String decrytedString = RSADecrypt(encrytedString.getBytes(), CLICKDESK_RSA_PRIVATE_KEY);
		System.out.println(decrytedString);

	}

}
