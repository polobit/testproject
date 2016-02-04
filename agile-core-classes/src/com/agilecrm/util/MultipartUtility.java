package com.agilecrm.util;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.exception.ExceptionUtils;

import net.sf.json.JSONObject;

import com.google.appengine.api.NamespaceManager;

/**
 * 
 * @author unascribed
 * 
 */
public class MultipartUtility
{
	private final String boundary;
	private static final String LINE_FEED = "\r\n";
	private HttpURLConnection httpConn;
	private String charset;
	private OutputStream outputStream;
	private PrintWriter writer;

	/**
	 * This constructor initializes a new HTTP POST request with content type is
	 * set to multipart/form-data
	 * 
	 * @param requestURL
	 * @param charset
	 * @throws IOException
	 */
	public MultipartUtility(String requestURL, String charset) throws IOException
	{
		this.charset = charset;

		// creates a unique boundary based on time stamp
		boundary = "===" + System.currentTimeMillis() + "===";

		// boundary = "----WebKitFormBoundaryc7fd3E25VpoWkNqO";

		URL url = new URL(requestURL);
		httpConn = (HttpURLConnection) url.openConnection();
		httpConn.setUseCaches(false);
		httpConn.setDoOutput(true); // indicates POST method
		httpConn.setDoInput(true);
		httpConn.setRequestProperty("Accept", "application/json");
		httpConn.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
		httpConn.addRequestProperty("User-Agent",
				"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.97 Safari/537.36");
		outputStream = httpConn.getOutputStream();
		writer = new PrintWriter(new OutputStreamWriter(outputStream, charset), true);
	}

	/**
	 * Adds a form field to the request
	 * 
	 * @param name
	 *            field name
	 * @param value
	 *            field value
	 */
	public void addFormField(String name, String value)
	{
		writer.append("--" + boundary).append(LINE_FEED);
		writer.append("Content-Disposition: form-data; name=\"" + name + "\"").append(LINE_FEED);
		writer.append("Content-Type: text/plain; charset=" + charset).append(LINE_FEED);
		writer.append(LINE_FEED);
		writer.append(value).append(LINE_FEED);
		writer.flush();
	}

	/**
	 * Adds a upload file section to the request
	 * 
	 * @param fieldName
	 *            name attribute in <input type="file" name="..." />
	 * @param uploadFile
	 *            a File to be uploaded
	 * @throws IOException
	 */
	public void addFilePart(String fieldName, String fileName, InputStream inputStream) throws IOException
	{
		// String fileName = uploadFile.getName();
		writer.append("--" + boundary).append(LINE_FEED);
		writer.append("Content-Disposition: form-data; name=\"" + fieldName + "\"; filename=\"" + fileName + "\"")
				.append(LINE_FEED);
		writer.append("Content-Type: " + URLConnection.guessContentTypeFromName(fileName)).append(LINE_FEED);
		writer.append("Content-Transfer-Encoding: binary").append(LINE_FEED);
		writer.append(LINE_FEED);
		writer.flush();

		// FileInputStream inputStream = new FileInputStream(uploadFile);
		byte[] buffer = new byte[4096];
		int bytesRead = -1;
		while ((bytesRead = inputStream.read(buffer)) != -1)
		{
			outputStream.write(buffer, 0, bytesRead);
		}
		outputStream.flush();
		inputStream.close();

		writer.append(LINE_FEED);
		writer.flush();
	}

	/**
	 * Adds a header field to the request.
	 * 
	 * @param name
	 *            - name of the header field
	 * @param value
	 *            - value of the header field
	 */
	public void addHeaderField(String name, String value)
	{
		writer.append(name + ": " + value).append(LINE_FEED);
		writer.flush();
	}

	/**
	 * Completes the request and receives response from the server.
	 * 
	 * @return a list of Strings as response in case the server returned status
	 *         OK, otherwise an exception is thrown.
	 * @throws IOException
	 */
	public org.json.JSONObject finish() throws IOException
	{
		org.json.JSONObject response = new org.json.JSONObject();
		BufferedReader reader = null;

		try
		{
			writer.append(LINE_FEED).flush();
			writer.append("--" + boundary + "--").append(LINE_FEED);
			writer.close();

			int status = httpConn.getResponseCode();

			System.out.println("status: " + status);
			
			response.put("status_code", status);
			
			if (status == HttpURLConnection.HTTP_OK)
			{
				return response;
			}
			else
			{
				reader = new BufferedReader(new InputStreamReader(httpConn.getErrorStream()));
				String line = "";
				StringBuilder sb = new StringBuilder();

				while ((line = reader.readLine()) != null)
					sb.append(line);
				
				response.put("err_msg", sb.toString());
				
				System.out.println("Error: " + response);
			}
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
		finally
		{
			reader.close();
			httpConn.disconnect();
		}
		
		return response;
	}

	/**
	 * 
	 * @param fileName
	 * @param fileType
	 * @param fileContent
	 * @return
	 * @throws Exception
	 */
	public static org.json.JSONObject SaveFileToS3(String fileName, String fileType, String fileContent) throws Exception
	{
		InputStream stream = new ByteArrayInputStream(fileContent.getBytes(StandardCharsets.UTF_8));

		String charset = "UTF-8";
		String requestURL = "https://agilecrm.s3.amazonaws.com/";
		String key = "panel/uploaded-logo/" + NamespaceManager.get() + "/";

		MultipartUtility multipart = new MultipartUtility(requestURL, charset);
		multipart.addFormField("key", key);
		multipart.addFormField("acl", "public-read");
		multipart.addFormField("content-type", "image/*");
		multipart.addFormField("AWSAccessKeyId", "AKIAIBK7MQYG5BPFHSRQ");
		multipart.addFormField("success_action_redirect", "https://" + NamespaceManager.get()
				+ ".agilecrm.com/upload-custom-document.jsp?id=uploadDocumentForm");
		multipart
				.addFormField(
						"policy",
						"IHsKImV4cGlyYXRpb24iOiAiMjAyMC0wMS0wMVQxMjowMDowMC4wMDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogImFnaWxlY3JtIiB9LAogICAgeyJhY2wiOiAicHVibGljLXJlYWQiIH0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAicGFuZWwvdXBsb2FkZWQtbG9nbyJdLAogICAgWyJzdGFydHMtd2l0aCIsICIkQ29udGVudC1UeXBlIiwgImltYWdlLyJdLAogICAgWyAiY29udGVudC1sZW5ndGgtcmFuZ2UiLCA1MTIsIDEwNDg1NzYwXSwKICAgIFsic3RhcnRzLXdpdGgiLCAiJHN1Y2Nlc3NfYWN0aW9uX3JlZGlyZWN0IiwgIiIgXQogIF0KfQ==");
		multipart.addFormField("signature", "lJaO/ZQyMANyulpZrP/FcxVLz5M=");
		multipart.addFilePart("file", fileName, stream);

		System.out.println("key: " + key);
		
		org.json.JSONObject response = multipart.finish();
		response.put("file_url", requestURL + key);
		
		System.out.println("response: " + response);
		
		return response;
	}
}