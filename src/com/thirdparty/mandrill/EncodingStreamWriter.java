package com.thirdparty.mandrill;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;

import org.apache.commons.codec.binary.Base64;

/**
 * This used for reading data from InputStream, converts into Base64 encoded
 * format then writes data into output stream
 * 
 * @author Ramesh
 * 
 */

public class EncodingStreamWriter
{
	private InputStream inStream = null;
	private OutputStream outStream = null;

	private int size = 255;
	private byte[] buffer = new byte[255];
	private byte[] encodableBuffer = new byte[size];
	private int previousIndex = 0;
	private int readInBytes = 0;

	public EncodingStreamWriter(InputStream inStream, OutputStream outStream)
	{
		this.inStream = inStream;
		this.outStream = outStream;
	}

	public void write()
	{
		try
		{
			while ((readInBytes = (inStream.read(buffer))) > -1)
			{
				int readIndex = 0;
				copy(readIndex);
			}
			sendFinalBytes();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	private void copy(int readIndex)
	{
		for (int i = readIndex; i < readInBytes; i++)
		{
			if (previousIndex < size)
			{
				encodableBuffer[previousIndex] = buffer[i];
				previousIndex++;
			}
			else if (previousIndex == size)
			{
				write2Stream();
				previousIndex = 0;
				readIndex = i;
				i = copyNext(readIndex);
			}
		}
		if (previousIndex == size)
		{
			write2Stream();
			previousIndex = 0;
		}
	}

	private int copyNext(int readIndex)
	{
		int i = 0;
		for (i = readIndex; i < readInBytes; i++)
		{
			if (previousIndex < size)
			{
				encodableBuffer[previousIndex] = buffer[i];
				previousIndex++;
			}
		}
		return i;
	}

	private void write2Stream()
	{
		try
		{
			byte[] encodedBytes = Base64.encodeBase64(encodableBuffer);
			outStream.write(encodedBytes);
			outStream.flush();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	public String getResponse(HttpURLConnection conn)
	{
		String response = "";
		try
		{
			BufferedReader reader1 = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			String inputLine;
			while ((inputLine = reader1.readLine()) != null)
			{
				response += inputLine;
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return response;
	}

	private void sendFinalBytes() throws Exception
	{
		for (int i = previousIndex; i < size; i++)
			encodableBuffer[i] = 0;
		write2Stream();
	}
}
