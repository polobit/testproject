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

/**
 * <code>ClickDeskEncrytion</code> encrypts data using RSA algorithm. Data is
 * encrypted using public key, which can be decrypted with the private key.
 * <p>
 * This class is used to from Subscription.java to save encrypted creditcard
 * details
 * </p>
 */
public class ClickDeskEncryption
{

    public static RSAPublicKeySpec publicKey = null;
    public static RSAPrivateKeySpec privateKey = null;

    // Modulus
    private static String CLICKDESK_RSA_PRIVATE_KEY = "2953580708969808895478722622330855319651511619533341232181427812833574561775138607857486013745407737374858408269571222580239870327499329492847334347640220410019008367871914398932368869596410126818316358712248131467975806864716511795751533862311919715341070243477218269729987782981405334195780035066714159018338446965381652945262239295512644076580869141156135605177191710070849344704388803187296036656229782265845405081344694315685380906801030140328546738689077245852429058754737922729850345415279070192216863660050989205065665621752607144524749641535357606131551419912594850093161329553096128180084671024619696287621370171996984926287808153564204924692193687891030917493989198870415331919528214545590717023919460313735174563658316571948582150517755600260383133787900211152782386324622353991911975588938501675841396520860907369560332546654177987945466580275922891736605068594410686948774653426480829468090268445849839418151873";

    private static String CLICKDESK_RSA_PUBLIC_KEY_MODULUS = "266005140447961308711225086496428827246951414219721661192998664294855925056191186336354293021339905306462063539608276713866071062562400480820819666768204715907800255965697478813145991637429125166168561468912739734932262551026675089818954428939659347481003325368377391607479664612537216291097285466914043871047857177440606628855477441032645851450198293273986419350482433087828274435607736499607815906875118928957314232136669881662204712511269520344259057228691618397970631948381390114882411596282054181404237894652777512357612422556876124326602074474617391672254824920414060169575574150835103294559972492538742014087890604095507468933405922386653576200935893284534904442003966540640360792648987180467585910403983312071999585911155272136217980208103142273962557933545454903";
    private static String CLICKDESK_RSA_PUBLIC_KEY_EXPONENT = "65537";

    /**
     * Generates private key and public key using {@link KeyFactory} by setting
     * the size of the key using {@link KeyPairGenerator}. Used only to
     * create/change public and private keys
     * 
     * @throws IOException
     */
    private static void generateKeys() throws IOException
    {
	try
	{

	    System.out.println("Generating pair...");

	    // Generates key pair, which is used to create public key and
	    // private key using RSAPublicKeySpec class
	    KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
	    kpg.initialize(2560);
	    KeyPair kp = kpg.genKeyPair();

	    // Creates public key and private key based on the key pair
	    // generated
	    KeyFactory fact = KeyFactory.getInstance("RSA");
	    publicKey = fact.getKeySpec(kp.getPublic(), RSAPublicKeySpec.class);
	    privateKey = fact.getKeySpec(kp.getPrivate(), RSAPrivateKeySpec.class);

	    System.out.println("pubic key = " + publicKey.toString());
	    System.out.println("Modulus = " + publicKey.getModulus() + "Exponent = " + publicKey.getPublicExponent() + "");

	    System.out.println("private key = " + privateKey.toString());
	    System.out.println("Modulus = " + privateKey.getModulus() + "Exponent = " + privateKey.getPrivateExponent() + "");

	}
	catch (Exception e)
	{
	    // throw new RuntimeException("Spurious serialisation error", e);
	}
    }

    /**
     * Returns public key
     * 
     * @return {@link PublicKey}
     * @throws Exception
     *             Exception
     */
    public static PublicKey getPublicKey() throws Exception
    {
	try
	{
	    // If public key is not available the creates a new public key
	    if (publicKey == null)
		generateKeys();

	    KeyFactory fact = KeyFactory.getInstance("RSA");

	    // Gets public key exponent and modulus
	    BigInteger mod = (BigInteger) publicKey.getModulus();
	    BigInteger exp = (BigInteger) publicKey.getPublicExponent();

	    // Creates key specification using both modulus and exponent
	    RSAPublicKeySpec keySpec = new RSAPublicKeySpec(mod, exp);

	    // Returns public key from the key specification
	    return fact.generatePublic(keySpec);

	}
	catch (Exception e)
	{
	    throw new RuntimeException("Error = ", e);
	}
    }

    private static PrivateKey getPrivateKey() throws Exception
    {
	try
	{
	    if (privateKey == null)
		generateKeys();

	    KeyFactory fact = KeyFactory.getInstance("RSA");

	    BigInteger mod = (BigInteger) privateKey.getModulus();
	    BigInteger exp = (BigInteger) privateKey.getPrivateExponent();
	    RSAPrivateKeySpec keySpec = new RSAPrivateKeySpec(mod, exp);
	    return fact.generatePrivate(keySpec);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return null;
    }

    /**
     * Returns a {@link PublicKey} based on the exponent and
     * (CLICKDESK_RSA_PUBLIC_KEY_EXPONENT)
     * 
     * @param exponent
     * @return
     * @throws Exception
     */
    private static PublicKey getRSAPublicKeyWithExponent(String exponent) throws Exception
    {
	try
	{

	    RSAPublicKeySpec keySpec = new RSAPublicKeySpec(new BigInteger(CLICKDESK_RSA_PUBLIC_KEY_MODULUS), new BigInteger(exponent));
	    KeyFactory fact = KeyFactory.getInstance("RSA");
	    return fact.generatePublic(keySpec);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return null;
    }

    /**
     * Returns privatekey based on the exponent and public key modulus
     * 
     * @param exponent
     *            CLICKDESK_RSA_PUBLIC_KEY_EXPONENT
     * @return
     * @throws Exception
     */
    private static PrivateKey getRSAPrivateKeyWithExponent(String exponent) throws Exception
    {
	try
	{

	    KeyFactory fact = KeyFactory.getInstance("RSA");
	    RSAPrivateKeySpec keySpec = new RSAPrivateKeySpec(new BigInteger(CLICKDESK_RSA_PUBLIC_KEY_MODULUS), new BigInteger(exponent));
	    return fact.generatePrivate(keySpec);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return null;
    }

    /**
     * Encrypts the data using the public key generated and returns encrypted
     * data
     * 
     * @param data
     * @return
     * @throws Exception
     */
    public static String RSAEncrypt(byte[] data) throws Exception
    {

	// Gets publicKey using exponent value
	PublicKey pubKey = getRSAPublicKeyWithExponent(CLICKDESK_RSA_PUBLIC_KEY_EXPONENT);

	// Sets type of encryption to Cipher and set public key to encrypt
	Cipher cipher = Cipher.getInstance("RSA");
	cipher.init(Cipher.ENCRYPT_MODE, pubKey);

	// Encrypts using cipher, which is initiated with public key
	byte[] cipherData = cipher.doFinal(data);

	// Encodes encrypted data using base64Encoder
	String encryptedValue = new Base64Encoder().encode(cipherData);
	return encryptedValue;
    }

    /**
     * Decrypts data based on the private key generated based on the exponentKey
     * 
     * @param data
     *            encrypted data
     * @param exponentKey
     *            exponentKey
     * @return {@link String} decrypted data
     * @throws Exception
     */
    public static String RSADecrypt(byte[] data, String exponentKey) throws Exception
    {
	// PrivateKey privateKey = getPrivateKey();
	// Gets private key based on the exponent
	PrivateKey privateKey = getRSAPrivateKeyWithExponent(exponentKey);

	// Sets algorithm to decrypt, private key to decrypt the data
	Cipher cipher = Cipher.getInstance("RSA");
	cipher.init(Cipher.DECRYPT_MODE, privateKey);

	// Decodes the encrypted data, since data is encoded with base64 after
	// encrypting with public key using cipher
	byte[] decordedValue = new Base64Encoder().decode(new String(data));

	// Decrypts data
	byte[] decValue = cipher.doFinal(decordedValue);

	// Converts decrypted byte data into string
	String decryptedValue = new String(decValue);

	// Returns decrypted data
	return decryptedValue;
    }

    public static void main(String[] args) throws Exception
    {
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