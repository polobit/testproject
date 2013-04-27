package com.agilecrm.filter;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.ServletOutputStream;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;

public class JSONPRequestFilter implements Filter
{
    private String callbackParameter;

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException
    {
	if (!(request instanceof HttpServletRequest))
	{
	    throw new ServletException("This filter can " + " only process HttpServletRequest requests");
	}

	final HttpServletRequest httpRequest = (HttpServletRequest) request;
	final HttpServletResponse httpResponse = (HttpServletResponse) response;

	if (isJSONPRequest(httpRequest))
	{
	    ServletOutputStream out = response.getOutputStream();

	    out.println(getCallbackParameter(httpRequest) + "(");
	    chain.doFilter(request, response);
	    out.println(");");

	    response.setContentType("text/javascript");
	}
	else
	{
	    chain.doFilter(request, response);
	}
    }

    private String getCallbackMethod(HttpServletRequest httpRequest)
    {
	return httpRequest.getParameter("callback");
    }

    private boolean isJSONPRequest(HttpServletRequest httpRequest)
    {
	String callbackMethod = getCallbackMethod(httpRequest);
	return (callbackMethod != null && callbackMethod.length() > 0);
    }

    private String getCallbackParameter(HttpServletRequest request)
    {
	return request.getParameter(callbackParameter);
    }

    public void init(FilterConfig filterConfig) throws ServletException
    {
	callbackParameter = filterConfig.getInitParameter("callbackParameter");
    }

    public void destroy()
    {
    }

    void printRequest(HttpServletRequest request) throws IOException
    {
	{
	    System.out.println("--------------Headers---------------");
	    Enumeration en = request.getHeaderNames();
	    while (en.hasMoreElements())
	    {
		String val = en.nextElement().toString();
		System.out.println(val + " :");
		Enumeration en1 = request.getHeaders(val);
		while (en1.hasMoreElements())
		{
		    System.out.println("\t" + en1.nextElement());
		}
	    }
	}
	{
	    System.out.println("------------Parameters--------------");
	    Enumeration en = request.getParameterNames();
	    while (en.hasMoreElements())
	    {
		String val = en.nextElement().toString();
		System.out.println(val + " :");
		String[] en1 = request.getParameterValues(val);
		for (String val1 : en1)
		{
		    System.out.println("\t" + val1);
		}
	    }
	}
	System.out.println("---------------BODY--------------");
	BufferedReader is = request.getReader();
	String line;
	while ((line = is.readLine()) != null)
	{
	    System.out.println(line);
	}
	System.out.println("---------------------------------");

	System.out.println("ContentType: " + request.getContentType());
	System.out.println("ContentLength: " + request.getContentLength());
	System.out.println("characterEncodings: " + request.getCharacterEncoding());
	System.out.println("AuthType: " + request.getAuthType());

	System.out.println("ContextPath: " + request.getContextPath());
	System.out.println("Method: " + request.getMethod());

    }

    public static class RequestWrapper extends HttpServletRequestWrapper
    {
	Map<String, String> headers = new HashMap<String, String>();

	int contentLength;
	BufferedReader reader;

	public RequestWrapper(HttpServletRequest request)
	{
	    super(request);
	}

	public void setHeader(String key, String value)
	{
	    headers.put(key, value);
	}

	ByteArrayInputStream bais;

	public void setBody(String body)
	{
	    bais = new ByteArrayInputStream(body.getBytes());
	    contentLength = body.length();
	    headers.put("content-length", Integer.toString(contentLength));
	}

	@Override
	public BufferedReader getReader() throws IOException
	{
	    reader = new BufferedReader(new InputStreamReader(bais));
	    return reader;
	}

	@Override
	public ServletInputStream getInputStream() throws IOException
	{
	    return new ServletInputStream()
	    {
		@Override
		public int read() throws IOException
		{
		    return bais.read();
		}
	    };
	}

	@Override
	public String getMethod()
	{
	    return "POST";
	}

	private String contentType;

	public void setContentType(String contentType)
	{
	    this.contentType = contentType;
	    headers.put("content-type", contentType);
	}

	@Override
	public String getContentType()
	{
	    return contentType;
	}

	@Override
	public int getContentLength()
	{
	    return contentLength;
	}

	@Override
	public String getHeader(String name)
	{
	    String val = headers.get(name);
	    if (val != null)
	    {
		return val;
	    }
	    return super.getHeader(name); // To change body of overridden
					  // methods use File | Settings | File
					  // Templates.
	}

	@Override
	public Enumeration getHeaders(final String name)
	{
	    return super.getHeaders(name);
	}

	@Override
	public Enumeration getHeaderNames()
	{
	    final Enumeration en1 = super.getHeaderNames();
	    final Iterator it = headers.keySet().iterator();
	    return new Enumeration()
	    {
		public boolean hasMoreElements()
		{
		    return en1.hasMoreElements() || it.hasNext();
		}

		public Object nextElement()
		{
		    return en1.hasMoreElements() ? en1.nextElement() : (it.hasNext() ? it.next() : null);
		}
	    };
	}

	@Override
	public int getIntHeader(String name)
	{
	    String val = headers.get(name);
	    if (val == null)
	    {
		return super.getIntHeader(name);
	    }
	    else
	    {
		return Integer.parseInt(val);
	    }
	}
    }
}