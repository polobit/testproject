package com.agilecrm.landingpages;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.NamespaceManager;

/**
 * Servlet implementation class LandingPageServlet
 */
public class LandingPageServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public LandingPageServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		response.setContentType("text/html; charset=UTF-8");
    	PrintWriter out = response.getWriter();
    	String oldNameSpace = NamespaceManager.get();
    	
		try {
				LandingPageUtil lpUtil = new LandingPageUtil();
				LandingPage landingPage = lpUtil.getLandingPage(request);
				if(landingPage == null)
				throw new Exception("No landing page found.");
				
				if(lpUtil.requestingDomain != null) {
					NamespaceManager.set(lpUtil.requestingDomain);
				}
				
				LandingPageHelper lpHelper = new LandingPageHelper(landingPage);
				lpHelper.requestingDomain = lpUtil.requestingDomain;
				lpHelper.cnameHost = lpUtil.cnameHost;
				
				new LandingPageMergeFields(lpHelper, request);
							
				out.write(lpHelper.getSourceCode());
				
		} catch (Exception e) {
			out.print("<h1>"+e.getMessage()+"</h1>");
		} finally {
			NamespaceManager.set(oldNameSpace);
		}
		
	}
	
	public String getResponsiveMediaIFrame(String fullHtml) {
		
		String responsiveMediaIFrame = "<div class=\"embed-responsive embed-responsive-16by9\"><iframe class=\"embed-responsive-item\" src=\"%s\"></iframe></div>";
		Pattern p = Pattern.compile("<img[^>]*data-src=[\"]*([\\w\\s-.:\\/,]+)[\"]*[^>]*>",Pattern.CASE_INSENSITIVE);
		Matcher m = p.matcher(fullHtml);
		
		while(m.find()){
			fullHtml = fullHtml.replaceAll(m.group(0), String.format(responsiveMediaIFrame, m.group(1)));
		}
		
		return fullHtml;
	}	
	
}
