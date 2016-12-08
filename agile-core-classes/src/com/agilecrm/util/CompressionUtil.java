/**
 * 
 */
package com.agilecrm.util;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.google.appengine.api.datastore.Blob;

/**
 * This class provides methods to convert String to Blob 
 * and vice-versa. The converted Blob is a compressed version of the String.
 * 
 * @author rohit
 */
public class CompressionUtil 
{
	
	private static final String NEW_LINE_REPLACE = "__br__";
	
	
	/**
	 * Compress a String to a Blob object
	 * 
	 * @param str
	 * @return
	 */
	public static Blob compressStringToBlob(String str)
	{
		if( StringUtils.isBlank(str) )	return null;
		
		byte[] bytes = null;
		
		try {
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			GZIPOutputStream gzip = new GZIPOutputStream(out);
			gzip.write(str.getBytes());
			gzip.close();
			
			bytes = out.toByteArray();
		} catch (IOException e) {
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
		
		return new Blob(bytes);
	}
	
	/**
	 * Uncompress Blob to a String object
	 * 
	 * @param blob
	 * @return
	 */
	public static String uncompressBlobToString(Blob blob)
	{
		if( blob == null )	return null;
		
		byte[] bytes = blob.getBytes();
		
		if( bytes == null )	return null;
		
		StringBuffer buf = new StringBuffer();
		String s;
		
		try {
			GZIPInputStream is = new GZIPInputStream(new ByteArrayInputStream(bytes));
			BufferedReader reader = new BufferedReader(new InputStreamReader(is));
			
			while( (s = reader.readLine()) != null )	buf.append(s + "\n");
			
		} catch(IOException e) {
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
		
		return buf.toString();
	}
	
}
